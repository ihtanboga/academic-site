# CLAUDE.md — Site Yönetim Kılavuzu
## Prof. Ibrahim Halil Tanboga — Akademik Kişisel Web Sitesi

---

## 1. Sistem Tanımı

Bu site, **Hugo Blox Academic CV** teması üzerine kurulmuş bir akademik kişisel web sitesidir.

- **Canlı URL:** https://tanboga.netlify.app
- **GitHub Reposu:** https://github.com/ihtanboga/academic-site
- **Deploy:** Netlify — GitHub `main` branch'e her push sonrası otomatik deploy edilir
- **Yerel Proje Klasörü (Mac):** `~/Desktop/site_iht/`
- **Hugo Sürümü:** v0.157.0 extended
- **Tema:** Hugo Blox, dark mode, minimal pack

---

## 2. Klasör Yapısı

```
~/Desktop/site_iht/
├── config/_default/
│   ├── hugo.yaml          # Site başlığı, dil, Go modül ayarları
│   ├── params.yaml        # Tema, Analytics, profil adı
│   └── menus.yaml         # Navbar sekmeleri ve sıraları
├── content/
│   ├── _index.md          # Ana sayfa blokları (bio, experience, skills...)
│   ├── authors/me/        # Profil fotoğrafı (avatar.jpg)
│   ├── trials/            # Trials sekmesi içerikleri (boş, klinik çalışmalar için)
│   ├── events/            # LLM sekmesi içerikleri
│   │   └── <slug>/
│   │       ├── index.md
│   │       └── *.jpeg     # Makaleye ait görseller
│   ├── blog/              # ML/AI sekmesi (blog yazıları)
│   ├── projects/          # Biostatistics sekmesi
│   ├── courses/           # Cardiology sekmesi
│   └── myprojects/        # Projects sekmesi
└── data/authors/
    └── me.yaml            # Profil bilgileri (ad, bio, affiliations, linkler)
```

---

## 3. Navbar Sekmeleri

| Sekme Adı     | URL           | İçerik Klasörü        |
|---------------|---------------|-----------------------|
| Main          | /             | content/_index.md     |
| Trials        | /trials/      | content/trials/       |
| LLM           | /events/      | content/events/       |
| ML/AI         | /blog/        | content/blog/         |
| Biostatistics | /projects/    | content/projects/     |
| Cardiology    | /courses/     | content/courses/      |
| Projects      | /myprojects/  | content/myprojects/   |

Navbar ayarları: `config/_default/menus.yaml`

---

## 4. Profil Bilgileri

Tüm profil verisi `data/authors/me.yaml` dosyasındadır:

