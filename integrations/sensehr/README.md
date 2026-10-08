# SenseHR ürün bağlantısı

Bu yama yerel `senseik` ürün deposunda uygulanmıştır. `commercial.patch` yalnız bu çalışmaya ait dosyaları içerir; mevcut raporlama çalışması, `.claude`, hook, skill, kişisel yapılandırma ve gizli bilgiler dahil değildir. Temel commit ve dosya listesi `manifest.json` içindedir.

Başka bir ürün checkout'unda uygulama:

```powershell
git -C C:/path/to/senseik apply --check C:/path/to/hrsales/integrations/sensehr/commercial.patch
git -C C:/path/to/senseik apply C:/path/to/hrsales/integrations/sensehr/commercial.patch
dotnet build C:/path/to/senseik/src/Sense.Api/Sense.Api.csproj
dotnet test C:/path/to/senseik/tests/Modules/Sense.Modules.Identity.Tests/Sense.Modules.Identity.Tests.csproj --filter FullyQualifiedName~CommercialLicenseTests
```

Yama zaten uygulanmışsa yeniden uygulamayın. `git apply --reverse --check` ile kontrol edebilirsiniz.

## Yapılandırma

Satış sunucusunun `.env` dosyasında:

```dotenv
PRODUCT_MODE=sensehr
SENSEHR_API_URL=https://api.your-product.example/api
SENSEHR_WEB_URL=https://app.your-product.example
SENSEHR_PLATFORM_EMAIL=your-platform-service-account
SENSEHR_PLATFORM_PASSWORD=your-secret
```

Ürünün frontend ortamında `VITE_SALES_URL=https://your-sales.example` tanımlayın. Identity `Frontend` bağlantı ayarındaki adres ürünün gerçek frontend alan adıyla aynı olmalıdır. Gelen davet URL'sinin origin'i satış sunucusunca kontrol edilir.

Servis hesabı platform kiracısında `IsPlatformStaff` ve `platform.tenants.manage` izni gerektirir; sıradan müşteri Owner hesabı yeterli değildir. Bu sürüm mevcut parola/JWT girişini kullanır ve interaktif MFA adımını otomatik tamamlamaz. Servis hesabı politikasına uygun yapılandırmayı kurum belirlemelidir. Üretim kimlik bilgileri repoya konmamalıdır.

## Eklenen ürün uçları

- `POST /api/v1/identity/commercial/provision`: platform JWT ile şirkete özel tenant, Owner ve davet oluşturur; lisans aynı işlemde kaydedilir. Sabit başvuru slug'ı ve referansla tekrar deneme ikinci tenant açmaz. Başvuru sahibinin parolası sistem tarafından atanmaz.
- `POST /api/v1/identity/commercial/{id}/license`: yalnız platform personeli süre, kapasite, paket ve modül kapsamını yönetir. Platform tenant'ı veya ticari olarak yönetilmeyen eski tenant değiştirilemez.
- `GET /api/v1/identity/commercial/mine`: mevcut tenant'ın lisans bağlamı; ürün kabuğunda demo süresi ve paket bağlantısı için kullanılır.

Lisans mevcut `Tenant.SettingsJson` içinde `commercialLicense` anahtarıyla tutulur; migration gerekmez. Eski tenant'ların ticari kapsamı otomatik değiştirilmez. Yeni ticari tenant'larda izin verilen modüller allowlist olarak saklanır.

Login, MFA tamamlama, refresh ve mevcut JWT'yle gelen isteklerde süre/iptal kontrolü uygulanır. Modül filtreleri lisans kapsamını da uygular. Çalışan kapasitesi Employee DbContext'in async kayıt katmanında PostgreSQL transaction/advisory lock ile denetlenir; kapasite korunan tüm çalışan kayıtlarını sayar. Raw SQL veya senkron `SaveChanges` kullanan yeni kodlar bu korumayı ayrıca uygulamalıdır.

Modül ayarı API'si lisans kapsamını ve `isLicensed` alanını döndürür. Kurulum sihirbazı yalnız lisanslı modülleri sunar; ayarlardaki kapsam dışı anahtarlar kilitlidir. Kapsam dışı modülü açan PUT sunucuda reddedilir. Lisansın zorunlu hariç tuttuğu modüller kişisel kapatma tercihi olarak saklanmaz; sonraki paket yükseltmesi bu nedenle engellenmez.

İlk ürün girişinde mevcut şirket kurulum sihirbazı çalışır. Bu sürüm gerçek tenant'a büyük demo seed profili kopyalamaz; kurgusal satış senaryosu `hrsales` sandbox'ındadır. Gerçek şirket verisiyle senaryo doğrulaması canlıya geçişten önce yapılmalıdır.

## Doğrulama kapsamı

Ürün API'si ve Employee persistence derlemesi; lisans okuma/yazma, eski ayar koruma, süre sınırı, iptal, lisanssız modül açma girişimi ve kapsam yükseltme testleri. Gerçek Docker yığınında tenant açılışı, Mailpit SMTP, davet kabulü, ürün girişi, kapsam dışı modülün reddi, mevcut JWT iptali ve PostgreSQL eşzamanlı kapasite koruması doğrulandı. Canlı SMTP sağlayıcısı ve gerçek müşteri senaryosu ayrıca doğrulanmalıdır.

## Yerel Docker yığını

Kök `docker-compose.yml` ürün API/web/worker, migrator, PostgreSQL, Redis, MinIO, Mailpit ve satış sitesini birlikte çalıştırır. `node scripts/setup-docker.mjs` ardından `docker compose --env-file data/docker.env up -d --build` kullanın. Ürün checkout'u varsayılan olarak `../senseik` olur; farklı checkout için ignored `data/docker.env` içindeki `SENSEHR_ROOT` yolunu düzenleyin. Yamanın o checkout'a uygulanmış olması gerekir.

Worker Docker SDK sürümü ürünün `global.json` dosyasıyla uyumlu 10.0.401'e güncellendi. Frontend Docker derlemesi yalnız web çalışma alanı bağımlılıklarını kurar ve `VITE_SALES_URL` değerini alır. Bu değişiklikler `commercial.patch` içinde paketlenmiştir. Tam ürün kaynakları ayrı `senseik` deposundadır; bu satış deposu ürünün tamamını içermez.
