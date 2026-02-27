# CLAUDE.md Ñ Site Yšnetim Kõlavuzu
## Prof. Ibrahim Halil Tanboga Ñ Akademik Web Sitesi

---

## 1. Sistem Tanõmõ

- **Canlõ URL:** https://tanboga.netlify.app
- **GitHub Reposu:** https://github.com/ihtanboga/academic-site
- **Deploy:** Netlify Ñ `main` branch'e her push'ta otomatik
- **Yerel klasšr (Mac):** `~/Desktop/site_iht/`
- **Hugo sŸrŸmŸ:** v0.157.0 extended
- **Tema:** Hugo Blox Academic CV, dark mode, minimal pack

---

## 2. Klasšr Yapõsõ

```
site_iht/
??? config/_default/
?   ??? hugo.yaml          # Site basülõgùõ, dil
?   ??? params.yaml        # Tema, Analytics, profil adõ
?   ??? menus.yaml         # Navbar sekmeleri
??? content/
?   ??? _index.md          # Ana sayfa bloklarõ
?   ??? authors/me/        # Profil fotogùrafõ (avatar.jpg)
?   ??? trials/            # Trials sekmesi
?   ??? events/            # LLM sekmesi
?   ??? blog/              # ML/AI sekmesi
?   ??? projects/          # Biostatistics sekmesi
?   ??? courses/           # Cardiology sekmesi
?   ??? myprojects/        # Projects sekmesi
??? data/authors/
?   ??? me.yaml            # Profil (ad, bio, affiliations, linkler)
??? layouts/               # …zel Hugo layout override'larõ
?   ??? events/list.html   # LLM sidebar
?   ??? blog/list.html     # ML/AI sidebar
?   ??? projects/list.html # Biostatistics sidebar
?   ??? courses/list.html  # Cardiology sidebar
?   ??? trials/list.html   # Trials sidebar
?   ??? myprojects/list.html # Projects sidebar
??? static/
?   ??? stent-app/         # Build edilmisü Coronary Stent Expansion uygulamasõ
??? stent-app/             # React kaynak kodu (Vite + Tailwind)
```

---

## 3. Navbar Sekmeleri

| Sekme         | URL           | Klasšr                 |
|---------------|---------------|------------------------|
| Main          | /             | content/_index.md      |
| Trials        | /trials/      | content/trials/        |
| LLM           | /events/      | content/events/        |
| ML/AI         | /blog/        | content/blog/          |
| Biostatistics | /projects/    | content/projects/      |
| Cardiology    | /courses/     | content/courses/       |
| Projects      | /myprojects/  | content/myprojects/    |

Her sekmenin sol tarafõnda ierikleri listeleyen **sidebar** mevcuttur (layouts/ klasšrŸnde override edilmisü).

---

## 4. Profil Bilgileri (`data/authors/me.yaml`)

