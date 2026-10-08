// Research copies only; third-party PDFs are not published as SenseIK content.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const sources = [
  ['izin', 'https://idenfit.com/wp-content/uploads/2026/09/Izin-ve-Ise-Donus-2026.pdf'],
  ['kusaklar', 'https://idenfit.com/wp-content/uploads/2026/04/Kusaklarin-is-Gucune-Etkisi.pdf'],
  ['ise-alim', 'https://idenfit.com/wp-content/uploads/2026/04/Veri-Odakli-Ise-Alim-Rehberi.pdf'],
  [
    'dijitallesme',
    'https://idenfit.com/wp-content/uploads/2026/04/2026ya-Hazirlik-10-Adimda-Dijital-IK-Donusum-Rehberi.pdf',
  ],
  ['strateji', 'https://idenfit.com/wp-content/uploads/2026/04/2026-Stratejik-IK-Rehberi-1.pdf'],
];
mkdirSync('artifacts/references', { recursive: true });
const result = await Promise.all(
  sources.map(async ([id, url]) => {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const b = Buffer.from(await r.arrayBuffer());
      if (b.subarray(0, 5).toString() !== '%PDF-') throw new Error('Not PDF');
      writeFileSync(`artifacts/references/${id}.pdf`, b);
      return {
        id,
        url,
        bytes: b.length,
        sha256: createHash('sha256').update(b).digest('hex'),
        downloadedAt: new Date().toISOString(),
      };
    } catch (e) {
      return { id, url, error: e.message };
    }
  }),
);
writeFileSync('artifacts/references/manifest.json', JSON.stringify(result, null, 2));
console.log(
  JSON.stringify(
    result.map(({ id, bytes, error }) => ({ id, bytes, error })),
    null,
    2,
  ),
);
