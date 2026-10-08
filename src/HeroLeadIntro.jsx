import React, { useId, useState } from 'react';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import './hero-reference.css';

export function HeroLeadIntro({ catalog }) {
  const id = useId();
  const [email, setEmail] = useState('');

  function continueDemo(event) {
    event.preventDefault();
    const params = new URLSearchParams({ eposta: email.trim() });
    ['employee', 'payroll', 'leave'].forEach((key) =>
      params.append('modul', key),
    );
    window.location.assign(`/demo-talebi?${params}`);
  }

  return (
    <div className="hero-reference-intro">
      <h1>Siz insana odaklanın. Biz teknolojiyi yönetelim.</h1>
      <p>
        SenseIK; İK, PDKS, performans yönetimi, bordro ve çalışan deneyimini tek
        platformda birleştirir — ekipleriniz süreçlerle değil, insanla
        ilgilensin.
      </p>
      <form
        className="hero-reference-form"
        onSubmit={continueDemo}
        aria-label="Demo başvurusuna başlayın"
      >
        <label className="hero-reference-email" htmlFor={`${id}-email`}>
          <span className="hero-reference-sr">Şirket e-postanız</span>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Şirket E-postanız"
            maxLength={254}
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <button type="submit">Ücretsiz Demo için Başvur</button>
      </form>
      <a className="hero-reference-support" href="/destek">
        Destek Talebi İçin Tıklayın <ArrowRight size={15} aria-hidden="true" />
      </a>
      <div className="hero-reference-contact">
        <a
          className="hero-reference-phone"
          href="/iletisim"
          aria-label="İletişim sayfasını aç"
        >
          <Phone size={24} aria-hidden="true" />
        </a>
        <a
          className="hero-reference-message"
          href={catalog.whatsappUrl || '/destek'}
          target={catalog.whatsappUrl ? '_blank' : undefined}
          rel={catalog.whatsappUrl ? 'noopener noreferrer' : undefined}
          aria-label={
            catalog.whatsappUrl
              ? 'WhatsApp’tan yaz (yeni sekmede açılır)'
              : 'Destek talebi oluşturun'
          }
        >
          <MessageCircle size={24} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
