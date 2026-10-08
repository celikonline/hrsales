import React, { useState } from 'react';
import {
  ArrowRight, ChevronLeft, ChevronRight, Clock3, Users, HeartHandshake,
  ChartNoAxesCombined, CalendarDays, Target, MapPin, CircleCheck, Cloud,
  ShieldCheck, MonitorSmartphone, ReceiptText, GraduationCap, Network, Plus,
} from 'lucide-react';
import { ProductPreview } from './ProductVisual.jsx';
import { ReferenceBrands } from './ReferenceBrands.jsx';
import './home-reference.css';

const stories = [
  { key: 'leave', label: 'İZİN & ONAY', title: 'Bir izin talebi. Baştan sona görünür.', text: 'Çalışan talebini oluşturur; yönetici takvimi ve bakiyeyi görerek onay sürecini takip eder.', href: '/urunler/leave', icon: CalendarDays },
  { key: 'profile', label: 'ÇALIŞAN YÖNETİMİ', title: 'Ekibinize ait bilgiler, bir arada.', text: 'Özlük kartını, organizasyon bilgilerini ve çalışan belgelerini aynı çalışma alanında açın.', href: '/urunler/employee', icon: Users },
  { key: 'payroll', label: 'BORDRO & ÜCRET', title: 'Ay sonu işleri daha düzenli.', text: 'Bordro dönemlerini, hesaplamaları ve yüklenen bordro belgelerini ürün ekranında keşfedin.', href: '/urunler/payroll', icon: ReceiptText },
  { key: 'attendance', label: 'ZAMAN YÖNETİMİ', title: 'Çalışma zamanı bir bakışta.', text: 'Devam, fazla mesai ve puantaj kayıtlarını ekibinizin günlük akışı içinde takip edin.', href: '/urunler/attendance', icon: Clock3 },
  { key: 'performance', label: 'PERFORMANS', title: 'Hedeflerden gelişime uzanan bir akış.', text: 'Çalışan hedeflerini ve değerlendirme dönemlerini tek bir yerde inceleyin.', href: '/urunler/performance', icon: Target },
  { key: 'onboarding', label: 'İŞE BAŞLANGIÇ', title: 'İlk günden itibaren birlikte.', text: 'İşe giriş görevlerini, sorumluları ve tamamlanma durumlarını aynı listede görün.', href: '/urunler/onboarding', icon: HeartHandshake },
];

const solutions = [
  [Clock3, 'Zaman ve İzin Yönetimi', 'Çalışma saatleri, vardiyalar, puantaj ve izin taleplerini aynı akışta takip edin.', '/urunler/attendance'],
  [Target, 'Performans Yönetimi', 'Hedefleri ve değerlendirme dönemlerini görünür hale getirin; gelişimi birlikte takip edin.', '/urunler/performance'],
  [HeartHandshake, 'Çalışan Deneyimi', 'Duyurular, talepler ve işe başlangıç görevleriyle ekibinizin günlük işlerini kolaylaştırın.', '/urunler/announcements'],
  [ChartNoAxesCombined, 'İnsan Kaynakları Analitiği', 'Çalışan dağılımını ve ekip göstergelerini inceleyin; kayıtlarınızı kararlarınıza taşıyın.', '/urunler/employee'],
];

function SectionHeading({ title, children, id }) {
  return <div className="home-ref-heading"><h2 id={id}>{title}</h2>{children && <p>{children}</p>}</div>;
}

function WorkflowStories() {
  const [start, setStart] = useState(0);
  const selected = [0, 1, 2].map((offset) => stories[(start + offset) % stories.length]);
  return (
    <section className="home-ref-section home-ref-stories" id="urun-ekranlari" aria-labelledby="home-stories-title">
      <div className="home-ref-container">
        <SectionHeading id="home-stories-title" title="SenseIK ile işin akışı değişir">
          Günlük İK işlerini, ürünün içinden örneklerle keşfedin.
        </SectionHeading>
        <div className="home-ref-story-grid" aria-live="polite">
          {selected.map(({ key, title, text, label, href, icon: Icon }, index) => (
            <article className={`home-ref-story story-tone-${index}`} key={key}>
              <div className="home-ref-story-top"><span>{label}</span><Icon size={25} aria-hidden="true" /></div>
              <ProductPreview selected={key} large />
              <div className="home-ref-story-copy"><h3>{title}</h3><p>{text}</p><a href={href}>Akışı keşfedin <ArrowRight size={17} /></a></div>
            </article>
          ))}
        </div>
        <div className="home-ref-story-controls">
          <button type="button" aria-label="Önceki iş akışı" onClick={() => setStart((n) => (n + stories.length - 1) % stories.length)}><ChevronLeft size={22} /></button>
          <span>{start + 1} / {stories.length}</span>
          <button type="button" aria-label="Sonraki iş akışı" onClick={() => setStart((n) => (n + 1) % stories.length)}><ChevronRight size={22} /></button>
        </div>
      </div>
    </section>
  );
}

