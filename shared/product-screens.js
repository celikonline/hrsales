// Real SenseHR screens captured with seeded Demo HR Company records.
export const productScreens = {
  payroll: {
    title: "Bordro ve ücret",
    alt: "SenseHR Eylül 2026 bordro dönem detayı: ödeme durumu, prim ve komisyon kayıtları; kurgusal demo veriler",
  },
  overview: {
    title: "İK genel bakış",
    alt: "SenseHR ana ekranı: çalışan bilgisi, izin bakiyesi ve ekip göstergeleri; demo veriler",
  },
  employee: {
    title: "Çalışanlar",
    alt: "SenseHR çalışan listesi: departman, unvan, yönetici ve kayıt durumu; demo veriler",
  },
  leave: {
    title: "İzin yönetimi",
    alt: "SenseHR izin takvimi: çalışanlar ve onaylanmış veya bekleyen izinler; demo veriler",
  },
  reporting: {
    title: "İK göstergeleri",
    alt: "SenseHR İK göstergeleri sayfası; demo şirket verileri",
  },
  profile: {
    title: "Çalışan özlük kartı",
    alt: "SenseHR çalışan kartı: çalışma bilgileri, organizasyon, iletişim ve özlük sekmeleri; demo veriler",
  },
  calendar: {
    title: "Şirket etkinlik takvimi",
    alt: "SenseHR kurumsal takvimi: şirket etkinlikleri, doğum günleri ve izin başlangıçları; demo veriler",
  },
  documents: {
    title: "Ortak şirket dosyaları",
    alt: "SenseHR ortak şirket dosyaları: indirilebilir çalışan rehberleri, belge türü ve mobil görünürlük; kurgusal demo veriler",
  },
  expense: {
    title: "Harcama ve avans talepleri",
    alt: "SenseHR harcama ve avans ekranı: çalışan talepleri, tutarlar ve onay durumları; kurgusal demo veriler",
  },
  training: {
    title: "Eğitim programları",
    alt: "SenseHR eğitim ekranı: eğitim programları, katılımcılar ve çalışan eğitim kayıtları; kurgusal demo veriler",
  },
  assets: {
    title: "Zimmet ve ekipman envanteri",
    alt: "SenseHR zimmet ekranı: envanter, atama, teslim, garanti ve yenileme göstergeleri; demo veriler",
  },
  messages: {
    title: "İK mesajları",
    alt: "SenseHR iç iletişim ekranı: gelen kutusu, giden kutusu ve mesaj grupları; demo veriler",
  },
  notes: {
    title: "Çalışan notları",
    alt: "SenseHR çalışan kartının notlar sekmesi: çalışan hakkında eklenen notlar; kurgusal demo veriler",
  },
  shifts: {
    title: "Haftalık vardiya planı",
    alt: "SenseHR vardiya planı: çalışanlar, haftanın günleri ve vardiya paleti; demo veriler",
  },
  safety: {
    title: "İSG takibi",
    alt: "SenseHR İSG hizmetleri: lokasyon uyum durumu, uzman ve hekim görevlendirmeleri; kurgusal demo veriler",
  },
  attendance: {
    title: "PDKS zaman panosu",
    alt: "SenseHR zaman panosu: devam oranı, geç kalma, erken çıkma ve fazla mesai göstergeleri; demo veriler",
  },
  timesheet: {
    title: "Aylık puantaj",
    alt: "SenseHR aylık puantaj tablosu: çalışma, fazla mesai, izin ve ay sonu onay durumları; demo veriler",
  },
  onboarding: {
    title: "İşe giriş görevleri",
    alt: "SenseHR işe giriş görev listesi: kategori ilerlemesi, tamamlanan, bekleyen ve muaf görevler ile sorumluları; kurgusal demo veriler",
  },
  offboarding: {
    title: "İşten ayrılış görevleri",
    alt: "SenseHR işe alış ve çıkış ekranında işten çıkış filtresi: ayrılış görevleri, sorumluları ve tamamlanma durumları; kurgusal demo veriler",
  },
  announcements: {
    title: "Çalışan duyuruları",
    alt: "SenseHR çalışan deneyimi ekranı: yayımlanan şirket duyuruları; kurgusal demo veriler",
  },
  reviews: {
    title: "Değerlendirme döngüleri",
    alt: "SenseHR performans değerlendirme dönemleri ekranı: aktif değerlendirme dönemleri ve durumları; kurgusal demo veriler",
  },
  performance: {
    title: "Performans hedefleri",
    alt: "SenseHR performans hedefleri ve ilerleme ekranı: çalışan hedefleri ve ilerleme durumları; kurgusal demo veriler",
  },
  recruitment: {
    title: "İşe alım ilanları",
    alt: "SenseHR işe alım ekranı: açık pozisyonlar, iş ilanları ve ilan durumları; kurgusal demo veriler",
  },
  terminals: {
    title: "PDKS terminal yönetimi",
    alt: "SenseHR PDKS ekranı: kayıtlı terminaller, terminal grupları ve çalışan kimlikleri; kurgusal demo veriler",
  },
};

// Preserve the homepage gallery's five-screen selection.
export const galleryScreenKeys = [
  "payroll",
  "overview",
  "employee",
  "leave",
  "reporting",
];
export const moduleScreenKeys = {
  occupationalSafety: "safety",
};

export const solutionVisuals = {
  "ozluk-dosyasi": { screen: "profile" },
  "kurumsal-takvim": { screen: "calendar" },
  dokumanlar: { screen: "documents" },
  "harcama-masraf": { screen: "expense" },
  egitim: { screen: "training" },
  zimmet: { screen: "assets" },
  mesajlar: { screen: "messages" },
  notlar: { screen: "notes" },
  servisler: {
    screen: "shifts",
    note: "Ulaşım ihtiyacını planlarken kullanılan ilgili vardiya ekranı. Servis sağlayıcı ve güzergâh bağlantısı kapsamı demoda birlikte değerlendirilir.",
  },
  saglik: { screen: "safety" },
  pdks: { screen: "attendance" },
  puantaj: { screen: "timesheet" },
  izin: { screen: "leave" },
  bordro: { screen: "payroll" },
  onboarding: { screen: "onboarding" },
  offboarding: { screen: "offboarding" },
  "calisan-deneyimi": { screen: "announcements" },
  anket: {
    screen: "reviews",
    note: "Geri bildirim süreçleriyle ilişkili performans değerlendirme ekranı. Anket oluşturma, yayınlama ve analiz kapsamı demoda ayrıca doğrulanır.",
  },
  "performans-okr": { screen: "performance" },
  "ise-alim-ats": { screen: "recruitment" },
  "entegre-cihazlar": { screen: "terminals" },
  "biyometrik-cihazlar": { screen: "terminals" },
  "rfid-cihazlar": { screen: "terminals" },
  turnikeler: { screen: "terminals" },
};
