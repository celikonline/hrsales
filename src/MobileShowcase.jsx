import React from 'react';
import { ArrowUpRight, CalendarDays, ReceiptText, Smartphone, Check } from 'lucide-react';
import './mobile-showcase.css';

const screens = [
  {
    key: 'home',
    title: 'İş gününüz bir bakışta',
    text: 'İzin bakiyesi, duyurular ve bekleyen işlemler aynı ekranda.',
    icon: Smartphone,
    alt: 'SenseHR gerçek mobil ana ekranı: izin bakiyesi, puantaj, bordro ve hızlı işlemler; demo veriler',
  },
  {
    key: 'leave',
    title: 'İzin talebi, birkaç adımda',
    text: 'Tarihlerinizi seçin, bakiyenizi görün ve talebinizi takip edin.',
    icon: CalendarDays,
    alt: 'SenseHR gerçek mobil izin talebi: izin türü, tarih aralığı ve talep gönderme; demo veriler',
  },
  {
    key: 'approvals',
    title: 'Onaylar, tek ekranda',
    text: 'İzin, masraf ve avans taleplerini inceleyin; kararlarınızı aynı akışta yönetin.',
    icon: ReceiptText,
    alt: 'SenseHR gerçek mobil onay ekranı: izin, masraf ve avans talepleri; demo veriler',
  },
];

export function MobileShowcase() {
  return (
    <section className="mobile-showcase" id="mobil-deneyim" aria-labelledby="mobile-showcase-title">
      <div className="container">
        <div className="mobile-showcase-heading">
          <span className="eyebrow">EKİBİNİZİN GÜNÜNE UYUM SAĞLAR</span>
          <h2 id="mobile-showcase-title">
            Masanızdan uzakta.
            <br />
            <span>Ekibinize hep yakın.</span>
          </h2>
          <p>
            Çalışan deneyimini telefon ekranında keşfedin. Günlük İK işlemleri için sade, anlaşılır
            bir çalışma alanı.
          </p>
        </div>
        <div className="mobile-screen-gallery">
          {screens.map(({ key, title, text, icon: Icon, alt }, index) => (
            <figure className={`mobile-screen-card screen-${key}`} key={key}>
              <div className="mobile-phone-stage">
                <img
                  src={`/images/product/mobile-${key}.jpg`}
                  alt={alt}
                  width="540"
                  height="1170"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span className="mobile-screen-number">
                  0{index + 1} <Icon size={20} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mobile-showcase-bottom">
          <span>
            <Check size={18} aria-hidden="true" /> SenseHR mobil uygulaması · Demo veriler
          </span>
          <a className="button" href="/demo-talebi?modul=leave">
            Mobil deneyimi demoda keşfedin <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
