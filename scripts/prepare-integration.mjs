// Package only this task's product changes; never include unrelated work or local credentials.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve('../senseik');
const modified = [
  'src/Modules/Identity/Sense.Modules.Identity.Application/Tenants/CreateTenant.cs',
  'src/Modules/Identity/Sense.Modules.Identity.Application/Auth/Login.cs',
  'src/Modules/Identity/Sense.Modules.Identity.Application/Auth/RefreshAndLogout.cs',
  'src/Modules/Identity/Sense.Modules.Identity.Application/Auth/GetMe.cs',
  'src/Modules/Identity/Sense.Modules.Identity.Infrastructure/Security/ModuleAccessService.cs',
  'src/Modules/Identity/Sense.Modules.Identity.Api/IdentityModule.cs',
  'src/Modules/Employee/Sense.Modules.Employee.Infrastructure/Persistence/EmployeeDbContext.cs',
  'src/Shared/Sense.Shared.Web/ErrorHandling/GlobalExceptionHandler.cs',
  'src/Sense.Api/Program.cs',
  'web/src/layouts/app-layout.tsx',
];
const added = [
  'src/Modules/Identity/Sense.Modules.Identity.Domain/Tenants/CommercialLicense.cs',
  'src/Modules/Identity/Sense.Modules.Identity.Application/Tenants/CommercialLicensing.cs',
  'src/Modules/Identity/Sense.Modules.Identity.Api/Controllers/CommercialController.cs',
  'src/Modules/Identity/Sense.Modules.Identity.Infrastructure/Security/CommercialEntitlements.cs',
  'src/Sense.Api/Middleware/CommercialLicenseMiddleware.cs',
  'src/Shared/Sense.Shared.Contracts/Modules/ICommercialEntitlements.cs',
  'web/src/components/commercial-license-banner.tsx',
  'tests/Modules/Sense.Modules.Identity.Tests/Tenants/CommercialLicenseTests.cs',
];
let patch = execFileSync('git', ['-C', root, 'diff', '--binary', '--', ...modified], {
  encoding: 'utf8',
});
for (const path of added) {
  try {
    patch += execFileSync('git', ['diff', '--no-index', '--', '/dev/null', path], {
      cwd: root,
      encoding: 'utf8',
    });
  } catch (error) {
    if (error.status !== 1) throw error;
    patch += error.stdout;
  }
}
mkdirSync('integrations/sensehr', { recursive: true });
writeFileSync('integrations/sensehr/commercial.patch', patch);
writeFileSync(
  'integrations/sensehr/manifest.json',
  JSON.stringify(
    {
      base: execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
      files: [...modified, ...added],
    },
    null,
    2,
  ) + '\n',
);
console.log(`SenseHR integration: ${modified.length + added.length} files packaged.`);
