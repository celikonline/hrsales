import React, { useState } from "react";
import {
  LayoutDashboard,
  ReceiptText,
  CalendarDays,
  Users,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
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

export function HeroProductSlider() {
  const [active, setActive] = useState(0);
  const slide = slides[active];
  const move = (step) =>
    setActive((current) => (current + step + slides.length) % slides.length);

  return (
    <div
      className="hero-product-slider"
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
      <div
        className="hero-product"
        id="hero-product-slide"
        role="group"
        aria-roledescription="slayt"
        aria-label={`${active + 1} / ${slides.length} · ${slide.title}`}
      >
        <ProductPreview selected={slide.key} />
        <img
          className="hero-device-phone"
          src={`/images/product/mobile-${slide.mobile}.jpg`}
          alt={`SenseHR gerçek mobil ${slide.mobile === "leave" ? "izin talebi" : slide.mobile === "approvals" ? "onaylar" : "ana ekranı"} · Demo veriler`}
          width="540"
          height="1170"
          decoding="async"
        />
      </div>
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
          aria-live="polite"
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
      </div>
      <div className="product-caption">
        <span className="tiny-dot" /> Gerçek ürün ekranları · Demo veriler
      </div>
    </div>
  );
}
