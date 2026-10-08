import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculate,
  progressiveTax,
  taxIncrement,
  noticeWeeks,
  calculators,
} from '../shared/calculators.js';
import { reports } from '../shared/content.js';
import { readFileSync } from 'node:fs';

test('2026 official wage and non-wage tariff boundary totals', () => {
  for (const [base, wage, expected] of [
    [190000, true, 28500],
    [400000, true, 70500],
    [1500000, true, 367500],
    [5300000, true, 1697500],
    [5300000, false, 1737500],
    [1000000, false, 232500],
    [5400000, true, 1737500],
  ])
    assert.equal(progressiveTax(base, wage), expected);
  assert.equal(taxIncrement(30000, 180000), 5500);
});
test('minimum-wage tax exemption follows the payroll month and does not underflow', () => {
  const v = { type: 'wage', base: 28075.5, previous: 168453, exemption: 'yes', month: 7 };
  assert.equal(calculate('gelir-vergisi', v).value, 0);
  assert.equal(calculate('gelir-vergisi', { ...v, base: 100 }).value, 0);
  assert.throws(() => calculate('gelir-vergisi', { ...v, month: 13 }));
});
test('notice thresholds use calendar anniversaries including leap years', () => {
  for (const [end, expected] of [
    ['2024-07-31', 2],
    ['2024-08-01', 4],
    ['2025-08-01', 6],
    ['2027-02-01', 6],
    ['2027-02-02', 8],
  ])
    assert.equal(noticeWeeks('2024-02-01', end), expected);
  assert.equal(noticeWeeks('2024-02-29', '2024-08-28'), 2);
  assert.equal(noticeWeeks('2024-02-29', '2024-08-29'), 4);
});
test('severance selects the correct half-year ceiling and minimum service', () => {
  const a = calculate('kidem-tazminati', {
    salary: 100000,
    start: '2024-07-01',
    end: '2026-07-01',
  });
  assert.equal(a.rows[2].value, 147459.74);
  assert.equal(a.value, 146340.52);
  const b = calculate('kidem-tazminati', {
    salary: 100000,
    start: '2025-06-30',
    end: '2026-06-30',
  });
  assert.equal(b.rows[2].value, 64948.77);
  assert.equal(
    calculate('kidem-tazminati', { salary: 100000, start: '2026-01-01', end: '2026-10-08' }).value,
    0,
  );
  assert.throws(() =>
    calculate('kidem-tazminati', { salary: 100000, start: '2024-01-01', end: '2027-01-01' }),
  );
});
test('normal and pension employer premiums respect 2026 ceiling', () => {
  assert.equal(
    calculate('isveren-maliyeti', { salary: 40000, type: 'normal', discount: 0 }).value,
    49500,
  );
  assert.equal(
    calculate('isveren-maliyeti', { salary: 40000, type: 'pension', discount: 5 }).value,
    49900,
  );
  assert.equal(
    calculate('isveren-maliyeti', { salary: 400000, type: 'normal', discount: 0 }).value,
    470601.63,
  );
  assert.throws(() =>
    calculate('isveren-maliyeti', { salary: 10000, type: 'normal', discount: 0 }),
  );
});
test('overtime separates 25 and 50 percent premiums', () =>
  assert.equal(calculate('fazla-mesai', { salary: 45000, hours: 10, extra: 4 }).value, 4000));
test('meal budget handles VAT-inclusive card and cash separately', () => {
  assert.equal(
    calculate('yemek-ucreti', { daily: 330, days: 22, type: 'card', vat: 10, vatMode: 'included' })
      .value,
    7260,
  );
  assert.equal(
    calculate('yemek-ucreti', { daily: 300, days: 22, type: 'cash', vat: 10, vatMode: 'included' })
      .value,
    6600,
  );
  assert.equal(
    calculate('yemek-ucreti', { daily: 330, days: 22, type: 'card', vat: 10, vatMode: 'included' })
      .rows[2].value,
    6600,
  );
});
test('all eight tools produce finite defaults and reject invalid data', () => {
  for (const c of calculators) {
    const values = Object.fromEntries(c.fields.map((f) => [f.key, f.value]));
    assert.ok(Number.isFinite(calculate(c.id, values).value), c.id);
  }
  assert.throws(() => progressiveTax(-1));
  assert.throws(() => progressiveTax(Infinity));
  assert.throws(() => noticeWeeks('2026-02-30', '2026-10-08'));
  assert.throws(() => noticeWeeks('2026-10-08', '2026-01-01'));
  assert.throws(() => calculate('maas-zammi', { type: 'rate', salary: 0, rate: 10 }));
  assert.throws(
    () =>
      calculate('ihbar-suresi', {
        start: '2020-01-01',
        end: '2027-01-01',
        salary: 40000,
        previous: 0,
      }),
    /2026/,
  );
});
test('every guide download exists as an actual PDF', () => {
  for (const r of reports)
    assert.equal(
      readFileSync(`public/rehberler/senseik-${r.id}.pdf`).subarray(0, 5).toString(),
      '%PDF-',
    );
});
