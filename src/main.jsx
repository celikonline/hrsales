import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronsUpDown,
  X,
  Menu,
  CircleAlert,
  CircleCheck,
  Check,
  Info,
  LockKeyhole,
  Ellipsis,
  Users,
  CalendarDays,
  Clock3,
  Wallet,
  Target,
  UserRoundPlus,
  ReceiptText,
  Laptop,
  GraduationCap,
  Megaphone,
  ShieldCheck,
  LayoutDashboard,
  ChartNoAxesCombined,
  Search,
  Bell,
  CalendarCheck2,
  Layers3,
  SlidersHorizontal,
  MonitorSmartphone,
  Handshake,
  HeartHandshake,
  MousePointer2,
  MailCheck,
  Rocket,
  Sprout,
  Building2,
  Plus,
  MessageCircle,
  SquareCheck,
  Square,
  LogIn,
  Inbox,
  KeyRound,
  ShoppingBag,
  Mail,
  History,
  LogOut,
  RefreshCw,
  Timer,
  Circle,
} from 'lucide-react';
const Icons = {
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronsUpDown,
  X,
  Menu,
  CircleAlert,
  CircleCheck,
  Check,
  Info,
  LockKeyhole,
  Ellipsis,
  Users,
  CalendarDays,
  Clock3,
  Wallet,
  Target,
  UserRoundPlus,
  ReceiptText,
  Laptop,
  GraduationCap,
  Megaphone,
  ShieldCheck,
  LayoutDashboard,
  ChartNoAxesCombined,
  Search,
  Bell,
  CalendarCheck2,
  Layers3,
  SlidersHorizontal,
  MonitorSmartphone,
  Handshake,
  HeartHandshake,
  MousePointer2,
  MailCheck,
  Rocket,
  Sprout,
  Building2,
  Plus,
  MessageCircle,
  SquareCheck,
  Square,
  LogIn,
  Inbox,
  KeyRound,
  ShoppingBag,
  Mail,
  History,
  LogOut,
  RefreshCw,
  Timer,
  Circle,
};
import '@fontsource-variable/zalando-sans';
import './styles.css';
import {
  MegaNavigation,
  ResourcePage,
  MarketingPage,
  DiscoverTeaser,
  PlatformSections,
} from './discover.jsx';
import { MobileShowcase } from './MobileShowcase.jsx';
import { ProductPreview } from './ProductVisual.jsx';
import { ProductStory } from './ProductStory.jsx';
import { PresentationRequest } from './PresentationRequest.jsx';
import { ReferenceBrands } from './ReferenceBrands.jsx';
import { WhatsAppLink } from './WhatsAppLink.jsx';
import './typography.css';
import { QuickDemoForm } from './QuickDemoForm.jsx';
import {
  modules as fallbackModules,
  plans as fallbackPlans,
  moduleName,
  planName,
} from '../shared/catalog.js';

function Icon({ name, size = 20, ...props }) {
  const Component = Icons[name] || Icons.Sparkles;
  return <Component size={size} strokeWidth={1.7} {...props} />;
}
function Logo({ dark = false, compact = false }) {
  return (
    <a href="/" className={`logo ${dark ? 'on-dark' : ''}`} aria-label="SenseIK ana sayfa">
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="12" fill="currentColor" />
        <path
          d="M28 11H17a6 6 0 0 0 0 12h6a3 3 0 0 1 0 6H12"
          fill="none"
          stroke="#14c6bb"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span>
          sense<span className="logo-ik">ik</span>
        </span>
      )}
    </a>
  );
}
async function api(path, body) {
  const response = await fetch(`/api${path}`, {
    credentials: 'same-origin',
    ...(body !== undefined
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      : {}),
  });
  const data = await response.json();
  if (!response.ok)
    throw Object.assign(new Error(data.message || 'İşlem tamamlanamadı.'), {
      status: response.status,
      fields: data.fields,
    });
  return data;
}
function useCatalog() {
  const [catalog, setCatalog] = useState({
    modules: fallbackModules,
    plans: fallbackPlans,
    trialDays: 14,
    privacyUrl: '/gizlilik',
    productWeb: 'http://localhost:3000',
    mode: 'sandbox',
  });
  useEffect(() => {
    api('/catalog')
      .then(setCatalog)
      .catch(() => {});
  }, []);
  return catalog;
}
const money = (value) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  }).format(value);
const date = (value) =>
  new Date(value).toLocaleDateString('tr-TR', { timeZone: 'Europe/Istanbul' });
