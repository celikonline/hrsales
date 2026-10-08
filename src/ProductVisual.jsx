import React, { useEffect, useRef, useState } from 'react';
import { Expand, X, ArrowUpRight } from 'lucide-react';
import './product-visual.css';

const screens = {
  payroll: {
    title: 'Bordro ve ücret',
    alt: 'SenseHR Eylül 2026 bordro dönem detayı: ödeme durumu, prim ve komisyon kayıtları; kurgusal demo veriler',
  },
  overview: {
    title: 'İK genel bakış',
    alt: 'SenseHR gerçek web ana ekranı: çalışan bilgisi, izin bakiyesi ve ekip göstergeleri; demo veriler',
  },
  employee: {
    title: 'Çalışanlar',
    alt: 'SenseHR gerçek çalışan listesi: departman, unvan, yönetici ve kayıt durumu; demo veriler',
  },
  leave: {
    title: 'İzin yönetimi',
    alt: 'SenseHR gerçek izin takvimi: çalışanlar ve onaylanmış veya bekleyen izinler; demo veriler',
  },
  reporting: {
    title: 'İK göstergeleri',
    alt: 'SenseHR gerçek İK göstergeleri sayfası; demo şirket verileri',
  },
};

export function ProductPreview({ selected = 'overview', large = false }) {
  const key = screens[selected] ? selected : 'overview';
  const screen = screens[key];
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const image = `/images/product/web-${key}.jpg?v=20261008-docker`;
  useEffect(() => {
    if (open && !dialog.current.open) dialog.current.showModal();
    else if (!open && dialog.current.open) dialog.current.close();
  }, [open]);
  return (
    <>
      <div className={`product-preview product-visual ${large ? 'large' : ''}`}>
        <button
          className="product-visual-trigger"
          onClick={() => setOpen(true)}
          aria-label={`${screen.title} görselini büyüt`}
        >
          <img
            src={image}
            alt={screen.alt}
            width="1280"
            height="720"
            decoding="async"
            loading={large ? 'lazy' : 'eager'}
          />
          <span className="product-visual-expand">
            <Expand size={16} /> Ekranı büyüt
          </span>
        </button>
      </div>
      <dialog
        ref={dialog}
        className="product-visual-dialog"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        aria-label={`${screen.title} ürün görseli`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="product-visual-dialog-heading">
          <b>{screen.title}</b>
          <button aria-label="Görseli kapat" onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <img src={image} alt={screen.alt} width="1280" height="720" />
        <p>SenseHR gerçek ürün ekranı · Demo şirket verileri</p>
      </dialog>
    </>
  );
}

export function ProductGallery() {
  const [selected, setSelected] = useState('leave');
  return (
    <section
      className="product-gallery section"
      id="urun-ekranlari"
      aria-labelledby="product-gallery-title"
    >
      <div className="container">
        <div className="section-title center">
          <span className="eyebrow">ÜRÜNÜ YAKINDAN KEŞFEDİN</span>
          <h2 id="product-gallery-title">
            Bir platform.
            <br />
            <span>Günün her adımı.</span>
          </h2>
          <p>Çalışan kaydından onaya, SenseHR ekranlarını keşfedin.</p>
        </div>
        <div className="product-gallery-tabs" role="group" aria-label="Ürün ekranını seçin">
          {Object.entries(screens).map(([key, screen]) => (
            <button key={key} aria-pressed={selected === key} onClick={() => setSelected(key)}>
              {screen.title}
            </button>
          ))}
        </div>
        <div className="product-gallery-stage">
          <ProductPreview selected={selected} large />
        </div>
        <div className="product-gallery-caption">
          <span>SenseHR web ekranları · Demo şirket verileri</span>
          <a className="text-link" href="/demo-talebi">
            Kendi ekibinizle deneyin <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
