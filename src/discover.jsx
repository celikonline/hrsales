import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calculator,
  Download,
  FileText,
  ChevronDown,
  X,
  Check,
  Search,
  Target,
  Clock3,
  Building2,
  ReceiptText,
  Wallet,
  CalendarDays,
  ChartNoAxesCombined,
  Sparkles,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { calculators, calculate, legalSources, rules2026 } from '../shared/calculators.js';
import {
  reports,
  blogArticles,
  sectors,
  moduleFeatures,
  maturityQuestions,
} from '../shared/content.js';
import './discover.css';
import { solutionGroups, solutions } from '../shared/solutions.js';
const iconMap = { Clock3, Building2, ReceiptText, Wallet, CalendarDays, ChartNoAxesCombined };
const Money = ({ value }) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
const Demo = ({ module, children = 'Ekibiniz için demo talep edin' }) => (
  <a className="button" href={`/demo-talebi${module ? `?modul=${module}` : ''}`}>
    {children}
    <ArrowUpRight size={18} />
  </a>
);
const PdfLink = ({ report }) => (
  <a className="button secondary" href={`/rehberler/senseik-${report.id}.pdf`} download>
    <Download size={17} />
    PDF indir
  </a>
);
export function ReportCover({ report, small = false }) {
  return (
    <div className={`report-cover ${report.color} ${small ? 'small' : ''}`}>
      <div className="report-cover-brand">
        <Sparkles size={16} /> senseik <span>REHBER</span>
      </div>
      <div className="cover-orbit" aria-hidden="true" />
      <div className="cover-copy">
        <span>{report.tag}</span>
        <h3>{report.title}</h3>
        <p>{report.subtitle}</p>
      </div>
      <div className="cover-bottom">
        <span>İnsana zaman ayırın.</span>
        <b>{report.edition}</b>
      </div>
    </div>
  );
}

