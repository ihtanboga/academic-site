# Stent Expansion Comparator

## Proje Özeti
Koroner stentlerin maksimum genişleme kapasitelerini karşılaştırmak için geliştirilmiş bir web uygulaması. Doktorlar ve klinisyenler için tasarlandı.

## Teknolojiler
- **React 19** + **Vite 7**
- **Recharts** - Grafik görselleştirme
- **Lucide React** - İkonlar
- **Tailwind CSS v4**

## Renk Paleti
- **Primary**: Koyu Mavi (`#1e3a5f`)
- **Accent**: Turuncu (`#f97316`)
- **Success**: Yeşil (`#22c55e`)

## Ana Özellikler

### 1. Stent Seçimi (Sol Panel)
- Arama kutusu ile stent/üretici arama
- Diameter filtresi
- Accordion tarzı stent listesi
- Her stent'e tıklayınca mevcut diameter'lar görünür
- Turuncu butonlarla karşılaştırmaya ekleme

### 2. Target Diameter Finder
- Hedef çap girişi (örn: 4.5mm)
- Bu hedefe ulaşabilecek tüm stentleri listeler
- Margin değeri gösterir (hedefin ne kadar üstüne çıkabilir)
- Direkt karşılaştırmaya ekleme imkanı

### 3. Karşılaştırma (Sağ Panel)
- Seçilen stentler etiket olarak görünür
- **Stacked Bar Chart**: Nominal (koyu mavi) + Expansion Range (turuncu)
- Detaylı tablo:
  - Stent adı, üretici
  - Nominal çap
  - Max expansion
  - Gain (%)
  - IFU referans linki

## Veri Yapısı
`src/data/stent_data.json` dosyasında:
```json
{
  "Stent": "XIENCE Sierra",
  "Manufacturer": "Abbott",
  "Nominal_diameter": 3.0,
  "Overexpansion_limit": 4.0,
  "Reference": "https://..."
}
```

## Dosya Yapısı
```
src/
├── App.jsx              # Ana uygulama (tüm UI burada)
├── index.css            # Global stiller
├── main.jsx             # React entry point
├── data/
│   └── stent_data.json  # Stent verileri
├── components/          # (kullanılmıyor, App.jsx'te birleştirildi)
└── lib/
    └── utils.js         # Yardımcı fonksiyonlar
```

## Çalıştırma
```bash
npm install
npm run dev
# http://localhost:5173
```

## Notlar
- Maksimum 8 stent karşılaştırılabilir
- "no data" olan stentler expansion hesaplamalarında 0 olarak değerlendirilir
- Inline style kullanıldı (Tailwind v4 CSS değişken sorunları nedeniyle)
