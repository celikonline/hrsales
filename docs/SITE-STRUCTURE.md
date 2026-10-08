# SenseIK sayfa yapısı ve referans eşlemesi

8 Ekim 2026 tarihinde Idenfit'in ana sayfası, üst menüleri, footer bağlantıları ve Keşfet kaynakları incelendi. Bilgi mimarisi SenseIK/SenseHR ürününe uyarlandı. Faturaport'un mor/turkuaz yaklaşımı ve kullandığı Zalando Sans font ailesi temel alındı. Metinler ve PDF kapakları SenseIK için özgün olarak hazırlandı. Kolay İK'nın kaydırıldıkça ürünü gösteren anlatımı bordro ve izin odağıyla uyarlandı; görseller SenseHR'ın gerçek demo web ve mobil ekranlarından alınır.

| Referans yapısı                                                            | SenseIK karşılığı                                                                                                                      |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Ürünler: çalışan, iş gücü, yetenek, donanım grupları                       | Dört gruplu geniş menü; `/urunler`, 12 lisans modülü ve `/cozumler/` altında 24 konu sayfası                                           |
| Özlük, takvim, doküman, masraf, eğitim, zimmet, mesaj, not, servis, sağlık | Çalışan yönetimi grubundaki 10 çözüm; ilgili SenseHR modülüne ve ön seçili demo talebine bağlantı                                      |
| PDKS, puantaj, izin, bordro                                                | İş gücü yönetimi grubundaki dört çözüm                                                                                                 |
| Onboarding, offboarding, deneyim, anket, performans/OKR, ATS               | Yetenek yönetimi grubundaki altı çözüm                                                                                                 |
| Entegre cihaz, biyometri, RFID, turnike                                    | Donanım yönetimi grubundaki dört keşif sayfası; `/donanim` ve `/entegrasyonlar`                                                        |
| Neden Idenfit ve fiyatlar                                                  | `/neden-senseik`, `/fiyatlar`, modül karşılaştırması, üç paket ve teklif akışı                                                         |
| 12 sektör                                                                  | `/sektorler` ve 12 sektörün ihtiyaç/modül sayfaları                                                                                    |
| Müşteri hikâyeleri                                                         | `/musteriler` ve ana sayfada üç etkileşimli örnek senaryo                                                                              |
| Kurumsal, hakkında, iletişim, SSS, güvenlik                                | `/hakkimizda`, `/iletisim`, `/sss`, `/guvenlik`, `/destek`                                                                             |
| Keşfet: blog ve olgunluk testi                                             | `/kesfet`, `/blog`, dört makale; `/ik-olgunluk-testi`, sekiz soru, skor, öncelik önerileri ve 90 günlük rehber indirmesi               |
| Sekiz hesaplama aracı                                                      | `/hesaplama-araclari` ve sekiz ayrı form/sonuç sayfası                                                                                 |
| Beş rapor                                                                  | `/raporlar`, beş okuma sayfası ve `/rehberler/senseik-*.pdf` indirmeleri                                                               |
| Ana sayfa paneli ve ürün sekmeleri                                         | Gerçek SenseHR web ve mobil ekranları; kaydırma ile bordro, izin, çalışan ve göstergeler; büyütülebilir görseller ve demo bağlantıları |
| Verimlilik soruları, PDKS donanımı ve partner bölümleri                    | Beş operasyon sorusu; modüller arası bağlantı kartları; cihaz/entegrasyon keşif sayfaları                                              |
| Bulut ve kalite standartları                                               | Rol, şirket, lisans ve erişim açıklamaları                                                                                             |
| Sunum talebi ve giriş                                                      | `/demo-talebi`, `/giris`, yönetici onayı ve gerçek SenseHR daveti                                                                      |
| Alt bilgi ve KVKK                                                          | Ürün, sektör, kaynak, kurumsal bağlantılar; `/gizlilik` ve onaylı üretim metni yapılandırması                                          |