function FiveQuestions() {
  const questions = [
    { title: 'Kim?', icon: Users, text: 'Çalışan bilgileri', href: '/urunler/employee' },
    { title: 'Nerede?', icon: MapPin, text: 'Ekip ve organizasyon', href: '/urunler/employee' },
    { title: 'Ne zaman?', icon: Clock3, text: 'Çalışma ve izin zamanı', href: '/urunler/attendance' },
    { title: 'Nasıl?', icon: CircleCheck, text: 'Hedef ve değerlendirme', href: '/urunler/performance' },
    { title: 'Ne yapıyor?', icon: Target, text: 'Görev ve işe başlangıç', href: '/urunler/onboarding' },
  ];
  return (
    <div className="home-ref-question-visual" aria-label="İK yönetiminin beş sorusu">
      <svg viewBox="0 0 600 380" aria-hidden="true">
        <path d="M65 300 A235 235 0 0 1 535 300" fill="none" stroke="#dce8fc" strokeWidth="2" strokeDasharray="4 7" />
        <path d="M300 300 L110 300 A190 190 0 0 1 146 188 Z" fill="#2864e8" />
        <path d="M300 300 L148 190 A188 188 0 0 1 242 121 Z" fill="#6494ef" />
        <path d="M300 300 L245 131 A178 178 0 0 1 355 131 Z" fill="#a4c3fa" />
        <path d="M300 300 L365 101 A210 210 0 0 1 470 176 Z" fill="#8bb1f7" />
        <path d="M300 300 L446 194 A180 180 0 0 1 480 300 Z" fill="#d7e6fd" />
        <circle cx="300" cy="300" r="58" fill="white" stroke="#edf3fe" strokeWidth="14" />
        <path d="M300 266 L310 287 L334 290 L316 307 L320 331 L300 320 L280 331 L284 307 L266 290 L290 287 Z" fill="#2864e8" />
      </svg>
      {questions.map(({ title, icon: Icon, text, href }, i) => (
        <a className={`question-point point-${i}`} href={href} key={title} aria-label={`${title} ${text}`}><span><Icon size={21} /></span><b>{title}</b></a>
      ))}
    </div>
  );
}