- **GšrŸnen ad:** Prof. Ibrahim Halil Tanboga
- **Sol nav adõ:** Ibrahim Halil Tanboga, MD, PhD (`params.yaml`)
- **Affiliations:** Nisüantasüõ †niversitesi + ItheraAI (https://www.ithera.ai/)
- **Sosyal:** Email, X, LinkedIn, Substack (https://metastata.substack.com/)
- **Tema:** dark + minimal (`params.yaml`)
- **Google Analytics:** G-PYZK2E4XV9 (`params.yaml ? measurement_id`)

---

## 5. Yapõlan Degùisüikliklerin Tam …zeti

### Profil & Tema
- "Prof. Dr." ? "Prof.", "(he/him)" kaldõrõldõ
- Affiliation: Hisar Intercontinental ? ItheraAI
- Sol nav: Ibrahim Halil Tanboga, MD, PhD
- Substack sosyal linki eklendi
- Dark mode + minimal pack varsayõlan yapõldõ

### Ana Sayfa
- Experience, Skills, Awards, Languages bloklarõ Bio'nun altõna tasüõndõ
- Experience navbar'dan kaldõrõldõ

### Navbar
- Bio ? Main
- Talks ? LLM (/events/)
- News ? ML/AI (/blog/)
- Projects ? Biostatistics (/projects/)
- Courses ? Cardiology (/courses/)
- Papers ? Trials (/trials/) Ñ publications ierigùi silindi
- Projects (yeni) ? /myprojects/ eklendi

### Iúerik
- Publications (17 makale) eklendi sonra tŸmŸ silindi, Trials sekmesine dšnŸsütŸrŸldŸ
- LLM sekmesine "Agentic AI for Rare Disease Diagnosis" makalesi eklendi (4 gšrsel dahil)
- Biostatistics'e "Bayesian Inference in Failed Clinical Trials" makalesi eklendi

### SEO & Analytics
- Google Analytics 4 entegrasyonu (G-PYZK2E4XV9)
- Publications sayfasõna PubMed intro linki eklendi (kaldõrõldõ)

### Teknik
- Her sekmeye sol sidebar eklendi (layouts/ klasšrŸ, Hugo template override)
- Sidebar: sticky, responsive (mobilde gizlenir), yeni ierik eklenince otomatik gŸncellenir

### Stent App
- Coronary Stent Expansion uygulamasõ Projects sekmesine eklendi
- Kaynak kodu: `site_iht/stent-app/` (React + Vite + Recharts + Tailwind v4)
- Build õktõsõ: `site_iht/static/stent-app/` ? canlõ URL: /stent-app/
- "How to Use" bšlŸmŸ app'in ŸstŸne eklendi (3 adõm: Target Finder, Browse & Add, Compare)
- Projects kartõna tõklanõnca direkt app aõlõr (`external_link`)

---

## 6. Yeni Iúerik Ekleme

### Herhangi bir sekmeye yazõ eklemek

```
content/<sekme-klasšrŸ>/<slug>/index.md
```

**Front matter süablonu (SEO uyumlu):**

```yaml
---
title: "Basülõk (primary keyword dahil)"
date: '2026-01-01T00:00:00Z'
summary: "Meta description Ñ max 160 karakter"
abstract: "Uzun šzet"
authors:
  - admin
tags:
  - Primary Keyword
  - Secondary Keyword
featured: false
image:
  filename: gorsel.jpeg
  focal_point: Right
links:
  - icon: link
    name: Kaynak
    url: https://doi.org/...
---
```

Gšrsel eklemek iin:
```
{{< figure src="gorsel.jpeg" caption="Aõklama" width="100%" >}}
```

---

## 7. SEO Iúerik Standardõ

### Zorunlu Yapõ (8 bšlŸm)

1. **H1** Ñ primary keyword iermeli
2. **Girisü** (100Ğ150 kelime) Ñ primary keyword + 2-3 teknik kavram + klinik/teknik šnem
3. **"X Nedir?"** Ñ 40Ğ70 kelime, kesin, alõntõlanabilir tanõm
4. **Teknik Mimari** (150Ğ250 kelime) Ñ sistem tasarõmõ, veri akõsüõ, reasoning yapõsõ
5. **Performans & Degùerlendirme** Ñ temel metrikler, baseline karsüõlasütõrmasõ, anahtar igšrŸ
6. **Neden …nemli** Ñ klinik ve AI õkarõmlarõ, šnceki alõsümalardan farkõ
7. **Anahtar Kavramlar** Ñ 8Ğ12 madde bullet liste
8. **Meta Blok** Ñ title (²60 kar.), description (²160 kar.), primary + 5-8 secondary keyword

### Stil Kurallarõ
- 500Ğ1000 kelime (ideal: 750Ğ900)
- Emoji yok, pazarlama dili yok
- Mekanizmalar šn planda, hikaye degùil
- Akademik uzman tonu

### LLM Agent iin Iúerik †retim Promptu

```
## ROLE
You are a clinician-scientist and AI systems expert writing a concise but technically authoritative blog article.

## OBJECTIVE
Write a high-density scientific blog article based on the provided paper.
- 500Ğ1000 words (ideal: 750Ğ900)
- No fluff, no repetition, focus on mechanisms

## STRUCTURE (MANDATORY)
1. H1 (Primary Keyword Included)
2. Short Opening (100Ğ150 words)
3. What is X? Ñ 40Ğ70 word definition
4. Technical Architecture (150Ğ250 words)
5. Performance & Evaluation
6. Why This Matters
7. Key Concepts Covered (8Ğ12 bullet items)
8. Meta Block: Title (²60), Description (²160), Primary + Secondary Keywords

## STYLE
No emojis. No marketing tone. Academic expert voice. Clean Markdown output only.

## INPUT
Paper: [BURAYA YAPISTIR]
Primary Keyword: [šrn. "Bayesian inference clinical trials"]
Angle (optional): [cardiology / AI / biostatistics]
```

---

## 8. Stent App GŸncelleme Akõsüõ

Stent verisi veya UI degùisüikligùi yapmak iin:

```bash
# 1. Kaynak kodu dŸzenle
cd ~/Desktop/site_iht/stent-app
# ? src/App.jsx (UI)
# ? src/data/stent_data.json (veri)

# 2. Build
npm run build

# 3. Static klasšrŸne kopyala
cp -r dist/* ../static/stent-app/

# 4. Push
cd ..
git add -A && git commit -m "Update stent app" && git push
```

---

## 9. Deploy Akõsüõ

```
Degùisüiklik yap
    ?
hugo --minify      ? hata yoksa devam
    ?
git add -A && git commit -m "..." && git push
    ?
Netlify ~1-2 dk deploy eder ? https://tanboga.netlify.app
```

---

## 10. Sõk Karsüõlasüõlan Hatalar

| Hata | Neden | ‚šzŸm |
|------|-------|-------|
| `value is not allowed in this context` | YAML'da `*` tõrnaksõz | `"*Journal*"` süeklinde ift tõrnagùa al |
| Netlify deploy olmuyor | Hugo build hatasõ | `hugo --minify` ile lokal test et |
| Gšrsel õkmõyor | Yanlõsü klasšrde | `index.md` ile aynõ klasšre koy |
| Yeni sekme gšrŸnmŸyor | menus.yaml eksik | `name`, `url`, `weight` ekle |
| Stent app asset yŸklenmiyor | base path yanlõsü | `vite.config.js`'de `base: '/stent-app/'` olmalõ |

---

*Son gŸncelleme: Süubat 2026*
