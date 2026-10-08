export const reports = [
  {
    id: 'izin-ve-donus',
    tag: 'ÇALIŞAN DENEYİMİ',
    title: 'İzin sonrası güçlü bir başlangıç',
    subtitle: 'İzin planlama, devir ve işe dönüş için ekip rehberi',
    color: 'purple',
    edition: '2026',
    summary:
      'İzin öncesindeki hazırlıktan ilk haftadaki iş yüküne kadar, çalışan ve yönetici için uygulanabilir bir çalışma planı.',
    chapters: [
      {
        title: '01 · İzni bir ekip planına dönüştürün',
        intro:
          'İzin talebi bir takvim kaydından fazlasıdır. İyi bir plan, dinlenme hakkını korurken işin devamlılığını sağlar. İlk adım; hangi görevlerin gerçekten devredilmesi gerektiğini belirlemektir. Her işi başka bir kişiye aktararak ekip üzerinde yeni bir yük yaratmayın.',
        points: [
          'Yönetici ile çalışan, izin tarihlerini ve kritik teslimleri birlikte gözden geçirsin. İş yoğunluğu ve yedekleme kapasitesi görünür olsun.',
          'Her kritik iş için sorumlu kişi, son tarih, belge bağlantısı ve eskalasyon noktası belirleyin. Devir notuna müşteri veya çalışanların gereksiz kişisel verilerini eklemeyin.',
          'İzin sırasında hangi durumun acil sayılacağını önceden açıklayın. Normal iş takibi için dinlenen çalışana sürekli mesaj göndermeyin.',
          'İzin bakiyesi ve ekip takvimini aynı süreçte kontrol edin. Onay veya değişiklik olduğunda ilgili kişilerin aynı kaydı görmesini sağlayın.',
        ],
        exercise:
          'Uygulama: Gelecek ay izin kullanacak bir ekip üyesi için en fazla beş kritik görevden oluşan devir listesi hazırlayın. Her görevde bir yedek sorumlu bulunsun.',
      },
      {
        title: '02 · İlk günü toplantıyla doldurmayın',
        intro:
          'Dönüşte biriken mesajlar, değişen öncelikler ve teslim baskısı aynı anda ortaya çıkabilir. Çalışanın bütün geçmişi tek başına taramasını beklemek yerine, kısa ve güncel bir özet hazırlayın. İlk günün hedefi her işi bitirmek değil, öncelikleri yeniden netleştirmektir.',
        points: [
          'Yönetici, çalışan dönmeden önce üç başlık altında özet hazırlasın: tamamlanan işler, değişen kararlar ve bekleyen sorular.',
          'İlk görüşmede yalnız iş takibi yapmayın. İş yükünün yönetilebilir olup olmadığını ve destek gerektiren noktaları konuşun.',
          'İlk haftadaki teslimleri gerçekçi biçimde sıralayın. Öncelik değiştiyse eski hedefi sessizce korumak yerine açıkça güncelleyin.',
          'Uzun süreli izinlerde ekip, rol ve araç değişikliklerini ayrıca anlatın. Gerekli erişimler ve eğitimler ilk gün hazır olsun.',
        ],
        exercise:
          'Uygulama: Otuz dakikalık bir dönüş görüşmesi tasarlayın: 10 dakika güncelleme, 10 dakika öncelik, 10 dakika destek ve sorular.',
      },
      {
        title: '03 · Süreci izleyin, kişiyi etiketlemeyin',
        intro:
          'İşe dönüşün kalitesini ölçmek için kişisel sağlık veya özel hayat bilgileri toplamak gerekmez. Talep ve onay süreleri, devir tamlığı ve destek ihtiyaçları süreç iyileştirmesi için yeterli başlangıç verileridir. Ölçümü çalışanları sıralamak için değil, iş tasarımını düzeltmek için kullanın.',
        points: [
          'İzin onay süresini talep tarihi ile karar tarihi arasındaki süre olarak tanımlayın. Bekleyen talepleri haftalık takip edin.',
          'Devir listesinin tamamlanma oranını izleyin. Eksik bir kaydı kişinin başarısızlığına dönüştürmeden, şablonun anlaşılır olup olmadığını kontrol edin.',
          'Dönüşten bir hafta sonra kısa bir geri bildirim alın: Öncelikler net miydi? Erişimler hazır mıydı? İş yükü yönetilebilir miydi?',
          'Ekip bazında paylaşım yaparken küçük gruplarda kişilerin kolayca tanınmasını önleyin. Gereksiz ayrıntıları rapora taşımayın.',
        ],
        exercise:
          'Uygulama: Bir aylık pilotun sonunda iki süreç sorunu seçin ve her biri için sorumlu ile düzeltme tarihi belirleyin.',
      },
    ],
    worksheet: [
      'İzin başlangıcı / dönüş tarihi',
      'Kritik görev ve yedek sorumlusu',
      'Devir belgesinin yeri',
      'Dönüş günündeki üç öncelik',
      'İlk hafta destek planı',
      'Bir hafta sonraki geri bildirim tarihi',
    ],
    sources: [
      {
        name: 'ÇSGB · İş Kanunu ve yıllık izin soruları',
        url: 'https://www.csgb.gov.tr/sikca-sorulan-sorular/calisma-genel-mudurlugu/%C4%B1s-kanunu/',
      },
    ],
    module: 'leave',
  },
  {
    id: 'birlikte-calisan-kusaklar',
    tag: 'EKİP & KÜLTÜR',
    title: 'Farklı kuşaklar, ortak çalışma dili',
    subtitle: 'Yaş etiketleri yerine ihtiyaçları ve iş alışkanlıklarını anlamak',
    color: 'teal',
    edition: '2026',
    summary:
      'Kuşak genellemeleri yerine rol, deneyim ve beklentilere dayanan bir ekip çalışma modeli kurun.',
    chapters: [
      {
        title: '01 · Varsayımları görünür kılın',
        intro:
          'Aynı yaş grubundaki iki çalışan aynı iş alışkanlığına sahip olmak zorunda değildir. Deneyim, görev, çalışma koşulları ve kişisel tercihlerin hepsi beklentileri etkiler. Ekip tasarımına kuşak etiketiyle başlamak, asıl ihtiyacı kaçırmanıza yol açabilir.',
        points: [
          'İletişim tercihlerini doğrudan sorun: Acil konu hangi kanalda, düzenli güncelleme hangi sıklıkta konuşulmalı?',
          'Esneklik ihtiyacını yaşa göre tahmin etmeyin. Rolün gerektirdiği erişilebilirlik ile çalışanın tercihlerini birlikte değerlendirin.',
          'Toplantı ve mesajlaşma alışkanlıklarını yazılı hale getirin. Yeni gelenlerin kuralları gözlemleyerek tahmin etmesini beklemeyin.',
          'Aynı performans ölçütünü benzer rollerde tutarlı uygulayın. Hızlı mesaj yanıtını tek başına bağlılık göstergesi saymayın.',
        ],
        exercise:
          'Uygulama: Ekipten herkesin cevapladığı üç soruluk bir çalışma tercihleri anketi hazırlayın. Yaş bilgisi istemeyin.',
      },
      {
        title: '02 · Bilgiyi iki yönde paylaşın',
        intro:
          'Mentorluk yalnız deneyimli kişinin yeni çalışana bilgi aktarması değildir. Yeni araçlar, farklı müşteri beklentileri ve değişen çalışma yöntemleri karşılıklı öğrenme fırsatı yaratır. İyi bir program, tarafların birbirini düzeltmesinden çok birlikte küçük bir problemi çözmesine dayanır.',
        points: [
          'Eşleştirmeyi yaş farkına göre değil, öğrenme ihtiyacı ve gönüllülük üzerinden yapın.',
          'Her görüşme için somut bir hedef belirleyin: rapor hazırlamak, müşteri görüşmesini planlamak veya bir araç kullanımını öğrenmek.',
          'Mentorun ve katılımcının zamanını iş planına dahil edin. Öğrenmeyi yalnız mesai dışına bırakan bir program kurmayın.',
          'Bilginin kişide kalmasını önlemek için görüşme sonucunu kısa bir ekip notuna dönüştürün. Gizli verileri paylaşmayın.',
        ],
        exercise:
          'Uygulama: Dört haftalık bir eşleşme deneyin. Sonunda birlikte üretilmiş tek bir iş çıktısını değerlendirin.',
      },
      {
        title: '03 · Adaleti gündelik kararlara taşıyın',
        intro:
          'Ekip kültürü bildirilerde değil; eğitim, görev dağılımı ve geri bildirim kararlarında görünür hale gelir. Herkesin aynı fırsata erişebilmesi için karar gerekçeleri anlaşılır olmalıdır. Benzer ihtiyaçlara benzer destek sunmak, farklılıkları tek tipe zorlamadan ortak bir zemin yaratır.',
        points: [
          'Gelişim fırsatlarının kimlere verildiğini ve gerekçelerini düzenli gözden geçirin.',
          'Geri bildirimi gözlenen davranış ve iş sonucuna bağlayın. “Bu kuşak böyledir” gibi genellemeleri görüşmeden çıkarın.',
          'Esnek çalışma ve izin kararları için rol bazlı, anlaşılır kriterler belirleyin.',
          'Ekip anlaşmasını üç ayda bir güncelleyin. Yeni çalışma arkadaşlarının önerilerini de değerlendirin.',
        ],
        exercise:
          'Uygulama: Son üç eğitim kararını inceleyin. Katılımcı seçiminin açıklanabilir ve iş ihtiyacına uygun olup olmadığını tartışın.',
      },
    ],
    worksheet: [
      'Ekibin ortak iletişim kanalları',
      'Toplantı ve odaklanma saatleri',
      'Gönüllü öğrenme eşleşmeleri',
      'Gözlenen iş davranışı / geri bildirim',
      'Eğitim fırsatı seçim kriterleri',
      'Üç aylık ekip anlaşması kontrolü',
    ],
    sources: [],
    module: 'training',
  },
  {
    id: 'olculebilir-ise-alim',
    tag: 'VERİ & KARAR',
    title: 'İşe alımda ölçülebilir kararlar',
    subtitle: 'Aday sürecini daha tutarlı değerlendirmek için uygulama defteri',
    color: 'navy',
    edition: '2026',
    summary:
      'Rol tanımı, görüşme ölçütleri ve aday akışındaki göstergelerle daha açıklanabilir işe alım kararları verin.',
    chapters: [
      {
        title: '01 · Önce başarı ölçütünü tanımlayın',
        intro:
          'Aday aramaya başlamadan önce rolün çözmesi gereken problemi yazın. Uzun bir yetkinlik listesi yerine, ilk üç ayda beklenen iş sonuçlarıyla başlayın. Böylece görüşmeler kişisel izlenimlerin ötesine geçer ve adaylar aynı ölçütlerle değerlendirilir.',
        points: [
          'Rol için üç somut sonuç belirleyin. Her sonucun gerekli deneyim veya beceriyle ilişkisini açıklayın.',
          'Zorunlu koşulları öğrenilebilir özelliklerden ayırın. İlanı gereksiz daraltan şartları gözden geçirin.',
          'Görüşme sorularını aynı yetkinliği değerlendirecek biçimde hazırlayın. Puanın yanında kanıt notu bulunsun.',
          'Kişisel hayat, sağlık ve rol ile ilgisiz özellikleri değerlendirme tablosundan çıkarın.',
        ],
        exercise:
          'Uygulama: Bir açık rol için üç başarı ölçütü ve her ölçüte karşılık gelen bir iş örneği sorusu yazın.',
      },
      {
        title: '02 · Aday akışını ölçün',
        intro:
          'İşe alım hızını tek bir toplam süreyle izlemek, beklemenin nerede oluştuğunu gizleyebilir. Başvuru, ön görüşme, değerlendirme ve teklif aşamalarının her birini takip edin. Süreleri ölçerken adayın ve ekibin deneyimini birlikte değerlendirin.',
        points: [
          'Aşama geçiş oranını, sonraki aşamaya geçen aday sayısının önceki aşamadaki aday sayısına oranı olarak tanımlayın.',
          'Bekleme süresini aşamaya giriş ile sonraki karar arasındaki fark olarak ölçün. Tekil gecikmeleri ortalamaya bakarak gizlemeyin.',
          'Kaynak değerlendirmesinde yalnız başvuru sayısını kullanmayın. Nitelikli görüşme ve kabul edilen teklif oranını da görün.',
          'Küçük örneklemlerde iddialı sonuç çıkarmayın. Başvuru koşulları farklıysa iki kaynağı doğrudan karşılaştırmayın.',
        ],
        exercise:
          'Uygulama: Son on adayın hangi aşamada beklediğini listeleyin. En uzun beklemenin sahibi ve azaltılabilecek nedeni belirleyin.',
      },
      {
        title: '03 · İnsan kararı ve veri sorumluluğu',
        intro:
          'Bir skor, kararın kendisi değil; görüşmeyi daha düzenli hale getiren bir yardımcıdır. Son kararı veren kişiler, kullanılan ölçütleri ve gerekçeyi açıklayabilmelidir. Aday verilerinin ne kadar süre ve hangi amaçla tutulacağı süreç başlamadan belirlenmelidir.',
        points: [
          'Görüşmeciler değerlendirmelerini ortak toplantıdan önce ayrı tamamlasın. Böylece ilk konuşan kişinin etkisi azalır.',
          'Puan farklarını kanıt üzerinden tartışın. “Kültüre uyum” gibi belirsiz gerekçeleri somut iş davranışlarıyla açıklayın.',
          'Adayın bilgilendirme metnine erişimini, veri saklama kuralını ve silme başvurusunu açıkça planlayın.',
          'İşe alım sonrası rol beklentisinin karşılanıp karşılanmadığını süreç düzeyinde değerlendirin. Bir adayın özel verilerini toplu raporlara taşımayın.',
        ],
        exercise:
          'Uygulama: Bir teklif kararının gerekçesini yarım sayfada açıklayın. Rol ölçütü, görüşme kanıtı ve karar sahibini belirtin.',
      },
    ],
    worksheet: [
      'Rolün ilk 90 gün sonucu',
      'Yetkinlik / soru / kanıt',
      'Aday aşaması ve giriş tarihi',
      'Görüşme puanı ve gerekçesi',
      'Aday bilgilendirme kanalı',
      'Saklama ve erişim sorumlusu',
    ],
    sources: [
      {
        name: 'KVKK · Temel veri işleme ilkeleri',
        url: 'https://www.kvkk.gov.tr/Icerik/2035/Genel-Ilkeler',
      },
    ],
    module: 'recruitment',
  },
  {
    id: 'dijital-ik-yol-haritasi',
    tag: 'İK DÖNÜŞÜMÜ',
    title: 'Dijital İK için 90 günlük yol haritası',
    subtitle: 'Süreç keşfinden pilot kullanıma kadar somut bir başlangıç',
    color: 'purple',
    edition: '2026',
    summary:
      'Öncelik, veri hazırlığı, pilot ekip ve ölçülebilir hedeflerle İK dönüşümünüzü küçük adımlarla başlatın.',
    chapters: [
      {
        title: '01 · İlk 30 gün: süreci ve veriyi hazırlayın',
        intro:
          'Dijitalleşme, mevcut formu ekrana taşımakla tamamlanmaz. Önce hangi kararın kim tarafından verildiğini, hangi bilginin gerçekten gerekli olduğunu ve beklemenin nerede oluştuğunu anlayın. Küçük ama sık tekrarlanan bir süreci başlangıç olarak seçmek öğrenmeyi hızlandırır.',
        points: [
          'İzin, masraf veya işe giriş süreçlerinden birini seçin. Adım, sorumlu ve kullanılan belgenin tek sayfalık haritasını çıkarın.',
          'Çalışan ve organizasyon bilgilerinin kaynağını belirleyin. Yinelenen kayıtları temizleyin; gerekli olmayan alanları aktarım listesinden çıkarın.',
          'Başlangıç ölçümünü alın: talep sayısı, karar süresi ve düzeltme için geri dönen kayıtlar.',
          'Yetki ve erişim matrisini yazın. Çalışan, yönetici ve İK rollerinin göreceği bilgiler açık olsun.',
        ],
        exercise:
          'Uygulama: Pilot sürecin bugün nasıl yürüdüğünü bir çalışan ve bir yöneticiyle birlikte çizin. Önceki varsayımlarınızı düzeltin.',
      },
      {
        title: '02 · Gün 31–60: küçük bir pilot yürütün',
        intro:
          'Bütün şirketi aynı gün geçirmek yerine, gerçek ihtiyaçları temsil eden küçük bir pilot ekip seçin. Pilotun amacı yalnız sistemin açılması değil; kullanıcıların işlemi anlayarak tamamlayabilmesidir. Değişiklikleri kontrollü uygulayın ve her sorun için sahip belirleyin.',
        points: [
          'Pilot kapsamını ve dışında kalan işleri yazın. Çalışan sayısı ve açılacak modüller lisans kapasitesiyle uyumlu olsun.',
          'Örnek işlemleri birlikte çalışın: talep oluşturma, karar verme, iade ve rapor kontrolü.',
          'Eğitimi rol bazlı hazırlayın. Her rol için en sık yapılan üç işlemin kısa rehberi bulunsun.',
          'Sorunları tek listede tutun. Kullanıcı hatası demeden önce ekranın ve açıklamanın anlaşılır olup olmadığını inceleyin.',
        ],
        exercise:
          'Uygulama: Bir çalışan, bir yönetici ve İK sorumlusu aynı izin talebini baştan sona tamamlasın. Her adımda takıldığı noktaları kaydedin.',
      },
      {
        title: '03 · Gün 61–90: ölçün ve kapsamı genişletin',
        intro:
          'Pilot sonunda başarıyı yalnız giriş yapan kişi sayısıyla değerlendirmeyin. İşlem tamamlama, karar süresi ve kayıt kalitesi değişimini inceleyin. Yeni modül açmadan önce ilk sürecin sorumluluğunu ve destek düzenini sürdürülebilir hale getirin.',
        points: [
          'Başlangıç ve pilot ölçümlerini aynı tanımlarla karşılaştırın. Süreç hacmi değiştiyse sonucu bu bağlamla anlatın.',
          'Canlıya geçiş için veri, yetki, eğitim ve destek kontrol listelerini tamamlayın.',
          'Sonraki modülü iş yükü ve kullanıcı ihtiyacına göre seçin. Lisans büyümesini çalışan kapasitesi ve dönemle birlikte planlayın.',
          'Her ay bir süreç iyileştirmesi belirleyin. Yazılımın yanında iş kurallarını da gözden geçirin.',
        ],
        exercise:
          'Uygulama: Pilot karar toplantısında devam, düzelt veya durdur seçeneklerinden birini gerekçesiyle kaydedin. Yeni hedefe bir sorumlu ve tarih atayın.',
      },
    ],
    worksheet: [
      'Pilot süreç ve hedefi',
      'Mevcut ölçüm / hedef ölçüm',
      'Veri kaynağı ve temizleme sorumlusu',
      'Rol bazlı erişim listesi',
      'Pilot katılımcıları',
      'Canlı geçiş ve destek tarihi',
    ],
    sources: [],
    module: 'employee',
  },
  {
    id: 'stratejik-ik-plani',
    tag: 'STRATEJİ & LİDERLİK',
    title: 'İK stratejisini iş planına bağlayın',
    subtitle: 'İşgücü, yetkinlik ve bütçe kararlarını aynı çerçevede ele almak',
    color: 'navy',
    edition: '2026',
    summary:
      'İş hedeflerini çalışan kapasitesi, gelişim ihtiyaçları ve operasyonel göstergelerle birlikte planlayın.',
    chapters: [
      {
        title: '01 · İş hedefinden insan ihtiyacına geçin',
        intro:
          'Bir İK planı, ayrı bir faaliyet listesi olarak kaldığında önceliklerle bağlantısını kaybeder. Satış büyümesi, yeni lokasyon veya hizmet kalitesi hedefinin hangi görev ve yetkinliği gerektirdiğini açıklayın. Böylece işe alım ve gelişim kararlarının gerekçesi ortak bir dil kazanır.',
        points: [
          'Önümüzdeki iki dönem için iş hedeflerini yazın. Her hedefin gerektirdiği rol ve kapasiteyi işletme liderleriyle değerlendirin.',
          'Mevcut kapasiteyi kişi sayısı yanında iş yükü ve beceri açısından inceleyin. Dönemsel ihtiyaçları kalıcı kadroyla karıştırmayın.',
          'Eksik yetkinliği işe alım, eğitim, görev tasarımı veya iç hareketlilik seçenekleriyle ele alın.',
          'Planı tek bir tahmine bağlamayın. Temel senaryo ile büyüme ve daralma koşullarını ayrı yazın.',
        ],
        exercise:
          'Uygulama: Bir iş hedefini seçin. Başarısı için gereken üç rol veya yetkinliği ve her biri için mevcut açığı belirleyin.',
      },
      {
        title: '02 · Ölçümden aksiyona geçin',
        intro:
          'Göstergeler ancak karar almayı kolaylaştırıyorsa değer yaratır. Her ölçüm için tanım, kaynak, sahip ve kontrol sıklığı belirleyin. İnsanla ilgili sonuçları tek bir sayı ile açıklamaya çalışmadan, süreç ve çalışan deneyimini birlikte değerlendirin.',
        points: [
          'Çalışan devir oranını dönem ayrılan çalışan sayısı / dönem ortalama çalışan sayısı olarak tanımlayın. Farklı tanımlı raporları karıştırmayın.',
          'İşe alım, izin ve masraf süreçlerinde bekleme süresini izleyin. Gecikme görüldüğünde çözüm sahibini belirleyin.',
          'Eğitim katılımını tek başına başarı saymayın. Öğrenilen becerinin iş çıktısında nasıl kullanıldığını takip edin.',
          'Raporlara erişimi amaçla sınırlayın. Küçük ekiplerin veya hassas kişisel durumların tanınmasına yol açan ayrıntıları paylaşmayın.',
        ],
        exercise:
          'Uygulama: Beş gösterge seçin. Her birinin hangi kararı değiştireceğini tek cümlede yazın. Karara etkisi olmayanı listeden çıkarın.',
      },
      {
        title: '03 · Bütçeyi ve sorumluluğu görünür yapın',
        intro:
          'İK bütçesi yalnız maaş toplamından oluşmaz. İşveren primleri, gelişim, sistem lisansı ve süreç geçişi gibi kalemleri aynı dönem yaklaşımıyla ele alın. Kesinleşmiş tutarları varsayımlardan ayırarak kararın dayandığı bilgiyi görünür kılın.',
        points: [
          'Ücret ve işveren maliyetini birbirinden ayırın. Vergi ve teşvik varsayımlarını ilgili dönem kaynaklarıyla doğrulayın.',
          'Sistem lisansını çalışan kapasitesi, modül ve süre bazında planlayın. Büyüme senaryosunda ek kapasite ihtiyacını hesaplayın.',
          'Her girişim için sorumlu, beklenen çıktı ve kontrol tarihi belirleyin.',
          'Üç aylık değerlendirmede yalnız gerçekleşmeyi raporlamayın. Değişen iş koşullarına göre öncelikleri yeniden sıralayın.',
        ],
        exercise:
          'Uygulama: Bir sayfalık İK planı hazırlayın: iş hedefi, insan ihtiyacı, aksiyon, bütçe varsayımı, sorumlu ve kontrol tarihi.',
      },
    ],
    worksheet: [
      'İş hedefi ve dönem',
      'Gerekli kapasite / mevcut kapasite',
      'Yetkinlik açığı ve çözüm',
      'Bütçe varsayımı / kesinleşmiş tutar',
      'Gösterge ve veri sahibi',
      'Üç aylık değerlendirme tarihi',
    ],
    sources: [],
    module: 'performance',
  },
];

