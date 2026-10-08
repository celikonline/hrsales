import React, { useId, useRef, useState, useEffect } from 'react';
import { ArrowUpRight, Check, CircleAlert, MailCheck } from 'lucide-react';
import './quick-demo.css';
import { WhatsAppLink } from './WhatsAppLink.jsx';

export function QuickDemoForm({ catalog, modules = [], plan = 'growth', hero = false, initialEmail = '' }) {
  const id = useId();
  const inputRef = useRef(null);
  const phoneRef = useRef(null);
  const feedbackRef = useRef(null);
  const submitting = useRef(false);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (sent || error) feedbackRef.current?.focus();
  }, [sent, error]);

  function validateEmail() {
    const valid = inputRef.current?.validity.valid;
    setFieldError(valid ? '' : 'Geçerli bir şirket e-posta adresi girin.');
    return valid;
  }

  function validatePhone() {
    const digits = phone.replace(/\D/g, '').length;
    const valid = phoneRef.current?.validity.valid && digits >= 10 && digits <= 15;
    setPhoneError(valid ? '' : 'Geçerli bir telefon numarası girin. Örn. 0555 123 45 67.');
    return valid;
  }

  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const emailValid = validateEmail();
    const phoneValid = validatePhone();
    if (!emailValid || !phoneValid) {
      (emailValid ? phoneRef : inputRef).current?.focus();
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/demo-requests/quick', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim(),
          privacyAccepted: true,
          website,
          plan,
          ...(modules.length ? { modules } : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Talebiniz gönderilemedi. Tekrar deneyin.');
      setSent(true);
    } catch (failure) {
      setError(
        failure.message === 'Failed to fetch'
          ? 'Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.'
          : failure.message,
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <div className={`quick-demo ${hero ? 'quick-demo--hero' : ''}`}>
      {sent ? (
        <div className="quick-demo-success" role="status" tabIndex={-1} ref={feedbackRef}>
          <MailCheck size={28} aria-hidden="true" />
          <div>
            <strong>Demo talebiniz alındı.</strong>
            <p>
              Ekibimiz <b>{email.trim()}</b> adresinden veya <b>{phone.trim()}</b> numarasından
              sizinle iletişime geçecek.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate aria-label="Ücretsiz demo talebi" aria-busy={busy}>
          <div className="quick-demo-row">
            <label htmlFor={`${id}-email`} className="quick-demo-field">
              <span>Şirket e-postanız</span>
              <input
                ref={inputRef}
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="siz@sirketiniz.com"
                required
                maxLength={254}
                disabled={busy}
                value={email}
                aria-invalid={!!fieldError}
                aria-describedby={`${id}-privacy${fieldError ? ` ${id}-error` : ''}`}
                onBlur={validateEmail}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFieldError('');
                }}
              />
            </label>
            <label htmlFor={`${id}-phone`} className="quick-demo-field">
              <span>Telefon numaranız</span>
              <input
                ref={phoneRef}
                id={`${id}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="0555 123 45 67"
                required
                pattern={'[+0-9 \\(\\)\\-]{10,25}'}
                maxLength={25}
                disabled={busy}
                value={phone}
                aria-invalid={!!phoneError}
                aria-describedby={`${id}-privacy${phoneError ? ` ${id}-phone-error` : ''}`}
                onBlur={validatePhone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setPhoneError('');
                }}
              />
            </label>
            <button className="button" type="submit" disabled={busy}>
              {busy ? 'Gönderiliyor…' : 'Ücretsiz demo için başvur'}
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          </div>
          {fieldError && (
            <p id={`${id}-error`} className="quick-demo-error" role="alert">
              {fieldError}
            </p>
          )}
          {phoneError && (
            <p id={`${id}-phone-error`} className="quick-demo-error" role="alert">
              {phoneError}
            </p>
          )}
          <div className="honeypot" aria-hidden="true">
            <label>
              Web sitesi
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </label>
          </div>
          <p className="quick-demo-privacy" id={`${id}-privacy`}>
            Başvurarak{' '}
            <a href={catalog.privacyUrl} target="_blank" rel="noreferrer">
              gizlilik ve aydınlatma metnini
            </a>{' '}
            okuduğunuzu ve demo talebiniz için sizinle iletişime geçileceğini kabul edersiniz.
          </p>
          {error && (
            <div className="quick-demo-error" role="alert" tabIndex={-1} ref={feedbackRef}>
              <CircleAlert size={18} aria-hidden="true" /> {error}
            </div>
          )}
        </form>
      )}
      <div className="quick-demo-assurance">
        <Check size={16} aria-hidden="true" /> Ücretsiz demo · Kredi kartı gerekmez
      </div>
      <WhatsAppLink catalog={catalog} />
    </div>
  );
}
