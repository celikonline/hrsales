import React, { useEffect, useRef, useState } from "react";
import { Expand, X, ArrowUpRight } from "lucide-react";
import {
  productScreens as screens,
  galleryScreenKeys,
  moduleScreenKeys,
} from "../shared/product-screens.js";
import "./product-visual.css";

export function ProductPreview({ selected = "overview", large = false }) {
  const selectedKey = moduleScreenKeys[selected] || selected;
  const key = screens[selectedKey] ? selectedKey : "overview";
  const screen = screens[key];
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const image = `/images/product/web-${key}.jpg?v=20261008-seeded-v4`;
  useEffect(() => {
    if (open && !dialog.current.open) dialog.current.showModal();
    else if (!open && dialog.current.open) dialog.current.close();
  }, [open]);
  return (
    <>
      <div className={`product-preview product-visual ${large ? "large" : ""}`}>
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
            loading={large ? "lazy" : "eager"}
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
  const [selected, setSelected] = useState("leave");
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
        <div
          className="product-gallery-tabs"
          role="group"
          aria-label="Ürün ekranını seçin"
        >
          {galleryScreenKeys.map((key) => (
            <button
              key={key}
              aria-pressed={selected === key}
              onClick={() => setSelected(key)}
            >
              {screens[key].title}
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