24 alt çözüm sayfası ihtiyaç keşfi ve önerilen akışı anlatır. Referanstaki bir özellik veya cihazın SenseHR'da desteklendiği otomatik varsayılmaz. Kullanılabilirlik, özel entegrasyon ve cihaz uyumluluğu demo ve teklif kapsamında doğrulanır. Başarı oranları, ISO/GDPR rozetleri, mağaza ve telefon bağlantıları için SenseIK'e ait doğrulanmış karşılıklar henüz yok.

## Online sunum talebi ve firma logoları

`/online-sunum-talep-et` (alternatif: `/online-sunum-talebi`) şirket e-postası ve firma adıyla başlayan iki adımlı bir formdur. İkinci adımda iletişim bilgileri, çalışan sayısı, modül tercihleri ve aydınlatma onayı alınır. Sunum talepleri mevcut kalıcı başvuru ve bildirim akışında `requestType: presentation` olarak saklanır; yönetici listesinde ve detayda türü görünür. Aynı e-posta hem demo hem sunum talebi bırakabilir; aynı türde tekrarlı başvuru bildirimleri çoğaltmaz. Talep alınması toplantı rezervasyonu veya otomatik demo erişimi oluşturmaz; görüşme zamanı iletişim kurularak belirlenir.

Kullanıcının isteğiyle [Idenfit online sunum sayfasındaki](https://idenfit.com/online-sunum-talep-et/) 14 marka logosu ana sayfa ve sunum sayfasına eklenmiştir. Kaynak SVG dosyaları `public/images/reference-brands/` altında tutulur. Sayfada kaynak belirtilir ve logoların SenseIK müşteri listesini temsil etmediği açıklanır. Idenfit'in “1.000’den fazla müşteri” iddiası SenseIK'e aktarılmaz.

## Rehberler

`node scripts/download-references.mjs` beş referans PDF'yi inceleme amacıyla ignored `artifacts/references/` altına indirir, URL ve SHA-256 kaydını tutar. Bu dosyalar siteye veya GitHub'a yayınlanmaz. SenseIK için aynı genel konularda bağımsız uygulama rehberleri hazırlanmıştır:

1. İzin sonrası güçlü bir başlangıç.
2. Farklı kuşaklar, ortak çalışma dili.
3. İşe alımda ölçülebilir kararlar.
4. Dijital İK için 90 günlük yol haritası.
5. İK stratejisini iş planına bağlayın.

Her biri kapak, üç bölüm, uygulanabilir kontrol listeleri, çalışma alanı ve sonraki adım sayfasıyla altı sayfadır. Yeniden üretim: `python scripts/build-reports.py` (ReportLab gerekir). Kaynak metin: `shared/content.js`. Orijinal PDF görselleri, tabloları ve uzun metinleri yeniden yayınlanmaz.

## Hesaplamalar

Fazla mesai, gelir vergisi, işveren maliyeti, kıdem, maaş zammı, kurumlar vergisi, yemek bütçesi ve ihbar. Formüller `shared/calculators.js` içinde bağımsız olarak uygulanır. 2026 parametreleri GİB, SGK ve ÇSGB resmî kaynaklarıyla kontrol edildi; sürüm ve bağlantılar sonuç ekranında görünür. Kıdem ve ihbar araçları 2026 dışındaki çıkış tarihlerini reddeder. İstisnalar ve kapsam dışındaki durumlar her araçta ayrıca açıklanır. Nihai bordro veya beyanname yerine belirtilen varsayımlarla senaryo sonucu üretilir.

Girdiler ve olgunluk testi yanıtları tarayıcıda işlenir; sunucuya veya üçüncü tarafa gönderilmez. Olgunluk testinin kişisel öncelikleri sonuç ekranında görünür; PDF bağlantısı genel 90 günlük uygulama rehberini indirir.

## Yerel adresler

Satış: `http://localhost:4173`, SenseHR: `http://localhost:13010`, yerel e-posta: `http://localhost:18026`. Gerçek müşteri açılışı yönetici onayına bağlıdır. Docker ayrıntıları kök README ve entegrasyon belgesindedir.
