import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck2,
  Check,
  Layers3,
  LockKeyhole,
  MailCheck,
  MonitorSmartphone,
} from 'lucide-react';
import { ReferenceBrands } from './ReferenceBrands.jsx';
import './presentation-request.css';

export function PresentationRequest({ catalog, api }) {
  const params = new URLSearchParams(location.search);
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const heading = useRef(null);
  const [form, setForm] = useState(() => ({
    requestType: 'presentation',
    email: '',
    company: '',
    fullName: '',
    phone: '',
    employees: '',
    modules: [
      ...new Set([
        'employee',
        ...params.getAll('modul').filter((key) => catalog.modules.some((m) => m.key === key)),
      ]),
    ],
    plan: catalog.plans.some((p) => p.key === params.get('paket')) ? params.get('paket') : 'growth',
    notes: '',
    privacyAccepted: false,
    website: '',
  }));
  useEffect(() => {
    document.title = 'Online sunum talep et | SenseIK';
  }, []);
  useEffect(() => {
    heading.current?.focus();
  }, [step, sent]);
  const change = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: '' }));
  };
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError('');
    if (step === 1) {
      setStep(2);
      return;
    }
    setBusy(true);
    setFieldErrors({});
    try {
      await api('/demo-requests', {
        ...form,
        employees: Number(form.employees),
      });
      setSent(true);
    } catch (failure) {
      const errors = Object.fromEntries(
        (failure.fields || []).map((field) => [field.path.split('.')[0], field.message]),
      );
      setFieldErrors(errors);
      setError(
        failure.fields
          ? 'Lütfen işaretli bilgileri kontrol edip talebinizi tekrar gönderin.'
          : failure.message,
      );
      if (errors.email || errors.company) setStep(1);
    } finally {
      setBusy(false);
    }
  }
  const input = (key, label, options = {}) => (
    <label className="field" htmlFor={`presentation-${key}`}>
      <span>{label}</span>
      <input
        id={`presentation-${key}`}
        name={key}
        required
        {...options}
        value={form[key]}
        onChange={(event) => change(key, event.target.value)}
        aria-invalid={Boolean(fieldErrors[key])}
        aria-describedby={fieldErrors[key] ? `presentation-${key}-error` : undefined}
      />
      {fieldErrors[key] && (
        <small className="field-error" id={`presentation-${key}-error`}>
          {fieldErrors[key]}
        </small>
      )}
    </label>
  );
  return (
    <main>
      <div className="presentation-page container">
        <a className="back-link" href="/">
          <ArrowLeft size={16} /> Ana sayfa
        </a>
        <div className="presentation-layout">
          <aside className="presentation-aside">
            <span className="eyebrow">SİZE ÖZEL ONLINE SUNUM</span>
            <h1>
              Ekibinizin ihtiyacını konuşalım.
              <br />
              <span>SenseHR’ı birlikte keşfedelim.</span>
            </h1>
            <p>
              İzin, bordro ve çalışan yönetiminde neleri kolaylaştırabileceğinizi, size özel bir
              online görüşmede gösterelim.
            </p>
            <div className="presentation-agenda">
              <div>
                <MonitorSmartphone size={24} />
                <span>
                  <b>Canlı ürün anlatımı</b>
                  <small>Web ve mobil deneyimi birlikte inceleyin.</small>
                </span>
              </div>
              <div>
                <Layers3 size={24} />
                <span>
                  <b>İhtiyacınıza uygun modüller</b>
                  <small>Ekibinizin öncelikleri üzerinden ilerleyelim.</small>
                </span>
              </div>
              <div>
                <CalendarCheck2 size={24} />
                <span>
                  <b>Size uygun bir zaman</b>
                  <small>Görüşme gününü birlikte belirleyelim.</small>
                </span>
              </div>
            </div>
            <p className="presentation-assurance">
              <Check size={18} /> Ücretsiz sunum · Satın alma zorunluluğu yok
            </p>
          </aside>
          <section className="form-card presentation-card" aria-labelledby="presentation-title">
            {sent ? (
              <div className="success-screen" role="status">
                <span className="success-icon">
                  <MailCheck size={40} />
                </span>
                <h2 id="presentation-title" ref={heading} tabIndex={-1}>
                  Online sunum talebiniz alındı.
                </h2>
                <p>
                  <b>{form.company}</b> için görüşmeyi planlamak üzere <b>{form.email}</b>{' '}
                  adresinden sizinle iletişime geçeceğiz.
                </p>
                <p>Sunumun günü ve saati birlikte belirlenecek.</p>
                <a className="button" href="/">
                  Ana sayfaya dön <ArrowRight size={17} />
                </a>
              </div>
            ) : (
              <>
                <div className="form-progress">
                  <span>ONLINE SUNUM TALEBİ</span>
                  <b>Adım {step} / 2</b>
                </div>
                <div className="progress-bars" aria-hidden="true">
                  <span className="filled" />
                  <span className={step === 2 ? 'filled' : ''} />
                </div>
                <h2 id="presentation-title" ref={heading} tabIndex={-1}>
                  {step === 1 ? 'Önce şirketinizi tanıyalım.' : 'Sunumu size göre hazırlayalım.'}
                </h2>
                <p className="form-intro">
                  {step === 1
                    ? 'Şirket e-postanızı ve firma adınızı paylaşarak başlayın.'
                    : 'İletişim bilgilerinizi ve görmek istediğiniz modülleri paylaşın.'}
                </p>
                <form onSubmit={submit} aria-busy={busy}>
                  <div className="honeypot" aria-hidden="true">
                    <label>
                      Web sitesi
                      <input
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={(event) => change('website', event.target.value)}
                      />
                    </label>
                  </div>
                  {step === 1 ? (
                    <>
                      {input('email', 'Şirket e-postanız', {
                        type: 'email',
                        autoComplete: 'email',
                        maxLength: 254,
                        placeholder: 'ad@firma.com',
                      })}
                      {input('company', 'Firmanızın adı', {
                        autoComplete: 'organization',
                        minLength: 2,
                        maxLength: 200,
                        placeholder: 'Firma adınız',
                      })}
                    </>
                  ) : (
                    <>
                      <div className="presentation-company">
                        <b>{form.company}</b>
                        <span>{form.email}</span>
                      </div>
                      {input('fullName', 'Ad soyad', {
                        autoComplete: 'name',
                        minLength: 3,
                        maxLength: 100,
                        placeholder: 'Adınız ve soyadınız',
                      })}
                      <div className="form-two">
                        {input('phone', 'Telefon', {
                          type: 'tel',
                          autoComplete: 'tel',
                          pattern: '[+0-9 \\(\\)\\-]{10,25}',
                          placeholder: '05xx xxx xx xx',
                        })}
                        {input('employees', 'Çalışan sayısı', {
                          type: 'number',
                          min: 1,
                          max: 100000,
                          step: 1,
                          placeholder: 'Örn. 50',
                        })}
                      </div>
                      <fieldset className="presentation-modules">
                        <legend>Sunumda neleri görmek istersiniz?</legend>
                        {catalog.modules.map((module) => (
                          <label
                            key={module.key}
                            className={form.modules.includes(module.key) ? 'selected' : ''}
                          >
                            <input
                              type="checkbox"
                              checked={form.modules.includes(module.key)}
                              disabled={module.base}
                              onChange={(event) =>
                                change(
                                  'modules',
                                  event.target.checked
                                    ? [...form.modules, module.key]
                                    : form.modules.filter((key) => key !== module.key),
                                )
                              }
                            />
                            <span>
                              {module.name}
                              {module.base && <small>Temel modül</small>}
                            </span>
                          </label>
                        ))}
                      </fieldset>
                      <label className="field">
                        <span>
                          Öncelikleriniz <small>İsteğe bağlı</small>
                        </span>
                        <textarea
                          rows={3}
                          maxLength={1500}
                          placeholder="Sunumda konuşmak istediğiniz ihtiyaçlarınızı yazın."
                          value={form.notes}
                          onChange={(event) => change('notes', event.target.value)}
                        />
                      </label>
                      <label className="consent">
                        <input
                          type="checkbox"
                          required
                          checked={form.privacyAccepted}
                          onChange={(event) => change('privacyAccepted', event.target.checked)}
                        />
                        <span>
                          <a href={catalog.privacyUrl} target="_blank" rel="noreferrer">
                            Gizlilik ve aydınlatma metnini
                          </a>{' '}
                          okudum. Sunum talebimin değerlendirilmesi ve benimle iletişim kurulması
                          hakkında bilgilendirildim.
                        </span>
                      </label>
                    </>
                  )}
                  {error && (
                    <p className="notice error" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="form-buttons">
                    {step === 2 && (
                      <button
                        type="button"
                        className="button secondary"
                        disabled={busy}
                        onClick={() => {
                          setStep(1);
                          setError('');
                        }}
                      >
                        <ArrowLeft size={17} /> Geri
                      </button>
                    )}
                    <button className="button" type="submit" disabled={busy}>
                      {busy ? 'Gönderiliyor…' : step === 1 ? 'Devam et' : 'Sunum talebini gönder'}
                      <ArrowRight size={17} />
                    </button>
                  </div>
                  <p className="form-footnote">
                    <LockKeyhole size={14} /> Bilgileriniz sunum talebiniz için kullanılır.
                  </p>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
      <ReferenceBrands />
    </main>
  );
}
