import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { mkdirSync } from 'node:fs';
mkdirSync('artifacts', { recursive: true });
const root = 'http://localhost:4173',
  product = 'http://localhost:13010/api',
  admin = JSON.parse(readFileSync('data/dev-admin-credentials.json', 'utf8'));
let adminCookie = '',
  demoCookie = '';
async function call(base, path, body, cookie = '', bearer = '') {
  const res = await fetch(base + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(30000),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (!res.ok)
    throw new Error(`${path}: HTTP ${res.status} ${data?.message || data?.detail || ''}`);
  return { data, cookie: res.headers.get('set-cookie')?.split(';')[0], status: res.status };
}
const c = await call(root, '/api/catalog');
assert.equal(c.data.mode, 'sensehr');
adminCookie = (await call(root, '/api/admin/login', admin)).cookie;
const email = `docker-qa-${Date.now()}@example.com`;
await call(root, '/api/demo-requests', {
  fullName: 'Demo Deniz Kaya',
  company: 'Docker Test Ekibi',
  email,
  phone: '5550000000',
  employees: 10,
  modules: ['employee', 'leave', 'expense'],
  plan: 'growth',
  notes: 'Local Docker integration verification with fictional data.',
  privacyAccepted: true,
});
const ov = (await call(root, '/api/admin/overview', undefined, adminCookie)).data;
assert.equal(ov.productMode, 'sensehr');
assert.equal(ov.mailConfigured, true);
const lead = ov.leads.find((l) => l.email === email);
assert.ok(lead);
const approved = (
  await call(
    root,
    `/api/admin/leads/${lead.id}/approve`,
    { days: 14, modules: lead.modules },
    adminCookie,
  )
).data;
assert.equal(approved.product.mode, 'sensehr');
assert.ok(approved.product.tenantId);
console.log('PASS: sales approval creates real SenseHR tenant and license.');
// SMTP is captured by this isolated stack's Mailpit; no external mail is sent.
let mail;
for (let i = 0; i < 20; i++) {
  const list = await fetch('http://localhost:18026/api/v1/messages').then((r) => r.json());
  const item = list.messages.find(
    (m) => m.To?.some((t) => t.Address === email) && m.Subject === 'SenseIK demonuz hazır',
  );
  if (item) {
    mail = await fetch(`http://localhost:18026/api/v1/message/${item.ID}`).then((r) => r.json());
    break;
  }
  await new Promise((r) => setTimeout(r, 1000));
}
assert.ok(mail, 'approval email received in Mailpit');
const raw = mail.Text.match(/\/demo#token=([\w-]+)/)?.[1];
assert.ok(raw);
demoCookie = (await call(root, '/api/demo/access', { token: raw })).cookie;
const workspace = (await call(root, '/api/demo/workspace', undefined, demoCookie)).data;
assert.equal(workspace.lead.product.mode, 'sensehr');
assert.ok(workspace.entryUrl.startsWith('http://localhost:13010/invite/'));
const invitation = workspace.entryUrl.split('/invite/')[1];
const preview = (await call(product, `/v1/identity/invitations/preview/${invitation}`)).data;
writeFileSync('artifacts/invitation-preview.json', JSON.stringify(preview, null, 2));
console.log(
  'PASS: Mailpit receives approval email; single-use sales entry resolves real product invitation.',
);
const password = `Demo!9${randomBytes(18).toString('base64url')}`;
const accepted = (
  await call(product, '/v1/identity/invitations/accept', {
    token: invitation,
    password,
    privacyNoticeAccepted: true,
    privacyNoticeVersion: '2026-09',
  })
).data;
const login = (
  await call(product, '/v1/identity/auth/login', {
    email,
    password,
    tenantSlug: approved.product.slug,
  })
).data;
const access = login.tokens?.accessToken || accepted.accessToken;
assert.ok(access);
const license = (await call(product, '/v1/identity/commercial/mine', undefined, '', access)).data;
assert.equal(license.employeeLimit, 10);
assert.deepEqual(license.modules.sort(), ['employee', 'expense', 'leave']);
assert.equal(license.status, 'trial');
const me = (await call(product, '/v1/identity/me', undefined, '', access)).data;
assert.ok(me);
writeFileSync(
  'data/docker-demo-credentials.json',
  JSON.stringify(
    {
      email,
      password,
      tenantSlug: approved.product.slug,
      webUrl: 'http://localhost:13010',
      leadId: lead.id,
    },
    null,
    2,
  ),
);
writeFileSync(
  'artifacts/docker-verification.json',
  JSON.stringify(
    {
      date: new Date().toISOString(),
      tenantId: approved.product.tenantId,
      leadId: lead.id,
      checks: [
        'real tenant',
        'SMTP via Mailpit',
        'single-use sales entry',
        'real invitation acceptance',
        'product login',
        'licensed modules',
        'employee capacity',
      ],
      result: 'passed',
    },
    null,
    2,
  ),
);
console.log(
  'PASS: real product invitation acceptance, login, licensed modules and 10-employee capacity. Local demo credentials saved in ignored data/.',
);
// Exercise real PostgreSQL locks and existing-token revocation on this newly created fictional tenant.
const env = Object.fromEntries(
  readFileSync('data/docker.env', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).replace(/^'|'$/g, '')]),
);
const platform = (
  await call(product, '/v1/identity/auth/login', {
    email: env.PLATFORM_EMAIL,
    password: env.PLATFORM_PASSWORD,
    tenantSlug: 'platform',
  })
).data.tokens.accessToken;
const licensePath = `/v1/identity/commercial/${approved.product.tenantId}/license`;
async function checkedRequest(path, body, method = body ? 'POST' : 'GET') {
  const res = await fetch(product + path, {
    method,
    headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(30000),
  });
  return { status: res.status, body: await res.json() };
}
try {
  const settings = (await checkedRequest('/v1/identity/settings/modules')).body;
  assert.equal(settings.modules.find((m) => m.key === 'assets').enabled, false);
  assert.equal(settings.modules.find((m) => m.key === 'assets').isLicensed, false);
  const forbiddenEnable = await checkedRequest(
    '/v1/identity/settings/modules',
    { disabledModules: [] },
    'PUT',
  );
  assert.equal(forbiddenEnable.status, 403);
  assert.equal(forbiddenEnable.body.code, 'commercial.module.not_licensed');
  console.log(
    'PASS: module settings reflect the commercial license and reject unlicensed enablement.',
  );
  await call(product, licensePath, { ...license, employeeLimit: 1 }, '', platform);
  const simultaneous = await Promise.all(
    ['Deniz', 'Ada'].map((firstName) =>
      checkedRequest('/v1/employees', { firstName, lastName: 'Demo', hireDate: '2026-10-01' }),
    ),
  );
  assert.equal(
    simultaneous.filter((r) => r.status === 200 || r.status === 201).length,
    1,
    JSON.stringify(simultaneous),
  );
  const rejected = simultaneous.find((r) => r.status === 409);
  assert.ok(rejected, JSON.stringify(simultaneous));
  assert.equal(rejected.body.code, 'commercial.employee_capacity_exceeded');
  const employees = (await checkedRequest('/v1/employees')).body;
  assert.equal(employees.totalCount, 1);
  console.log(
    'PASS: two simultaneous employee creates against capacity 1 yield one success and one 409; PostgreSQL contains one employee.',
  );
  const denied = await checkedRequest('/v1/assets');
  assert.equal(denied.status, 403);
  console.log('PASS: an unlicensed module is denied to the tenant Owner.');
  await call(product, licensePath, { ...license, status: 'revoked' }, '', platform);
  const expired = await checkedRequest('/v1/identity/me');
  assert.equal(expired.status, 403);
  assert.equal(expired.body.code, 'commercial.license.expired_or_revoked');
  console.log('PASS: revocation rejects an already issued product JWT.');
} finally {
  await call(product, licensePath, license, '', platform);
}
const proof = JSON.parse(readFileSync('artifacts/docker-verification.json', 'utf8'));
proof.checks.push(
  'module settings license allowlist',
  'PostgreSQL concurrent capacity writes',
  'unlicensed module denial',
  'existing JWT revocation',
);
writeFileSync('artifacts/docker-verification.json', JSON.stringify(proof, null, 2));