function Notice({ error, children }) {
  return children ? (
    <div role={error ? 'alert' : 'status'} className={`notice ${error ? 'error' : ''}`}>
      <Icon name={error ? 'CircleAlert' : 'CircleCheck'} size={20} />
      <span>{children}</span>
    </div>
  ) : null;
}
function Button({ children, secondary, className = '', ...props }) {
  return (
    <button className={`button ${secondary ? 'secondary' : ''} ${className}`} {...props}>
      {children}
    </button>
  );
}
function DemoLink({ children = 'Demo talep et', className = '', plan, modules = [] }) {
  const params = new URLSearchParams();
  if (plan) params.set('paket', plan);
  modules.forEach((module) => params.append('modul', module));
  return (
    <a className={`button ${className}`} href={`/demo-talebi${params.size ? `?${params}` : ''}`}>
      {children}
      <Icon name="ArrowUpRight" size={18} />
    </a>
  );
}
function Header({ catalog }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>
            <span className="live-dot" /> Ekibinizin ihtiyacına göre, size özel demo
          </span>
          <a href="/online-sunum-talep-et">
            Online sunum talep et <Icon name="ArrowRight" size={14} />
          </a>
        </div>
      </div>
      <header className="header">
        <div className="container nav">
          <Logo />
          <nav aria-label="Ana menü" className={open ? 'is-open' : ''}>
            <MegaNavigation catalog={catalog} />
          </nav>
          <div className="nav-actions">
            <a href="/giris" className="login-link">
              Giriş yap <Icon name="ArrowUpRight" size={15} />
            </a>
            <DemoLink />
            <button
              className="menu-toggle"
              onClick={() => setOpen(!open)}
              aria-label="Menüyü aç"
              aria-expanded={open}
            >
              <Icon name={open ? 'X' : 'Menu'} />
            </button>
          </div>
        </div>
      </header>
      <WhatsAppLink catalog={catalog} floating />
    </>
  );
}
function Footer({ catalog }) {
  return (
    <footer>
      <div className="container footer-main">
        <div>
          <Logo dark />
          <p>
            İşlemlere değil,
            <br />
            insanlara zaman ayırın.
          </p>
          <span className="made-by">Bir AlgoSense ürünü.</span>
        </div>
        <div>
          <h4>Ürünü keşfedin</h4>
          <a href="/#moduller">İK modülleri</a>
          <a href="/#urun-ekranlari">Ürün ekranları</a>
          <a href="/#mobil-deneyim">Mobil deneyim</a>
          <a href="/#paketler">Paket & lisans</a>
          <a href="/#nasil-calisir">Nasıl başlarsınız?</a>
          <a href="/sektorler">Sektör çözümleri</a>
          <a href="/kesfet">Keşfet merkezi</a>
          <a href="/raporlar">PDF rehberler</a>
          <a href="/hesaplama-araclari">Hesaplama araçları</a>
          <a href="/hakkimizda">Hakkımızda</a>
          <a href="/iletisim">İletişim</a>
        </div>
        <div>
          <h4>Birlikte başlayalım</h4>
          <a href="/online-sunum-talep-et">Online sunum talep et</a>
          <a href="/demo-talebi">Demo talep et</a>
          <a href="/giris">Demo girişi</a>
          <a href="/giris?urun=1">SenseHR girişi</a>
          {catalog.supportEmail && (
            <a href={`mailto:${catalog.supportEmail}`}>{catalog.supportEmail}</a>
          )}
        </div>
        <div className="footer-note">
          <Icon name="MessageCircle" size={28} />
          <h4>İhtiyacınız kadar İK.</h4>
          <p>Çalışan sayınıza ve önceliklerinize uygun bir başlangıç planlayalım.</p>
          <a href="/demo-talebi">
            Ekibiniz için görüşelim <Icon name="ArrowRight" size={15} />
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} SenseIK · AlgoSense</span>
        <div>
          <a href={catalog.privacyUrl}>Gizlilik & aydınlatma</a>
          <a href="/admin">Yönetim</a>
        </div>
      </div>
    </footer>
  );
}
function SectionTitle({ eyebrow, title, children, center = true }) {
  return (
    <div className={`section-title ${center ? 'center' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
function Plans({ catalog, purchase = false, onSelect }) {
  const [cycle, setCycle] = useState('yearly');
  const [count, setCount] = useState(50);
  return (
    <>
      <div className="pricing-controls">
        <label>
          Çalışan sayınız{' '}
          <input
            type="number"
            min="1"
            max="100000"
            value={count}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
        <div className="segmented" aria-label="Lisans dönemi">
          <button
            className={cycle === 'monthly' ? 'selected' : ''}
            onClick={() => setCycle('monthly')}
          >
            Aylık
          </button>
          <button
            className={cycle === 'yearly' ? 'selected' : ''}
            onClick={() => setCycle('yearly')}
          >
            Yıllık <span>12 ay</span>
          </button>
        </div>
      </div>
      <div className="plan-grid">
        {catalog.plans.map((plan, i) => (
          <article className={`plan ${i === 1 ? 'featured' : ''}`} key={plan.key}>
            {i === 1 && (
              <div className="plan-ribbon">
                <Icon name="Sparkles" size={13} /> Operasyonunuzu bir araya getirin
              </div>
            )}
            <span className={`module-icon ${i === 1 ? 'mint' : 'lilac'}`}>
              <Icon name={['Sprout', 'Layers3', 'Building2'][i]} size={25} />
            </span>
            <h3>{plan.name}</h3>
            <p className="plan-audience">{plan.audience}</p>
            <div className="plan-price">
              {plan.price ? (
                <>
                  <strong>
                    {money(
                      plan.price * Math.max(count, plan.minimum) * (cycle === 'yearly' ? 12 : 1),
                    )}
                  </strong>
                  <span>/{cycle === 'yearly' ? 'yıl' : 'ay'} · vergi hariç</span>
                </>
              ) : (
                <>
                  <strong>Size özel teklif</strong>
                  <span>Çalışan sayısı ve ihtiyaçlarınıza göre</span>
                </>
              )}
            </div>
            <small className="plan-minimum">
              En az {plan.minimum} çalışan kapasitesi · {Math.max(count, plan.minimum)} kişi için
            </small>
            {purchase ? (
              <Button secondary={i !== 1} onClick={() => onSelect(plan, cycle, count)}>
                Paketi seç <Icon name="ArrowRight" size={16} />
              </Button>
            ) : (
              <DemoLink className={i !== 1 ? 'secondary' : ''} plan={plan.key}>
                Demo talep et
              </DemoLink>
            )}
            <div className="plan-divider" />
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Icon name="Check" size={16} />
                  {feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="pricing-note">
        <Icon name="Info" size={15} /> Ücretli lisans, teklif ve ödeme teyidinden sonra başlar. Demo
        için kredi kartı gerekmez.
      </p>
    </>
  );
}
function Landing({ catalog }) {
  const [allModules, setAllModules] = useState(false);
  const priority = ['payroll', 'leave', 'employee', 'expense', 'attendance', 'performance'];
  const orderedModules = [...catalog.modules].sort((a, b) => {
    const rank = (key) => (priority.includes(key) ? priority.indexOf(key) : priority.length);
    return rank(a.key) - rank(b.key);
  });
  const visibleModules = allModules ? orderedModules : orderedModules.slice(0, 6);
  return (
    <>
      <Header catalog={catalog} />
      <main>
        <section className="hero container">
          <div className="hero-orb one" />
          <div className="hero-orb two" />
          <div className="hero-copy">
            <span className="hero-badge">
              <span className="live-dot" /> Daha sade bir İK, daha güçlü bir ekip
            </span>
            <h1>
              Bordro ve izin, tek bir düzende.
              <br />
              <span>Ekibinize daha çok zaman.</span>
            </h1>
            <p>
              Çalışan bilgilerini, izin planını ve bordro operasyonunu
              <br className="desktop-break" /> SenseHR'da bir araya getirin. Web'de ve mobilde, aynı
              akışta.
            </p>
            <QuickDemoForm catalog={catalog} modules={['employee', 'payroll', 'leave']} hero />
            <div className="hero-actions">
              <a href="/online-sunum-talep-et?modul=payroll&modul=leave" className="hero-secondary">
                Online sunum talep et <Icon name="ArrowUpRight" size={17} />
              </a>
            </div>
            <div className="hero-assurances">
              <span>
                <Icon name="Check" size={15} />
                {catalog.trialDays} günlük onaylı demo
              </span>
              <span>
                <Icon name="Check" size={15} />
                Kredi kartı gerekmez
              </span>
              <span>
                <Icon name="Check" size={15} />
                İhtiyacınız kadar modül
              </span>
            </div>
          </div>
          <div className="hero-topic-links">
            <a href="#urun-payroll">
              <Icon name="ReceiptText" size={18} /> Bordro & ücret
            </a>
            <a href="#urun-leave">
              <Icon name="CalendarDays" size={18} /> İzin & onay
            </a>
            <a href="#mobil-deneyim">
              <Icon name="MonitorSmartphone" size={18} /> Mobil deneyim
            </a>
          </div>
          <div className="hero-product">
            <div className="floating-badge">
              <span className="mint">
                <Icon name="CircleCheck" size={22} />
              </span>
              <div>
                <b>Bir talep daha tamam.</b>
                <small>Daha az takip, daha çok zaman.</small>
              </div>
            </div>
            <ProductPreview />
            <img
              className="hero-device-phone"
              src="/images/product/mobile-home.jpg"
              alt="SenseHR gerçek mobil ana ekranı · Demo veriler"
              width="540"
              height="1170"
              decoding="async"
            />
            <div className="product-caption">
              <span className="tiny-dot" /> SenseHR gerçek web ve mobil ekranları · Demo veriler
            </div>
          </div>
        </section>
        <ReferenceBrands />
        <section className="benefits-strip container">
          <div>
            <Icon name="Layers3" />
            <span>
              Tüm İK süreçleri<strong>Tek bir platformda</strong>
            </span>
          </div>
          <div>
            <Icon name="SlidersHorizontal" />
            <span>
              Modüler yapı<strong>İhtiyacınıza göre şekillenir</strong>
            </span>
          </div>
          <div>
            <Icon name="MonitorSmartphone" />
            <span>
              Çalışan self servis<strong>Her yerden erişim</strong>
            </span>
          </div>
          <div>
            <Icon name="Handshake" />
            <span>
              Birlikte başlangıç<strong>Size özel demo deneyimi</strong>
            </span>
          </div>
        </section>
        <ProductStory />
        <section className="section container" id="moduller">
          <SectionTitle
            eyebrow="EKİBİNİZ İÇİN, BİR ARADA"
            title={
              <>
                İK'nın her adımı.
                <br />
                <span>Tek bir yerde.</span>
              </>
            }
          >
            Ayrı dosyalar, dağınık talepler ve bitmeyen takipler yerine,
            <br className="desktop-break" /> birbiriyle bağlantılı, anlaşılır bir çalışma alanı.
          </SectionTitle>
          <div className="module-grid">
            {visibleModules.map((m, i) => (
              <a href={`/urunler/${m.key}`} className="module-card" key={m.key}>
                <span className={`module-icon ${['lilac', 'mint', 'peach'][i % 3]}`}>
                  <Icon name={m.icon} size={25} />
                </span>
                <h3>{m.name}</h3>
                <p>{m.description}</p>
                <span className="module-discover">
                  Demoda keşfedin <Icon name="ArrowUpRight" size={16} />
                </span>
              </a>
            ))}
          </div>
          <div className="center module-more">
            <Button secondary onClick={() => setAllModules(!allModules)}>
              {allModules ? 'Daha az göster' : 'Tüm modülleri keşfedin'}
              <Icon name={allModules ? 'ChevronUp' : 'ArrowRight'} size={16} />
            </Button>
          </div>
        </section>
        <MobileShowcase />
        <section className="section container" id="nasil-calisir">
          <SectionTitle
            eyebrow="TANIŞMAKTAN KULLANMAYA"
            title={
              <>
                Başlamak <span>karmaşık değil.</span>
              </>
            }
          >
            Önce ihtiyacınızı anlayalım. Sonra size uygun çalışma alanını birlikte açalım.
          </SectionTitle>
          <div className="steps">
            {[
              [
                '01',
                'MousePointer2',
                'Demo talep edin',
                'Şirket e-postanızı ve telefonunuzu paylaşın; demo talebinizi gönderin.',
              ],
              [
                '02',
                'MailCheck',
                'Davetinizi alın',
                'Ekibimiz talebinizi onaylasın, giriş bağlantınız e-postanıza gelsin.',
              ],
              [
                '03',
                'Rocket',
                'Deneyin, karar verin',
                'Size açılan modülleri keşfedin; uygun paketle lisansa geçin.',
              ],
            ].map(([n, icon, title, text]) => (
              <div key={n}>
                <span className="step-number">{n}</span>
                <Icon name={icon} size={26} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="pricing-section" id="paketler">
          <div className="container">
            <SectionTitle
              eyebrow="İHTİYACINIZ KADAR İK"
              title={
                <>
                  Bugünkü ekibinize uygun.
                  <br />
                  <span>Yarınki büyümenize hazır.</span>
                </>
              }
            >
              Çalışan kapasitenizi ve modüllerinizi birlikte belirleyin.
              <br className="desktop-break" /> Demo sonrası size uygun paketle devam edin.
            </SectionTitle>
            <Plans catalog={catalog} />
          </div>
        </section>
        <PlatformSections />
        <DiscoverTeaser />
        <section className="section container faq" id="sorular">
          <SectionTitle
            center={false}
            eyebrow="AKLINIZDAKİ SORULAR"
            title={
              <>
                Başlamadan önce
                <br />
                <span>bilmek isteyecekleriniz.</span>
              </>
            }
          >
            İhtiyacınıza uygun demo için buradayız.
            <br />
            <a className="text-link" href="/demo-talebi">
              Birlikte konuşalım <Icon name="ArrowUpRight" size={16} />
            </a>
          </SectionTitle>
          <div>
            {[
              [
                'Demo hemen açılır mı?',
                `Başvurunuz ekibimiz tarafından incelenir. Onaylandıktan sonra seçilen modüller için ${catalog.trialDays} günlük demo daveti e-postanıza gönderilir.`,
              ],
              [
                'Demo için kredi kartı gerekli mi?',
                'Hayır. Demo başvurusu için şirket ve iletişim bilgileriniz, çalışan sayınız ve modül tercihleriniz yeterlidir.',
              ],
              [
                'Hangi modülleri seçebilirim?',
                'Özlük temel çalışma alanıdır. İzin, masraf, PDKS, performans, işe alım ve diğer modülleri başvuruda seçebilirsiniz; ekibimiz demo kapsamını birlikte netleştirir.',
              ],
              [
                'Demo bittikten sonra ne olur?',
                'Demo erişimi süre sonunda kapanır. Teklifinizin ve ödemenizin teyidinden sonra paketiniz, çalışan kapasiteniz ve lisans döneminize göre erişim etkinleştirilir.',
              ],
              [
                'SenseIK ve SenseHR arasındaki ilişki nedir?',
                'SenseIK, İK ürünümüzün satış ve başvuru deneyimidir. SenseHR ise modülleri kullandığınız ürün çalışma alanıdır.',
              ],
            ].map(([q, a], i) => (
              <details key={q} open={i === 0}>
                <summary>
                  {q}
                  <Icon name="Plus" size={18} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="cta-section container">
          <div>
            <span className="eyebrow">EKİBİNİZİN BİR SONRAKİ ADIMI</span>
            <h2>
              İK'ya değil,
              <br />
              <span>insana zaman ayırın.</span>
            </h2>
            <p>Ekibinize uygun SenseIK deneyimini birlikte planlayalım.</p>
          </div>
          <div>
            <DemoLink>Demo talep et</DemoLink>
            <span>
              <Icon name="Check" size={15} /> Kredi kartı gerekmez · Onaylı demo
            </span>
          </div>
          <div className="cta-decoration" aria-hidden="true">
            <Icon name="Sparkles" size={130} />
          </div>
        </section>
      </main>
      <Footer catalog={catalog} />
    </>
  );
}
function Field({ label, error, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
function DemoRequest({ catalog }) {
  const params = new URLSearchParams(location.search);
  const requestedModules = params
    .getAll('modul')
    .filter((key) => catalog.modules.some((module) => module.key === key));
  const plan = catalog.plans.some((item) => item.key === params.get('paket'))
    ? params.get('paket')
    : 'growth';
  return (
    <>
      <Header catalog={catalog} />
      <main className="quick-request-page container">
        <a className="back-link" href="/">
          <Icon name="ArrowLeft" size={16} /> Ana sayfaya dön
        </a>
        <section className="quick-request-content">
          <span className="eyebrow">ÜCRETSİZ DEMO</span>
          <h1>Ekibiniz için daha kolay bir İK.</h1>
          <p>
            Şirket e-postanızı ve telefon numaranızı paylaşın. SenseHR'ı birlikte keşfetmek için sizinle iletişime geçelim.
          </p>
          <QuickDemoForm catalog={catalog} modules={requestedModules} plan={plan} />
          <a className="quick-request-support" href="/destek">
            Destek talebi için tıklayın <Icon name="ArrowRight" size={16} />
          </a>
        </section>
      </main>
      <Footer catalog={catalog} />
    </>
  );
}
function Dialog({ title, children, onClose }) {
  const ref = useRef();
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="dialog-header">
        <h2>{title}</h2>
        <button className="icon-button" onClick={onClose} aria-label="Kapat">
          <Icon name="X" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
function Login({ catalog }) {
  const product = new URLSearchParams(location.search).get('urun');
  return (
    <>
      <Header catalog={catalog} />
      <main className="login-page container">
        <div className="form-card">
          <span className="module-icon lilac">
            <Icon name="LogIn" size={28} />
          </span>
          <h1>{product ? 'SenseHR çalışma alanınız.' : 'Demonuza hoş geldiniz.'}</h1>
          <p>
            {product
              ? 'Mevcut hesabınızla SenseHR ürününe giriş yapabilirsiniz.'
              : 'Onaylanan demo başvurunuza ait tek kullanımlık bağlantıyı e-postanızdan açın.'}
          </p>
          {product ? (
            <a className="button" href={`${catalog.productWeb}/login`}>
              SenseHR'a giriş yap <Icon name="ArrowUpRight" size={17} />
            </a>
          ) : (
            <>
              <Notice>
                E-posta gelmediyse spam klasörünüzü kontrol edin. Bağlantı kullanıldıysa ekibimizden
                yeni davet isteyin.
              </Notice>
              <a className="button" href="/demo">
                Açık demo oturumuna dön <Icon name="ArrowRight" size={17} />
              </a>
              <a className="text-link" href="/demo-talebi">
                Henüz başvurmadınız mı? Demo talep edin
              </a>
            </>
          )}
        </div>
      </main>
      <Footer catalog={catalog} />
    </>
  );
}
function Admin({ catalog }) {
  const [data, setData] = useState(null),
    [login, setLogin] = useState({ email: '', password: '' }),
    [tab, setTab] = useState('leads'),
    [search, setSearch] = useState(''),
    [status, setStatus] = useState('all'),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState(null),
    [action, setAction] = useState(null),
    [form, setForm] = useState({}),
    [message, setMessage] = useState('');
  const load = () =>
    api('/admin/overview')
      .then(setData)
      .catch((e) => {
        if (e.status === 401) setData(null);
        else setError(e.message);
      });
  useEffect(() => {
    load();
  }, []);
  async function signIn(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/admin/login', login);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  function open(record, kind) {
    setSelected(record);
    setAction(kind);
    setError('');
    setMessage('');
    setForm(
      kind === 'approve'
        ? {
            days: catalog.trialDays,
            modules: record.modules,
            fullName: record.fullName,
            company: record.company,
            employees: record.employees ?? '',
          }
        : kind === 'quote'
          ? {
              amount: record.estimatedSubtotal || '',
              taxPercent: 0,
              paymentInstructions: '',
            }
          : kind === 'activate'
            ? { paymentReference: '', paymentVerified: false }
            : { reason: '' },
    );
  }
  async function perform(e) {
    e?.preventDefault();
    setBusy(true);
    setError('');
    try {
      const endpoint = ['quote', 'activate', 'cancel'].includes(action) ? 'orders' : 'leads';
      await api(`/admin/${endpoint}/${selected.id}/${action}`, form);
      setSelected(null);
      setAction(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function quick(record, kind) {
    setBusy(true);
    setError('');
    try {
      await api(`/admin/leads/${record.id}/${kind}`, {});
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function readMessage(id) {
    try {
      const result = await api(`/admin/messages/${id}`);
      setMessage(result.body);
      setAction('message');
      setSelected({});
    } catch (e) {
      setError(e.message);
    }
  }
  if (!data)
    return (
      <main className="admin-login">
        <a href="/" className="back-link">
          <Icon name="ArrowLeft" size={16} /> Siteye dön
        </a>
        <div className="form-card">
          <Logo />
          <span className="eyebrow">SENSEIK YÖNETİM</span>
          <h1>Satış çalışma alanı.</h1>
          <p>Demo taleplerini, teklifleri ve lisansları yönetin.</p>
          <form onSubmit={signIn}>
            <Field
              label="Yönetici e-postası"
              type="email"
              required
              autoComplete="username"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />
            <Field
              label="Parola"
              type="password"
              required
              autoComplete="current-password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
            <Notice error>{error}</Notice>
            <Button type="submit" disabled={busy}>
              {busy ? 'Giriş yapılıyor…' : 'Yönetim paneline giriş'}
              <Icon name="ArrowRight" size={17} />
            </Button>
          </form>
        </div>
      </main>
    );
  const stats = [
    ['Bekleyen talep', data.leads.filter((l) => l.status === 'pending').length, 'Inbox'],
    [
      'Aktif erişim',
      data.leads.filter(
        (l) =>
          l.status === 'approved' &&
          l.license?.status !== 'revoked' &&
          l.license.expiresAt > new Date().toISOString(),
      ).length,
      'KeyRound',
    ],
    [
      'Satın alma talebi',
      data.orders.filter((o) => !['paid', 'cancelled'].includes(o.status)).length,
      'ShoppingBag',
    ],
    ['E-posta kuyruğu', data.messages.filter((m) => m.status !== 'sent').length, 'Mail'],
  ];
  const filtered = data.leads.filter(
    (l) =>
      `${l.company} ${l.fullName} ${l.email}`
        .toLocaleLowerCase('tr-TR')
        .includes(search.toLocaleLowerCase('tr-TR')) &&
      (status === 'all' || l.status === status),
  );
  return (
    <div className="workspace admin-workspace">
      <aside className="workspace-sidebar">
        <Logo />
        <div className="workspace-label">SATIŞ & MÜŞTERİ BAŞARISI</div>
        {[
          ['leads', 'Inbox', 'Demo & sunum talepleri'],
          ['orders', 'ShoppingBag', 'Satın alma & lisans'],
          ['mail', 'Mail', 'E-posta kuyruğu'],
          ['audit', 'History', 'İşlem geçmişi'],
        ].map(([key, icon, title]) => (
          <button
            key={key}
            className={tab === key ? 'active' : ''}
            onClick={() => {
              setTab(key);
              setError('');
            }}
          >
            <Icon name={icon} size={19} />
            {title}
            {key === 'leads' && stats[0][1] > 0 && <span className="nav-count">{stats[0][1]}</span>}
          </button>
        ))}
        <div className="workspace-bottom">
          <a href="/">
            <Icon name="ArrowUpRight" size={17} /> Pazarlama sitesini aç
          </a>
          <button
            onClick={async () => {
              await api('/logout', {});
              setData(null);
            }}
          >
            <Icon name="LogOut" size={17} /> Çıkış yap
          </button>
        </div>
      </aside>
      <main className="workspace-main">
        <div className="workspace-top">
          <span>SenseIK / Yönetim</span>
          <div>
            <span className="live-dot" />{' '}
            {data.productMode === 'sandbox' ? 'Yerel satış demosu' : 'SenseHR bağlı'}{' '}
            <Button secondary disabled={busy} onClick={load}>
              <Icon name="RefreshCw" size={16} /> Yenile
            </Button>
          </div>
        </div>
        <div className="workspace-heading">
          <span className="eyebrow">HER TALEP, YENİ BİR BAŞLANGIÇ</span>
          <h1>
            {
              {
                leads: 'Demo & sunum talepleri',
                orders: 'Satın alma & lisans',
                mail: 'E-posta kuyruğu',
                audit: 'İşlem geçmişi',
              }[tab]
            }
          </h1>
          <p>Doğru kapsamı belirleyin, kontrollü erişim açın, lisansa geçişi takip edin.</p>
        </div>
        <div className="workspace-stats">
          {stats.map(([name, value, icon]) => (
            <div key={name}>
              <span>
                {name}
                <Icon name={icon} size={21} />
              </span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        {!data.mailConfigured && (
          <Notice>
            SMTP henüz bağlı değil. E-postalar kalıcı kuyrukta tutuluyor; yerel inceleme için
            mesajları açabilirsiniz.
          </Notice>
        )}
        <Notice error>{!selected && error}</Notice>
        {tab === 'leads' && (
          <section className="workspace-card">
            <div className="list-toolbar">
              <h2>
                Başvurular <span>{filtered.length}</span>
              </h2>
              <div>
                <label className="search-field">
                  <Icon name="Search" size={16} />
                  <input
                    aria-label="Başvuru ara"
                    placeholder="Şirket, kişi veya e-posta ara"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                <select
                  aria-label="Başvuru durumu"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">Tüm durumlar</option>
                  <option value="pending">Bekliyor</option>
                  <option value="approved">Onaylandı</option>
                  <option value="rejected">Reddedildi</option>
                </select>
              </div>
            </div>
            {filtered.length === 0 ? (
              <Empty
                icon="Inbox"
                title="Henüz burada bir talep yok."
                text="Siteden gönderilen demo talepleri burada görünecek."
              />
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Şirket & iletişim</th>
                      <th>Çalışan</th>
                      <th>Modüller</th>
                      <th>Durum</th>
                      <th>Başvuru</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <b>{lead.company || 'Hızlı demo talebi'}</b>
                          <small>
                            {lead.requestType === 'presentation'
                              ? 'Online sunum talebi'
                              : 'Demo talebi'}
                          </small>
                          <small>
                            {lead.fullName ? `${lead.fullName} · ` : ''}
                            {lead.email}
                          </small>
                          <small>{lead.phone}</small>
                        </td>
                        <td>{lead.employees ?? 'Henüz paylaşılmadı'}</td>
                        <td>
                          <div className="tags">
                            {lead.modules.slice(0, 3).map((m) => (
                              <span key={m}>{moduleName(m)}</span>
                            ))}
                            {lead.modules.length > 3 && <span>+{lead.modules.length - 3}</span>}
                          </div>
                        </td>
                        <td>
                          <Badge
                            status={lead.license?.status === 'revoked' ? 'revoked' : lead.status}
                          />
                          {lead.license && <small>{date(lead.license.expiresAt)} bitiş</small>}
                        </td>
                        <td>{date(lead.createdAt)}</td>
                        <td>
                          <div className="row-actions">
                            <button onClick={() => open(lead, 'detail')}>İncele</button>
                            {lead.status === 'pending' && (
                              <button className="accent" onClick={() => open(lead, 'approve')}>
                                Onayla
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
        {tab === 'orders' && (
          <section className="workspace-card">
            <div className="list-toolbar">
              <h2>Satın alma talepleri</h2>
            </div>
            {!data.orders.length ? (
              <Empty
                icon="ShoppingBag"
                title="İlk lisansa hazırız."
                text="Demo çalışma alanından açılan satın alma talepleri burada görünür."
              />
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Şirket</th>
                      <th>Paket</th>
                      <th>Kapasite</th>
                      <th>Tutar</th>
                      <th>Durum</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <b>{order.company}</b>
                          <small>{order.email}</small>
                        </td>
                        <td>
                          {planName(order.plan)}
                          <small>{order.cycle === 'yearly' ? 'Yıllık' : 'Aylık'}</small>
                        </td>
                        <td>{order.billedEmployees} çalışan</td>
                        <td>{order.total ? money(order.total) : 'Teklif bekliyor'}</td>
                        <td>
                          <Badge status={order.status} />
                        </td>
                        <td>
                          <div className="row-actions">
                            <button onClick={() => open(order, 'order-detail')}>İncele</button>
                            {['awaiting_quote', 'pending_payment'].includes(order.status) && (
                              <button onClick={() => open(order, 'quote')}>Teklif ver</button>
                            )}
                            {order.status === 'pending_payment' && (
                              <button className="accent" onClick={() => open(order, 'activate')}>
                                Lisans aç
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
        {tab === 'mail' && (
          <section className="workspace-card">
            <div className="list-toolbar">
              <h2>Bildirimler</h2>
            </div>
            {!data.messages.length ? (
              <Empty
                icon="Mail"
                title="Kuyruk boş."
                text="Başvuru ve davet bildirimleri burada takip edilir."
              />
            ) : (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Alıcı</th>
                      <th>Konu</th>
                      <th>Durum</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.messages.map((m) => (
                      <tr key={m.id}>
                        <td>{m.recipient}</td>
                        <td>
                          {m.subject}
                          <small>{m.last_error}</small>
                        </td>
                        <td>
                          <Badge status={m.status} />
                        </td>
                        <td>
                          <div className="row-actions">
                            {!data.mailConfigured && (
                              <button onClick={() => readMessage(m.id)}>İçeriği aç</button>
                            )}
                            {['failed', 'retry'].includes(m.status) && (
                              <button
                                onClick={async () => {
                                  await api(`/admin/messages/${m.id}/retry`, {});
                                  await load();
                                }}
                              >
                                Yeniden dene
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
        {tab === 'audit' && (
          <section className="workspace-card">
            <div className="list-toolbar">
              <h2>Son işlemler</h2>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>İşlem</th>
                    <th>İşlemi yapan</th>
                    <th>Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {data.audit.map((a) => (
                    <tr key={a.id}>
                      <td>
                        {a.action}
                        <small>{a.entity_id}</small>
                      </td>
                      <td>{a.actor}</td>
                      <td>
                        {new Date(a.created_at).toLocaleString('tr-TR', {
                          timeZone: 'Europe/Istanbul',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      {selected && (
        <Dialog
          title={
            {
              approve: 'Demo erişimini onayla',
              reject: 'Başvuruyu reddet',
              revoke: 'Erişimi iptal et',
              detail: selected.company || 'Hızlı demo talebi',
              quote: 'Paket teklifini hazırla',
              activate: 'Ödemeyi teyit et, lisansı aç',
              'order-detail': 'Satın alma talebi',
              cancel: 'Satın alma talebini iptal et',
              message: 'Yerel e-posta önizlemesi',
            }[action]
          }
          onClose={() => {
            setSelected(null);
            setAction(null);
          }}
        >
          {action === 'message' ? (
            <pre className="mail-preview">{message}</pre>
          ) : action === 'detail' ? (
            <>
              <div className="request-summary">
                <div>
                  <span>Talep türü</span>
                  <b>{selected.requestType === 'presentation' ? 'Online sunum' : 'Demo'}</b>
                </div>
                <div>
                  <span>İletişim</span>
                  <b>
                    {selected.fullName || 'Henüz paylaşılmadı'}
                    <small>
                      {selected.email}
                      <br />
                      {selected.phone}
                    </small>
                  </b>
                </div>
                <div>
                  <span>Çalışan</span>
                  <b>{selected.employees ?? 'Henüz paylaşılmadı'}</b>
                </div>
                <div>
                  <span>Paket</span>
                  <b>{planName(selected.plan)}</b>
                </div>
                <div>
                  <span>Modüller</span>
                  <div className="tags">
                    {selected.modules.map((m) => (
                      <span key={m}>{moduleName(m)}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span>Not</span>
                  <p>{selected.notes || 'Not eklenmemiş.'}</p>
                </div>
              </div>
              <div className="dialog-actions">
                {selected.status === 'pending' ? (
                  <>
                    <Button onClick={() => open(selected, 'approve')}>Onayla</Button>
                    <Button secondary onClick={() => open(selected, 'reject')}>
                      Reddet
                    </Button>
                  </>
                ) : selected.status === 'approved' && selected.license?.status !== 'revoked' ? (
                  <>
                    <Button disabled={busy} onClick={() => quick(selected, 'invite')}>
                      Davet gönder
                    </Button>
                    <Button secondary onClick={() => open(selected, 'revoke')}>
                      Erişimi iptal et
                    </Button>
                  </>
                ) : null}
              </div>
            </>
          ) : action === 'order-detail' ? (
            <>
              <div className="request-summary">
                <div>
                  <span>Şirket</span>
                  <b>{selected.billingCompany}</b>
                </div>
                <div>
                  <span>Vergi no</span>
                  <b>{selected.taxNumber}</b>
                </div>
                <div>
                  <span>Adres</span>
                  <p>{selected.billingAddress}</p>
                </div>
                <div>
                  <span>Ödeme</span>
                  <p>{selected.paymentInstructions || 'Henüz teklif verilmedi.'}</p>
                </div>
              </div>
              {!['paid', 'cancelled'].includes(selected.status) && (
                <Button secondary onClick={() => open(selected, 'cancel')}>
                  Talebi iptal et
                </Button>
              )}
            </>
          ) : (
            <form onSubmit={perform}>
              {action === 'approve' && (
                <>
                  <p>
                    <b>{selected.company || selected.email}</b> için şirket bilgilerini, açılacak
                    modülleri ve demo süresini belirleyin. Davet onay sonrasında e-posta kuyruğuna
                    alınır.
                  </p>
                  <Field
                    label="Ad soyad"
                    required
                    minLength={3}
                    maxLength={100}
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                  <Field
                    label="Şirket adı"
                    required
                    minLength={2}
                    maxLength={200}
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                  <Field
                    label="Çalışan sayısı"
                    type="number"
                    required
                    min="1"
                    max="100000"
                    value={form.employees}
                    onChange={(e) => setForm({ ...form, employees: Number(e.target.value) })}
                  />
                  <Field
                    label="Demo süresi (gün)"
                    type="number"
                    required
                    min="1"
                    max="30"
                    value={form.days}
                    onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
                  />
                  <div className="module-choices">
                    {catalog.modules.map((m) => (
                      <label className="module-choice" key={m.key}>
                        <input
                          type="checkbox"
                          disabled={m.base}
                          checked={form.modules.includes(m.key)}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              modules: e.target.checked
                                ? [...form.modules, m.key]
                                : form.modules.filter((k) => k !== m.key),
                            })
                          }
                        />
                        <span>{m.name}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
              {action === 'reject' && (
                <label className="field">
                  <span>Başvuru sahibine iletilecek açıklama</span>
                  <textarea
                    required
                    minLength={5}
                    maxLength={500}
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  />
                </label>
              )}
              {action === 'revoke' && (
                <Notice error>
                  Bu şirkete ait demo ve ürün erişimi kapatılacak. Açık oturumlar da sona erer.
                </Notice>
              )}
              {action === 'cancel' && (
                <p>Bu satın alma talebi kapatılacak. Demo erişimi devam eder.</p>
              )}
              {action === 'quote' && (
                <>
                  <Field
                    label="Vergi hariç dönem bedeli (TRY)"
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  />
                  <Field
                    label="Vergi oranı (%)"
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={form.taxPercent}
                    onChange={(e) => setForm({ ...form, taxPercent: Number(e.target.value) })}
                  />
                  <label className="field">
                    <span>Ödeme açıklaması / banka bilgileri</span>
                    <textarea
                      required
                      minLength={10}
                      maxLength={1000}
                      rows={4}
                      value={form.paymentInstructions}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          paymentInstructions: e.target.value,
                        })
                      }
                    />
                  </label>
                  <Notice>Teklif e-posta ile iletilir. Ödeme teyidi olmadan lisans açılmaz.</Notice>
                </>
              )}
              {action === 'activate' && (
                <>
                  <Notice>
                    Teklif toplamı: {money(selected.total)}. {selected.billedEmployees} çalışan,{' '}
                    {planName(selected.plan)} paketi.
                  </Notice>
                  <Field
                    label="Banka / ödeme referansı"
                    required
                    minLength={5}
                    maxLength={100}
                    value={form.paymentReference}
                    onChange={(e) => setForm({ ...form, paymentReference: e.target.value })}
                  />
                  <label className="consent">
                    <input
                      type="checkbox"
                      required
                      checked={form.paymentVerified}
                      onChange={(e) => setForm({ ...form, paymentVerified: e.target.checked })}
                    />
                    <span>Ödemenin alındığını kontrol ettim ve teyit ediyorum.</span>
                  </label>
                </>
              )}
              <div className="dialog-actions">
                <Button disabled={busy} type="submit">
                  {busy ? 'İşlem sürüyor…' : 'İşlemi tamamla'}
                </Button>
                <Button type="button" secondary onClick={() => setSelected(null)}>
                  Vazgeç
                </Button>
              </div>
            </form>
          )}
          <Notice error>{error}</Notice>
        </Dialog>
      )}
    </div>
  );
}
function Badge({ status }) {
  const labels = {
    pending: 'Bekliyor',
    approved: 'Onaylandı',
    rejected: 'Reddedildi',
    revoked: 'İptal edildi',
    awaiting_quote: 'Teklif bekliyor',
    pending_payment: 'Ödeme bekliyor',
    paid: 'Lisans aktif',
    cancelled: 'İptal edildi',
    sent: 'Gönderildi',
    retry: 'Tekrar denenecek',
    failed: 'Başarısız',
    active: 'Aktif',
    trial: 'Demo',
  };
  return <span className={`badge ${status}`}>{labels[status] || status}</span>;
}
function Empty({ icon, title, text }) {
  return (
    <div className="empty">
      <Icon name={icon} size={38} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
function DemoWorkspace({ catalog }) {
  const [data, setData] = useState(null),
    [error, setError] = useState(''),
    [tab, setTab] = useState('overview'),
    [purchase, setPurchase] = useState(null),
    [busy, setBusy] = useState(false),
    [billing, setBilling] = useState({
      billingCompany: '',
      taxNumber: '',
      billingAddress: '',
    }),
    [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const initialized = useRef(false);
  const load = () =>
    api('/demo/workspace')
      .then(setData)
      .catch((e) => setError(e.message));
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    (async () => {
      try {
        const raw = new URLSearchParams(location.hash.slice(1)).get('token');
        if (raw) {
          history.replaceState(null, '', '/demo');
          await api('/demo/access', { token: raw });
        }
        await load();
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);
  async function decide(id, decision) {
    setError('');
    try {
      await api(`/demo/requests/${id}/decision`, { decision });
      await load();
    } catch (e) {
      setError(e.message);
    }
  }
  async function order(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/orders', {
        plan: purchase.plan.key,
        employees: purchase.count,
        cycle: purchase.cycle,
        ...billing,
      });
      setPurchase(null);
      setPurchaseSuccess(true);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (!data)
    return (
      <>
        <Header catalog={catalog} />
        <main className="login-page container">
          <div className="form-card">
            <Icon name="KeyRound" size={35} />
            <h1>{error ? 'Demo erişimi' : 'Demonuz hazırlanıyor…'}</h1>
            <Notice error>{error}</Notice>
            {error && (
              <a className="button" href="/giris">
                Giriş bilgilerini incele
              </a>
            )}
          </div>
        </main>
      </>
    );
  const { lead, sample, decisions } = data;
  const days = Math.max(0, Math.ceil((Date.parse(lead.license.expiresAt) - Date.now()) / 86400000));
  return (
    <div className="workspace">
      <aside className="workspace-sidebar">
        <Logo />
        <div className="workspace-company">
          <span className="avatar lilac">
            {lead.company.slice(0, 2).toLocaleUpperCase('tr-TR')}
          </span>
          <b>
            {lead.company}
            <small>
              SenseHR · {lead.license.status === 'active' ? 'Lisanslı hesap' : 'Demo alanı'}
            </small>
          </b>
        </div>
        <div className="workspace-label">ÇALIŞMA ALANINIZ</div>
        {[
          ['overview', 'LayoutDashboard', 'Genel bakış', 'employee'],
          ['employees', 'Users', 'Çalışanlar', 'employee'],
          ['leave', 'CalendarDays', 'İzin yönetimi', 'leave'],
          ['expense', 'Wallet', 'Masraf & avans', 'expense'],
          ['modules', 'Layers3', 'Modüllerim', 'employee'],
          ['license', 'KeyRound', 'Paket & lisans', 'employee'],
        ]
          .filter((x) => lead.modules.includes(x[3]))
          .map(([key, icon, title]) => (
            <button
              key={key}
              className={tab === key ? 'active' : ''}
              onClick={() => {
                setTab(key);
                setError('');
              }}
            >
              <Icon name={icon} size={19} />
              {title}
            </button>
          ))}
        <div className="workspace-bottom">
          <div className="demo-expiry">
            <Icon name="Timer" size={20} />
            <b>
              {days} gün kaldı
              <small>{date(lead.license.expiresAt)} bitiş</small>
            </b>
          </div>
          <button
            onClick={async () => {
              await api('/logout', {});
              location.href = '/giris';
            }}
          >
            <Icon name="LogOut" size={17} /> Çıkış yap
          </button>
        </div>
      </aside>
      <main className="workspace-main">
        <div className="workspace-top">
          <span>{lead.company} / SenseHR deneyimi</span>
          <div>
            <Badge status={lead.license.status} />
            <span className="avatar mint">
              {lead.fullName.slice(0, 2).toLocaleUpperCase('tr-TR')}
            </span>
          </div>
        </div>
        <div className="demo-banner">
          <Icon name="Sparkles" size={20} />
          <p>
            {lead.product?.mode === 'sandbox'
              ? 'Satış demosundasınız. Tüm çalışanlar ve talepler kurgusal örnek verilerdir.'
              : 'SenseHR çalışma alanınız açıldı. Davetinizle parolanızı belirleyip ürüne geçebilirsiniz.'}
          </p>
          <button onClick={() => setTab('license')}>
            Paketleri keşfet <Icon name="ArrowRight" size={15} />
          </button>
        </div>
        <div className="workspace-heading">
          <span className="eyebrow">EKİBİNİZ İÇİN GÜZEL BİR BAŞLANGIÇ</span>
          <h1>
            {tab === 'overview'
              ? `Merhaba, ${lead.fullName.split(' ')[0]}.`
              : {
                  employees: 'Çalışanlar',
                  leave: 'İzin yönetimi',
                  expense: 'Masraf & avans',
                  modules: 'Modülleriniz',
                  license: 'Paket & lisans',
                }[tab]}
          </h1>
          <p>
            {tab === 'overview'
              ? 'Daha az operasyon, daha çok insan. SenseIK deneyiminizi keşfedin.'
              : 'Demo kapsamınızı ve ekibinizin ihtiyaçlarını birlikte keşfedin.'}
          </p>
        </div>
        <Notice error>{error}</Notice>
        <Notice>
          {purchaseSuccess
            ? 'Satın alma talebiniz alındı. Teklif ve ödeme bilgileri ekibimiz tarafından iletilecek.'
            : null}
        </Notice>
        {data.entryUrl && (
          <div className="product-entry">
            <Icon name="Rocket" size={32} />
            <div>
              <h2>Gerçek SenseHR ürününüz hazır.</h2>
              <p>
                İlk girişte davetinizi açıp parolanızı belirleyin. Sonraki girişlerde mevcut
                hesabınızı kullanın.
              </p>
            </div>
            <a className="button" href={data.entryUrl}>
              Daveti aç <Icon name="ArrowUpRight" size={17} />
            </a>
            <a className="text-link" href={data.productLogin}>
              Ürün girişi
            </a>
          </div>
        )}
        {tab === 'overview' && (
          <>
            <div className="workspace-stats">
              {[
                ['Örnek çalışan', sample.employees.length, 'Users'],
                ['Açık modül', lead.modules.length, 'Layers3'],
                ['Çalışan kapasitesi', lead.license.employeeLimit, 'Building2'],
                ['Erişim süresi', `${days} gün`, 'Timer'],
              ].map(([label, value, icon]) => (
                <div key={label}>
                  <span>
                    {label}
                    <Icon name={icon} size={21} />
                  </span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <div className="demo-overview-grid">
              <section className="workspace-card">
                <div className="list-toolbar">
                  <h2>Bekleyen talepler</h2>
                  <span className="muted">Örnek veriler</span>
                </div>
                {sample.requests
                  .filter((r) => lead.modules.includes(r.module))
                  .map((r) => (
                    <div className="request-row" key={r.id}>
                      <span className="module-icon lilac">
                        <Icon name={r.module === 'leave' ? 'CalendarDays' : 'Wallet'} />
                      </span>
                      <div>
                        <b>{r.employee}</b>
                        <small>{r.description}</small>
                      </div>
                      <strong>{r.value}</strong>
                      {decisions[r.id] ? (
                        <Badge status={decisions[r.id]} />
                      ) : (
                        <div className="row-actions">
                          <button className="accent" onClick={() => decide(r.id, 'approved')}>
                            Onayla
                          </button>
                          <button onClick={() => decide(r.id, 'rejected')}>Reddet</button>
                        </div>
                      )}
                    </div>
                  ))}
                {!sample.requests.some((r) => lead.modules.includes(r.module)) && (
                  <Empty
                    icon="CircleCheck"
                    title="Bekleyen talep yok."
                    text="İzin ve masraf modülleri açıldığında örnek talepler burada görünür."
                  />
                )}
              </section>
              <section className="workspace-card getting-started">
                <span className="module-icon mint">
                  <Icon name="Rocket" size={24} />
                </span>
                <h2>İlk adımlarınız.</h2>
                <p>Ekibinizi tanıyın, bir talebi onaylayın ve modüllerinizi keşfedin.</p>
                <button onClick={() => setTab('employees')}>
                  <Icon name="Circle" size={16} /> Çalışan listesini keşfet{' '}
                  <Icon name="ArrowRight" size={16} />
                </button>
                <button onClick={() => setTab('modules')}>
                  <Icon name="Circle" size={16} /> Açık modülleri incele{' '}
                  <Icon name="ArrowRight" size={16} />
                </button>
                <button onClick={() => setTab('license')}>
                  <Icon name="Circle" size={16} /> Ekibinize uygun paketi seç{' '}
                  <Icon name="ArrowRight" size={16} />
                </button>
              </section>
            </div>
          </>
        )}
        {tab === 'employees' && (
          <section className="workspace-card">
            <div className="list-toolbar">
              <h2>
                Ekibiniz <span>Örnek veriler</span>
              </h2>
              <span>4 kurgusal çalışan</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Çalışan</th>
                    <th>Departman</th>
                    <th>Görev</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {sample.employees.map((p, i) => (
                    <tr key={p.name}>
                      <td>
                        <div className="person-cell">
                          <span className={`avatar ${['lilac', 'mint', 'peach'][i % 3]}`}>
                            {p.avatar}
                          </span>
                          <b>{p.name}</b>
                        </div>
                      </td>
                      <td>{p.department}</td>
                      <td>{p.role}</td>
                      <td>
                        <Badge status="active" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {['leave', 'expense'].includes(tab) && (
          <section className="workspace-card">
            <div className="list-toolbar">
              <h2>{tab === 'leave' ? 'İzin talepleri' : 'Masraf talepleri'}</h2>
              <span>Örnek senaryo</span>
            </div>
            {sample.requests
              .filter((r) => r.module === tab)
              .map((r) => (
                <div className="request-row" key={r.id}>
                  <Icon name={tab === 'leave' ? 'CalendarDays' : 'Wallet'} size={25} />
                  <div>
                    <b>{r.employee}</b>
                    <small>{r.description}</small>
                  </div>
                  <strong>{r.value}</strong>
                  {decisions[r.id] ? (
                    <Badge status={decisions[r.id]} />
                  ) : (
                    <div className="row-actions">
                      <button className="accent" onClick={() => decide(r.id, 'approved')}>
                        Onayla
                      </button>
                      <button onClick={() => decide(r.id, 'rejected')}>Reddet</button>
                    </div>
                  )}
                </div>
              ))}
          </section>
        )}
        {tab === 'modules' && (
          <div className="module-grid">
            {catalog.modules.map((m) => (
              <article
                className={`module-card ${!lead.modules.includes(m.key) ? 'locked' : ''}`}
                key={m.key}
              >
                <span className="module-icon lilac">
                  <Icon name={m.icon} size={24} />
                </span>
                <h3>{m.name}</h3>
                <p>{m.description}</p>
                <Badge status={lead.modules.includes(m.key) ? 'active' : 'revoked'} />
                {!lead.modules.includes(m.key) && (
                  <small>Paket seçimiyle kapsamı genişletebilirsiniz.</small>
                )}
              </article>
            ))}
          </div>
        )}
        {tab === 'license' && (
          <>
            <div className="license-card">
              <Icon name="KeyRound" size={32} />
              <div>
                <h2>
                  {planName(lead.license.plan)} ·{' '}
                  {lead.license.status === 'trial' ? 'Demo lisansı' : 'Aktif lisans'}
                </h2>
                <p>
                  {lead.license.employeeLimit} çalışan kapasitesi · {date(lead.license.expiresAt)}{' '}
                  bitiş · {lead.modules.length} modül
                </p>
              </div>
            </div>
            <Plans
              catalog={catalog}
              purchase
              onSelect={(plan, cycle, count) => {
                setPurchase({ plan, cycle, count });
                setBilling({
                  billingCompany: lead.company,
                  taxNumber: '',
                  billingAddress: '',
                });
                setError('');
              }}
            />
            {data.orders.length > 0 && (
              <section className="workspace-card">
                <div className="list-toolbar">
                  <h2>Satın alma talepleriniz</h2>
                </div>
                {data.orders.map((o) => (
                  <div className="request-row" key={o.id}>
                    <Icon name="ShoppingBag" />
                    <div>
                      <b>
                        {planName(o.plan)} · {o.billedEmployees} çalışan
                      </b>
                      <small>
                        {o.total
                          ? `${money(o.total)} · ${o.paymentInstructions}`
                          : 'Teklifiniz hazırlanıyor.'}
                      </small>
                    </div>
                    <Badge status={o.status} />
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </main>
      {purchase && (
        <Dialog
          title={`${purchase.plan.name} paketi için satın alma talebi`}
          onClose={() => setPurchase(null)}
        >
          <p>
            {Math.max(purchase.count, purchase.plan.minimum)} çalışan kapasitesi ·{' '}
            {purchase.cycle === 'yearly' ? 'Yıllık' : 'Aylık'} lisans. Ekibimiz teklif ve ödeme
            bilgilerini iletecek.
          </p>
          <form onSubmit={order}>
            <Field
              label="Fatura şirket adı"
              required
              value={billing.billingCompany}
              onChange={(e) => setBilling({ ...billing, billingCompany: e.target.value })}
            />
            <Field
              label="Vergi numarası (10 veya 11 rakam)"
              required
              pattern="[0-9]{10,11}"
              value={billing.taxNumber}
              onChange={(e) => setBilling({ ...billing, taxNumber: e.target.value })}
            />
            <label className="field">
              <span>Fatura adresi</span>
              <textarea
                minLength={10}
                required
                rows={3}
                value={billing.billingAddress}
                onChange={(e) => setBilling({ ...billing, billingAddress: e.target.value })}
              />
            </label>
            <Notice>
              Bu aşamada ödeme alınmaz. Lisansınız, ödeme yönetici tarafından teyit edildikten sonra
              etkinleşir.
            </Notice>
            <Notice error>{error}</Notice>
            <Button type="submit" disabled={busy}>
              {busy ? 'Gönderiliyor…' : 'Satın alma talebi gönder'}
              <Icon name="ArrowRight" size={16} />
            </Button>
          </form>
        </Dialog>
      )}
    </div>
  );
}
function Privacy({ catalog }) {
  return (
    <>
      <Header catalog={catalog} />
      <main className="section container privacy-page">
        <span className="eyebrow">YEREL GELİŞTİRME METNİ · YAYIN ÖNCESİ ONAY GEREKİR</span>
        <h1>Demo başvurusu ve gizlilik.</h1>
        <p>
          Demo formunda ad soyad, şirket adı, iş e-postası, telefon, çalışan sayısı, modül
          tercihleri ve isteğe bağlı notlar alınır. Bu bilgiler demo talebinin değerlendirilmesi,
          ilgili kişilerle iletişim kurulması ve onay sonrası erişimin hazırlanması amacıyla
          kullanılır.
        </p>
        <p>
          Başvurular yönetici panelinde tutulur. Başvuru ve giriş bildirimleri yapılandırılmış
          e-posta servisi üzerinden gönderilir. Pazarlama listesine otomatik kayıt yapılmaz. Oturum
          için yalnız gerekli, HttpOnly çerez kullanılır.
        </p>
        <p>
          Bu metin geliştirme ortamında akışı açıklamak içindir. Veri sorumlusu bilgileri, başvuru
          kanalları, saklama süreleri ve nihai aydınlatma metni kurum tarafından tamamlanmalıdır.
          Üretimde bu sayfa yerine onaylanmış metnin adresi tanımlanır.
        </p>
        <a className="text-link" href="/demo-talebi">
          Demo formuna dön <Icon name="ArrowRight" size={16} />
        </a>
      </main>
      <Footer catalog={catalog} />
    </>
  );
}
function App() {
  const catalog = useCatalog();
  const path = location.pathname.replace(/\/$/, '') || '/';
  return path === '/admin' ? (
    <Admin catalog={catalog} />
  ) : path === '/demo-talebi' ? (
    <DemoRequest catalog={catalog} />
  ) : ['/online-sunum-talep-et', '/online-sunum-talebi'].includes(path) ? (
    <>
      <Header catalog={catalog} />
      <PresentationRequest catalog={catalog} api={api} />
      <Footer catalog={catalog} />
    </>
  ) : path === '/demo' ? (
    <DemoWorkspace catalog={catalog} />
  ) : path === '/giris' ? (
    <Login catalog={catalog} />
  ) : path === '/gizlilik' ? (
    <Privacy catalog={catalog} />
  ) : ['/kesfet', '/raporlar', '/hesaplama-araclari', '/blog', '/ik-olgunluk-testi'].some(
      (p) => path === p || path.startsWith(`${p}/`),
    ) ? (
    <>
      <Header catalog={catalog} />
      <main>
        <ResourcePage path={path} />
      </main>
      <Footer catalog={catalog} />
    </>
  ) : [
      '/urunler',
      '/cozumler',
      '/sektorler',
      '/neden-senseik',
      '/fiyatlar',
      '/hakkimizda',
      '/iletisim',
      '/sss',
      '/guvenlik',
      '/destek',
      '/musteriler',
      '/entegrasyonlar',
      '/donanim',
      '/calisan-deneyimi',
    ].some((p) => path === p || path.startsWith(`${p}/`)) ? (
    <>
      <Header catalog={catalog} />
      <main>
        <MarketingPage
          path={path}
          catalog={catalog}
          ProductPreview={ProductPreview}
          Plans={Plans}
        />
      </main>
      <Footer catalog={catalog} />
    </>
  ) : path === '/' ? (
    <Landing catalog={catalog} />
  ) : (
    <>
      <Header catalog={catalog} />
      <main className="section container">
        <h1>Bu sayfa bulunamadı.</h1>
        <a className="button" href="/">
          Ana sayfaya dön
        </a>
      </main>
    </>
  );
}
createRoot(document.getElementById('root')).render(<App />);