export function HomeReferenceSections({ catalog }) {
  const faqs = [
    ['SenseIK nedir?', 'SenseIK, İK ürünümüzün satış ve başvuru deneyimidir. Çalışan bilgisi, izin, zaman, bordro ve diğer modülleri SenseHR çalışma alanında kullanırsınız.'],
    ['Günlük İK işlerimi dijital olarak takip edebilir miyim?', 'Çalışan kayıtları, izin talepleri, onaylar ve seçtiğiniz diğer modüller aynı çalışma alanında yönetilir. Demoda kendi iş akışınıza uygun ekranları birlikte inceleyebilirsiniz.'],
    ['Modüller ve paketler nasıl belirleniyor?', 'Çalışan kapasiteniz ve ihtiyaç duyduğunuz modüller, demo ve teklif kapsamını belirler. Başlangıç, Büyüme ve Kurumsal paketlerin kapsamını paketler sayfasında karşılaştırabilirsiniz.'],
    ['Küçük ekipler için uygun bir başlangıç var mı?', 'Başlangıç paketi çalışan bilgileri ve izin yönetimi gibi temel süreçleri bir araya getirir. Çalışan sayınıza ve ihtiyacınıza göre demo kapsamını birlikte netleştiririz.'],
    ['Demo hemen açılır mı, kredi kartı gerekir mi?', `Demo için kredi kartı gerekmez. Başvurunuz onaylandığında ${catalog.trialDays} günlük deneme daveti e-postanıza gönderilir.`],
    ['Mevcut PDKS veya bordro sistemimle bağlantı kurulabilir mi?', 'Kullandığınız cihazları, veri formatlarını ve aktarım ihtiyacını keşif görüşmesinde inceleriz. Özel bağlantıların kapsamı ve cihaz uyumluluğu doğrulandıktan sonra tekliflendirilir.'],
    ['Bordro modülünde neler var?', 'Bordro dönemlerini ve hesaplamaları yönetebilir, harici bordro PDF belgelerini yükleyebilirsiniz. Şirketinizde kullanılacak hesaplama ve belge paylaşım akışını demoda netleştirebiliriz.'],
    ['Demo bittikten sonra ne olur?', 'Deneme süresi sonunda demo erişimi kapanır. Ücretli lisans, teklifinizin ve ödemenizin teyidinden sonra seçtiğiniz paket ve çalışan kapasitesine göre etkinleştirilir.'],
  ];
  return (
    <div className="home-ref-sections">
      <WorkflowStories />
      <ReferenceBrands />

      <div className="home-ref-banner"><h2>Manuel Süreçlerden Kurtulun,<br />İK Operasyonlarınızı Kolaylaştırın!</h2></div>

      <section className="home-ref-section home-ref-why" id="nasil-calisir" aria-labelledby="home-why-title">
        <div className="home-ref-container">
          <SectionHeading id="home-why-title" title="Neden SenseIK?" />
          <a className="home-ref-more" href="/neden-senseik">Daha fazla <ArrowRight size={16} /></a>
          <div className="home-ref-why-screen"><ProductPreview selected="overview" large /></div>
          <div className="home-ref-start-steps">
            <div><span>01</span><b>Demo talep edin</b><p>Ekibinizi ve öncelikli modüllerinizi paylaşın.</p></div>
            <div><span>02</span><b>Davetinizi alın</b><p>Onaylanan başvurunuzun giriş bağlantısı e-postanıza gelsin.</p></div>
            <div><span>03</span><b>Birlikte deneyin</b><p>Günlük iş akışlarınızı ürün ekranlarında inceleyin.</p></div>
          </div>
        </div>
      </section>

      <section className="home-ref-section home-ref-solutions" id="moduller" aria-labelledby="home-solutions-title">
        <div className="home-ref-container">
          <SectionHeading id="home-solutions-title" title="Verimli İşletmeler İçin Akıllı İK Çözümleri">
            Çalışan bilgilerini, iş gücünü ve ekip gelişimini bir arada yönetin.<br />Günlük takiplere daha az, insanlara daha çok zaman ayırın.
          </SectionHeading>
          <div className="home-ref-solution-grid">
            {solutions.map(([Icon, title, text, href], i) => (
              <a className={`home-ref-solution solution-${i}`} href={href} key={title}>
                <span className="home-ref-solution-icon"><Icon size={32} strokeWidth={1.4} /></span><h3>{title}</h3><p>{text}</p><ArrowRight className="home-ref-card-arrow" size={20} />
                {i < 3 && <span className="home-ref-equation" aria-hidden="true">{i === 2 ? '=' : '+'}</span>}
              </a>
            ))}
          </div>
          <div className="home-ref-module-links" aria-label="SenseIK modülleri">
            {catalog.modules.map((module) => <a key={module.key} href={`/urunler/${module.key}`}>{module.name}<ArrowRight size={14} /></a>)}
          </div>
        </div>
      </section>

      <div className="home-ref-banner"><h2>Zamandan Tasarruf Edin,<br />İK Süreçlerinizi Akıllıca Yönetin!</h2></div>

      <section className="home-ref-section">
        <div className="home-ref-container home-ref-split">
          <FiveQuestions />
          <div className="home-ref-copy"><h2>Verimliliği Ölçen 5 Soru</h2><p>Kim, nerede, ne zaman, nasıl ve ne yapıyor? Çalışan kayıtları, çalışma zamanı, hedefler ve görevleri birbirinden koparmadan inceleyin. Günlük operasyonları görünür hale getiren bir çalışma alanıyla ekibinizi daha yakından tanıyın.</p><a className="home-ref-more" href="/ik-olgunluk-testi">İK süreçlerinizi değerlendirin <ArrowRight size={17} /></a></div>
        </div>
      </section>

      <section className="home-ref-hardware" id="mobil-deneyim" aria-labelledby="home-hardware-title">
        <div className="home-ref-container home-ref-split">
          <div className="home-ref-copy"><span className="home-ref-kicker">ZAMAN YÖNETİMİ & PDKS</span><h2 id="home-hardware-title">Çalışma zamanı ve PDKS,<br />aynı platformda.</h2><p>Giriş-çıkış kayıtlarını, terminalleri, vardiyaları ve puantajı birlikte takip edin. Mobil izin ve onay ekranlarıyla günlük işlemleri masanızın dışında da keşfedin.</p><p className="home-ref-small">Mevcut cihazlarınızın bağlantı ve uyumluluk kapsamını birlikte doğrulayalım.</p><a className="home-ref-pill" href="/donanim">PDKS çözümlerini keşfedin <ArrowRight size={18} /></a></div>
          <div className="home-ref-device-stage"><div className="home-ref-terminal-screen"><ProductPreview selected="terminals" large /></div><img className="home-ref-device-phone" src="/images/product/mobile-home.jpg" alt="SenseHR mobil ana ekranı: izin bakiyesi ve günlük işlemler; demo veriler" width="540" height="1170" loading="lazy" /><span className="home-ref-device-note">Web ve mobil · Gerçek ürün ekranları</span></div>
        </div>
      </section>

      <section className="home-ref-section home-ref-integrations" aria-labelledby="home-integrations-title">
        <div className="home-ref-container">
          <SectionHeading id="home-integrations-title" title="İş akışınızın tamamını birlikte düşünelim">
            Mevcut sistemleriniz ve SenseIK modülleri için bağlantı ihtiyacınızı keşfedelim.
          </SectionHeading>
          <div className="home-ref-integration-groups">
            {[[Network, 'PDKS & DONANIM', 'Terminaller · Giriş-çıkış kayıtları', '/donanim'], [ReceiptText, 'BORDRO', 'Dönemler · Hesaplama · PDF belgeleri', '/urunler/payroll'], [GraduationCap, 'EĞİTİM', 'Programlar · Katılımcılar · Kayıtlar', '/urunler/training'], [CircleCheck, 'GÖREV YÖNETİMİ', 'İşe giriş · İşten ayrılış · Sorumlular', '/urunler/onboarding'], [Users, 'ÇALIŞAN KAYITLARI', 'Özlük · Organizasyon · Belgeler', '/urunler/employee']].map(([Icon, label, text, href]) => <a href={href} key={label}><span>{label}</span><Icon size={35} strokeWidth={1.3} /><b>{text}</b></a>)}
          </div>
          <a className="home-ref-more" href="/entegrasyonlar">Entegrasyon kapsamını konuşalım <ArrowRight size={17} /></a>
        </div>
      </section>

      <section className="home-ref-section home-ref-cloud" aria-labelledby="home-cloud-title">
        <div className="home-ref-container">
          <SectionHeading id="home-cloud-title" title={<>Birlikte Çalışmanın<br />Dijital Hali</>}>
            İK ekibi, yöneticiler ve çalışanlar için ortak bir çalışma alanı.<br />Yetkileri, onay adımlarını ve şirketinize uygun kullanım kapsamını demoda birlikte inceleyin.
          </SectionHeading>
          <div className="home-ref-cloud-strip">
            {[[Cloud, 'Web erişimi'], [ShieldCheck, 'Yetki ve roller'], [MonitorSmartphone, 'Mobil deneyim'], [CircleCheck, 'Onay akışları']].map(([Icon, label]) => <div key={label}><Icon size={42} strokeWidth={1.3} /><span>{label}</span></div>)}
          </div>
        </div>
      </section>

      <section className="home-ref-section home-ref-faq" id="sorular" aria-labelledby="home-faq-title">
        <div className="home-ref-container">
          <SectionHeading id="home-faq-title" title="Sıkça Sorulan Sorular" />
          <div className="home-ref-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={20} /></summary><p>{answer}</p></details>)}</div>
          <a className="home-ref-pill" href="/sss">Tüm soruları görüntüleyin <ArrowRight size={18} /></a>
        </div>
      </section>

      <section className="home-ref-final" id="paketler">
        <div className="home-ref-container"><div><span>EKİBİNİZİN BİR SONRAKİ ADIMI</span><h2>İnsanlara zaman ayırın.<br />İK işlerini birlikte kolaylaştıralım.</h2><p>Onay sonrası {catalog.trialDays} günlük demo · Kredi kartı gerekmez</p></div><div className="home-ref-final-actions"><a className="home-ref-pill" href="/demo-talebi">Ücretsiz demo için başvur <ArrowRight size={18} /></a><a href="/fiyatlar">Paketleri karşılaştırın <ArrowRight size={16} /></a></div></div>
      </section>
    </div>
  );
}
