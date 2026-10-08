import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createStore } from '../server/store.js';
import { createApp, readConfig } from '../server/app.js';
import { hashPassword, digest } from '../server/security.js';

const input = {
  fullName: 'Test Yetkili',
  company: 'Test Şirketi',
  email: 'test@example.com',
  phone: '0555 111 22 33',
  employees: 42,
  modules: ['employee', 'leave'],
  plan: 'growth',
  privacyAccepted: true,
};
async function setup(t, injected = {}) {
  const store = createStore(':memory:');
  const config = {
    ...readConfig({}),
    adminEmail: 'admin@example.com',
    adminHash: hashPassword('Test-only-password!'),
    notifyEmail: 'admin@example.com',
  };
  const app = createApp(store, config, injected);
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  config.publicUrl = base;
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    store.close();
  });
  async function request(path, body, cookie, origin) {
    const response = await fetch(`${base}/api${path}`, {
      ...(body !== undefined ? { method: 'POST', body: JSON.stringify(body) } : {}),
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
        ...(origin ? { Origin: origin } : {}),
      },
    });
    return {
      status: response.status,
      cookie: response.headers.get('set-cookie')?.split(';')[0],
      data: await response.json(),
    };
  }
  async function admin() {
    const result = await request('/admin/login', {
      email: config.adminEmail,
      password: 'Test-only-password!',
    });
    assert.equal(result.status, 200);
    return result.cookie;
  }
  async function approve(cookie) {
    await request('/demo-requests', input);
    const id = store.leads()[0].id;
    const result = await request(
      `/admin/leads/${id}/approve`,
      { days: 14, modules: input.modules },
      cookie,
    );
    assert.equal(result.status, 200);
    return {
      id,
      token: store.db
        .prepare(
          "SELECT body FROM outbox WHERE subject='SenseIK demonuz hazır' ORDER BY rowid DESC LIMIT 1",
        )
        .get()
        .body.match(/#token=([\w-]+)/)[1],
    };
  }
  return { store, config, request, admin, approve };
}
test('Başvuru kalıcı kayda ve yönetici + müşteri bildirim kuyruğuna alınır', async (t) => {
  const s = await setup(t);
  const result = await s.request('/demo-requests', input);
  assert.equal(result.status, 202);
  assert.equal(s.store.leads()[0].status, 'pending');
  assert.equal(s.store.db.prepare('SELECT count(*) AS n FROM outbox').get().n, 2);
  assert.equal(s.store.db.prepare('SELECT count(*) AS n FROM links').get().n, 0);
  await s.request('/demo-requests', input);
  assert.equal(s.store.leads().length, 1);
  assert.equal(s.store.db.prepare('SELECT count(*) AS n FROM outbox').get().n, 2);
});
test('Aydınlatma, çalışan sayısı ve modül girdileri sunucuda doğrulanır', async (t) => {
  const s = await setup(t);
  for (const patch of [
    { privacyAccepted: false },
    { employees: 0 },
    { modules: ['forged-module'] },
    { website: 'spam' },
    { employees: 1.5 },
  ])
    assert.equal((await s.request('/demo-requests', { ...input, ...patch })).status, 400);
  assert.equal(s.store.leads().length, 0);
});
test('Yönetici uçları ve çapraz kaynak yazımı korunur', async (t) => {
  const s = await setup(t);
  assert.equal((await s.request('/admin/overview')).status, 401);
  assert.equal(
    (await s.request('/demo-requests', input, null, 'https://attacker.example')).status,
    403,
  );
  assert.equal(
    (await s.request('/admin/login', { email: s.config.adminEmail, password: 'wrong' })).status,
    401,
  );
  const cookie = await s.admin();
  assert.equal((await s.request('/admin/overview', undefined, cookie)).status, 200);
  assert.equal((await s.request('/demo/workspace', undefined, cookie)).status, 401);
});
test('Demo onaydan önce açılmaz; token tek kullanımlı ve sadece hash olarak saklanır', async (t) => {
  const s = await setup(t);
  assert.equal((await s.request('/demo/access', { token: 'x'.repeat(43) })).status, 403);
  const cookie = await s.admin();
  const lead = await s.approve(cookie);
  assert.ok(s.store.db.prepare('SELECT hash FROM links').get().hash === digest(lead.token));
  const result = await s.request('/demo/access', { token: lead.token });
  assert.equal(result.status, 200);
  assert.ok(result.cookie);
  assert.equal((await s.request('/demo/access', { token: lead.token })).status, 403);
  const workspace = await s.request('/demo/workspace', undefined, result.cookie);
  assert.equal(workspace.status, 200);
  assert.deepEqual(workspace.data.lead.modules, input.modules);
});
test('İptal edilen demo: eski oturum ve davet geçersiz', async (t) => {
  const s = await setup(t);
  const admin = await s.admin();
  const lead = await s.approve(admin);
  const access = await s.request('/demo/access', { token: lead.token });
  assert.equal((await s.request(`/admin/leads/${lead.id}/revoke`, {}, admin)).status, 200);
  assert.equal((await s.request('/demo/workspace', undefined, access.cookie)).status, 401);
  assert.equal((await s.request('/demo/access', { token: lead.token })).status, 403);
});
test('Lisansın bitmesi açık oturumu da engeller', async (t) => {
  const s = await setup(t);
  const admin = await s.admin();
  const lead = await s.approve(admin);
  const access = await s.request('/demo/access', { token: lead.token });
  const record = s.store.lead(lead.id);
  record.license.expiresAt = '2000-01-01T00:00:00.000Z';
  s.store.saveLead(record);
  assert.equal((await s.request('/demo/workspace', undefined, access.cookie)).status, 403);
});
test('Açık olmayan modülün işlem ucu engellenir; örnek onay kalıcıdır', async (t) => {
  const s = await setup(t);
  const admin = await s.admin();
  const lead = await s.approve(admin);
  const access = await s.request('/demo/access', { token: lead.token });
  assert.equal(
    (await s.request('/demo/requests/e1/decision', { decision: 'approved' }, access.cookie)).status,
    403,
  );
  assert.equal(
    (await s.request('/demo/requests/l1/decision', { decision: 'approved' }, access.cookie)).status,
    200,
  );
  assert.equal(s.store.lead(lead.id).decisions.l1, 'approved');
});
test('Ürün provisioning başarısızsa onay veya davet oluşmaz; yeniden denenebilir', async (t) => {
  const s = await setup(t, {
    product: {
      provision: async () => {
        throw new Error('Fake product outage');
      },
    },
  });
  const admin = await s.admin();
  await s.request('/demo-requests', input);
  const id = s.store.leads()[0].id;
  assert.equal(
    (await s.request(`/admin/leads/${id}/approve`, { days: 14, modules: input.modules }, admin))
      .status,
    503,
  );
  assert.equal(s.store.lead(id).status, 'pending');
  assert.equal(s.store.db.prepare('SELECT count(*) AS n FROM links').get().n, 0);
});
test('Satın alma: teklif ve doğrulanmış ödeme olmadan lisans etkinleşmez', async (t) => {
  const s = await setup(t);
  const admin = await s.admin();
  const lead = await s.approve(admin);
  const access = await s.request('/demo/access', { token: lead.token });
  const order = await s.request(
    '/orders',
    {
      plan: 'starter',
      employees: 3,
      cycle: 'yearly',
      billingCompany: 'Test Şirketi',
      taxNumber: '1234567890',
      billingAddress: 'Test adresi, İstanbul',
    },
    access.cookie,
  );
  assert.equal(order.status, 201);
  assert.equal(order.data.billedEmployees, 10);
  assert.equal(order.data.status, 'awaiting_quote');
  const path = `/admin/orders/${order.data.id}`;
  assert.equal(
    (
      await s.request(
        `${path}/activate`,
        { paymentReference: 'bank-123', paymentVerified: true },
        admin,
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await s.request(
        `${path}/quote`,
        {
          amount: 12000,
          taxPercent: 20,
          paymentInstructions: 'Test ödeme bilgisi - ödeme referansına talep no yazın.',
        },
        admin,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await s.request(
        `${path}/activate`,
        { paymentReference: 'bank-123', paymentVerified: false },
        admin,
      )
    ).status,
    400,
  );
  assert.equal(s.store.lead(lead.id).license.status, 'trial');
  assert.equal(
    (
      await s.request(
        `${path}/activate`,
        { paymentReference: 'bank-123', paymentVerified: true },
        admin,
      )
    ).status,
    200,
  );
  assert.equal(s.store.lead(lead.id).license.status, 'active');
  assert.equal(s.store.lead(lead.id).license.employeeLimit, 10);
  assert.equal(s.store.order(order.data.id).total, 14400);
  assert.equal(
    (
      await s.request(
        `${path}/activate`,
        { paymentReference: 'bank-123', paymentVerified: true },
        admin,
      )
    ).status,
    409,
  );
});
test('Davet tekrar gönderildiğinde önceki bağlantı iptal olur', async (t) => {
  const s = await setup(t);
  const admin = await s.admin();
  const lead = await s.approve(admin);
  assert.equal((await s.request(`/admin/leads/${lead.id}/invite`, {}, admin)).status, 200);
  assert.equal((await s.request('/demo/access', { token: lead.token })).status, 403);
  assert.equal(s.store.db.prepare('SELECT count(*) AS n FROM links WHERE used=0').get().n, 1);
});
test('Reddedilen talebe erişim daveti verilmez', async (t) => {
  const s = await setup(t);
  const admin = await s.admin();
  await s.request('/demo-requests', input);
  const id = s.store.leads()[0].id;
  assert.equal(
    (
      await s.request(
        `/admin/leads/${id}/reject`,
        { reason: 'İhtiyaçlarınızı görüşerek netleştirelim.' },
        admin,
      )
    ).status,
    200,
  );
  assert.equal(
    (await s.request(`/admin/leads/${id}/approve`, { days: 14, modules: input.modules }, admin))
      .status,
    409,
  );
});
test('Üretim eksik yapılandırma ile başlayamaz', () => {
  const store = createStore(':memory:');
  try {
    assert.throws(() => createApp(store, { ...readConfig({}), production: true }), /Üretim/);
  } finally {
    store.close();
  }
});