export const blogArticles = [
  {
    id: 'izin-onay-sureci',
    tag: 'İzin yönetimi',
    title: 'İzin onayını bekleme kuyruğundan çıkarın',
    description: 'Talep, yedek yönetici ve ekip takvimi için üç pratik düzenleme.',
    sections: [
      [
        'Önce beklemeyi görünür yapın',
        'Talebin ne zaman açıldığı, kimde beklediği ve kararın ne zaman verildiği aynı kayıtta bulunsun. Bekleyen talepler için düzenli takip yapın; kişisel mesajlarda kaybolan onayları ortak sürece taşıyın.',
      ],
      [
        'Yedek onaylayıcı belirleyin',
        'Yönetici izinliyken talep akışı durmamalı. Onay sorumluluğunu ve vekâlet dönemini önceden belirleyin. Hangi durumda İK ekibinin devreye gireceğini yazılı açıklayın.',
      ],
      [
        'Kararı takvimle birleştirin',
        'Talep onaylandığında ekip takvimi güncellensin. Değişiklik veya iptal olduğunda aynı bilgi ilgili kişilere ulaşsın. Pilot ekipte sürecin anlaşılır olup olmadığını çalışan ve yöneticiden birlikte öğrenin.',
      ],
    ],
    module: 'leave',
  },
  {
    id: 'masraf-politikasi',
    tag: 'Masraf & avans',
    title: 'Kullanılabilir bir masraf politikası nasıl yazılır?',
    description: 'Uzun bir metin yerine çalışanların karar verebildiği bir politika.',
    sections: [
      [
        'Kategorileri iş ihtiyacına bağlayın',
        'Seyahat, konaklama ve temsil gibi kategoriler için tutar sınırı, gerekli belge ve onay rolünü birlikte yazın. Aynı harcamanın farklı kişiler tarafından farklı yorumlanmasını azaltın.',
      ],
      [
        'İadeyi açıklanabilir hale getirin',
        'Eksik belge nedeniyle geri dönen talepte neyin tamamlanması gerektiğini açıkça belirtin. Çalışanın bütün talebi yeniden yazması yerine mevcut kayıt üzerinden düzeltme yapabileceği bir akış kurun.',
      ],
      [
        'Bordro dönemini hesaba katın',
        'Talep son günü ve ödeme takvimini çalışanlarla paylaşın. Avans ile gerçekleşen masrafın kapanışını aynı süreçte kontrol edin. Süreç başarısını yalnız reddedilen talep sayısıyla ölçmeyin; karar süresi ve tekrar düzeltmeleri de değerlendirin.',
      ],
    ],
    module: 'expense',
  },
  {
    id: 'vardiya-planlama',
    tag: 'PDKS & vardiya',
    title: 'Vardiya planında son dakika değişikliklerini azaltın',
    description: 'İhtiyaç, erişilebilirlik ve değişiklik kaydı aynı plan üzerinde.',
    sections: [
      [
        'Kapasiteyi görev bazında görün',
        'Her zaman diliminde gerekli rol ve beceriyi belirleyin. Aynı sayıda çalışan bulundurmak, gerekli yetkinliğin de hazır olduğu anlamına gelmez.',
      ],
      [
        'Değişiklik sahibini belirleyin',
        'Kim vardiya değiştirebilir, kim onaylar ve çalışan ne zaman bilgilendirilir? Bu soruların yanıtı ortak planda bulunsun. Eski ve yeni plan arasındaki fark izlenebilsin.',
      ],
      [
        'Puantajla karşılaştırın',
        'Planlanan ve gerçekleşen zamanı aynı dönemde inceleyin. Giriş kaydı farkını doğrudan disiplin sorununa dönüştürmeden izin, görevlendirme ve teknik nedenleri değerlendirin.',
      ],
    ],
    module: 'attendance',
  },
  {
    id: 'demo-kontrol-listesi',
    tag: 'Dijital İK',
    title: 'İK yazılımı demosunda denemeniz gereken beş işlem',
    description: 'Ekran izlemekten gerçek bir iş akışını denemeye geçin.',
    sections: [
      [
        'Bir çalışan kaydını inceleyin',
        'Özlük, organizasyon ve belge görünümünü rol bazında kontrol edin. Çalışan ve yöneticinin aynı bilgiyi aynı yetkiyle görmesi gerekmeyebilir.',
      ],
      [
        'Bir talebi baştan sona tamamlayın',
        'İzin veya masraf oluşturun, yönetici olarak karar verin ve sonucu çalışan rolünde görün. Düzeltme ve iptal durumlarını da konuşun.',
      ],
      [
        'Modül ve kapasiteyi netleştirin',
        'Demonun süresini, açılacak modülleri, çalışan kapasitesini ve lisansa geçişi sorun. Ödeme teyidi, veri aktarımı ve destek planını yazılı olarak netleştirin.',
      ],
    ],
    module: 'employee',
  },
];

