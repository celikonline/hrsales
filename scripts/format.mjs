import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import prettier from 'prettier';
function files(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(path, e.name)) : [join(path, e.name)],
  );
}
for (const path of [
  ...['src', 'server', 'shared', 'tests', 'scripts', 'docs'].flatMap(files),
  'README.md',
  'package.json',
  'vite.config.js',
  'index.html',
  '.github/workflows/ci.yml',
  'integrations/sensehr/README.md',
  'integrations/sensehr/manifest.json',
]) {
  if (!/\.(jsx?|mjs|css|json|md|html|yml)$/.test(path)) continue;
  writeFileSync(
    path,
    await prettier.format(readFileSync(path, 'utf8'), {
      filepath: path,
      singleQuote: true,
      printWidth: 100,
    }),
  );
}
console.log('Source files formatted.');
