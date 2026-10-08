# Doğrulama — 8 Ekim 2026

Başarılı kontroller:

- Satış platformu: 15 API/SMTP/ürün adaptörü testi; `npm run check` ve Vite üretim derlemesi.
- npm bağımlılık denetimi: 0 güvenlik açığı.
- SenseHR: `Sense.Api` ve Employee Infrastructure derlemesi, 0 hata/uyarı.
- SenseHR Identity: 267 birim testi; yeni 7 lisans testi bu toplamın içindedir.
- SenseHR frontend: mevcut TypeScript derleyicisi ile `tsc --noEmit` başarılı.
- Entegrasyon yaması: yerel ürün checkout'unda `git apply --reverse --check` başarılı; yalnız görev dosyaları paketlendi.
- Tarayıcı: üç adımlı başvuru → yönetici panelindeki kayıt → kapsam/süre onayı → e-posta önizlemesindeki tek kullanımlık davet → demo çalışma alanı. Masaüstü ve 390 px mobil görünüm incelendi; yatay taşma yok.

Bu kontrollerde gerçek müşteriye e-posta veya ödeme gönderilmedi. SMTP teslimatı yerel test SMTP sunucusuyla; ürün adaptörü HTTP sözleşmesi yerel test ürün servisiyle sınandı. Yapılandırılmış gerçek SMTP hesabı ve çalışan SenseHR servisleriyle canlı entegrasyon testi yapılmadı.

PostgreSQL üzerinde çalışan kapasitesi/eşzamanlılık entegrasyon testi yapılmadı: Docker Desktop Linux engine erişilebilir değildi. Kapasite korumasının kaynak kodu derlendi; canlıya geçmeden gerçek DB üzerinde doğrulanmalıdır.

Mevcut SenseHR test projeleri test çalıştırmasında Azure.Identity 1.3.0 ve System.Drawing.Common 5.0.0 için güvenlik uyarıları üretti. Bu eski test bağımlılıklarının güncellenmesi ayrı ürün bakımı gerektirir; satış platformunun npm denetimi temizdir.
