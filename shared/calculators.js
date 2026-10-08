export const legalSources = {
  tax: {
    name: 'GİB · 2026 gelir vergisi tarifesi',
    url: 'https://gib.gov.tr/mevzuat/kanun/433/madde/6937',
  },
  labor: {
    name: 'ÇSGB · İş Kanunu soruları',
    url: 'https://www.csgb.gov.tr/sikca-sorulan-sorular/calisma-genel-mudurlugu/%C4%B1s-kanunu/',
  },
  ceiling: {
    name: 'ÇSGB · 2026 kıdem tavanı',
    url: 'https://www.csgb.gov.tr/yayinlar/calisma-hayati-istatistikleri-e-bulteni/temmuz-2026/ucret-ve-sendikal-istatistikler.html',
  },
  sgk: {
    name: 'SGK · İşveren prim oranları',
    url: 'https://www.sgk.gov.tr/Content/Post/c7812ea8-5087-413f-aeb5-d3c1d153e11a/Isveren-Prim-Oranlari-2026-01-13-04-52-38',
  },
  base: {
    name: 'SGK · 2026 prime esas kazanç sınırları',
    url: 'https://www.sgk.gov.tr/Content/Post/2e0c9e1a-2cfe-4456-af10-49d3de0c58ba/Prime-Esas-Kazanc-Miktarlari-2026-01-14-10-35-39',
  },
  corporate: {
    name: 'GİB · Kurumlar vergisinin beyanı',
    url: 'https://gib.gov.tr/vergi-konulari/2/19_kurumlar_vergisinin_beyani/19/130/681',
  },
  meal: {
    name: 'GİB · 2026 ücret geliri rehberi',
    url: 'https://intvrg.gib.gov.tr/hazirbeyan/assets/pdf/DUYURU_UNIVERSAL_2026_2026_Ucret_Geliri.pdf',
  },
};
export const rules2026 = {
  minimumWage: 33030,
  sgkCeiling: 297270,
  mealExemption: 300,
  stamp: 0.00759,
  version: '2026.10',
  verified: '8 Ekim 2026',
};
const num = (x, label, { min = 0, max = 1e12 } = {}) => {
  const n = Number(x);
  if (x === '' || x == null || !Number.isFinite(n) || n < min || n > max)
    throw new Error(`${label}: ${min} ile ${max} arasında bir değer girin.`);
  return n;
};
export const roundMoney = (x) => Math.round((x + Number.EPSILON) * 100) / 100;
export function progressiveTax(base, wage = true) {
  base = num(base, 'Matrah');
  const limits = [190000, 400000, wage ? 1500000 : 1000000, 5300000, Infinity];
  const rates = [0.15, 0.2, 0.27, 0.35, 0.4];
  let prev = 0,
    total = 0;
  for (let i = 0; i < limits.length; i++) {
    total += Math.max(0, Math.min(base, limits[i]) - prev) * rates[i];
    prev = limits[i];
    if (base <= prev) break;
  }
  return total;
}
export function taxIncrement(base, previous = 0, wage = true) {
  return roundMoney(
    progressiveTax(num(base, 'Dönem matrahı') + num(previous, 'Önceki matrah'), wage) -
      progressiveTax(previous, wage),
  );
}
function utcDate(x) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(x || '')) throw new Error('Geçerli tarih girin.');
  const d = new Date(`${x}T00:00:00Z`);
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== x)
    throw new Error('Geçerli tarih girin.');
  return d;
}
function anniversary(start, months) {
  const d = new Date(start);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, last));
  return d;
}
export function servicePeriod(startText, endText) {
  const start = utcDate(startText),
    end = utcDate(endText);
  if (end < start) throw new Error('Çıkış tarihi girişten önce olamaz.');
  let years = end.getUTCFullYear() - start.getUTCFullYear();
  if (anniversary(start, years * 12) > end) years--;
  const remainder = Math.round((end - anniversary(start, years * 12)) / 86400000);
  return {
    start,
    end,
    years,
    remainder,
    days: Math.round((end - start) / 86400000),
    factor: years + remainder / 365,
  };
}
export function noticeWeeks(start, end) {
  const p = servicePeriod(start, end);
  return p.end < anniversary(p.start, 6)
    ? 2
    : p.end < anniversary(p.start, 18)
      ? 4
      : p.end <= anniversary(p.start, 36)
        ? 6
        : 8;
}
const row = (label, value, unit = 'TRY') => ({
  label,
  value: unit === 'TRY' ? roundMoney(value) : value,
  unit,
});
export function calculate(id, v) {
  switch (id) {
    case 'fazla-mesai': {
      const salary = num(v.salary, 'Brüt ücret', { min: 1 }),
        hours = num(v.hours, '45 saat üzeri çalışma', { max: 744 }),
        extra = num(v.extra, 'Sözleşme süresi ile 45 saat arası', { max: 744 });
      const hourly = salary / 225;
      return {
        title: 'Toplam brüt ek ücret',
        value: roundMoney(hourly * (hours * 1.5 + extra * 1.25)),
        rows: [
          row('Normal saat ücreti', hourly),
          row('%50 zamlı fazla çalışma', hourly * hours * 1.5),
          row('%25 zamlı fazla sürelerle çalışma', hourly * extra * 1.25),
        ],
        note: 'Aylık brüt ücret / 225 saat varsayımı kullanılır. Saatleri haftalık sınırlarına göre ayrı girin. Vergi ve SGK kesintileri dahil değildir.',
      };
    }
    case 'gelir-vergisi': {
      const wage = v.type === 'wage',
        base = num(v.base, 'Dönem matrahı'),
        previous = num(v.previous, 'Önceki kümülatif matrah');
      const raw = taxIncrement(base, previous, wage);
      let exemption = 0;
      if (wage && v.exemption === 'yes') {
        const month = num(v.month, 'Bordro ayı', { min: 1, max: 12 });
        if (!Number.isInteger(month)) throw new Error('Ay tam sayı olmalıdır.');
        const minBase = rules2026.minimumWage * 0.85;
        exemption = Math.min(raw, taxIncrement(minBase, minBase * (month - 1), true));
      }
      return {
        title: 'Hesaplanan gelir vergisi',
        value: roundMoney(raw - exemption),
        rows: [
          row('İstisna öncesi vergi', raw),
          row('Asgari ücret gelir vergisi istisnası', exemption),
          row('Dönem sonu matrah', base + previous),
        ],
        note: 'Matrah brüt maaş değildir; uygulanabilir indirimlerden sonraki tutardır. İstisna, seçilen ay için kesintisiz asgari ücret matrahı varsayımıyla hesaplanır. Çoklu işveren/beyan ve diğer indirimler dahil değildir.',
      };
    }
    case 'isveren-maliyeti': {
      const salary = num(v.salary, 'Brüt ücret', { min: 33030 }),
        pension = v.type === 'pension';
      const discount = pension ? 0 : num(v.discount, 'İndirim puanı', { max: 5 });
      const base = Math.min(salary, rules2026.sgkCeiling),
        sgk = (base * ((pension ? 24.75 : 21.75) - discount)) / 100,
        unemployment = pension ? 0 : base * 0.02;
      return {
        title: 'Aylık işveren maliyeti',
        value: roundMoney(salary + sgk + unemployment),
        rows: [
          row('Brüt ücret', salary),
          row('Prime esas kazanç', base),
          row(pension ? 'SGDP işveren payı' : 'SGK işveren payı', sgk),
          row('İşsizlik sigortası işveren payı', unemployment),
        ],
        note: '30 günlük tam ay ve özel sektör 4/a varsayımı. Normal toplam işveren primi %23,75; SGDP %24,75. İndirim hakkını işveren belirler; otomatik teşvik uygulanmaz. Asgari ücret desteği ve yan haklar hariçtir.',
      };
    }
    case 'kidem-tazminati': {
      const p = servicePeriod(v.start, v.end);
      if (p.end.getUTCFullYear() !== 2026)
        throw new Error('Bu sürüm yalnız 2026 çıkışları için tavan içerir.');
      const ceiling = v.end < '2026-07-01' ? 64948.77 : 73729.87;
      const salary = num(v.salary, 'Giydirilmiş brüt ücret', { min: 1 });
      const gross = p.years >= 1 ? Math.min(salary, ceiling) * p.factor : 0;
      return {
        title: 'Yaklaşık net kıdem tutarı',
        value: roundMoney(gross * (1 - rules2026.stamp)),
        rows: [
          row('Hizmet süresi', `${p.years} yıl, ${p.remainder} gün`, 'text'),
          row('Dönem yıllık tavanı', ceiling),
          row('Brüt kıdem tutarı', gross),
          row('Damga vergisi', gross * rules2026.stamp),
        ],
        note: 'Hak kazanma koşulları ayrıca değerlendirilmelidir; bir yıldan az hizmette tutar sıfırdır. Tam yıl + kalan gün/365, dönem tavanı ve binde 7,59 damga vergisi kullanılır. Aralıklı hizmet/özel sözleşme kapsamı hariçtir.',
      };
    }
    case 'maas-zammi': {
      const old = num(v.salary, 'Mevcut maaş', { min: 1 });
      const next =
        v.type === 'rate'
          ? old * (1 + num(v.rate, 'Zam oranı', { max: 1000 }) / 100)
          : num(v.newSalary, 'Yeni maaş', { min: 0 });
      return {
        title: 'Yeni maaş',
        value: roundMoney(next),
        rows: [
          row('Mevcut maaş', old),
          row('Maaş farkı', next - old),
          row('Değişim oranı', roundMoney((next / old - 1) * 100), '%'),
        ],
        note: 'İki maaşı aynı bazda (net veya brüt) karşılaştırın. Bu araç netten brüte dönüşüm veya bordro kesintisi hesaplamaz.',
      };
    }
    case 'kurumlar-vergisi': {
      const base = num(v.base, 'Vergi matrahı'),
        rate = v.type === 'special' ? 30 : 25;
      return {
        title: 'Oran üzerinden hesaplanan vergi',
        value: roundMoney((base * rate) / 100),
        rows: [row('Vergi matrahı', base), row('Oran', rate, '%')],
        note: '2026 genel oran %25; Kanun madde 32 kapsamındaki belirli kurumlar %30. İstisnalar, indirimli oranlar, asgari kurumlar vergisi ve mahsuplar dahil değildir. Sonuç nihai beyanname tutarı değildir.',
      };
    }
    case 'yemek-ucreti': {
      const daily = num(v.daily, 'Günlük bedel', { max: 100000 }),
        days = num(v.days, 'Çalışılan gün', { max: 31 });
      if (!Number.isInteger(days)) throw new Error('Gün sayısı tam sayı olmalıdır.');
      const vat = v.type === 'cash' ? 0 : num(v.vat, 'KDV oranı', { max: 100 }),
        excluded = v.vatMode === 'included' ? daily / (1 + vat / 100) : daily;
      const budget = excluded * days * (1 + vat / 100),
        eligible = Math.min(excluded, 300) * days;
      return {
        title: 'Toplam yemek bütçesi',
        value: roundMoney(budget),
        rows: [
          row('KDV hariç tutar', excluded * days),
          row('KDV tutarı', budget - excluded * days),
          row('Gelir vergisi istisnasına esas tutar', eligible),
          row('İstisna üzeri tutar (KDV hariç)', Math.max(0, excluded - 300) * days),
        ],
        note: '2026 günlük gelir vergisi istisnası 300 TL ve fiili çalışma günü esas alınır. Nakit ödemede KDV yoktur. İşyeri yemeği ve özel durumlar kapsam dışıdır; SGK istisnası, net/brüt dönüşümü ve nihai vergi hesaplanmaz.',
      };
    }
    case 'ihbar-suresi': {
      if (servicePeriod(v.start, v.end).end.getUTCFullYear() !== 2026)
        throw new Error('Bu sürüm yalnız 2026 çıkışları için vergi tarifesi içerir.');
      const weeks = noticeWeeks(v.start, v.end),
        salary = num(v.salary, 'Giydirilmiş brüt ücret', { min: 1 }),
        previous = num(v.previous, 'Kümülatif matrah'),
        gross = (salary / 30) * weeks * 7,
        tax = taxIncrement(gross, previous, true),
        stamp = gross * rules2026.stamp;
      return {
        title: 'Yaklaşık net ihbar tutarı',
        value: roundMoney(gross - tax - stamp),
        rows: [
          row('Bildirim süresi', weeks, 'hafta'),
          row('Brüt ihbar tutarı', gross),
          row('Gelir vergisi (istisnasız)', tax),
          row('Damga vergisi', stamp),
        ],
        note: 'Belirsiz süreli sözleşme ve bildirim süresinin kullandırılmadığı varsayımı. Sözleşmedeki daha uzun süreler ve hak kazanma şartları ayrıca incelenir. Asgari ücret istisnası burada tekrar uygulanmaz. 2026 gelir vergisi tarifesi kullanılır.',
      };
    }
    default:
      throw new Error('Hesaplama aracı bulunamadı.');
  }
}
const f = (key, label, value, type = 'number', options) => ({ key, label, value, type, options });
export const calculators = [
  {
    id: 'fazla-mesai',
    name: 'Fazla mesai ücreti',
    icon: 'Clock3',
    description: 'Fazla çalışma ve fazla sürelerle çalışmayı ayrı hesaplayın.',
    sources: ['labor'],
    fields: [
      f('salary', 'Aylık brüt ücret (TL)', 45000),
      f('hours', '45 saat üzeri toplam süre (saat)', 10),
      f('extra', 'Sözleşme süresini aşan, 45 saate kadar süre (saat)', 0),
    ],
  },
  {
    id: 'gelir-vergisi',
    name: 'Gelir vergisi',
    icon: 'ReceiptText',
    description: '2026 dilimleri ve kümülatif matrah üzerinden vergi hesabı.',
    sources: ['tax', 'base'],
    fields: [
      f('type', 'Gelir türü', 'wage', 'select', [
        ['wage', 'Ücret geliri'],
        ['other', 'Ücret dışı gelir'],
      ]),
      f('base', 'Dönem vergi matrahı (TL)', 40000),
      f('previous', 'Önceki kümülatif matrah (TL)', 0),
      f('exemption', 'Asgari ücret istisnası', 'no', 'select', [
        ['no', 'Uygulama'],
        ['yes', 'Ücret geliri için uygula'],
      ]),
      f('month', 'Bordro ayı (1–12)', 1),
    ],
  },
  {
    id: 'isveren-maliyeti',
    name: 'İşveren maliyeti',
    icon: 'Building2',
    description: 'Brüt ücret ve prime esas kazanç sınırlarıyla bütçe planlayın.',
    sources: ['sgk', 'base'],
    fields: [
      f('type', 'Çalışan türü', 'normal', 'select', [
        ['normal', 'Normal 4/a çalışan'],
        ['pension', 'Emekli / SGDP'],
      ]),
      f('salary', 'Aylık brüt ücret (TL)', 45000),
      f('discount', 'Hak kazanılmış prim indirim puanı (0–5)', 0),
    ],
  },
  {
    id: 'kidem-tazminati',
    name: 'Kıdem tazminatı',
    icon: 'Wallet',
    description: '2026 çıkış dönemi tavanıyla hizmet süresini hesaplayın.',
    sources: ['ceiling', 'labor'],
    fields: [
      f('start', 'İşe giriş tarihi', '2021-10-08', 'date'),
      f('end', 'İşten çıkış tarihi', '2026-10-08', 'date'),
      f('salary', 'Aylık giydirilmiş brüt ücret (TL)', 80000),
    ],
  },
  {
    id: 'maas-zammi',
    name: 'Maaş zammı',
    icon: 'ChartNoAxesCombined',
    description: 'Ücret artışının tutarını ve yüzde karşılığını karşılaştırın.',
    sources: [],
    fields: [
      f('type', 'Hesaplama türü', 'rate', 'select', [
        ['rate', 'Orandan yeni maaş'],
        ['amount', 'İki maaştan değişim oranı'],
      ]),
      f('salary', 'Mevcut maaş (TL)', 40000),
      f('rate', 'Zam oranı (%)', 20),
      f('newSalary', 'Yeni maaş (TL)', 48000),
    ],
  },
  {
    id: 'kurumlar-vergisi',
    name: 'Kurumlar vergisi',
    icon: 'ReceiptText',
    description: '2026 genel veya özel oranla temel vergi senaryosu.',
    sources: ['corporate'],
    fields: [
      f('type', 'Kurum grubu', 'general', 'select', [
        ['general', 'Genel oran · %25'],
        ['special', 'Madde 32 özel kurumlar · %30'],
      ]),
      f('base', 'Vergi matrahı (TL)', 1000000),
    ],
  },
  {
    id: 'yemek-ucreti',
    name: 'Yemek ücreti',
    icon: 'Wallet',
    description: 'Çalışma günleri, KDV ve istisna tutarıyla yemek bütçesi.',
    sources: ['meal'],
    fields: [
      f('type', 'Ödeme türü', 'card', 'select', [
        ['card', 'Yemek kartı / yemek hizmeti'],
        ['cash', 'Nakit yemek bedeli'],
      ]),
      f('daily', 'Günlük bedel (TL)', 300),
      f('days', 'Fiilen çalışılan gün sayısı', 22),
      f('vat', 'Faturadaki KDV oranı (%)', 10),
      f('vatMode', 'Girilen bedelin KDV durumu', 'excluded', 'select', [
        ['excluded', 'KDV hariç'],
        ['included', 'KDV dahil'],
      ]),
    ],
  },
  {
    id: 'ihbar-suresi',
    name: 'İhbar süresi & tazminatı',
    icon: 'CalendarDays',
    description: 'Takvim eşikleriyle bildirim süresi ve yaklaşık tazminat.',
    sources: ['labor', 'tax'],
    fields: [
      f('start', 'İşe giriş tarihi', '2023-10-08', 'date'),
      f('end', 'İşten çıkış tarihi', '2026-10-08', 'date'),
      f('salary', 'Aylık giydirilmiş brüt ücret (TL)', 45000),
      f('previous', 'Önceki kümülatif vergi matrahı (TL)', 0),
    ],
  },
];
