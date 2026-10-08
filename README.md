# SenseIK — Satış, demo ve lisans platformu

SenseIK pazarlama sitesi, demo başvurusu, yönetici onayı, süreli erişim, satın alma talebi ve paket lisans yönetimi. Mevcut SenseHR ürününün bağlantısı `integrations/sensehr` altında paketlenmiştir.

## Çalıştırma

Node.js 24+ gerekir (yerleşik SQLite kullanılır).

```powershell
npm ci --ignore-scripts
Copy-Item .env.example .env
npm run dev
```

Site: http://localhost:4173 · Başvuru: `/demo-talebi` · Yönetim: `/admin` · Demo: `/demo`.

İlk yerel çalıştırmada rastgele yönetici bilgileri `data/dev-admin-credentials.json` dosyasına yazılır. Dosya Git'e alınmaz. Yönetici bilgileri oluşturulana kadar ortak/sabit parola yoktur.

Üretim parolası için `npm run admin:password -- "en-az-12-karakterli-parolanız"` çıktısını `.env` içindeki `ADMIN_PASSWORD_HASH` alanına ekleyin. `.env` ve `data/` hassastır; depoya eklemeyin.

## Mevcut akışlar

- Demo başvurusu: şirket, yetkili, e-posta, telefon, **tam çalışan sayısı**, paket ve modül tercihleri. Sunucu doğrulaması ve zorunlu aydınlatma kaydı.
- Yönetici: başvuru inceleme, kapsam ve süre seçerek onay, gerekçeli ret, davet yenileme, erişim iptali, arama ve durum filtresi.
- E-posta: müşteri başvuru bildirimi, yönetici bildirimi, onay daveti ve teklif/lisans bildirimleri. SQLite outbox, yeniden deneme ve başarısız kayıtların takibi. SMTP yoksa **gönderilmiş sayılmaz**; yerel panelden içerik incelenebilir.
- Demo: yalnız yönetici onayı sonrası tek kullanımlık e-posta bağlantısı. Token URL fragment'inde taşınır; sunucuda hash saklanır. HttpOnly/SameSite oturum. Süre ve iptal her istekte denetlenir.
- Satın alma: müşteri paket, dönem ve fatura bilgileriyle talep açar. Yönetici dönem bedeli, vergi ve ödeme bilgilerini içeren teklif verir. **Banka/ödeme referansı ve ödeme teyidi olmadan lisans açılmaz.** Karttan tahsilat entegrasyonu yoktur; manuel ödeme teyidi uygulanır.
- Paketler: Başlangıç, Büyüme, Kurumsal; çalışan kapasitesi ve modül kapsamı. Henüz onaylanmış ticari fiyat olmadığı için varsayılan olarak “Size özel teklif” gösterilir. `PRICE_*` tanımlandığında çalışan başına aylık bedelle hesaplanır; yıllık toplam 12 ay üzerinden hesaplanır.
- Denetim: başvuru, giriş, onay, ret, teklif ve lisans işlemleri kayıt altına alınır.

## Yerel satış demosu ve gerçek SenseHR

`PRODUCT_MODE=sandbox`: bu depoda çalışan, açıkça örnek verili olarak işaretlenmiş satış demosudur. Örnek çalışanları, izin ve masraf onaylarını ve lisansa geçişi deneyebilirsiniz. Diğer modüllerin kapsam kartları görünür; bu ortam tam İK ürünü değildir.

`PRODUCT_MODE=sensehr`: platform servis hesabı ile mevcut SenseHR API'sine bağlanır. Onay, şirkete özel kiracı/Owner daveti ve ticari yetki oluşturur. Kullanıcı e-postadaki bağlantıdan davetine ulaşır ve SenseHR'da kendi parolasını belirler. Mevcut ürünün modülleri kullanılır. Her şirket ayrı hesaptadır; ortak demo hesabı paylaşılmaz.

Ürün kurulumunun ilk şirket sihirbazı korunur; gerçek tenant'a başka müşterinin veya ortak demo tenant'ının verisi kopyalanmaz. Yerel örnek veri sandbox'tadır.

Kurulum: [SenseHR entegrasyonu](integrations/sensehr/README.md).

## Üretime geçiş

`npm run build` ardından `npm start`. Üretim HTTPS adresi, kalıcı veri dizini, yönetici parola hash'i, SMTP ve bildirim adresi, onaylı gizlilik URL'si ve gerçek SenseHR bağlantısı gerektirir; eksik yapılandırma ile süreç başlamaz. `.env.example` tüm alanları içerir.

Node sunucusunu bir HTTPS reverse proxy arkasında çalıştırın. SQLite/outbox ve işlem kilitleri için **tek uygulama örneği** kullanın. Çoklu sunucuya geçişte PostgreSQL ve dağıtık iş kuyruğu gerekir. Reverse proxy kullanırken IP limitleri için güvenilen proxy ayarını kendi topolojinize göre uygulayın; varsayılan doğrudan bağlantıyı sınırlar.

Üretimde yerel e-posta önizlemesi kapalıdır. SMTP gönderildikten sonra kuyruk mesajının gövdesi temizlenir. Veri saklama/imha süreleri kurum politikasıyla netleştirilmelidir. SQLite dosyasını yedekleyin ve erişimini servis kullanıcısıyla sınırlayın.

Henüz yapılandırılmayanlar: gerçek SMTP hesabı ve yöneticinin bildirim adresi, kesin paket fiyatları, onaylı aydınlatma metni, canlı alan adı ve ödeme sağlayıcısı. Bunlar olmadan canlı müşterilere açılmış veya tahsilat yapıyor sayılmaz.

## Kontroller

```powershell
npm run check
npm audit
```

API testleri izole, bellek içi SQLite üzerinde çalışır. Gerçek e-posta veya ödeme göndermez. Testler başvuru, kimlik doğrulama, CSRF, onay, tek kullanımlık token, süre, iptal, modül erişimi ve lisans aktivasyonu koşullarını doğrular.

Ürün planı: [docs/PRODUCT-PLAN.md](docs/PRODUCT-PLAN.md).

Tasarım referansları: [İdenfit](https://idenfit.com/) ürün/modül ve demo yönlendirme yapısı; [Faturaport](https://faturaport.com/) mor/lacivert ve turkuaz renk yaklaşımı. Metin, logo ve ürün temsilleri SenseIK/SenseHR için hazırlanmıştır; üçüncü taraf müşteri referansı veya sertifika iddiası kullanılmaz.