- **Görünen ad:** `Prof. Ibrahim Halil Tanboga`
- **Sol nav adı (params.yaml):** `Ibrahim Halil Tanboga, MD, PhD`
- **Affiliations:** Nişantaşı Üniversitesi + ItheraAI (https://www.ithera.ai/)
- **Sosyal linkler:** Email, X (Twitter), LinkedIn, Substack (https://metastata.substack.com/)
- **Tema:** dark mode, minimal pack (`config/_default/params.yaml`)
- **Google Analytics:** `G-PYZK2E4XV9` (`params.yaml` içinde `measurement_id`)

---

## 5. Yapılan Değişikliklerin Özeti

Bu sitede şu ana kadar yapılan başlıca işlemler:

- Profil güncellendi: "Dr." kaldırıldı, "ItheraAI" affiliasyonu eklendi, Substack linki eklendi
- Ana sayfa: Experience, Skills, Awards, Languages blokları Bio'nun altına taşındı
- Navbar sekmeleri yeniden adlandırıldı (Papers → Trials, Bio → Main, Talks → LLM, vb.)
- Publications sekmesi kaldırıldı, yerine Trials sekmesi eklendi (içerik boş)
- Google Analytics 4 entegrasyonu yapıldı (`G-PYZK2E4XV9`)
- "Projects" sekmesi eklendi (`/myprojects/`)
- LLM sekmesine "Agentic AI for Rare Disease Diagnosis" makalesi eklendi (4 görsel dahil)

---

## 6. Yeni İçerik Ekleme Rehberi

### A) LLM Sekmesine Yeni Makale/Yazı Eklemek

LLM sekmesi `content/events/` klasörüne karşılık gelir.

**Adımlar:**

1. Yeni bir klasör oluştur:
   ```
   content/events/<slug-isim>/
   ```

2. İçine `index.md` dosyası oluştur:

```yaml
---
title: "Makale Başlığı"
date: '2026-01-01T00:00:00Z'
summary: "Kısa özet (kart görünümünde görünür)"
abstract: "Uzun özet"
authors:
  - admin
tags:
  - LLM
  - Clinical AI
featured: false
image:
  filename: featured.jpeg   # görseli aynı klasöre koy
  caption: 'Görsel açıklaması'
  focal_point: Right
links:
  - icon: link
    name: Orijinal Makale
    url: https://doi.org/...
---

Buraya markdown içerik gelir.

Görsel eklemek için Hugo shortcode kullan:
{{< figure src="gorsel.jpeg" caption="Açıklama" width="100%" >}}
```

3. Varsa görselleri (`.jpeg`, `.png`) aynı klasöre koy.

4. Build ve push:
```bash
cd ~/Desktop/site_iht
hugo --minify          # hata yoksa devam et
git add -A
git commit -m "Add LLM post: Makale Adı"
git push
```

---

### B) Trials Sekmesine İçerik Eklemek

`content/trials/` klasörüne `content/events/` ile aynı yapıyı kullan. Her klinik çalışma için ayrı bir klasör ve `index.md` oluştur.

---

### C) ML/AI Sekmesine Blog Yazısı Eklemek

`content/blog/<slug>/index.md` olarak oluştur. Aynı front matter yapısını kullan.

---

### D) Mevcut İçeriği Düzenlemek

- **Profil bilgisi:** `data/authors/me.yaml`
- **Navbar:** `config/_default/menus.yaml`
- **Tema/Analytics:** `config/_default/params.yaml`
- **Ana sayfa blokları:** `content/_index.md`

---

## 7. Deploy Akışı

```
Düzenleme yap
    ↓
hugo --minify   ← Build test (hata varsa burada görünür)
    ↓
git add -A
git commit -m "Açıklama"
git push
    ↓
Netlify otomatik deploy eder (~1-2 dakika)
    ↓
https://tanboga.netlify.app
```

---

## 8. Sık Karşılaşılan Hatalar

| Hata | Nedeni | Çözümü |
|------|--------|---------|
| `value is not allowed in this context` | YAML'da `*` tırnaksız kullanıldı | İlgili değeri çift tırnak içine al |
| Netlify deploy olmuyor | Hugo build hatası var | `hugo --minify` ile lokal test et |
| Görsel görünmüyor | Dosya yanlış klasörde | Görseli `index.md` ile aynı klasöre koy |
| Yeni sekme görünmüyor | menus.yaml'a eklenmemiş | `menus.yaml`'a `name`, `url`, `weight` ekle |

---

## 9. LLM Agent için Hızlı Komut Seti

Bir LLM agent bu siteye içerik eklemek istiyorsa sırasıyla şunu yapmalıdır:

```bash
# 1. Klasör oluştur (örnek: LLM sekmesi için)
mkdir ~/Desktop/site_iht/content/events/yeni-yazi/

# 2. index.md yaz (yukarıdaki şablonu kullan)
# 3. Varsa görselleri kopyala
cp gorsel.jpeg ~/Desktop/site_iht/content/events/yeni-yazi/

# 4. Build testi
cd ~/Desktop/site_iht && hugo --minify

# 5. Push
git add -A && git commit -m "Add: Yeni yazı" && git push
```

---

*Bu dosya, Claude (Anthropic) tarafından site yönetim kılavuzu olarak hazırlanmıştır. Son güncelleme: Şubat 2026.*
