import { GameCollection } from './types'

/**
 * Yeni Yapı: Her konu için 3 farklı mod
 * Kullanıcı önce konu seçer, sonra mod seçer
 */

// Konu Tanımı
export interface Topic {
  id: string
  title: string
  description?: string
  data: {
    matching: Array<{ key: string; value: string }>
    sequence: string[]
    grouping: Array<{ item: string; category: string }>
  }
}

/**
 * Sinir Sistemi Konuları
 */
export const sinirSistemiTopics: Topic[] = [
  {
    id: "noron-yapisi",
    title: "Nöron Yapısı ve İmpuls İletimi",
    description: "Nöronun yapısı, bölümleri ve impuls iletim mekanizması",
    data: {
      matching: [
        { key: "Dendrit", value: "Uyarıyı alan kısa uzantılar" },
        { key: "Akson", value: "Uyarıyı ileten uzun uzantı" },
        { key: "Miyelin Kılıf", value: "İletimi hızlandıran yağlı tabaka" },
        { key: "Ranvier Boğumu", value: "Miyelin kılıf arasındaki boşluklar" },
        { key: "Sinaps", value: "Nöronlar arası bağlantı noktası" },
        { key: "Nörotransmitter", value: "Sinaptik aralıkta kimyasal iletici" }
      ],
      sequence: [
        "Dendrit uyarıyı alır",
        "Hücre gövdesinde işlenir",
        "Akson tepesine iletilir",
        "Sinaptik veziküller açılır",
        "Nörotransmitter salınır",
        "Diğer nörona iletilir"
      ],
      grouping: [
        { item: "Dendrit", category: "Uyarı Alıcı" },
        { item: "Hücre Gövdesi", category: "Uyarı Alıcı" },
        { item: "Akson", category: "Uyarı İletici" },
        { item: "Akson Terminali", category: "Uyarı İletici" },
        { item: "Miyelin Kılıf", category: "Destek Yapı" },
        { item: "Schwann Hücresi", category: "Destek Yapı" }
      ]
    }
  },
  {
    id: "refleks-yayi",
    title: "Refleks Yayı",
    description: "Refleks hareketlerinin oluşum mekanizması ve aşamaları",
    data: {
      matching: [
        { key: "Reseptör", value: "Uyarıyı algılayan duyu organı" },
        { key: "Duyu Nöronu", value: "Uyarıyı merkeze taşır (Afferent)" },
        { key: "Ara Nöron", value: "Omurilik/beyinde bağlantı kurar" },
        { key: "Motor Nöron", value: "Cevabı organa taşır (Efferent)" },
        { key: "Efektör", value: "Tepkiyi gerçekleştiren kas/bez" }
      ],
      sequence: [
        "Reseptör (Duyu organı)",
        "Duyu Nöronu (Afferent)",
        "Ara Nöron (Merkezi Sinir Sistemi)",
        "Motor Nöron (Efferent)",
        "Efektör Organ (Kas/Bez)"
      ],
      grouping: [
        { item: "Reseptör", category: "Duyu Sistemi" },
        { item: "Duyu Nöronu", category: "Duyu Sistemi" },
        { item: "Ara Nöron", category: "Merkezi Sistem" },
        { item: "Motor Nöron", category: "Hareket Sistemi" },
        { item: "Efektör", category: "Hareket Sistemi" }
      ]
    }
  },
  {
    id: "impuls-iletimi",
    title: "İmpuls İletim Aşamaları",
    description: "Aksiyon potansiyeli ve impuls iletiminin elektriksel aşamaları",
    data: {
      matching: [
        { key: "Dinlenme Potansiyeli", value: "-70mV, Na+/K+ pompası aktif" },
        { key: "Depolarizasyon", value: "Na+ kanalları açılır, +40mV'a çıkar" },
        { key: "Repolarizasyon", value: "K+ kanalları açılır, -70mV'a döner" },
        { key: "Hiperpolarizasyon", value: "Geçici olarak -90mV'a düşer" },
        { key: "Eşik Değer", value: "-55mV, aksiyon potansiyeli başlar" }
      ],
      sequence: [
        "Dinlenme Potansiyeli (-70mV)",
        "Uyarı (Eşik değer aşılır)",
        "Depolarizasyon (Na+ kanalları açılır)",
        "Repolarizasyon (K+ kanalları açılır)",
        "Hiperpolarizasyon (Geçici aşırı negatiflik)",
        "Dinlenme haline dönüş"
      ],
      grouping: [
        { item: "Na+ kanalları açılır", category: "Depolarizasyon" },
        { item: "Membran +40mV olur", category: "Depolarizasyon" },
        { item: "K+ kanalları açılır", category: "Repolarizasyon" },
        { item: "Membran -70mV'a döner", category: "Repolarizasyon" },
        { item: "Na+/K+ pompası çalışır", category: "Dinlenme" },
        { item: "Membran -70mV'da", category: "Dinlenme" }
      ]
    }
  },
  {
    id: "beyin-bolumleri",
    title: "Merkezi Sinir Sistemi Bölümleri",
    description: "Beyin ve omurilik bölümleri, görevleri ve sınıflandırması",
    data: {
      matching: [
        { key: "Serebrum (Uç Beyin)", value: "Bilinçli hareketler, düşünme, hafıza" },
        { key: "Serebellum (Beyincik)", value: "Denge, koordinasyon, kas tonusu" },
        { key: "Hipotalamus", value: "Homeostazi, vücut sıcaklığı, açlık-tokluk" },
        { key: "Talamus", value: "Duyu bilgilerini filtreleme ve yönlendirme" },
        { key: "Orta Beyin", value: "Görme ve işitme refleksleri" },
        { key: "Omurilik Soğanı", value: "Solunum, kalp atışı, yutkunma" }
      ],
      sequence: [
        "Ön Beyin (En üst seviye)",
        "Orta Beyin (Refleksler)",
        "Arka Beyin (Yaşamsal fonksiyonlar)",
        "Omurilik (Refleks merkezi)"
      ],
      grouping: [
        { item: "Uç Beyin (Serebrum)", category: "Ön Beyin" },
        { item: "Talamus", category: "Ön Beyin" },
        { item: "Hipotalamus", category: "Ön Beyin" },
        { item: "Orta Beyin", category: "Orta Beyin" },
        { item: "Beyincik (Serebellum)", category: "Arka Beyin" },
        { item: "Pons (Köprü)", category: "Arka Beyin" },
        { item: "Omurilik Soğanı (Medulla Oblongata)", category: "Arka Beyin" }
      ]
    }
  },
  {
    id: "otonom-sinir",
    title: "Otonom Sinir Sistemi",
    description: "Sempatik ve parasempatik sinir sisteminin etkileri",
    data: {
      matching: [
        { key: "Sempatik Sistem", value: "Savaş-kaç tepkisi, enerji harcama" },
        { key: "Parasempatik Sistem", value: "Dinlenme-sindirim, enerji depolama" },
        { key: "Adrenalin", value: "Sempatik sistemin hormonu" },
        { key: "Asetilkolin", value: "Parasempatik sistemin nörotransmitteri" }
      ],
      sequence: [
        "Stres durumu algılanır",
        "Sempatik sistem aktive olur",
        "Adrenalin salınır",
        "Vücut savaş-kaç moduna geçer",
        "Tehlike geçer",
        "Parasempatik sistem devreye girer",
        "Vücut dinlenme moduna döner"
      ],
      grouping: [
        { item: "Göz bebeği büyümesi", category: "Sempatik" },
        { item: "Kalp atışı hızlanması", category: "Sempatik" },
        { item: "Sindirim yavaşlaması", category: "Sempatik" },
        { item: "Bronşların genişlemesi", category: "Sempatik" },
        { item: "Göz bebeği küçülmesi", category: "Parasempatik" },
        { item: "Kalp atışı yavaşlaması", category: "Parasempatik" },
        { item: "Sindirim hızlanması", category: "Parasempatik" },
        { item: "Bronşların daralması", category: "Parasempatik" }
      ]
    }
  }
]

/**
 * NotebookLM için Prompt Şablonu
 */
export const notebookLMPrompt = `
Yüklediğim dokümanları analiz et. [KONU ADI] konusuyla ilgili; 
matching, sequence ve grouping için veri oluştur.

Çıktıyı tam olarak şu JSON yapısında ver:

{
  "id": "konu-id",
  "title": "Konu Başlığı",
  "description": "Kısa açıklama",
  "data": {
    "matching": [
      { "key": "Terim", "value": "Açıklama" }
    ],
    "sequence": [
      "Adım 1",
      "Adım 2"
    ],
    "grouping": [
      { "item": "Öğe", "category": "Kategori" }
    ]
  }
}

KURALLAR:
- Hiçbir açıklama metni ekleme, sadece JSON kodunu ver
- Veriler sınav odaklı ve ezberlenmesi kritik bilgiler olsun
- Her mod için en az 4, en fazla 8 öğe
- Aynı bilgiyi 3 farklı şekilde öğretecek şekilde düzenle
`
