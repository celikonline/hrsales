import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { modules, plans, moduleName } from '../shared/catalog.js';
import { digest, token, verifyPassword, parseCookies } from './security.js';
import { createMailer } from './mail.js';
import { createProductAdapter } from './product.js';

export function readConfig(env = process.env) {
  const whatsappPhone = (env.WHATSAPP_PHONE || '').replace(/[+\s()-]/g, '');
  const whatsappUrl = /^[1-9]\d{9,14}$/.test(whatsappPhone)
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent('Merhaba, SenseIK / SenseHR için demo bilgisi almak istiyorum.')}`
    : '';
  return {
    whatsappUrl,
    production: env.NODE_ENV === 'production',
    publicUrl: (env.PUBLIC_URL || 'http://localhost:4173').replace(/\/$/, ''),
    adminEmail: env.ADMIN_EMAIL || 'admin@senseik.local',
    adminHash: env.ADMIN_PASSWORD_HASH || '',
    notifyEmail: env.ADMIN_NOTIFICATION_EMAIL || env.ADMIN_EMAIL || 'admin@senseik.local',
    smtpHost: env.SMTP_HOST,
    smtpPort: Number(env.SMTP_PORT || 587),
    smtpSecure: env.SMTP_SECURE === 'true',
    smtpUser: env.SMTP_USER,
    smtpPassword: env.SMTP_PASSWORD,
    mailFrom: env.MAIL_FROM || 'SenseIK <demo@senseik.local>',
    trialDays: Math.min(30, Math.max(1, Number(env.TRIAL_DAYS) || 14)),
    productMode: env.PRODUCT_MODE || 'sandbox',
    productApi: (env.SENSEHR_API_URL || 'http://localhost:5000/api').replace(/\/$/, ''),
    productWeb: env.SENSEHR_WEB_URL || 'http://localhost:3000',
    platformEmail: env.SENSEHR_PLATFORM_EMAIL,
    platformPassword: env.SENSEHR_PLATFORM_PASSWORD,
    privacyUrl: env.PRIVACY_URL || '/gizlilik',
    supportEmail: env.SUPPORT_EMAIL || '',
    prices: Object.fromEntries(
      plans.map((p) => [
        p.key,
        Number(env[`PRICE_${p.key.toUpperCase()}`]) > 0
          ? Number(env[`PRICE_${p.key.toUpperCase()}`])
          : null,
      ]),
    ),
  };
}
const fields = {
  requestType: z.enum(['demo', 'presentation']).default('demo'),
  fullName: z.string().trim().min(3).max(100),
  company: z.string().trim().min(2).max(200),
  email: z
    .email()
    .max(254)
    .transform((e) => e.toLowerCase()),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{10,25}$/, 'Geçerli bir telefon numarası girin.')
    .refine((value) => {
      const digits = value.replace(/\D/g, '').length;
      return digits >= 10 && digits <= 15;
    }, 'Telefon numarası 10 ile 15 rakam içermelidir.'),
  employees: z.number().int().min(1).max(100000),
  modules: z
    .array(z.enum(modules.map((m) => m.key)))
    .min(1)
    .max(modules.length)
    .transform((keys) => [...new Set(['employee', ...keys])]),
  plan: z.enum(plans.map((p) => p.key)).default('growth'),
  notes: z.string().trim().max(1500).default(''),
  privacyAccepted: z.literal(true),
  website: z.string().max(0).optional(),
};
const leadSchema = z.object(fields);
const quickLeadSchema = leadSchema
  .pick({
    email: true,
    phone: true,
    privacyAccepted: true,
    website: true,
    plan: true,
    notes: true,
  })
  .extend({ modules: fields.modules.default(['employee', 'leave', 'payroll']) })
  .transform((input) => ({
    ...input,
    fullName: '',
    company: '',
    employees: null,
  }));
const cookieName = 'sense_session';
const time = () => new Date().toISOString();
const future = (days) => new Date(Date.now() + days * 86400000).toISOString();
const validLicense = (lead) =>
  lead.status === 'approved' &&
  lead.license?.status !== 'revoked' &&
  lead.license?.expiresAt > time();
const safeLead = (lead) => {
  const { product, ...rest } = lead;
  return {
    ...rest,
    product: product
      ? { mode: product.mode, tenantId: product.tenantId, slug: product.slug }
      : null,
  };
};

export function createApp(store, config, injected = {}) {
  if (
    config.production &&
    (!config.adminHash ||
      !config.publicUrl.startsWith('https://') ||
      !config.smtpHost ||
      !config.notifyEmail ||
      config.privacyUrl === '/gizlilik' ||
      config.productMode !== 'sensehr' ||
      !config.platformEmail ||
      !config.platformPassword)
  ) {
    throw new Error(
      'Üretim için HTTPS, yönetici parolası, SMTP, bildirim adresi, onaylı gizlilik URL’si ve SenseHR bağlantısı gereklidir. .env.example dosyasını inceleyin.',
    );
  }
  if (!['sandbox', 'sensehr'].includes(config.productMode))
    throw new Error('PRODUCT_MODE geçersiz.');
  const app = express();
  const mailer = injected.mailer || createMailer(store, config);
  const product = injected.product || createProductAdapter(config);
  app.locals.mailer = mailer;
  app.disable('x-powered-by');
  app.use(
    helmet({
      contentSecurityPolicy: config.production ? undefined : false,
      crossOriginEmbedderPolicy: false,
      strictTransportSecurity: config.production ? undefined : false,
    }),
  );
  app.use(express.json({ limit: '24kb' }));
  app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.use('/api', (req, res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      const origin = req.get('origin');
      if (origin && origin !== new URL(config.publicUrl).origin)
        return res.status(403).json({ message: 'İstek kaynağı doğrulanamadı.' });
      if (req.get('sec-fetch-site') === 'cross-site')
        return res.status(403).json({ message: 'İstek kaynağı doğrulanamadı.' });
      if (!req.is('application/json'))
        return res.status(415).json({ message: 'JSON içerik bekleniyor.' });
    }
    next();
  });
  const publicLimit = rateLimit({
    windowMs: 3600000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      message: 'Çok sayıda istek gönderdiniz. Daha sonra tekrar deneyin.',
    },
  });
  const authLimit = rateLimit({
    windowMs: 900000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      message: 'Çok sayıda giriş denemesi. 15 dakika sonra tekrar deneyin.',
    },
  });
  function issueSession(res, role, leadId, expiresAt) {
    const raw = token();
    store.db
      .prepare('INSERT INTO sessions VALUES(?,?,?,?)')
      .run(digest(raw), role, leadId, expiresAt);
    res.cookie(cookieName, raw, {
      httpOnly: true,
      secure: config.production,
      sameSite: 'strict',
      path: '/',
      expires: new Date(expiresAt),
    });
  }
  function auth(role) {
    return (req, res, next) => {
      const raw = parseCookies(req.get('cookie'))[cookieName];
      const session = raw
        ? store.db
            .prepare('SELECT * FROM sessions WHERE hash=? AND expires_at>?')
            .get(digest(raw), time())
        : null;
      if (!session || session.role !== role)
        return res.status(401).json({ message: 'Oturum açmanız gerekiyor.' });
      req.session = session;
      if (role === 'demo') {
        req.lead = store.lead(session.lead_id);
        if (!req.lead || !validLicense(req.lead))
          return res.status(403).json({
            message: 'Demo veya lisans süreniz doldu ya da erişiminiz iptal edildi.',
          });
      }
      next();
    };
  }
  const locks = new Set();
  const exclusive = (handler) => async (req, res, next) => {
    const key = req.path.includes('/orders/')
      ? store.order(req.params.id)?.leadId || req.params.id
      : req.params.id;
    if (locks.has(key))
      return res.status(409).json({ message: 'Bu kayıt üzerinde işlem sürüyor.' });
    locks.add(key);
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    } finally {
      locks.delete(key);
    }
  };
  function invite(lead) {
    const raw = token();
    store.db.prepare('UPDATE links SET used=1 WHERE lead_id=?').run(lead.id);
    store.db
      .prepare('INSERT INTO links(hash,lead_id,expires_at) VALUES(?,?,?)')
      .run(digest(raw), lead.id, lead.license.expiresAt);
    // Fragment prevents the bearer token from appearing in server/proxy access logs and referrers.
    mailer.enqueue(
      lead.email,
      'SenseIK demonuz hazır',
      `Merhaba ${lead.fullName},\n\n${lead.company} için demo talebiniz onaylandı.\nModüller: ${lead.modules.map(moduleName).join(', ')}\nBitiş: ${new Date(lead.license.expiresAt).toLocaleDateString('tr-TR', { timeZone: 'Europe/Istanbul' })}\n\nGüvenli, tek kullanımlık giriş bağlantınız:\n${config.publicUrl}/demo#token=${raw}\n\n${lead.product?.mode === 'sandbox' ? 'Bu ortam örnek veriler içeren bir satış demosudur.' : 'Bağlantıdan SenseHR davetinize ulaşarak parolanızı belirleyebilirsiniz.'}\n\nSenseIK ekibi`,
    );
  }
  app.get('/api/catalog', (_req, res) =>
    res.json({
      modules,
      plans: plans.map((p) => ({ ...p, price: config.prices[p.key] })),
      trialDays: config.trialDays,
      privacyUrl: config.privacyUrl,
      supportEmail: config.supportEmail,
      whatsappUrl: config.whatsappUrl,
      productWeb: config.productWeb,
      mode: config.productMode,
    }),
  );
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.post(['/api/demo-requests', '/api/demo-requests/quick'], publicLimit, (req, res) => {
    const quick = req.path.endsWith('/quick');
    const input = (quick ? quickLeadSchema : leadSchema).parse(req.body);
    // Do not disclose whether this address already has a request.
    const existing = store.db
      .prepare(
        "SELECT id FROM leads WHERE email=? AND status IN ('pending','approved') AND COALESCE(json_extract(body, '$.requestType'), 'demo')=?",
      )
      .get(input.email, input.requestType || 'demo');
    if (!existing)
      store.transaction(() => {
        const lead = {
          ...input,
          id: randomUUID(),
          status: 'pending',
          createdAt: time(),
          privacyVersion: '2026-10-08',
          privacyAcceptedAt: time(),
          license: null,
          product: null,
        };
        store.saveLead(lead);
        const presentation = lead.requestType === 'presentation';
        const requestLabel = presentation ? 'online sunum' : 'demo';
        store.audit(presentation ? 'presentation.requested' : 'demo.requested', lead.id, 'public');
        mailer.enqueue(
          lead.email,
          `SenseIK ${requestLabel} talebinizi aldık`,
          presentation
            ? `Merhaba ${lead.fullName},\n\n${lead.company} için online sunum talebiniz alındı. Ekibimiz size özel online sunumu planlamak için bu e-posta adresinden sizinle iletişime geçecek. Görüşme zamanı birlikte belirlenecek.\n\nSenseIK ekibi`
            : quick
              ? 'Merhaba,\n\nDemo talebiniz alındı. Ekibimiz bu e-posta adresinden sizinle iletişime geçerek ihtiyacınıza uygun demoyu planlayacak.\n\nSenseIK ekibi'
              : `Merhaba ${lead.fullName},\n\n${lead.company} için ${lead.employees} çalışan ve ${lead.modules.map(moduleName).join(', ')} modülleriyle demo talebiniz alındı. Ekibimiz başvurunuzu inceleyecek. Onaylandığında giriş bağlantınız bu adrese gönderilecek.\n\nSenseIK ekibi`,
        );
        mailer.enqueue(
          config.notifyEmail,
          `Yeni ${requestLabel} talebi: ${lead.company || lead.email}`,
          `${lead.fullName || 'Hızlı demo talebi'}\n${lead.email}\n${lead.phone || 'Telefon henüz paylaşılmadı'}\nÇalışan: ${lead.employees ?? 'Henüz paylaşılmadı'}\nModüller: ${lead.modules.map(moduleName).join(', ')}\nNot: ${lead.notes}\n\nİnceleyin: ${config.publicUrl}/admin`,
        );
      });
    res.status(202).json({
      message: 'Talebiniz alındı. Ekibimiz inceledikten sonra e-posta ile bilgi verecek.',
    });
  });
  app.post('/api/admin/login', authLimit, (req, res) => {
    const input = z
      .object({ email: z.string().max(254), password: z.string().max(512) })
      .parse(req.body);
    const valid = verifyPassword(input.password, config.adminHash);
    if (!valid || input.email.toLowerCase() !== config.adminEmail.toLowerCase())
      return res.status(401).json({ message: 'E-posta veya parola hatalı.' });
    issueSession(res, 'admin', null, future(1 / 3));
    store.audit('admin.login', null, config.adminEmail);
    res.json({ email: config.adminEmail });
  });
  app.post('/api/logout', (req, res) => {
    const raw = parseCookies(req.get('cookie'))[cookieName];
    if (raw) store.db.prepare('DELETE FROM sessions WHERE hash=?').run(digest(raw));
    res.clearCookie(cookieName, { path: '/' });
    res.json({ success: true });
  });
  app.get('/api/admin/overview', auth('admin'), (_req, res) => {
    const messages = store.db
      .prepare(
        'SELECT id,recipient,subject,status,attempts,last_error,sent_at FROM outbox ORDER BY rowid DESC LIMIT 50',
      )
      .all();
    res.json({
      leads: store.leads().map(safeLead),
      orders: store.orders(),
      messages,
      mailConfigured: mailer.configured,
      productMode: config.productMode,
      audit: store.db.prepare('SELECT * FROM audit ORDER BY id DESC LIMIT 30').all(),
    });
  });
  app.get('/api/admin/messages/:id', auth('admin'), (req, res) => {
    if (config.production)
      return res.status(403).json({ message: 'Üretimde mesaj içeriği görüntülenmez.' });
    const message = store.db.prepare('SELECT body FROM outbox WHERE id=?').get(req.params.id);
    if (!message) return res.status(404).json({ message: 'Mesaj bulunamadı.' });
    res.json(message);
  });
  app.post('/api/admin/messages/:id/retry', auth('admin'), (req, res) => {
    const changed = store.db
      .prepare(
        "UPDATE outbox SET status='pending',attempts=0,next_at=? WHERE id=? AND status IN ('failed','retry')",
      )
      .run(time(), req.params.id);
    res.json({ success: changed.changes > 0 });
  });
  app.post(
    '/api/admin/leads/:id/approve',
    auth('admin'),
    exclusive(async (req, res) => {
      const lead = store.lead(req.params.id);
      if (!lead) return res.status(404).json({ message: 'Başvuru bulunamadı.' });
      if (lead.status !== 'pending')
        return res.status(409).json({ message: 'Yalnız bekleyen talepler onaylanabilir.' });
      const input = z
        .object({
          days: z.number().int().min(1).max(30),
          modules: fields.modules,
          fullName: fields.fullName,
          company: fields.company,
          employees: fields.employees,
        })
        .parse({
          fullName: lead.fullName,
          company: lead.company,
          employees: lead.employees,
          ...req.body,
        });
      lead.fullName = input.fullName;
      lead.company = input.company;
      lead.employees = input.employees;
      lead.modules = input.modules;
      lead.license = {
        status: 'trial',
        plan: lead.plan,
        modules: lead.modules,
        employeeLimit: lead.employees,
        expiresAt: future(input.days),
        reference: lead.id,
      };
      lead.product = await product.provision(lead, lead.license);
      lead.status = 'approved';
      lead.approvedAt = time();
      store.transaction(() => {
        store.saveLead(lead);
        invite(lead);
        store.audit('demo.approved', lead.id, config.adminEmail);
      });
      res.json(safeLead(lead));
    }),
  );
  app.post(
    '/api/admin/leads/:id/reject',
    auth('admin'),
    exclusive(async (req, res) => {
      const lead = store.lead(req.params.id);
      if (!lead || lead.status !== 'pending')
        return res.status(409).json({ message: 'Bekleyen başvuru bulunamadı.' });
      const { reason } = z.object({ reason: z.string().trim().min(5).max(500) }).parse(req.body);
      lead.status = 'rejected';
      lead.reason = reason;
      store.transaction(() => {
        store.saveLead(lead);
        store.audit('demo.rejected', lead.id, config.adminEmail);
        mailer.enqueue(
          lead.email,
          'SenseIK demo başvurunuz hakkında',
          `Merhaba ${lead.fullName},\n\n${reason}\n\nSenseIK ekibi`,
        );
      });
      res.json(safeLead(lead));
    }),
  );
  app.post(
    '/api/admin/leads/:id/revoke',
    auth('admin'),
    exclusive(async (req, res) => {
      const lead = store.lead(req.params.id);
      if (!lead || lead.status !== 'approved')
        return res.status(409).json({ message: 'Aktif başvuru bulunamadı.' });
      const license = { ...lead.license, status: 'revoked' };
      await product.updateLicense(lead, license);
      lead.license = license;
      store.transaction(() => {
        store.saveLead(lead);
        store.db.prepare('DELETE FROM sessions WHERE lead_id=?').run(lead.id);
        store.db.prepare('UPDATE links SET used=1 WHERE lead_id=?').run(lead.id);
        store.audit('license.revoked', lead.id, config.adminEmail);
      });
      res.json(safeLead(lead));
    }),
  );
  app.post(
    '/api/admin/leads/:id/invite',
    auth('admin'),
    exclusive(async (req, res) => {
      const lead = store.lead(req.params.id);
      if (!lead || !validLicense(lead))
        return res.status(409).json({ message: 'Demo süresi bitmiş veya erişim iptal edilmiş.' });
      if (lead.product?.mode === 'sensehr')
        lead.product = await product.provision(lead, lead.license);
      store.transaction(() => {
        store.saveLead(lead);
        invite(lead);
        store.audit('demo.invite_resent', lead.id, config.adminEmail);
      });
      res.json({ success: true });
    }),
  );
  app.post('/api/demo/access', authLimit, (req, res) => {
    const { token: raw } = z.object({ token: z.string().min(30).max(100) }).parse(req.body);
    store.transaction(() => {
      const link = store.db
        .prepare('SELECT * FROM links WHERE hash=? AND used=0 AND expires_at>?')
        .get(digest(raw), time());
      const lead = link ? store.lead(link.lead_id) : null;
      if (!lead || !validLicense(lead))
        return res.status(403).json({
          message: 'Bağlantı geçersiz, kullanılmış veya süresi dolmuş. Yeni davet isteyin.',
        });
      store.db.prepare('UPDATE links SET used=1 WHERE hash=? AND used=0').run(digest(raw));
      issueSession(res, 'demo', lead.id, future(1 / 3));
      store.audit('demo.login', lead.id, lead.email);
      res.json({ success: true });
    });
  });
  app.get('/api/demo/workspace', auth('demo'), (req, res) =>
    res.json({
      lead: safeLead(req.lead),
      orders: store.orders().filter((o) => o.leadId === req.lead.id),
      entryUrl: req.lead.product?.entryUrl || null,
      productLogin: `${config.productWeb}/login`,
      sample: {
        employees: [
          {
            name: 'Elif Yılmaz',
            department: 'İnsan Kaynakları',
            role: 'İK Uzmanı',
            avatar: 'EY',
          },
          {
            name: 'Can Demir',
            department: 'Ürün',
            role: 'Ürün Yöneticisi',
            avatar: 'CD',
          },
          {
            name: 'Deniz Kaya',
            department: 'Yazılım',
            role: 'Yazılım Geliştirici',
            avatar: 'DK',
          },
          {
            name: 'Zeynep Arslan',
            department: 'Finans',
            role: 'Finans Uzmanı',
            avatar: 'ZA',
          },
        ],
        requests: [
          {
            id: 'l1',
            module: 'leave',
            employee: 'Can Demir',
            description: 'Yıllık izin · 12–14 Ekim',
            value: '3 gün',
          },
          {
            id: 'e1',
            module: 'expense',
            employee: 'Deniz Kaya',
            description: 'Müşteri ziyareti · ulaşım',
            value: '₺1.250',
          },
        ],
      },
      decisions: req.lead.decisions || {},
    }),
  );
  app.post('/api/demo/requests/:id/decision', auth('demo'), (req, res) => {
    const module = req.params.id === 'l1' ? 'leave' : req.params.id === 'e1' ? 'expense' : null;
    if (!module || !req.lead.modules.includes(module))
      return res.status(403).json({ message: 'Bu modüle erişiminiz yok.' });
    const { decision } = z.object({ decision: z.enum(['approved', 'rejected']) }).parse(req.body);
    req.lead.decisions = { ...req.lead.decisions, [req.params.id]: decision };
    store.saveLead(req.lead);
    res.json({ success: true });
  });
  app.post('/api/orders', auth('demo'), (req, res) => {
    const input = z
      .object({
        plan: fields.plan,
        employees: fields.employees,
        cycle: z.enum(['monthly', 'yearly']),
        billingCompany: z.string().trim().min(2).max(200),
        taxNumber: z.string().regex(/^\d{10,11}$/, 'Vergi numarası 10 veya 11 rakam olmalı.'),
        billingAddress: z.string().trim().min(10).max(500),
      })
      .parse(req.body);
    if (
      store
        .orders()
        .some((o) => o.leadId === req.lead.id && !['paid', 'cancelled'].includes(o.status))
    )
      return res.status(409).json({ message: 'Zaten açık bir satın alma talebiniz var.' });
    const plan = plans.find((p) => p.key === input.plan);
    const price = config.prices[input.plan];
    const order = {
      ...input,
      id: randomUUID(),
      leadId: req.lead.id,
      company: req.lead.company,
      email: req.lead.email,
      status: 'awaiting_quote',
      createdAt: time(),
      billedEmployees: Math.max(input.employees, plan.minimum),
      estimatedSubtotal: price
        ? price * Math.max(input.employees, plan.minimum) * (input.cycle === 'yearly' ? 12 : 1)
        : null,
    };
    store.transaction(() => {
      store.saveOrder(order);
      store.audit('purchase.requested', order.id, req.lead.email);
      mailer.enqueue(
        config.notifyEmail,
        `Satın alma talebi: ${order.company}`,
        `Paket: ${plan.name}\nÇalışan: ${order.employees}\nDönem: ${order.cycle}\n${config.publicUrl}/admin`,
      );
    });
    res.status(201).json(order);
  });
  app.post(
    '/api/admin/orders/:id/quote',
    auth('admin'),
    exclusive(async (req, res) => {
      const order = store.order(req.params.id);
      if (!order || !['awaiting_quote', 'pending_payment'].includes(order.status))
        return res.status(409).json({ message: 'Teklif verilebilecek talep bulunamadı.' });
      const input = z
        .object({
          amount: z.number().positive().max(100000000),
          taxPercent: z.number().min(0).max(100),
          paymentInstructions: z.string().trim().min(10).max(1000),
        })
        .parse(req.body);
      Object.assign(order, input, {
        status: 'pending_payment',
        total: Math.round(input.amount * (1 + input.taxPercent / 100) * 100) / 100,
        quotedAt: time(),
      });
      store.transaction(() => {
        store.saveOrder(order);
        store.audit('purchase.quoted', order.id, config.adminEmail);
        mailer.enqueue(
          order.email,
          'SenseIK paket teklifiniz hazır',
          `Paket: ${order.plan}\nVergi hariç: ${order.amount} TRY\nVergi: %${order.taxPercent}\nToplam: ${order.total} TRY\n\n${order.paymentInstructions}\n\nÖdeme doğrulandıktan sonra lisansınız etkinleştirilecektir.`,
        );
      });
      res.json(order);
    }),
  );
  app.post(
    '/api/admin/orders/:id/activate',
    auth('admin'),
    exclusive(async (req, res) => {
      const order = store.order(req.params.id);
      if (!order || order.status !== 'pending_payment')
        return res.status(409).json({ message: 'Ödeme bekleyen talep bulunamadı.' });
      const input = z
        .object({
          paymentReference: z.string().trim().min(5).max(100),
          paymentVerified: z.literal(true),
        })
        .parse(req.body);
      const lead = store.lead(order.leadId);
      if (!lead || lead.license?.status === 'revoked')
        return res.status(409).json({
          message: 'İptal edilmiş erişimde lisans etkinleştirilemez.',
        });
      const expiry = new Date();
      if (order.cycle === 'yearly') expiry.setUTCFullYear(expiry.getUTCFullYear() + 1);
      else expiry.setUTCMonth(expiry.getUTCMonth() + 1);
      const license = {
        status: 'active',
        plan: order.plan,
        modules: plans.find((p) => p.key === order.plan).modules,
        employeeLimit: order.billedEmployees,
        expiresAt: expiry.toISOString(),
        reference: order.id,
      };
      await product.updateLicense(lead, license);
      if (lead.product?.mode === 'sensehr') lead.product = await product.provision(lead, license);
      lead.license = license;
      lead.modules = license.modules;
      lead.plan = order.plan;
      Object.assign(order, input, { status: 'paid', paidAt: time() });
      store.transaction(() => {
        store.saveLead(lead);
        store.saveOrder(order);
        invite(lead);
        store.audit('license.activated', order.id, config.adminEmail);
        mailer.enqueue(
          lead.email,
          'SenseIK lisansınız etkinleştirildi',
          `Paketiniz: ${order.plan}\nÇalışan kapasitesi: ${license.employeeLimit}\nLisans bitişi: ${license.expiresAt}\nÖdeme referansı: ${input.paymentReference}`,
        );
      });
      res.json(order);
    }),
  );
  app.post(
    '/api/admin/orders/:id/cancel',
    auth('admin'),
    exclusive(async (req, res) => {
      const order = store.order(req.params.id);
      if (!order || ['paid', 'cancelled'].includes(order.status))
        return res.status(409).json({ message: 'Bu talep iptal edilemez.' });
      order.status = 'cancelled';
      store.saveOrder(order);
      store.audit('purchase.cancelled', order.id, config.adminEmail);
      res.json(order);
    }),
  );
  app.use('/api', (_req, res) => res.status(404).json({ message: 'İşlem bulunamadı.' }));
  app.use((error, _req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof z.ZodError)
      return res.status(400).json({
        message: 'Lütfen alanları kontrol edin.',
        fields: error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      });
    if (error.type === 'entity.parse.failed' || error.type === 'entity.too.large')
      return res.status(400).json({ message: 'Geçersiz veya çok büyük istek.' });
    console.error('API error:', error.message);
    res.status(503).json({
      message:
        'İşlem tamamlanamadı. Tekrar deneyin; devam ederse bağlantı ayarlarını kontrol edin.',
    });
  });
  return app;
}
