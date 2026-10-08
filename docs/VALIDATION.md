# Doğrulama — 8 Ekim 2026

Başarılı kontroller:

- Satış platformu: 24 API/SMTP/ürün adaptörü/hesaplama/PDF testi; `npm run check` ve Vite üretim derlemesi.
- npm bağımlılık denetimi: 0 güvenlik açığı.
- SenseHR: `Sense.Api` ve Employee Infrastructure derlemesi, 0 hata/uyarı.
- SenseHR Identity: ayrı PostgreSQL test sunucusu ile 276 test geçti; kurulum frontend'inde 9 test geçti. Son modül ayarı değişikliği ayrıca ilgili handler testleriyle doğrulandı.
- SenseHR frontend: mevcut TypeScript derleyicisi ile `tsc --noEmit` başarılı.
- Entegrasyon yaması: yerel ürün checkout'unda `git apply --reverse --check` başarılı; 26 görev dosyası paketlendi.
- Docker: satış sitesi, gerçek SenseHR API/web/worker, migrator, PostgreSQL, Redis, MinIO ve Mailpit imajları derlendi; izole `hrsales` yerel yığını çalıştırıldı.
- Gerçek ürün: satış başvurusu → yönetici onayı → tenant/Owner daveti/lisans → Mailpit SMTP → tek kullanımlık satış girişi → ürün daveti kabulü → SenseHR girişi ve lisanslı modüller doğrulandı.
- PostgreSQL kapasitesi: kapasite 1 iken iki eşzamanlı çalışan ekleme isteğinin biri başarılı, diğeri `409 commercial.employee_capacity_exceeded`; kayıt sayısı 1. Test sonunda kapasite 10'a döndürüldü.
- Lisans güvenliği: Owner kapsam dışı zimmet modülünde 403 aldı. Lisans iptalinde mevcut JWT 403 aldı; test sonunda lisans geri açıldı.
- Rehberler: beş gerçek PDF, her biri altı sayfa. Türkçe karakterler ve örnek baskı sayfaları doğrulandı.
- Tarayıcı: sekiz hesaplama aracının varsayılan sonuçları, masaüstü/mobil menüler ve gerçek SenseHR lisans bandı denetlendi.
- Tarayıcı: üç adımlı başvuru → yönetici panelindeki kayıt → kapsam/süre onayı → e-posta önizlemesindeki tek kullanımlık davet → demo çalışma alanı. Masaüstü ve 390 px mobil görünüm incelendi; yatay taşma yok.

Bu kontrollerde gerçek müşteriye e-posta veya ödeme gönderilmedi. SMTP teslimatı yerel Mailpit sunucusuyla, ürün bağlantısı çalışan Docker SenseHR servisleriyle sınandı. Canlı SMTP sağlayıcısının teslim edilebilirliği sınanmadı.

Yerel Docker doğrulaması `node scripts/verify-docker.mjs` ile tekrarlanabilir. Yeni kurgusal test hesabı açar; kimlik bilgileri ignored `data/` altında tutulur. Varsayılan Docker ortamı localhost geliştirme ortamıdır. Ürünün ilk şirket kurulum sihirbazı korunur; müşterinin yeni şirketine ortak demo verisi kopyalanmaz. Canlıya geçişte SMTP, HTTPS, fiyatlar ve onaylı aydınlatma metni yapılandırılmalıdır.

Mevcut SenseHR test projeleri test çalıştırmasında Azure.Identity 1.3.0 ve System.Drawing.Common 5.0.0 için güvenlik uyarıları üretti. Bu eski test bağımlılıklarının güncellenmesi ayrı ürün bakımı gerektirir; satış platformunun npm denetimi temizdir.