export function MegaNavigation({ catalog }) {
  const [active, setActive] = useState(null);
  const holder = useRef(null);
  useEffect(() => {
    function outside(e) {
      if (!holder.current?.contains(e.target)) setActive(null);
    }
    function escape(e) {
      if (e.key === 'Escape') {
        setActive(null);
        holder.current?.querySelector(`[data-menu="${active}"]`)?.focus();
      }
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [active]);
  const toggle = (id, label) => (
    <button
      data-menu={id}
      className={active === id ? 'active' : ''}
      aria-expanded={active === id}
      aria-controls={`mega-${id}`}
      onClick={() => setActive(active === id ? null : id)}
    >
      {label}
      <ChevronDown size={13} />
    </button>
  );
  return (
    <div className="mega-navigation" ref={holder}>
      {toggle('products', 'Ürünler')}
      <a href="/neden-senseik">Neden SenseIK?</a>
      {toggle('sectors', 'Sektörler')}
      <a href="/fiyatlar">Paketler</a>
      <a href="/musteriler">Senaryolar</a>
      {toggle('corporate', 'Kurumsal')}
      {toggle('discover', 'Keşfet')}
      {active && (
        <div className={`mega-panel ${active}`} id={`mega-${active}`}>
          <button
            className="mega-close"
            onClick={() => setActive(null)}
            aria-label="Alt menüyü kapat"
          >
            <X size={19} />
          </button>
          {active === 'products' && (
            <>
              <div className="mega-intro">
                <span className="eyebrow">BİRLİKTE ÇALIŞAN MODÜLLER</span>
                <h3>İhtiyacınız kadar İK.</h3>
                <p>Özlükten gelişime; ekibinizin süreçlerini aynı çalışma alanında birleştirin.</p>
                <a href="/urunler" className="text-link">
                  Tüm modülleri görün <ArrowRight size={16} />
                </a>
              </div>
              {solutionGroups.map((group) => (
                <div className="mega-product-group" key={group.name}>
                  <h3>{group.name}</h3>
                  {group.items.map(([id, title]) => (
                    <a key={id} href={`/cozumler/${id}`}>
                      {title}
                      <ArrowUpRight size={13} />
                    </a>
                  ))}
                </div>
              ))}
            </>
          )}
          {active === 'sectors' && (
            <>
              <div className="mega-intro">
                <span className="eyebrow">SEKTÖRÜNÜZE UYGUN</span>
                <h3>
                  Farklı işler.
                  <br />
                  Ortak insan odağı.
                </h3>
                <p>İş biçiminize uygun modülleri ve demo senaryosunu birlikte seçin.</p>
                <a href="/sektorler" className="text-link">
                  Tüm sektörler <ArrowRight size={16} />
                </a>
              </div>
              <div className="mega-sector-links">
                {sectors.map((s) => (
                  <a href={`/sektorler/${s.id}`} key={s.id}>
                    {s.name}
                    <ArrowUpRight size={15} />
                  </a>
                ))}
              </div>
            </>
          )}
          {active === 'corporate' && (
            <>
              <div className="mega-intro">
                <span className="eyebrow">SENSEIK · ALGOSENSE</span>
                <h3>Birlikte daha iyi bir iş günü.</h3>
                <p>Ürünü, yaklaşımımızı ve başlangıç sürecini tanıyın.</p>
              </div>
              <div className="mega-sector-links">
                {[
                  ['/hakkimizda', 'Hakkımızda'],
                  ['/iletisim', 'İletişim'],
                  ['/sss', 'Sıkça sorulanlar'],
                  ['/guvenlik', 'Güvenlik yaklaşımı'],
                  ['/musteriler', 'Kullanım senaryoları'],
                  ['/destek', 'Destek'],
                  ['/entegrasyonlar', 'Entegrasyonlar'],
                  ['/donanim', 'PDKS donanımı'],
                  ['/calisan-deneyimi', 'Çalışan deneyimi'],
                ].map(([url, text]) => (
                  <a key={url} href={url}>
                    {text}
                    <ArrowUpRight size={15} />
                  </a>
                ))}
              </div>
            </>
          )}
          {active === 'discover' && (
            <>
              <div className="mega-content">
                <BookOpen className="mega-heading-icon" />
                <h3>İçerikler</h3>
                <a href="/blog">
                  <span className="discovery-symbol">
                    <BookOpen />
                  </span>
                  <div>
                    <b>İK yazıları</b>
                    <p>Gündelik İK süreçleri için uygulanabilir fikirler.</p>
                  </div>
                </a>
                <a href="/ik-olgunluk-testi">
                  <span className="discovery-symbol teal">
                    <Target />
                  </span>
                  <div>
                    <b>Dijital İK olgunluk testi</b>
                    <p>Ekibinizin önceliklerini belirleyin, yol haritanızı oluşturun.</p>
                  </div>
                </a>
                <a href="/kesfet" className="text-link">
                  Keşfet merkezine git <ArrowRight size={16} />
                </a>
              </div>
              <div className="mega-calculators">
                <Calculator className="mega-heading-icon" />
                <h3>Hesaplamalar</h3>
                {calculators.map((c) => {
                  const C = iconMap[c.icon];
                  return (
                    <a key={c.id} href={`/hesaplama-araclari/${c.id}`}>
                      <C size={17} />
                      {c.name}
                    </a>
                  );
                })}
              </div>
              <div className="mega-reports">
                <FileText className="mega-heading-icon" />
                <h3>Rehberler & raporlar</h3>
                <div className="mega-report-strip">
                  {reports.map((r) => (
                    <a href={`/raporlar/${r.id}`} key={r.id}>
                      <ReportCover report={r} small />
                      <small>{r.tag}</small>
                      <b>{r.title}</b>
                    </a>
                  ))}
                </div>
                <a className="text-link" href="/raporlar">
                  Tüm PDF rehberler <ArrowRight size={16} />
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
function PageHero({ eyebrow, title, text, children }) {
  return (
    <section className="resource-hero">
      <div className="container">
        <a className="breadcrumb" href="/">
          SenseIK / Ana sayfa
        </a>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
        {children}
      </div>
    </section>
  );
}
function ReportCard({ report }) {
  return (
    <article className="report-card">
      <a href={`/raporlar/${report.id}`}>
        <ReportCover report={report} />
      </a>
      <div className="report-card-body">
        <span className="eyebrow">{report.tag}</span>
        <h3>
          <a href={`/raporlar/${report.id}`}>{report.title}</a>
        </h3>
        <p>{report.summary}</p>
        <div className="resource-card-actions">
          <a className="text-link" href={`/raporlar/${report.id}`}>
            Rehberi incele <ArrowRight size={17} />
          </a>
          <a
            href={`/rehberler/senseik-${report.id}.pdf`}
            download
            aria-label={`${report.title} PDF indir`}
            className="round-icon"
          >
            <Download size={20} />
          </a>
        </div>
      </div>
    </article>
  );
}
function CalculatorCards() {
  return (
    <div className="tool-grid">
      {calculators.map((c) => {
        const C = iconMap[c.icon];
        return (
          <a className="tool-card" href={`/hesaplama-araclari/${c.id}`} key={c.id}>
            <span className="module-icon lilac">
              <C size={25} />
            </span>
            <h3>{c.name}</h3>
            <p>{c.description}</p>
            <span className="text-link">
              Hesaplamaya başla <ArrowRight size={17} />
            </span>
          </a>
        );
      })}
    </div>
  );
}
export function DiscoverTeaser() {
  return (
    <section className="section container discover-teaser">
      <div>
        <span className="eyebrow">KEŞFET · ÖĞREN · UYGULA</span>
        <h2>
          Bir sonraki iyi kararınız
          <br />
          <span>burada başlıyor.</span>
        </h2>
        <p>
          Pratik İK rehberleri, sekiz hesaplama aracı ve ekibinize özel dijitalleşme yol haritası.
        </p>
        <a className="button secondary" href="/kesfet">
          Keşfet merkezini aç <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="teaser-tiles">
        <a href="/hesaplama-araclari">
          <Calculator />
          <b>Hesaplama araçları</b>
          <span>Ücret, vergi ve işveren maliyeti</span>
          <ArrowUpRight size={19} />
        </a>
        <a href="/raporlar">
          <FileText />
          <b>PDF rehberler</b>
          <span>Ekibiniz için uygulanabilir planlar</span>
          <ArrowUpRight size={19} />
        </a>
        <a href="/ik-olgunluk-testi">
          <Target />
          <b>İK olgunluk testi</b>
          <span>Önceliklerinizi 3 dakikada keşfedin</span>
          <ArrowUpRight size={19} />
        </a>
      </div>
    </section>
  );
}
export function PlatformSections() {
  const [selected, setSelected] = useState(0);
  const scenarios = [
    [
      'Dağınık bilgilerden ortak kayda',
      'Özlük ve organizasyon',
      'Çalışan bilgilerini aynı kaynaktan yönetin. Rol bazlı erişimle ekip ve yöneticilerin doğru bilgiye ulaşmasını sağlayın.',
      'employee',
    ],
    [
      'Bekleyen taleplerden görünür kararlara',
      'İzin ve masraf',
      'Talebi, onay sorumlusunu ve kararı aynı akışta takip edin. Çalışanın işlemin durumunu yeniden sormasına gerek kalmasın.',
      'leave',
    ],
    [
      'Yeni başlangıçlardan düzenli gelişime',
      'İşe giriş ve eğitim',
      'İşe giriş görevlerini ve gelişim adımlarını sorumlu ve tarihlerle görünür hale getirin.',
      'onboarding',
    ],
  ];
  const s = scenarios[selected];
  return (
    <>
      <section className="resource-soft">
        <div className="section container">
          <div className="resource-section-heading">
            <div>
              <span className="eyebrow">EKİBİNİZİN GÜNLÜK İŞİNDEN</span>
              <h2>Sizin başlangıç noktanız hangisi?</h2>
            </div>
            <a href="/musteriler" className="text-link">
              Kullanım senaryoları <ArrowRight size={17} />
            </a>
          </div>
          <div className="scenario-switcher" role="group" aria-label="Kullanım senaryosu seçin">
            {scenarios.map((a, i) => (
              <button
                aria-pressed={selected === i}
                className={selected === i ? 'active' : ''}
                key={a[1]}
                onClick={() => setSelected(i)}
              >
                {a[1]}
              </button>
            ))}
          </div>
          <article className="scenario-highlight">
            <div>
              <span className="eyebrow">ÖRNEK KULLANIM SENARYOSU</span>
              <h3>{s[0]}</h3>
              <p>{s[2]}</p>
              <a className="text-link" href={`/urunler/${s[3]}`}>
                Modülü incele <ArrowRight size={17} />
              </a>
            </div>
            <div className="scenario-flow">
              <span>Ortak bilgi</span>
              <ArrowRight />
              <span>Net sorumluluk</span>
              <ArrowRight />
              <span>Görünür sonuç</span>
            </div>
          </article>
        </div>
      </section>
      <section className="section container platform-grid">
        <div>
          <span className="eyebrow">BİRLİKTE ÇALIŞAN BİR DÜZEN</span>
          <h2>
            Süreçleriniz arasında
            <br />
            <span>bağlantı kurun.</span>
          </h2>
          <p>
            Çalışan kaydı, zaman bilgisi ve onay süreçlerinin birbirini tamamladığı bir İK düzeni
            planlayın. Mevcut bordro ve donanım ihtiyaçlarını demo görüşmesinde değerlendirelim.
          </p>
          <a className="button secondary" href="/entegrasyonlar">
            Entegrasyon kapsamını konuşalım <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="platform-tiles">
          {[
            ['/urunler/employee', 'Özlük & organizasyon', 'Ortak çalışan bilgisi'],
            ['/urunler/attendance', 'Zaman & puantaj', 'Plan ve gerçekleşen kayıtlar'],
            ['/donanim', 'PDKS donanımı', 'Uyumluluk ve bağlantı keşfi'],
            ['/urunler/payroll', 'Bordro operasyonu', 'Dönem ve ödeme bilgileri'],
            ['/calisan-deneyimi', 'Çalışan deneyimi', 'İletişim ve gelişim'],
            ['/guvenlik', 'Erişim & güvenlik', 'Rol, lisans ve süre kontrolü'],
          ].map(([url, t, p]) => (
            <a href={url} key={url}>
              <Check size={20} />
              <b>{t}</b>
              <span>{p}</span>
            </a>
          ))}
        </div>
      </section>
      <section className="resource-soft">
        <div className="section container five-questions">
          <div>
            <span className="eyebrow">BEŞ SORUYLA BAŞLAYIN</span>
            <h2>
              İK operasyonunuzun
              <br />
              nabzını tutun.
            </h2>
            <a className="text-link" href="/ik-olgunluk-testi">
              Kendi önceliklerinizi görün <ArrowRight size={17} />
            </a>
          </div>
          <ol>
            {[
              'Çalışan bilgisi hangi kaynaktan güncelleniyor?',
              'Bir izin veya masraf talebi kimde bekliyor?',
              'Planlanan vardiya ile gerçekleşen kayıt örtüşüyor mu?',
              'Yeni çalışanın ilk gün görevleri hazır mı?',
              'Hangi İK göstergesi bir sonraki kararınızı değiştirecek?',
            ].map((q, i) => (
              <li key={q}>
                <span>0{i + 1}</span>
                {q}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
function DiscoverHome() {
  return (
    <>
      <PageHero
        eyebrow="SENSEIK BİLGİ MERKEZİ"
        title={
          <>
            Daha çok bilgi.
            <br />
            <em>Daha iyi bir iş günü.</em>
          </>
        }
        text="Ekibinizi büyütürken ihtiyacınız olan fikirler, rehberler ve hesaplamalar bir arada."
      />
      <div className="container resource-tabs">
        <a href="#rehberler">PDF rehberler</a>
        <a href="#araclar">Hesaplamalar</a>
        <a href="#yazilar">İK yazıları</a>
        <a href="/ik-olgunluk-testi">
          Olgunluk testi <ArrowUpRight size={17} />
        </a>
      </div>
      <section className="section container" id="rehberler">
        <div className="resource-section-heading">
          <div>
            <span className="eyebrow">OKUYUN, EKİBİNİZLE UYGULAYIN</span>
            <h2>İK için pratik rehberler.</h2>
          </div>
          <a href="/raporlar" className="text-link">
            Tüm rehberler <ArrowRight size={18} />
          </a>
        </div>
        <div className="report-grid">
          {reports.slice(0, 3).map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      </section>
      <section className="resource-soft" id="araclar">
        <div className="section container">
          <span className="eyebrow">SAYILARI NETLEŞTİRİN</span>
          <h2>Hesaplama araçları.</h2>
          <p>2026 parametreleri, açık formüller ve kaynak bağlantılarıyla senaryonuzu inceleyin.</p>
          <CalculatorCards />
        </div>
      </section>
      <section className="section container" id="yazilar">
        <span className="eyebrow">GÜNDELİK İK İÇİN</span>
        <h2>İyi fikirler, somut adımlar.</h2>
        <BlogCards articles={blogArticles.slice(0, 3)} />
      </section>
      <MaturityBanner />
    </>
  );
}
function MaturityBanner() {
  return (
    <section className="container maturity-banner">
      <div>
        <span className="eyebrow">DİJİTAL İK OLGUNLUK TESTİ</span>
        <h2>Nereden başlamalısınız?</h2>
        <p>Sekiz soruyla ekibinizin önceliklerini görün. Sonucunuz ve önerileriniz anında hazır.</p>
        <a className="button" href="/ik-olgunluk-testi">
          Testi başlat <ArrowRight size={18} />
        </a>
      </div>
      <div className="maturity-visual" aria-hidden="true">
        <Target size={65} />
        <span>Öncelik → Plan → Uygulama</span>
      </div>
    </section>
  );
}
function BlogCards({ articles }) {
  return (
    <div className="blog-grid">
      {articles.map((b, i) => (
        <article className="blog-card" key={b.id}>
          <a className={`blog-art tone-${i % 3}`} href={`/blog/${b.id}`}>
            <span>{b.tag}</span>
            <BookOpen size={58} />
            <b>SENSEIK NOTLARI</b>
          </a>
          <div>
            <span className="eyebrow">{b.tag}</span>
            <h3>
              <a href={`/blog/${b.id}`}>{b.title}</a>
            </h3>
            <p>{b.description}</p>
            <a className="text-link" href={`/blog/${b.id}`}>
              Yazıyı oku <ArrowRight size={17} />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
function BlogIndex() {
  const [query, setQuery] = useState('');
  const filtered = blogArticles.filter((b) =>
    `${b.title} ${b.tag}`.toLocaleLowerCase('tr-TR').includes(query.toLocaleLowerCase('tr-TR')),
  );
  return (
    <>
      <PageHero
        eyebrow="SENSEIK NOTLARI"
        title="İK'ya dair, işe yarayan fikirler."
        text="İzin, masraf, çalışma zamanı ve dijital dönüşüm üzerine pratik yazılar."
      />
      <section className="section container">
        <label className="resource-search">
          <Search size={19} />
          <input
            aria-label="Yazılarda ara"
            placeholder="Bir konu arayın…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <BlogCards articles={filtered} />
        {!filtered.length && <p role="status">Bu aramada yazı bulunamadı.</p>}
      </section>
    </>
  );
}
function BlogDetail({ article }) {
  return (
    <>
      <PageHero eyebrow={article.tag} title={article.title} text={article.description} />
      <article className="container reading-layout">
        <div className="reading-content">
          <div className="reading-meta">SenseIK içerik ekibi · 8 Ekim 2026 · 3 dk okuma</div>
          {article.sections.map(([title, text]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>
        <aside className="reading-aside">
          <BookOpen size={28} />
          <h3>Fikirden uygulamaya.</h3>
          <p>Ekibinizin ihtiyacına uygun modülleri gerçek SenseHR çalışma alanında keşfedin.</p>
          <Demo module={article.module} children="Demo talep et" />
        </aside>
      </article>
      <section className="section container">
        <h2>Okumaya devam edin.</h2>
        <BlogCards articles={blogArticles.filter((b) => b.id !== article.id).slice(0, 3)} />
      </section>
    </>
  );
}
function ReportDetail({ report }) {
  return (
    <>
      <section className="container report-detail-hero">
        <div>
          <a className="breadcrumb" href="/raporlar">
            Keşfet / PDF rehberler
          </a>
          <span className="eyebrow">{report.tag} · SENSEIK REHBERİ</span>
          <h1>{report.title}</h1>
          <p>{report.summary}</p>
          <PdfLink report={report} />
          <span className="download-detail">6 sayfa · PDF · Türkçe · Ücretsiz</span>
        </div>
        <ReportCover report={report} />
      </section>
      <div className="container reading-layout">
        <article className="reading-content">
          <div className="reading-meta">SenseIK içerik ekibi · 2026 uygulama rehberi</div>
          {report.chapters.map((c) => (
            <section key={c.title}>
              <h2>{c.title}</h2>
              <p>{c.intro}</p>
              <ul className="practical-list">
                {c.points.map((p) => (
                  <li key={p}>
                    <Check size={18} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="exercise">{c.exercise}</div>
            </section>
          ))}
          <section>
            <h2>Ekibiniz için çalışma sayfası</h2>
            <p>
              Bu başlıkları bir ekip toplantısında tamamlayın; her karar için sorumlu ve tarih
              belirleyin.
            </p>
            <ol className="worksheet-list">
              {report.worksheet.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ol>
          </section>
          {report.sources.length > 0 && (
            <section className="source-links">
              <h3>İlgili kaynaklar</h3>
              {report.sources.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                  {s.name}
                  <ArrowUpRight size={15} />
                </a>
              ))}
            </section>
          )}
        </article>
        <aside className="reading-aside">
          <FileText size={28} />
          <h3>Rehber yanınızda olsun.</h3>
          <p>Uygulama adımlarını ve çalışma sayfasını PDF olarak indirin.</p>
          <PdfLink report={report} />
          <hr />
          <p>Bu süreci SenseHR'de denemek ister misiniz?</p>
          <Demo module={report.module} children="Demo talep et" />
        </aside>
      </div>
    </>
  );
}
function CalculatorDetail({ tool }) {
  const initial = Object.fromEntries(tool.fields.map((f) => [f.key, f.value]));
  const [values, setValues] = useState(initial),
    [result, setResult] = useState(null),
    [error, setError] = useState('');
  useEffect(() => {
    document.title = `${tool.name} hesaplama · SenseIK`;
  }, [tool.name]);
  const update = (key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
    setResult(null);
    setError('');
  };
  const visible = tool.fields.filter(
    (f) =>
      !(
        tool.id === 'maas-zammi' &&
        ((f.key === 'rate' && values.type !== 'rate') ||
          (f.key === 'newSalary' && values.type !== 'amount'))
      ) &&
      !(
        tool.id === 'gelir-vergisi' &&
        (f.key === 'month' || f.key === 'exemption') &&
        (values.type !== 'wage' || (f.key === 'month' && values.exemption !== 'yes'))
      ) &&
      !(tool.id === 'isveren-maliyeti' && f.key === 'discount' && values.type === 'pension') &&
      !(tool.id === 'yemek-ucreti' && ['vat', 'vatMode'].includes(f.key) && values.type === 'cash'),
  );
  return (
    <>
      <PageHero
        eyebrow="SENSEIK HESAPLAMA ARAÇLARI · 2026"
        title={`${tool.name} hesaplama`}
        text={tool.description}
      />
      <section className="container calculator-layout">
        <form
          className="calculator-form"
          onSubmit={(e) => {
            e.preventDefault();
            try {
              setResult(calculate(tool.id, values));
              setError('');
            } catch (err) {
              setError(err.message);
              setResult(null);
            }
          }}
        >
          <div className="calc-form-title">
            <Calculator size={22} />
            <h2>Bilgilerinizi girin</h2>
          </div>
          {visible.map((f) => (
            <label className="field" key={f.key}>
              <span>{f.label}</span>
              {f.type === 'select' ? (
                <select value={values[f.key]} onChange={(e) => update(f.key, e.target.value)}>
                  {f.options.map(([k, t]) => (
                    <option key={k} value={k}>
                      {t}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type}
                  required
                  min={f.type === 'number' ? 0 : undefined}
                  step={f.type === 'number' ? 'any' : undefined}
                  value={values[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                />
              )}
            </label>
          ))}
          {error && (
            <div role="alert" className="notice error">
              {error}
            </div>
          )}
          <button className="button" type="submit">
            Hesapla <ArrowRight size={18} />
          </button>
          <p className="calc-private">
            <ShieldCheck size={16} /> Girilen bilgiler tarayıcınızda hesaplanır; sunucuya
            gönderilmez.
          </p>
        </form>
        <div className="calculator-output" aria-live="polite">
          {result ? (
            <>
              <span className="eyebrow">HESAPLAMA SONUCUNUZ</span>
              <h2>{result.title}</h2>
              <strong className="calc-total">
                <Money value={result.value} />
              </strong>
              <dl>
                {result.rows.map((r) => (
                  <div key={r.label}>
                    <dt>{r.label}</dt>
                    <dd>
                      {r.unit === 'TRY' ? (
                        <Money value={r.value} />
                      ) : (
                        `${r.value}${r.unit === 'text' ? '' : ` ${r.unit}`}`
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="calc-assumptions">{result.note}</p>
            </>
          ) : (
            <div className="calc-empty">
              <ChartNoAxesCombined size={48} />
              <h2>Senaryonuzu netleştirin.</h2>
              <p>
                Bilgilerinizi girip “Hesapla” düğmesine basın. Sonuç, ara kalemler ve kullanılan
                varsayımlar burada görünür.
              </p>
            </div>
          )}
          <div className="calc-method">
            <span>
              Parametre sürümü: {rules2026.version} · Kontrol: {rules2026.verified}
            </span>
            <p>
              Bilgilendirme ve bütçe senaryosu içindir. Bordro, vergi beyannamesi veya hak kazanma
              kararı yerine geçmez.
            </p>
            {tool.sources.map((k) => (
              <a key={k} href={legalSources[k].url} target="_blank" rel="noreferrer">
                {legalSources[k].name}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="section container">
        <h2>Diğer hesaplamaları keşfedin.</h2>
        <div className="related-tools">
          {calculators
            .filter((c) => c.id !== tool.id)
            .map((c) => (
              <a key={c.id} href={`/hesaplama-araclari/${c.id}`}>
                {c.name}
                <ArrowRight size={16} />
              </a>
            ))}
        </div>
      </section>
    </>
  );
}
function MaturityTest() {
  const [answers, setAnswers] = useState({}),
    [done, setDone] = useState(false);
  const complete = Object.keys(answers).length === maturityQuestions.length;
  const score = Math.round(
    (Object.values(answers).reduce((s, n) => s + n, 0) / (maturityQuestions.length * 3)) * 100,
  );
  const priorities = maturityQuestions
    .map(([name, text], i) => ({ name, text, i, score: answers[i] }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);
  return (
    <>
      <PageHero
        eyebrow="3 DAKİKA · 8 SORU"
        title="Dijital İK olgunluk testi"
        text="Bugünkü çalışma biçiminizi değerlendirin; gelişim önceliklerinizi ve ilk adımlarınızı görün."
      />
      <section className="container maturity-test">
        {done ? (
          <div className="maturity-result" aria-live="polite">
            <span className="eyebrow">EKİBİNİZİN ÖZ DEĞERLENDİRMESİ</span>
            <strong>
              {score}
              <small>/100</small>
            </strong>
            <h2>
              {score < 35
                ? 'Temelleri birlikte kuralım.'
                : score < 70
                  ? 'Süreçleri birbirine bağlayın.'
                  : 'Ölçün, geliştirin, sürdürülebilir kılın.'}
            </h2>
            <p>
              Bu skor sekiz cevabınızın eşit ağırlıklı ortalamasıdır; bilimsel bir değerlendirme
              veya sektör karşılaştırması değildir.
            </p>
            <div className="priority-grid">
              {priorities.map((p) => (
                <div key={p.i}>
                  <span>ÖNCELİK {priorities.indexOf(p) + 1}</span>
                  <h3>{p.name}</h3>
                  <p>
                    {p.score === 3
                      ? 'Tanımı ve sorumluyu koruyun, düzenli olarak iyileştirin.'
                      : 'Mevcut adımları yazın, ortak kayıt kaynağını belirleyin ve küçük bir ekiple pilot yapın.'}
                  </p>
                </div>
              ))}
            </div>
            <div className="resource-card-actions">
              <Demo />
              <a
                className="button secondary"
                href="/rehberler/senseik-dijital-ik-yol-haritasi.pdf"
                download
              >
                90 günlük yol haritası PDF <Download size={18} />
              </a>
              <button
                className="text-link"
                onClick={() => {
                  setDone(false);
                  setAnswers({});
                }}
              >
                Yeniden değerlendir
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (complete) setDone(true);
            }}
          >
            <div className="test-progress">
              <span>{Object.keys(answers).length} / 8 soru yanıtlandı</span>
              <div>
                <span style={{ width: `${(Object.keys(answers).length / 8) * 100}%` }} />
              </div>
            </div>
            {maturityQuestions.map(([name, text], i) => (
              <fieldset key={name}>
                <legend>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {name}
                </legend>
                <p>{text}</p>
                <div className="maturity-options">
                  {[
                    'Henüz yok',
                    'Kısmen / dağınık',
                    'Tanımlı ve düzenli',
                    'Ölçülüyor ve geliştiriliyor',
                  ].map((t, v) => (
                    <label key={v} className={answers[i] === v ? 'selected' : ''}>
                      <input
                        required
                        type="radio"
                        name={`question-${i}`}
                        checked={answers[i] === v}
                        onChange={() => setAnswers((a) => ({ ...a, [i]: v }))}
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <button className="button" disabled={!complete}>
              Sonucumu ve önceliklerimi gör <ArrowRight size={18} />
            </button>
            <p className="calc-private">
              Yanıtlarınız bu sayfada kalır; e-posta vermeniz gerekmez.
            </p>
          </form>
        )}
      </section>
    </>
  );
}

export function ResourcePage({ path }) {
  useEffect(() => {
    const id = path.split('/')[2];
    const item = [...reports, ...blogArticles, ...calculators].find((r) => r.id === id);
    const titles = {
      '/kesfet': 'Keşfet',
      '/blog': 'İK yazıları',
      '/raporlar': 'İK rehberleri',
      '/hesaplama-araclari': 'İK hesaplama araçları',
      '/ik-olgunluk-testi': 'Dijital İK olgunluk testi',
    };
    document.title = `${item?.title || item?.name || titles[path] || 'Keşfet'} · SenseIK`;
  }, [path]);
  if (path === '/kesfet') return <DiscoverHome />;
  if (path === '/blog') return <BlogIndex />;
  if (path.startsWith('/blog/')) {
    const b = blogArticles.find((b) => b.id === path.split('/')[2]);
    return b ? <BlogDetail article={b} /> : <Missing />;
  }
  if (path === '/raporlar')
    return (
      <>
        <PageHero
          eyebrow="SENSEIK REHBER KÜTÜPHANESİ"
          title="Bilgiyi işinize taşıyın."
          text="Beş özgün uygulama rehberi. Okuyun, PDF olarak indirin, ekibinizle birlikte kullanın."
        />
        <section className="section container">
          <div className="report-grid">
            {reports.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </div>
        </section>
      </>
    );
  if (path.startsWith('/raporlar/')) {
    const r = reports.find((r) => r.id === path.split('/')[2]);
    return r ? <ReportDetail report={r} /> : <Missing />;
  }
  if (path === '/hesaplama-araclari')
    return (
      <>
        <PageHero
          eyebrow="SENSEIK · 2026 PARAMETRELERİ"
          title="İK hesaplamaları, daha açık."
          text="Ücret, tazminat ve bütçe senaryolarınızı açık varsayımlar ve kaynaklarla hesaplayın."
        />
        <section className="section container">
          <CalculatorCards />
        </section>
      </>
    );
  if (path.startsWith('/hesaplama-araclari/')) {
    const c = calculators.find((c) => c.id === path.split('/')[2]);
    return c ? <CalculatorDetail key={c.id} tool={c} /> : <Missing />;
  }
  if (path === '/ik-olgunluk-testi') return <MaturityTest />;
  return <Missing />;
}
function Missing() {
  return (
    <section className="section container">
      <h1>Bu sayfa bulunamadı.</h1>
      <a href="/kesfet" className="button">
        Keşfet merkezine dön
      </a>
    </section>
  );
}

export function MarketingPage({ path, catalog, ProductPreview, Plans }) {
  useEffect(() => {
    const key = path.split('/')[2];
    const item = [...catalog.modules, ...sectors, ...solutions].find(
      (i) => i.key === key || i.id === key,
    );
    const titles = {
      '/urunler': 'İK modülleri',
      '/sektorler': 'Sektör çözümleri',
      '/fiyatlar': 'Paketler ve lisans',
      '/neden-senseik': 'Neden SenseIK?',
      '/musteriler': 'Kullanım senaryoları',
      '/hakkimizda': 'Hakkımızda',
      '/iletisim': 'İletişim',
      '/sss': 'Sıkça sorulanlar',
      '/guvenlik': 'Güvenlik',
      '/destek': 'Destek',
      '/entegrasyonlar': 'Entegrasyonlar',
      '/donanim': 'PDKS donanımı',
      '/calisan-deneyimi': 'Çalışan deneyimi',
    };
    document.title = `${item?.title || item?.name || titles[path] || 'İhtiyacınız kadar İK'} · SenseIK`;
  }, [path, catalog]);
  const key = path.split('/')[2];
  const module = catalog.modules.find((m) => m.key === key);
  const sector = sectors.find((s) => s.id === key);
  const solution = solutions.find((s) => s.id === key);
  if (path.startsWith('/cozumler/'))
    return solution ? (
      <>
        <PageHero
          eyebrow={`SENSEHR · ${solution.group.toLocaleUpperCase('tr-TR')}`}
          title={solution.title}
          text={solution.description}
        >
          <Demo module={solution.module} />
        </PageHero>
        <section className="section container">
          <div className="module-detail-grid">
            <div>
              <span className="eyebrow">EKİBİNİZE UYGUN BİR BAŞLANGIÇ</span>
              <h2>
                İhtiyacı netleştirin.
                <br />
                Akışı birlikte deneyin.
              </h2>
              <p>
                Mevcut işleyişinizi örnek bir senaryoya dönüştürelim. Roller, veri ihtiyaçları ve
                özel bağlantılar üzerinden teklifinize girecek kapsamı belirleyelim.
              </p>
              <a href={`/urunler/${solution.module}`} className="text-link">
                İlgili SenseHR modülünü incele <ArrowRight size={17} />
              </a>
            </div>
            <div className="module-feature-list">
              {solution.checks.map((check) => (
                <div key={check}>
                  <Check size={22} />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="scope-note">
            Bu sayfa ihtiyaç keşfi ve önerilen kullanım akışını anlatır. Alt özelliklerin
            kullanılabilirliği, cihaz uyumluluğu ve özel entegrasyonlar demo ortamında doğrulanarak
            teklif kapsamında belirtilir.
          </p>
        </section>
        <MaturityBanner />
      </>
    ) : (
      <Missing />
    );
  if (path === '/urunler')
    return (
      <>
        <PageHero
          eyebrow="SENSEHR ÜRÜN AİLESİ"
          title="Bütün İK süreçleriniz, aynı yerde."
          text="Önce ihtiyacınızı belirleyin; sonra ekibinize uygun modüllerle başlayın."
        />
        <section className="section container">
          <div className="module-grid">
            {catalog.modules.map((m) => (
              <a className="module-card" href={`/urunler/${m.key}`} key={m.key}>
                <span className="module-icon lilac">
                  <Users size={25} />
                </span>
                <h3>{m.name}</h3>
                <p>{m.description}</p>
                <span className="text-link">
                  Modülü keşfet <ArrowRight size={17} />
                </span>
              </a>
            ))}
          </div>
          <h2 className="spaced-title">İş biçiminize göre keşfedin.</h2>
          <div className="solution-groups">
            {solutionGroups.map((group) => (
              <div key={group.name}>
                <h3>{group.name}</h3>
                {group.items.map(([id, title]) => (
                  <a href={`/cozumler/${id}`} key={id}>
                    {title}
                    <ArrowUpRight size={16} />
                  </a>
                ))}
              </div>
            ))}
          </div>
        </section>
      </>
    );
  if (path.startsWith('/urunler/'))
    return module ? (
      <>
        <PageHero eyebrow="SENSEHR MODÜLLERİ" title={module.name} text={module.description}>
          <Demo module={module.key} />
        </PageHero>
        <section className="section container module-detail-grid">
          <div>
            <span className="eyebrow">GÜNLÜK İŞİNİZİ KOLAYLAŞTIRIN</span>
            <h2>
              Daha düzenli süreç.
              <br />
              Daha görünür bilgi.
            </h2>
            <ul className="practical-list">
              {moduleFeatures[module.key].map((f) => (
                <li key={f}>
                  <Check size={19} />
                  {f}
                </li>
              ))}
            </ul>
            <p>
              Demo başvurusunda bu modülü seçin. Ekibimiz çalışan kapasitenizi, onay rollerinizi ve
              senaryonuzu birlikte netleştirsin.
            </p>
            <a className="text-link" href="/fiyatlar">
              Paket seçenekleri <ArrowRight size={17} />
            </a>
          </div>
          <ProductPreview selected={module.key} large />
        </section>
        <section className="resource-soft">
          <div className="section container">
            <span className="eyebrow">BAĞLANTILI BİR İK DENEYİMİ</span>
            <h2>Birlikte kullanın.</h2>
            <div className="related-tools">
              {catalog.modules
                .filter((m) => m.key !== module.key)
                .slice(0, 5)
                .map((m) => (
                  <a key={m.key} href={`/urunler/${m.key}`}>
                    {m.name}
                    <ArrowRight size={16} />
                  </a>
                ))}
            </div>
          </div>
        </section>
      </>
    ) : (
      <Missing />
    );
  if (path === '/sektorler')
    return (
      <>
        <PageHero
          eyebrow="SEKTÖR ÇÖZÜMLERİ"
          title="İşinize uygun bir İK başlangıcı."
          text="Sektörünüzün iş ritmini, çalışan yapısını ve önceliklerini birlikte ele alalım."
        />
        <section className="section container">
          <div className="sector-grid">
            {sectors.map((s) => (
              <a href={`/sektorler/${s.id}`} key={s.id}>
                <Building2 size={30} />
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <span className="text-link">
                  Çözümü incele <ArrowRight size={17} />
                </span>
              </a>
            ))}
          </div>
        </section>
      </>
    );
  if (path.startsWith('/sektorler/'))
    return sector ? (
      <>
        <PageHero
          eyebrow="SEKTÖRÜNÜZE UYGUN SENSEIK"
          title={`${sector.name} için insan odaklı İK.`}
          text={sector.description}
        >
          <Demo />
        </PageHero>
        <section className="section container">
          <h2>Önceliklerinizi birlikte çözelim.</h2>
          <div className="priority-grid">
            {sector.needs.map((n, i) => (
              <div key={n}>
                <span>0{i + 1}</span>
                <h3>{n}</h3>
                <p>
                  Şirketinizin mevcut akışını, karar rollerini ve raporlama ihtiyacını demo
                  senaryosuna dahil edelim.
                </p>
              </div>
            ))}
          </div>
          <h2 className="spaced-title">Başlamak için önerilen modüller.</h2>
          <div className="tool-grid">
            {sector.modules.map((k) => {
              const m = catalog.modules.find((m) => m.key === k);
              return (
                <a className="tool-card" key={k} href={`/urunler/${k}`}>
                  <h3>{m.name}</h3>
                  <p>{m.description}</p>
                  <span className="text-link">
                    Modülü incele <ArrowRight size={17} />
                  </span>
                </a>
              );
            })}
          </div>
          <p className="scope-note">
            Bu sayfa sektörünüz için önerilen kullanım kapsamını anlatır. Özel entegrasyon ve
            mevzuat ihtiyaçları teklif öncesi birlikte değerlendirilir.
          </p>
        </section>
      </>
    ) : (
      <Missing />
    );
  if (path === '/fiyatlar')
    return (
      <>
        <PageHero
          eyebrow="PAKET & LİSANS"
          title="Ekibinize uygun kapsamı seçin."
          text="Çalışan kapasitesi, modüller ve lisans dönemi üzerinden size uygun teklif hazırlayalım."
        />
        <section className="section container">
          <Plans catalog={catalog} />
          <div className="comparison">
            <h2>Paketleri karşılaştırın.</h2>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Modül</th>
                    {catalog.plans.map((p) => (
                      <th key={p.key}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {catalog.modules.map((m) => (
                    <tr key={m.key}>
                      <td>{m.name}</td>
                      {catalog.plans.map((p) => (
                        <td key={p.key}>
                          {p.modules.includes(m.key) ? (
                            <>
                              <Check size={18} />
                              <span className="sr-only">Dahil</span>
                            </>
                          ) : (
                            '—'
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </>
    );
  if (path === '/neden-senseik')
    return (
      <>
        <PageHero
          eyebrow="NEDEN SENSEIK?"
          title="İşlemler sadeleşsin. İnsanlar öne çıksın."
          text="Özlük, talepler ve ekip planını ortak bir çalışma alanında yönetin; ihtiyacınıza göre kapsamı büyütün."
        />
        <section className="section container">
          <div className="priority-grid">
            {[
              [
                'Ortak kayıt, daha net bilgi',
                'Çalışan ve organizasyon bilgilerini dağınık dosyalar yerine rol bazlı erişilen bir alanda toplayın.',
              ],
              [
                'Talep ve karar aynı süreçte',
                'İzin ve masraf gibi işlemlerde kimin neyi beklediğini görün, yöneticiler için onay adımlarını netleştirin.',
              ],
              [
                'Kontrollü bir başlangıç',
                'Seçilen modüller ve çalışan kapasitesiyle demoyu deneyin. Teklif ve ödeme teyidinden sonra lisansa geçin.',
              ],
            ].map(([t, p]) => (
              <div key={t}>
                <Check size={25} />
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
          <div className="module-detail-grid spaced-title">
            <div>
              <h2>
                Ekibiniz büyürken,
                <br />
                İK düzeniniz de büyüsün.
              </h2>
              <p>
                İlk adımda bütün modülleri açmak zorunda değilsiniz. En çok zaman alan süreci seçin;
                ekibinizle denedikten sonra yeni ihtiyaçlara doğru ilerleyin.
              </p>
              <Demo />
            </div>
            <ProductPreview large />
          </div>
        </section>
        <MaturityBanner />
      </>
    );
  if (path === '/musteriler')
    return (
      <>
        <PageHero
          eyebrow="KULLANIM SENARYOLARI"
          title="Ekibiniz için bir senaryo seçin."
          text="Bunlar örnek kullanım planlarıdır. Yayınlanmış müşteri referansı veya gerçek başarı hikâyesi değildir."
        />
        <section className="section container">
          <div className="priority-grid">
            {[
              [
                '50 kişilik büyüyen ekip',
                'Özlük, izin ve duyurularla ortak kayıt düzeni.',
                'starter',
              ],
              [
                'Birden fazla lokasyon',
                'Vardiya, masraf, zimmet ve işe giriş süreçlerini birlikte değerlendirme.',
                'growth',
              ],
              [
                'Kapsamlı İK organizasyonu',
                'Performans, eğitim, işe alım ve bordro operasyonuna yayılan modül kapsamı.',
                'enterprise',
              ],
            ].map(([t, p, key]) => (
              <div key={key}>
                <Users size={28} />
                <h3>{t}</h3>
                <p>{p}</p>
                <a href={`/demo-talebi?paket=${key}`} className="text-link">
                  Bu kapsamla demo iste <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  const corporate = {
    '/hakkimizda': [
      'SENSEIK · ALGOSENSE',
      'İnsan odağını koruyan teknoloji.',
      'SenseIK, AlgoSense’in insan kaynakları ürününün satış ve keşif deneyimidir. SenseHR, ekiplerin günlük İK işlemlerini yürüttüğü ürün çalışma alanıdır.',
      [
        [
          'Yaklaşımımız',
          'İhtiyaç keşfi, küçük bir başlangıç ve ölçülebilir gelişim. Çalışan sayısı ve modül ihtiyacına göre demo kapsamını birlikte planlarız.',
        ],
        [
          'Ürün deneyimi',
          'Talep ve onay akışlarını, ekip bilgilerini ve lisans kapsamını aynı deneyimde görünür hale getiririz.',
        ],
        [
          'Birlikte başlangıç',
          'Başvurunuzu inceleyip seçtiğiniz modüller için demo erişimi hazırlarız. Teklif, geçiş ve destek kapsamını görüşmede netleştiririz.',
        ],
      ],
    ],
    '/entegrasyonlar': [
      'ENTEGRASYON KEŞFİ',
      'Mevcut düzeninizden başlayalım.',
      'Bordro, PDKS ve veri aktarım ihtiyaçlarını kurumunuzun mevcut sistemiyle birlikte değerlendirelim.',
      [
        [
          'Kaynak ve hedef',
          'Hangi sistemde hangi bilginin tutulduğunu belirleyin. Alan eşlemesi, veri sahipliği ve aktarım sıklığı entegrasyon tasarımının başlangıcıdır.',
        ],
        [
          'Kapsamı doğrulayın',
          'Marka logosu veya genel uyumluluk iddiası yerine sistem sürümü, API erişimi ve örnek veri üzerinden kapsam netleştirilir. Teklifte bağlantının sorumluluğu ve test koşulları belirtilir.',
        ],
        [
          'Kontrollü geçiş',
          'Örnek veriyle pilot aktarım yapın, kayıt sayılarını ve kritik alanları karşılaştırın. Başarısız işlemler için tekrar ve destek akışı belirleyin.',
        ],
      ],
    ],
    '/donanim': [
      'PDKS & DONANIM',
      'Saha kayıtlarını İK planına bağlayın.',
      'Mevcut terminal ve giriş kayıtlarınızın SenseHR zaman yönetimiyle bağlantısını birlikte keşfedelim.',
      [
        [
          'Cihaz envanteri',
          'Terminal marka/modeli, protokolü, ağ erişimi ve kayıt formatını paylaşın. Her cihaz için uyumluluk demo öncesi teknik olarak doğrulanmalıdır.',
        ],
        [
          'Çalışan eşlemesi',
          'Kart veya terminal kaydını doğru çalışan ve lokasyonla eşleştirin. Yinelenen veya geç gelen kayıtların nasıl ele alınacağını planlayın.',
        ],
        [
          'Veri ve erişim',
          'Biyometrik veri işleme gereksinimi ayrıca değerlendirilir. Bu sayfa herhangi bir biyometrik cihaz için hazır bağlantı veya hukuki uygunluk taahhüdü sunmaz.',
        ],
      ],
    ],
    '/calisan-deneyimi': [
      'ÇALIŞAN DENEYİMİ',
      'İyi bir iş günü, küçük anlarda başlar.',
      'İşe giriş, iletişim, izin ve gelişim süreçleriyle çalışanların gündelik deneyimini iyileştirin.',
      [
        [
          'Planlı bir başlangıç',
          'Yeni çalışan görevlerini, belgelerini ve ilk gün sorumlularını işe giriş modülüyle görünür hale getirin.',
        ],
        [
          'Ortak bilgi',
          'Şirket duyurularını ve organizasyon bilgisini herkesin erişebileceği doğru kanalda paylaşın.',
        ],
        [
          'Düzenli gelişim',
          'Performans ve eğitim ihtiyaçlarını yalnız dönem sonunda değil, düzenli görüşmelerde ele alın.',
        ],
      ],
    ],
    '/guvenlik': [
      'GÜVENLİK YAKLAŞIMI',
      'Doğru kişiye, doğru erişim.',
      'Satış ve demo akışında kimlik doğrulama, onay ve lisans kontrolleri birlikte çalışır.',
      [
        [
          'Demo erişimi',
          'Yönetici onayı sonrasında süreli ve tek kullanımlık satış demo bağlantısı hazırlanır. Lisans süresi ve modül kapsamı ürün tarafında da kontrol edilir.',
        ],
        [
          'Rol ve kayıt',
          'Yönetici işlemleri kayıt altına alınır. Satış oturumları HttpOnly çerezle yürütülür; ürün erişimi kendi kimlik doğrulama akışıyla korunur.',
        ],
        [
          'Veri sorumluluğu',
          'Canlı ortamdaki veri saklama, yedekleme, barındırma ve erişim politikaları sözleşme kapsamında belirlenmelidir. Sertifika veya denetim iddiası bu sayfada sunulmaz.',
        ],
      ],
    ],
    '/sss': [
      'SIKÇA SORULAN SORULAR',
      'Başlamadan önce bilmek istedikleriniz.',
      'Demo, modüller ve lisans süreci hakkında.',
      [
        [
          'Demo nasıl açılır?',
          `Çalışan sayısı ve modül tercihlerinizle başvurun. Yönetici incelemesinden sonra ${catalog.trialDays} günlük erişim daveti e-posta ile hazırlanır.`,
        ],
        [
          'Kredi kartı gerekli mi?',
          'Demo başvurusunda kart bilgisi alınmaz. Lisans, teklif ve ödeme teyidinden sonra etkinleşir.',
        ],
        [
          'Lisans nasıl belirlenir?',
          'Çalışan kapasitesi, paket modülleri ve aylık/yıllık dönem birlikte belirlenir. Onaylanmış fiyat yoksa size özel teklif sunulur.',
        ],
        [
          'İK araçları verimi kaydediyor mu?',
          'Hesaplama araçları ve olgunluk testi tarayıcı içinde çalışır; değerleri sunucuya göndermez.',
        ],
        [
          'Verilerimi nasıl taşırım?',
          'Veri kaynağı, alan eşlemesi ve pilot kapsamı geçiş planında değerlendirilir. Demo başvurusunda mevcut araçlarınızı not olarak paylaşabilirsiniz.',
        ],
      ],
    ],
    '/destek': [
      'DESTEK',
      'Başlangıçta da, kullanımda da yanınızdayız.',
      'Ürün çalışma alanı ve demo başvurusu için doğru kanalı seçin.',
      [
        [
          'Mevcut ürün kullanıcısı',
          'SenseHR çalışma alanınıza giriş yapın. Destek kapsamı ve iletişim kanalları kurumunuzun kurulum ve hizmet planına göre belirlenir.',
        ],
        [
          'Demo başvurusu',
          'Onay ve davet bilgileri başvuru e-postanıza gönderilir. Erişim süresini ve seçilmiş modülleri satış demo alanında görebilirsiniz.',
        ],
      ],
    ],
    '/iletisim': [
      'BİRLİKTE KONUŞALIM',
      'Ekibiniz için doğru başlangıcı bulalım.',
      'Çalışan sayınız, İK öncelikleriniz ve mevcut araçlarınızla bize ulaşın.',
      [
        [
          'Demo görüşmesi',
          'Şirket bilgilerinizi, çalışan sayınızı ve öncelikli modüllerinizi formda paylaşın. Ekibimiz inceleyip sonraki adımı planlasın.',
        ],
        [
          'Mevcut müşteriler',
          'SenseHR ürün girişinden çalışma alanınıza ulaşabilirsiniz. Kurumunuzun belirlenmiş destek kanalını kullanın.',
        ],
      ],
    ],
  }[path];
  if (corporate)
    return (
      <>
        <PageHero eyebrow={corporate[0]} title={corporate[1]} text={corporate[2]} />
        <section className="section container corporate-content">
          {corporate[3].map(([t, p]) => (
            <section key={t}>
              <h2>{t}</h2>
              <p>{p}</p>
            </section>
          ))}
          {catalog.supportEmail && (
            <a className="button secondary" href={`mailto:${catalog.supportEmail}`}>
              {catalog.supportEmail}
            </a>
          )}
          <Demo />
          <a className="text-link" href="/giris">
            SenseHR ürün girişi <ArrowUpRight size={17} />
          </a>
        </section>
      </>
    );
  return <Missing />;
}
