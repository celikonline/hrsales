# SenseIK ticari ürün planı

Tarih: 8 Ekim 2026. Marka: **SenseIK** satış ve pazarlama deneyimi, **SenseHR** ürün çalışma alanı.

## Konumlandırma

Ana mesaj: “İK'da daha az iş yükü. İnsana daha çok zaman.” Ürün faydası, ayrı dosya ve taleplerin tek çalışma alanında birleşmesi. İlk satın alma nedeni olarak özlük, izin ve masraf; büyümede PDKS, vardiya, zimmet ve işe giriş; kapsamlı kurumlarda performans, işe alım, bordro, eğitim ve İSG.

Pazarlama sitesi ana CTA'sı **Demo talep et**. Formu ziyaretçinin kararını kolaylaştırmak için üç adıma ayır: şirket bilgisi, modül seçimi, talep özeti. İlk adımda tam çalışan sayısı al; satış operasyonunda kullanıcı adedi ile çalışan kapasitesini karıştırma. İş e-postasına dönüş yap; müşteriden ilk başvuruda parola veya kart bilgisi isteme.

## Satış yaşam döngüsü

| Aşama             | Müşteri deneyimi                         | Yönetici işlemi                               |
| ----------------- | ---------------------------------------- | --------------------------------------------- |
| Başvuru           | Şirket, çalışan sayısı, modül tercihleri | Talebi ve iletişim bilgilerini incele         |
| İnceleme          | Başvuru alındı bildirimi                 | Uygun modül ve demo süresini seç              |
| Onay              | Kişiye özel giriş bağlantısı             | Şirkete özel erişim ve süre oluştur           |
| Demo              | Seçilen modülleri deneyimle              | İhtiyaç ve teklif kapsamını netleştir         |
| Satın alma talebi | Paket, dönem, fatura bilgileri           | Dönem bedeli, vergi ve ödeme bilgilerini ilet |
| Ödeme bekliyor    | Teklif ve ödeme bilgilerini gör          | Ödemenin alındığını referansla teyit et       |
| Lisans aktif      | Satın alınan modül ve kapasite           | Lisans süresi ve kapsamını izle               |
| Süre/iptal        | Erişim kapanır                           | Yenileme veya yeni teklif planla              |

Reddedilen başvuru davet alamaz. Ürün bağlantısı başarısızsa başvuru onaylanmış gösterilmez. Her ticari işlem kayıt altına alınır. Demo başlangıcı başvuru tarihinde değil, yönetici onayında başlar.

## Paket modeli

| Paket     | Asgari kapasite | Kapsam                                                |
| --------- | --------------: | ----------------------------------------------------- |
| Başlangıç |              10 | Özlük, izin, duyurular, temel self servis ve raporlar |
| Büyüme    |              25 | Başlangıç + masraf, PDKS, zimmet ve işe giriş         |
| Kurumsal  |              50 | Tüm ürün modülleri                                    |

Asgari kapasite ve paket kapsamı ilk öneridir; ticari yönetici tarafından değerlendirilebilir. Fiyat henüz verilmemiştir. Kataloğa fiyat tanımlanırsa çalışan başına aylık bedel × faturalandırılan kapasite × lisans ayı üzerinden hesaplanır. Vergi oranı teklif oluşturulurken yönetici tarafından belirtilir; otomatik indirim veya kanıtlanmamış kampanya yoktur.

Demo kapsamı ilgilenilen paket ile sınırlı olmak zorunda değildir: satış yöneticisi müşterinin gerçekten ihtiyacı olan modülleri seçebilir. Satın alınan kapsam paket kataloğundan sunucuda hesaplanır; tarayıcı isteğindeki modül listesine güvenilmez.

## İlk teslimde uygulananlar

1. Responsive satış sitesi: fayda anlatımı, modül kartları, ürün temsili, başlangıç akışı, paketler, SSS.
2. Üç adımlı demo formu ve doğrulama.
3. Kalıcı başvuru, e-posta kuyruğu ve yönetici inceleme paneli.
4. Onaylı, süreli, tek kullanımlık davet ve örnek verili yerel satış demo alanı.
5. Satın alma talebi, yönetici teklifi, ödeme teyidi ve lisans aktivasyonu.
6. Gerçek SenseHR kiracısı, Owner daveti ve sunucu tarafında ticari erişim kontrolü.
7. Modül lisansı ile mevcut modül aç/kapa ayarının birleşimi; müşteri yöneticisi lisanssız modülü açamaz.
8. SenseHR'da çalışan kaydı kapasitesinin yazım sırasında denetlenmesi; import/ATS de aynı kayıt katmanından geçer. Kapasite mevcut tutulan çalışan kayıtlarına uygulanır, arşivlenmiş kayıtlar da dahildir.

## Canlı kullanıma hazırlık

SMTP ve gönderen alan adı doğrulaması, gerçek yönetici bildirim adresi, nihai paket fiyatları ve vergileri, kurumca onaylanmış aydınlatma metni, canlı alan adı/HTTPS ve SenseHR servis hesabı gerekir. Mevcut ürünün veritabanı/servisleriyle uçtan uca gerçek tenant açılışı ayrıca doğrulanmalıdır.

Sonraki ticari geliştirmeler: ödeme sağlayıcısı ile doğrulanmış webhook tabanlı otomatik aktivasyon, müşterinin teklifi kabul/ret akışı, e-fatura entegrasyonu, yenileme hatırlatmaları, satış sorumlusu atama ve UTM/funnel ölçümü. Şu an kredi kartı tahsilatı yerine yönetici teyitli ödeme akışı uygulanır.

Sonraki ürün geliştirmeleri: tenant'a özel sentetik demo veri hazırlığı ve sıfırlama, modül senaryoları için rehberli tur, kapasiteyi aktif çalışan modeliyle sayma politikası, yenileme/grace period ve self servis lisans genişletme. Ticari şartlar kesinleşmeden bunlar canlı vaat olarak sunulmaz.

## Ölçülecekler

Demo formuna başlayan/tamamlayan oranı, başvurudan ilk temasa geçen süre, onaydan ilk girişe dönüşüm, modül ilgisi, tekliften ödemeye dönüşüm ve demo→lisans süresi. İlk sürümde işletim kayıtları mevcuttur; izinsiz üçüncü taraf analitik eklenmemiştir.
