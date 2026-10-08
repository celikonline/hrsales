// Local-only credentials stay in ignored data/. Never overwrite an existing installation.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { resolve } from 'node:path';
import { hashPassword } from '../server/security.js';
mkdirSync('data', { recursive: true });
const file = 'data/docker.env';
if (!existsSync(file)) {
  const adminFile = 'data/dev-admin-credentials.json';
  const admin = existsSync(adminFile)
    ? JSON.parse(readFileSync(adminFile, 'utf8'))
    : { email: 'admin@senseik.local', password: randomBytes(24).toString('base64url') };
  if (!existsSync(adminFile)) writeFileSync(adminFile, JSON.stringify(admin, null, 2));
  const secrets = {
    SENSEHR_ROOT: resolve('../senseik').replaceAll('\\', '/'),
    MIGRATOR_DOCKERFILE: resolve('integrations/sensehr/Dockerfile.migrator').replaceAll('\\', '/'),
    POSTGRES_PASSWORD: randomBytes(24).toString('hex'),
    MINIO_PASSWORD: randomBytes(24).toString('hex'),
    PLATFORM_EMAIL: 'sales-service@senseik.local',
    PLATFORM_PASSWORD: `Sense!${randomBytes(24).toString('base64url')}`,
    CREDENTIAL_PEPPER: randomBytes(48).toString('base64'),
    ADMIN_EMAIL: admin.email,
    ADMIN_PASSWORD_HASH: hashPassword(admin.password),
  };
  writeFileSync(
    file,
    Object.entries(secrets)
      .map(([k, v]) => `${k}='${v}'`)
      .join('\n') + '\n',
  );
}
console.log('Docker local settings ready: data/docker.env (ignored).');
