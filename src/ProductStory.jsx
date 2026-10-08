import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ReceiptText,
  CalendarDays,
  Users,
  ChartNoAxesCombined,
} from 'lucide-react';
import { ProductPreview } from './ProductVisual.jsx';
import './product-story.css';

const chapters = [
  {
    key: 'payroll',
    icon: ReceiptText,
    label: 'Bordro & ücret',
    eyebrow: '01 · BORDRO OPERASYONU',
    title: 'Her dönem, daha düzenli bir bordro.',
    text: 'Çalışan ve ücret bilgilerini ortak bir düzende tutun. Bordro dönemlerini ve belge paylaşımını ekibinizin işleyişine göre planlayın.',
    points: [
      'Bordro dönemleri ve ücret bilgileri',
      'Dış bordro PDF yükleme',
      'Çalışan için bordro görüntüleme',
    ],
    mobile: 'home',
    cta: 'Bordro demosunu keşfedin',
  },
  {
    key: 'leave',
    icon: CalendarDays,
    label: 'İzin & onay',
    eyebrow: '02 · İZİN YÖNETİMİ',
    title: 'İzinler planlı. Ekibiniz hazır.',
    text: 'İzin talebinden ekip takvimine kadar herkes aynı akışta buluşsun. Çalışanlar tarihlerini seçsin, yöneticiler planı birlikte görsün.',
    points: [
      'Mobil izin talebi ve bakiye',
      'Onaylanmış ve bekleyen izinler',
      'Gün, hafta ve ay görünümünde ekip takvimi',
    ],
    mobile: 'leave',
    cta: 'İzin demosunu keşfedin',
  },
  {
    key: 'employee',
    icon: Users,
    label: 'Çalışan bilgisi',
    eyebrow: '03 · ÖZLÜK & ORGANİZASYON',
    title: 'Ekibinizin bilgisi, bir arada.',
    text: 'Çalışan kayıtlarını, departmanları ve yöneticileri tek ekrandan keşfedin. İzin ve bordro operasyonu aynı çalışan kaydından başlasın.',
    points: [
      'Çalışan dizini ve filtreler',
      'Departman, unvan ve yönetici bilgisi',
      'Ortak özlük kaydı',
    ],
    mobile: 'approvals',
    cta: 'Çalışan yönetimini keşfedin',
  },
  {
    key: 'reporting',
    icon: ChartNoAxesCombined,
    label: 'İK göstergeleri',
    eyebrow: '04 · GÖRÜNÜR BİR İK DÜZENİ',
    title: 'Bir sonraki kararınız için, ortak bir görünüm.',
    text: 'Günlük İK operasyonunu ve ekip göstergelerini aynı çalışma alanında değerlendirin. Önceliklerinize göre demo kapsamını birlikte belirleyelim.',
    points: [
      'İK göstergeleri ve ekip görünümü',
      'İzin ve çalışan bilgisiyle birlikte değerlendirme',
      'İhtiyacınıza göre modül kapsamı',
    ],
    cta: 'Size özel demo talep edin',
  },
];

export function ProductStory() {
  const root = useRef(null);
  const [active, setActive] = useState('payroll');
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            setActive(entry.target.dataset.chapter);
          }
        }
      },
      { rootMargin: '-15% 0px -40% 0px', threshold: 0 },
    );
    root.current.querySelectorAll('[data-chapter]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <section className="product-story" id="urun-ekranlari" ref={root} aria-labelledby="story-title">
      <div className="container story-intro">
        <span className="eyebrow">SENSEHR'A YAKINDAN BAKIN</span>
        <h2 id="story-title">
          Bordrodan izne.
          <br />
          <span>İK'nın her adımı, bir arada.</span>
        </h2>
        <p>Aşağı kaydırın; gerçek web ve mobil ürün ekranlarıyla günlük iş akışınızı keşfedin.</p>
        <ArrowDown size={24} aria-hidden="true" />
      </div>
      <nav className="story-navigation" aria-label="Ürün deneyimi bölümleri">
        <div className="container">
          {chapters.map(({ key, label, icon: Icon }) => (
            <a key={key} href={`#urun-${key}`} aria-current={active === key ? 'step' : undefined}>
              <Icon size={18} />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </nav>
      <div className="story-chapters">
        {chapters.map(({ key, label, eyebrow, title, text, points, mobile, cta }, index) => (
          <article
            className={`story-chapter ${index % 2 ? 'story-reverse' : ''}`}
            id={`urun-${key}`}
            data-chapter={key}
            key={key}
          >
            <div className="container story-chapter-grid">
              <div className="story-copy">
                <span className="eyebrow">{eyebrow}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <ul>
                  {points.map((point) => (
                    <li key={point}>
                      <Check size={18} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <a
                  className="button"
                  href={`/demo-talebi${key === 'reporting' ? '' : `?modul=${key}`}`}
                >
                  {cta}
                  <ArrowUpRight size={18} />
                </a>
                <a
                  className="text-link"
                  href={key === 'reporting' ? '/neden-senseik' : `/urunler/${key}`}
                >
                  {label} hakkında daha fazla <ArrowUpRight size={16} />
                </a>
              </div>
              <div className="story-device-stage">
                <div className="story-browser-caption">
                  <span className="tiny-dot" /> SenseHR · {label}
                </div>
                <ProductPreview selected={key} large />
                {mobile && (
                  <img
                    className="story-phone"
                    src={`/images/product/mobile-${mobile}.jpg`}
                    alt={`SenseHR gerçek mobil ${mobile === 'home' ? 'ana ekranı' : mobile === 'leave' ? 'izin talebi' : 'onaylar'} · Demo veriler`}
                    width="540"
                    height="1170"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <small>Gerçek ürün ekranı · Demo veriler</small>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