export const sectors = [
  [
    'gida',
    'Gıda',
    'Üretim ve satış ekiplerini aynı İK düzeninde buluşturun.',
    ['Vardiya sürekliliği', 'Dönemsel personel', 'İSG ve eğitim'],
    ['attendance', 'leave', 'occupationalSafety'],
  ],
  [
    'hizmet',
    'Hizmet',
    'Müşteriyle temas eden ekiplerde iş planını görünür kılın.',
    ['Saha görevlendirmeleri', 'Masraf takibi', 'Ekip duyuruları'],
    ['expense', 'announcements', 'leave'],
  ],
  [
    'turizm',
    'Turizm',
    'Sezonluk yoğunluk ve farklı ekipleri birlikte yönetin.',
    ['Sezon işe girişleri', 'Vardiya değişiklikleri', 'Ekipman teslimleri'],
    ['onboarding', 'attendance', 'assets'],
  ],
  [
    'perakende',
    'Perakende',
    'Mağaza ve merkez arasında ortak bir çalışma dili kurun.',
    ['Çok lokasyonlu ekip', 'Vardiya planı', 'Ortak izin takvimi'],
    ['employee', 'attendance', 'leave'],
  ],
  [
    'enerji',
    'Enerji',
    'Saha operasyonunun insan ve güvenlik ihtiyaçlarını takip edin.',
    ['İSG kayıtları', 'Eğitim takibi', 'Saha masrafları'],
    ['occupationalSafety', 'training', 'expense'],
  ],
  [
    'saglik',
    'Sağlık',
    'Kesintisiz hizmette ekip planını ve görev devirlerini netleştirin.',
    ['Vardiya koordinasyonu', 'İzin yedeklemesi', 'Zorunlu eğitim takibi'],
    ['attendance', 'leave', 'training'],
  ],
  [
    'egitim',
    'Eğitim',
    'Akademik ve idari ekiplerin gelişimini birlikte planlayın.',
    ['Dönemsel takvim', 'Gelişim planları', 'Kurumsal iletişim'],
    ['training', 'performance', 'announcements'],
  ],
  [
    'guvenlik',
    'Güvenlik',
    'Farklı noktalardaki ekiplerde zaman ve ekipman takibini birleştirin.',
    ['Nokta bazlı vardiya', 'Zimmet kontrolü', 'İşe giriş adımları'],
    ['attendance', 'assets', 'onboarding'],
  ],
  [
    'tesis-yonetimi',
    'Tesis yönetimi',
    'Dağınık lokasyonlardaki İK operasyonunu bir araya getirin.',
    ['Lokasyon yapısı', 'Vardiya takibi', 'Masraf ve avans'],
    ['employee', 'attendance', 'expense'],
  ],
  [
    'sanayi',
    'Sanayi & otomotiv',
    'Üretim temposunu ekip kapasitesiyle birlikte planlayın.',
    ['Puantaj takibi', 'İSG kayıtları', 'Yetkinlik gelişimi'],
    ['attendance', 'occupationalSafety', 'training'],
  ],
  [
    'danismanlik',
    'Hukuk & danışmanlık',
    'Uzman ekiplerin gelişimine ve proje iş yüküne odaklanın.',
    ['Hedef ve gelişim', 'Masraf süreçleri', 'İzin planlama'],
    ['performance', 'expense', 'leave'],
  ],
  [
    'lojistik',
    'Dağıtım & lojistik',
    'Saha ekiplerinde başlangıç, çalışma zamanı ve masrafları izleyin.',
    ['Saha vardiyaları', 'Masraf kayıtları', 'Ekipman devirleri'],
    ['attendance', 'expense', 'assets'],
  ],
].map(([id, name, description, needs, modules]) => ({ id, name, description, needs, modules }));

