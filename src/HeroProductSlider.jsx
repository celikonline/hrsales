import React, { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  ReceiptText,
  CalendarDays,
  Users,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { ProductPreview } from "./ProductVisual.jsx";
import "./hero-product-slider.css";

const slides = [
  {
    key: "overview",
    title: "İK genel bakış",
    icon: LayoutDashboard,
    mobile: "home",
  },
  {
    key: "payroll",
    title: "Bordro & ücret",
    icon: ReceiptText,
    mobile: "home",
  },
  { key: "leave", title: "İzin & onay", icon: CalendarDays, mobile: "leave" },
  {
    key: "employee",
    title: "Çalışan bilgisi",
    icon: Users,
    mobile: "approvals",
  },
  {
    key: "reporting",
    title: "İK göstergeleri",
    icon: ChartNoAxesCombined,
    mobile: "home",
  },
];

export function HeroProductSlider({ referenceLayout = false }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const root = useRef(null);
  const slide = slides[active];
  const move = (step) =>
    setActive((current) => (current + step + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      if (document.hidden || root.current?.querySelector("dialog[open]"))
        return;
      setActive((current) => (current + 1) % slides.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [active, paused]);

  const slideTabs = (
    <div
      className="hero-slide-tabs"
      role="group"
      aria-label="Ürün slaytını seçin"
    >
      {slides.map(({ key, title, icon: Icon }, index) => (
        <button
          type="button"
          key={key}
          aria-pressed={active === index}
          aria-controls="hero-product-slide"
          onClick={() => setActive(index)}
        >
          <Icon size={18} aria-hidden="true" /> {title}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className="hero-product-slider"
      ref={root}
      role="region"
      aria-roledescription="slayt gösterisi"
      aria-label="SenseHR ürün ekranları"
      onKeyDown={(event) => {
        if (event.target.closest("dialog")) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      {!referenceLayout && slideTabs}
      <div
        className="hero-product"
        id="hero-product-slide"
        role="group"
        aria-roledescription="slayt"
        aria-label={`${active + 1} / ${slides.length} · ${slide.title}`}
      >
        {referenceLayout ? (
          <div className="hero-reference-browser">
            <div className="hero-reference-browser-bar" aria-hidden="true">
              <span className="hero-reference-browser-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="hero-reference-browser-address">
                SenseHR çalışma alanı
              </span>
            </div>
            <ProductPreview selected={slide.key} />
          </div>
        ) : (
          <>
            <ProductPreview selected={slide.key} />
            <img
              className="hero-device-phone"
              src={`/images/product/mobile-${slide.mobile}.jpg`}
              alt={`SenseHR gerçek mobil ${slide.mobile === "leave" ? "izin talebi" : slide.mobile === "approvals" ? "onaylar" : "ana ekranı"} · Demo veriler`}
              width="540"
              height="1170"
              decoding="async"
            />
          </>
        )}
      </div>
      {referenceLayout && slideTabs}
      <div className="hero-slide-controls">
        <button
          type="button"
          className="hero-slide-arrow"
          aria-label="Önceki ürün slaytı"
          onClick={() => move(-1)}
        >
          <ChevronLeft size={21} aria-hidden="true" />
        </button>
        <div
          className="hero-slide-status"
          aria-live={paused ? "polite" : "off"}
          aria-atomic="true"
        >
          <strong>{slide.title}</strong>
          <span>
            {active + 1} / {slides.length}
          </span>
        </div>
        <button
          type="button"
          className="hero-slide-arrow"
          aria-label="Sonraki ürün slaytı"
          onClick={() => move(1)}
        >
          <ChevronRight size={21} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="hero-slide-arrow hero-slide-playback"
          aria-label={
            paused ? "Slaytları otomatik oynat" : "Slaytları duraklat"
          }
          onClick={() => setPaused((current) => !current)}
        >
          {paused ? (
            <Play size={18} aria-hidden="true" />
          ) : (
            <Pause size={18} aria-hidden="true" />
          )}
        </button>
      </div>
      <div className="product-caption">
        <span className="tiny-dot" /> Gerçek ürün ekranları · Demo veriler
      </div>
    </div>
  );
}
