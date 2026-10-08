import { createServer } from 'node:http';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import express from 'express';
import { resolve } from 'node:path';
import { createStore } from './store.js';
import { createApp, readConfig } from './app.js';
import { hashPassword, token } from './security.js';
const config = readConfig();
const production = process.argv.includes('--production') || config.production;
if (production) config.production = true;
if (!config.adminHash && !production) {
  mkdirSync('data', { recursive: true });
  const path = 'data/dev-admin-credentials.json';
  if (!existsSync(path))
    writeFileSync(
      path,
      JSON.stringify({ email: config.adminEmail, password: token().slice(0, 22) }, null, 2),
    );
  const credentials = JSON.parse(readFileSync(path, 'utf8'));
  config.adminEmail = credentials.email;
  config.adminHash = hashPassword(credentials.password);
  console.log(`Yerel yönetici bilgileri: ${resolve(path)}`);
}
const store = createStore(process.env.DATABASE_PATH);
const app = createApp(store, config);
const server = createServer(app);
if (production || process.env.SERVE_DIST === 'true') {
  if (!existsSync('dist/index.html')) throw new Error('Önce npm run build çalıştırın.');
  app.use(express.static(resolve('dist'), { index: false, maxAge: '1h' }));
  app.get('/{*path}', (_req, res) => res.sendFile(resolve('dist/index.html')));
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: { server } },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}
const timer = setInterval(() => void app.locals.mailer.flush(), 10000);
timer.unref();
// Cleanup expired credentials, keep business records for administrative review.
const cleanup = setInterval(() => {
  store.db.prepare('DELETE FROM sessions WHERE expires_at<?').run(new Date().toISOString());
  store.db.prepare('DELETE FROM links WHERE expires_at<?').run(new Date().toISOString());
}, 3600000);
cleanup.unref();
server.listen(Number(process.env.PORT || 4173), process.env.HOST || '127.0.0.1', () =>
  console.log(`SenseIK hazır: ${config.publicUrl}`),
);
for (const signal of ['SIGTERM', 'SIGINT'])
  process.on(signal, () => {
    clearInterval(timer);
    clearInterval(cleanup);
    server.close(() => {
      store.close();
      process.exit(0);
    });
  });