export const moduleFeatures = {
  employee: [
    'Çalışan özlük kaydı',
    'Şirket ve organizasyon görünümü',
    'Belge takibi ve rol bazlı erişim',
  ],
  leave: ['Talep ve onay akışı', 'İzin bakiyesi görünümü', 'Ekip takvimi'],
  expense: ['Masraf ve avans talepleri', 'Belge ve kategori takibi', 'Yönetici değerlendirmesi'],
  attendance: ['Giriş ve çıkış kayıtları', 'Vardiya planlama', 'Puantaj görünümü'],
  performance: ['Hedef takibi', 'Değerlendirme dönemleri', 'Gelişim görüşmeleri'],
  recruitment: ['Aday ve pozisyon takibi', 'Görüşme aşamaları', 'İşe girişe geçiş'],
  payroll: ['Bordro dönemleri', 'Çalışan ödeme bilgileri', 'Bordro operasyon takibi'],
  assets: ['Ekipman envanteri', 'Çalışan teslimleri', 'İade ve devir takibi'],
  training: ['Eğitim planı', 'Katılım takibi', 'Gelişim kayıtları'],
  onboarding: ['İşe giriş görevleri', 'Sorumlu ve tarih takibi', 'Yeni çalışan hazırlığı'],
  announcements: ['Şirket duyuruları', 'Ekip iletişimi', 'Bilgiye ortak erişim'],
  occupationalSafety: [
    'İSG operasyon kayıtları',
    'Takip ve hatırlatma süreçleri',
    'İlgili çalışan görünümü',
  ],
};

export const maturityQuestions = [
  [
    'Çalışan bilgileri',
    'Özlük kayıtları ve organizasyon bilgilerinin güncel, ortak bir kaynağı var mı?',
  ],
  ['İzin yönetimi', 'İzin talebi, onayı ve bakiye kontrolü tek bir süreçte izleniyor mu?'],
  ['Masraf süreçleri', 'Harcama belgeleri ve kararlar kaybolmadan takip ediliyor mu?'],
  ['Çalışma zamanı', 'Vardiya ile gerçekleşen çalışma kayıtları karşılaştırılabiliyor mu?'],
  ['İşe giriş', 'Yeni çalışan için görevler, sorumlular ve tarihler tanımlı mı?'],
  ['Gelişim', 'Hedefler ve eğitim ihtiyaçları düzenli görüşmelerle ele alınıyor mu?'],
  ['Raporlama', 'İK göstergelerinin tanımı, kaynağı ve sahibi belli mi?'],
  [
    'Veri sorumluluğu',
    'Yetki ve saklama kuralları belirli, erişimler düzenli gözden geçiriliyor mu?',
  ],
];
