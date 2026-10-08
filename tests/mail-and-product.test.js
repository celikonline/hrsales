import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { createServer } from 'node:http';
import { createStore } from '../server/store.js';
import { createMailer } from '../server/mail.js';
import { createProductAdapter } from '../server/product.js';
import { readConfig } from '../server/app.js';

test('SMTP kuyruk teslimatı tamamlanır ve gönderilmiş mesajın gizli gövdesi temizlenir', async (t) => {
  let delivered = '';
  const smtp = net.createServer((socket) => {
    socket.setEncoding('utf8');
    socket.write('220 local-test ESMTP\r\n');
    let buffer = '',
      dataMode = false;
    socket.on('data', (chunk) => {
      buffer += chunk;
      while (buffer.includes('\r\n')) {
        const index = buffer.indexOf('\r\n');
        const line = buffer.slice(0, index);
        buffer = buffer.slice(index + 2);
        if (dataMode) {
          if (line === '.') {
            dataMode = false;
            socket.write('250 accepted\r\n');
          } else delivered += line + '\n';
        } else if (line.startsWith('EHLO')) socket.write('250 local-test\r\n');
        else if (line === 'DATA') {
          dataMode = true;
          socket.write('354 end with dot\r\n');
        } else if (line === 'QUIT') {
          socket.end('221 goodbye\r\n');
        } else socket.write('250 ok\r\n');
      }
    });
  });
  await new Promise((resolve) => smtp.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => smtp.close(resolve)));
  const store = createStore(':memory:');
  t.after(() => store.close());
  const mailer = createMailer(store, {
    smtpHost: '127.0.0.1',
    smtpPort: smtp.address().port,
    smtpSecure: false,
    mailFrom: 'demo@example.com',
  });
  mailer.enqueue('customer@example.com', 'Demo invitation', 'test-secret-link');
  await mailer.flush();
  const row = store.db.prepare('SELECT * FROM outbox').get();
  assert.equal(row.status, 'sent');
  assert.equal(row.body, '');
  assert.ok(row.sent_at);
  assert.match(delivered, /test-secret-link/);
});
test('SMTP yoksa bildirim kalıcı kalır ve gönderilmiş gibi raporlanmaz', async () => {
  const store = createStore(':memory:');
  try {
    const mailer = createMailer(store, {});
    mailer.enqueue('test@example.com', 'Test', 'Pending');
    await mailer.flush();
    assert.equal(mailer.configured, false);
    assert.equal(store.db.prepare('SELECT status FROM outbox').get().status, 'pending');
  } finally {
    store.close();
  }
});
test('Gerçek ürün adaptörü platform JWT ile tenant ve lisans sözleşmesini kullanır', async (t) => {
  const calls = [];
  const server = createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    calls.push({ path: req.url, authorization: req.headers.authorization, body: JSON.parse(body) });
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify(
        req.url.endsWith('/login')
          ? { status: 'ok', tokens: { accessToken: 'test-platform-jwt' } }
          : req.url.endsWith('/provision')
            ? {
                tenantId: 'tenant-test',
                slug: 'demo-test',
                invitationUrl: 'http://product.example/invite/test-token',
              }
            : { status: 'active' },
      ),
    );
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const adapter = createProductAdapter({
    ...readConfig({}),
    productMode: 'sensehr',
    productApi: `http://127.0.0.1:${server.address().port}/api`,
    productWeb: 'http://product.example',
    platformEmail: 'service@example.com',
    platformPassword: 'only-a-test',
  });
  const lead = {
    id: '12345678-1234-1234-1234-123456789012',
    company: 'Test',
    email: 'customer@example.com',
    fullName: 'Ayşe Yıldız',
    phone: '05551112233',
  };
  const license = {
    status: 'trial',
    plan: 'growth',
    modules: ['employee', 'leave'],
    employeeLimit: 50,
    expiresAt: '2026-11-01T00:00:00Z',
    reference: lead.id,
  };
  const result = await adapter.provision(lead, license);
  lead.product = result;
  await adapter.updateLicense(lead, { ...license, status: 'active' });
  assert.equal(result.mode, 'sensehr');
  assert.equal(calls[0].body.tenantSlug, 'platform');
  assert.equal(calls[1].authorization, 'Bearer test-platform-jwt');
  assert.equal(calls[1].body.ownerFirstName, 'Ayşe');
  assert.equal(calls[1].body.ownerLastName, 'Yıldız');
  assert.deepEqual(calls[1].body.license, license);
  assert.equal(calls[3].path, '/api/v1/identity/commercial/tenant-test/license');
});
