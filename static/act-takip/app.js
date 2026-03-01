const protocols = [
  {
    id: "pci_standard",
    name: "Standart PCI (GP IIb/IIIa yok)",
    group: "Koroner",
    indication: "Elektif veya AKS PCI; güçlü GPIIb/IIIa inhibitörü yok.",
    targets: {
      hemotec: "250-300 sn",
      hemochron: "300-350 sn"
    },
    initialDose: {
      mode: "range_per_kg",
      min: 70,
      max: 100,
      maxUnits: 5000,
      fallback: "Bazı elektif olgularda sabit 5000 U bolus yaklaşımı kullanılabilir."
    },
    firstCheck: "İlk bolustan 5-10 dk sonra",
    maintenanceCheck: "Uzayan veya kompleks işlemde her 20-30 dk",
    redose: [
      { range: "<200 sn", action: "40 U/kg veya yaklaşık 5000 U'ya kadar ek bolus; 5-10 dk sonra ACT tekrar" },
      { range: "200-249 sn", action: "20 U/kg veya 2000-3000 U ek bolus; 5-10 dk sonra ACT tekrar" },
      { range: "250-300 sn", action: "Hedef aralık, ek bolus gerekmez" },
      { range: ">300 sn", action: "Ek heparin verilmez; kanama bulgusu için klinik izlem" }
    ],
    decisionBands: [
      {
        label: "<200 sn",
        max: 199,
        summary: "Hedefin belirgin altında",
        action: "Ek UFH: 40 U/kg (yaklaşık 5000 U'ya kadar) bolus ver.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: "200-249 sn",
        min: 200,
        max: 249,
        summary: "Subterapötik",
        action: "Ek UFH: 20 U/kg (yaklaşık 2000-3000 U) bolus ver.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: "250-300 sn",
        min: 250,
        max: 300,
        summary: "Hedef aralıkta",
        action: "Ek heparin verme, işlemi sürdür.",
        nextCheck: "Uzayan işlemde 20-30 dk arayla ACT izle.",
        tone: "ok"
      },
      {
        label: ">300 sn",
        min: 301,
        summary: "Hedef üstü",
        action: "Ek heparin verme; kanama açısından klinik izle.",
        nextCheck: "20-30 dk içinde tekrar ACT kontrolü yap.",
        tone: "neutral"
      }
    ],
    notes: [
      "Femoral girişte sheath çekimi için ACT'nin daha düşük düzeye inmesi beklenebilir.",
      "Hemochron cihazı kullanılıyorsa hedef bant daha yüksek yorumlanır."
    ]
  },
  {
    id: "pci_gpi",
    name: "PCI + GP IIb/IIIa",
    group: "Koroner",
    indication: "PCI sırasında GP IIb/IIIa inhibitörü kullanımı planlanan durumlar.",
    targets: {
      hemotec: "200-250 sn",
      hemochron: "200-250 sn"
    },
    initialDose: {
      mode: "range_per_kg",
      min: 50,
      max: 70,
      maxUnits: 5000,
      fallback: "Güçlü antiplatelet etki nedeniyle düşük UFH bandı tercih edilir."
    },
    firstCheck: "Bolustan 5-10 dk sonra",
    maintenanceCheck: "İşlem uzarsa her 20-30 dk",
    redose: [
      { range: "<180 sn", action: "20-30 U/kg ek bolus; 5-10 dk sonra tekrar ACT" },
      { range: "180-199 sn", action: "10-20 U/kg ek bolus" },
      { range: "200-250 sn", action: "Hedef aralık" },
      { range: ">250 sn", action: "Ek doz verme, kanama açısından izle" }
    ],
    decisionBands: [
      {
        label: "<180 sn",
        max: 179,
        summary: "Belirgin hedef altı",
        action: "Ek UFH: 20-30 U/kg bolus ver.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: "180-199 sn",
        min: 180,
        max: 199,
        summary: "Sınır altı",
        action: "Ek UFH: 10-20 U/kg bolus ver.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: "200-250 sn",
        min: 200,
        max: 250,
        summary: "Hedef aralıkta",
        action: "Ek heparin verme.",
        nextCheck: "İşlem uzarsa 20-30 dk arayla ACT kontrol et.",
        tone: "ok"
      },
      {
        label: ">250 sn",
        min: 251,
        summary: "Hedef üstü",
        action: "Ek doz verme; kanama açısından yakın izle.",
        nextCheck: "20-30 dk içinde yeniden ACT bak.",
        tone: "neutral"
      }
    ],
    notes: [
      "GPI varlığında yüksek ACT hedefleri gereksiz kanama riskini artırabilir."
    ]
  },
  {
    id: "cto_pci",
    name: "Kompleks PCI / CTO",
    group: "Koroner",
    indication: "Uzun süreli, çoklu tel/cihaz kullanılan kompleks PCI veya CTO olguları.",
    targets: {
      hemotec: ">300 sn (retrograd çoğunlukla >350 sn)",
      hemochron: ">350 sn"
    },
    initialDose: {
      mode: "range_per_kg",
      min: 90,
      max: 100,
      maxUnits: 10000,
      fallback: "Kompleks girişimlerde ek bolus ihtiyacı sık görülür."
    },
    firstCheck: "5-10 dk sonra",
    maintenanceCheck: "Her 20-30 dk, ACT düşüşünde daha sık",
    redose: [
      { range: "<250 sn", action: "30-40 U/kg veya 3000-5000 U ek bolus" },
      { range: "250-299 sn", action: "20 U/kg ek bolus" },
      { range: "300-350 sn", action: "Antegrad CTO için kabul edilebilir" },
      { range: ">350 sn", action: "Retrograd CTO için çoğunlukla hedef aralık" }
    ],
    decisionBands: [
      {
        label: "<250 sn",
        max: 249,
        summary: "Hedef altı",
        action: "Ek UFH: 30-40 U/kg (veya 3000-5000 U) bolus ver.",
        nextCheck: "5-10 dk içinde ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: "250-299 sn",
        min: 250,
        max: 299,
        summary: "Sınırda düşük",
        action: "Ek UFH: 20 U/kg bolus uygula.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: "300-350 sn",
        min: 300,
        max: 350,
        summary: "Antegrad CTO için kabul edilebilir",
        action: "Ek doz gerekmeyebilir, işlem yaklaşımına göre değerlendir.",
        nextCheck: "20-30 dk aralıkla ACT izle.",
        tone: "ok"
      },
      {
        label: ">350 sn",
        min: 351,
        summary: "Retrograd CTO için çoğunlukla hedef",
        action: "Ek heparin verme.",
        nextCheck: "20-30 dk aralıkla ACT izle.",
        tone: "ok"
      }
    ],
    notes: [
      "Uzun işlem nedeniyle yarı ömür etkisiyle ACT düşüşü beklenir; periyodik kontrol şarttır.",
      "Perforasyon riski olan vakalarda reversibilite nedeniyle UFH avantajlıdır."
    ]
  },
  {
    id: "tavr",
    name: "TAVR",
    group: "Yapısal",
    indication: "Transkateter aort kapak girişimleri.",
    targets: {
      hemotec: "250-300 sn (en az >250)",
      hemochron: "250-300 sn"
    },
    initialDose: {
      mode: "range_per_kg",
      min: 50,
      max: 100,
      maxUnits: 10000,
      fallback: "Bazı protokollerde sabit 5000 U başlangıç da kullanılabilir."
    },
    firstCheck: "Bolustan 5-10 dk sonra",
    maintenanceCheck: "Her 15-30 dk",
    redose: [
      { range: "<250 sn", action: "1000-2000 U ek bolus; kısa aralıkla ACT tekrar" },
      { range: "250-300 sn", action: "Hedef aralık" },
      { range: ">300 sn", action: "Ek doz gerekmez" }
    ],
    decisionBands: [
      {
        label: "<250 sn",
        max: 249,
        summary: "Hedef altı",
        action: "Ek UFH: 1000-2000 U bolus ver.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: "250-300 sn",
        min: 250,
        max: 300,
        summary: "Hedef aralıkta",
        action: "Ek heparin verme.",
        nextCheck: "15-30 dk aralıkla ACT izle.",
        tone: "ok"
      },
      {
        label: ">300 sn",
        min: 301,
        summary: "Hedef üstü",
        action: "Ek doz verme, kanama/hemostaz açısından klinik izlem yap.",
        nextCheck: "15-30 dk içinde yeniden ACT bak.",
        tone: "neutral"
      }
    ],
    notes: [
      "İşlem sonunda ACT rehberli protamin, hemostaz için sık kullanılan stratejidir.",
      "Büyük kılıf nedeniyle kanama ve tromboz dengesi hassastır."
    ]
  },
  {
    id: "teer",
    name: "TEER (MitraClip/TriClip)",
    group: "Yapısal",
    indication: "Transseptal kenar-kenara kapak onarımı girişimleri.",
    targets: {
      hemotec: ">250 sn",
      hemochron: ">250 sn"
    },
    initialDose: {
      mode: "range_per_kg",
      min: 100,
      max: 100,
      maxUnits: 10000,
      fallback: "Transseptal sonrası erken heparinizasyon kritik kabul edilir."
    },
    firstCheck: "Transseptalden kısa süre sonra (yaklaşık 10-15 dk)",
    maintenanceCheck: "Her 15-30 dk",
    redose: [
      { range: "<220 sn", action: "25-30 U/kg ek bolus" },
      { range: "220-249 sn", action: "10-20 U/kg ek bolus" },
      { range: ">=250 sn", action: "Hedef aralık" }
    ],
    decisionBands: [
      {
        label: "<220 sn",
        max: 219,
        summary: "Belirgin hedef altı",
        action: "Ek UFH: 25-30 U/kg bolus uygula.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: "220-249 sn",
        min: 220,
        max: 249,
        summary: "Sınır altı",
        action: "Ek UFH: 10-20 U/kg bolus uygula.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: ">=250 sn",
        min: 250,
        summary: "Hedef aralıkta",
        action: "Ek heparin gerekmeyebilir.",
        nextCheck: "15-30 dk arayla ACT izle.",
        tone: "ok"
      }
    ],
    notes: [
      "Sol atriyum içinde uzun kateter manipülasyonu tromboz riskini artırır."
    ]
  },
  {
    id: "laao",
    name: "LAAO (Watchman/Amulet)",
    group: "Yapısal",
    indication: "Sol atriyal apendiks kapatma işlemleri.",
    targets: {
      hemotec: "250-300 sn",
      hemochron: "250-300 sn"
    },
    initialDose: {
      mode: "range_per_kg",
      min: 70,
      max: 100,
      maxUnits: 10000,
      fallback: "Transseptal sonrası sistemik antikoagülasyon sağlanır."
    },
    firstCheck: "İlk bolustan 10-15 dk sonra",
    maintenanceCheck: "Her 15-30 dk",
    redose: [
      { range: "<250 sn", action: "15-30 U/kg ek bolus" },
      { range: "250-300 sn", action: "Hedef aralık" },
      { range: ">300 sn", action: "Ek doz yok; kanama izlemi" }
    ],
    decisionBands: [
      {
        label: "<250 sn",
        max: 249,
        summary: "Hedef altı",
        action: "Ek UFH: 15-30 U/kg bolus uygula.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: "250-300 sn",
        min: 250,
        max: 300,
        summary: "Hedef aralıkta",
        action: "Ek heparin verme.",
        nextCheck: "15-30 dk arayla ACT izle.",
        tone: "ok"
      },
      {
        label: ">300 sn",
        min: 301,
        summary: "Hedef üstü",
        action: "Ek doz verme, kanama izlemi yap.",
        nextCheck: "15-30 dk içinde tekrar ACT bak.",
        tone: "neutral"
      }
    ],
    notes: [
      "Sessiz serebral emboli riski nedeniyle hedef dışı düşük ACT'den kaçınılır."
    ]
  },
  {
    id: "af_ablation",
    name: "AF / Sol Atriyal Ablasyon",
    group: "Elektrofizyoloji",
    indication: "Sol atriyal ablasyon prosedürleri (RF/Kriyo).",
    targets: {
      hemotec: ">300 sn (çoğu merkez 300-350/400)",
      hemochron: ">300 sn"
    },
    initialDose: {
      mode: "range_per_kg",
      min: 100,
      max: 130,
      maxUnits: 15000,
      fallback: "DOAC altında başlangıçta daha yüksek UFH ihtiyacı görülebilir."
    },
    firstCheck: "10-15 dk sonra",
    maintenanceCheck: "Hedefe kadar 15 dk, hedefteyken 15-30 dk",
    redose: [
      { range: "<150 sn", action: "100 U/kg ek bolus" },
      { range: "150-199 sn", action: "70 U/kg ek bolus" },
      { range: "200-249 sn", action: "50 U/kg ek bolus" },
      { range: "250-299 sn", action: "25 U/kg ek bolus" },
      { range: ">=300 sn", action: "Hedef aralık; ek bolus yok" }
    ],
    decisionBands: [
      {
        label: "<150 sn",
        max: 149,
        summary: "Ciddi hedef altı",
        action: "Ek UFH: 100 U/kg bolus uygula.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: "150-199 sn",
        min: 150,
        max: 199,
        summary: "Belirgin subterapötik",
        action: "Ek UFH: 70 U/kg bolus uygula.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: "200-249 sn",
        min: 200,
        max: 249,
        summary: "Subterapötik",
        action: "Ek UFH: 50 U/kg bolus uygula.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: "250-299 sn",
        min: 250,
        max: 299,
        summary: "Sınırda düşük",
        action: "Ek UFH: 25 U/kg bolus uygula.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: ">=300 sn",
        min: 300,
        summary: "Hedef aralıkta",
        action: "Ek bolus verme.",
        nextCheck: "15-30 dk arayla ACT izle.",
        tone: "ok"
      }
    ],
    notes: [
      "Sol atriyuma geçişten sonra hızlı hedefe ulaşmak embolik riski azaltır.",
      "Kesintisiz DOAC hastalarında hedef ACT'ye ulaşma gecikebilir."
    ]
  },
  {
    id: "vt_left",
    name: "Sol Kalp VT/PVC Ablasyonu",
    group: "Elektrofizyoloji",
    indication: "Sol ventrikül veya sol kalp kateterizasyonu içeren ventriküler ablasyon.",
    targets: {
      hemotec: ">250-350 sn",
      hemochron: ">250-350 sn"
    },
    initialDose: {
      mode: "range_per_kg",
      min: 50,
      max: 100,
      maxUnits: 10000,
      fallback: "Merkez protokolüne göre bolus + infüzyon kombinasyonu uygulanabilir."
    },
    firstCheck: "İlk 15 dk içinde",
    maintenanceCheck: "Hedefe kadar 15 dk, sonra 15-30 dk",
    redose: [
      { range: "<250 sn", action: "20-30 U/kg ek bolus" },
      { range: "250-300 sn", action: "Kabul edilebilir alt hedef" },
      { range: ">300 sn", action: "Çoğu merkezde uygun aralık" }
    ],
    decisionBands: [
      {
        label: "<250 sn",
        max: 249,
        summary: "Hedef altı",
        action: "Ek UFH: 20-30 U/kg bolus uygula.",
        nextCheck: "5-10 dk sonra ACT tekrar bak.",
        tone: "warn"
      },
      {
        label: "250-300 sn",
        min: 250,
        max: 300,
        summary: "Kabul edilebilir alt hedef",
        action: "Ek dozu klinik bağlama göre değerlendir.",
        nextCheck: "15-30 dk arayla ACT izle.",
        tone: "ok"
      },
      {
        label: ">300 sn",
        min: 301,
        summary: "Uygun aralık",
        action: "Ek bolus gerekmeyebilir.",
        nextCheck: "15-30 dk arayla ACT izle.",
        tone: "ok"
      }
    ],
    notes: [
      "Epikardiyal geçiş planlanıyorsa heparin zamanlaması ayrı değerlendirilir."
    ]
  },
  {
    id: "ep_right",
    name: "Sağ Taraf EP (ör: AVNRT/sağ flutter)",
    group: "Elektrofizyoloji",
    indication: "Saf sağ taraf girişimlerinde tromboz riski düşük prosedürler.",
    targets: {
      hemotec: "Rutin sistemik ACT hedefi yok",
      hemochron: "Rutin sistemik ACT hedefi yok"
    },
    initialDose: {
      mode: "none"
    },
    firstCheck: "Rutin ACT takibi çoğu vakada gerekmez",
    maintenanceCheck: "Klinik riske göre karar",
    redose: [
      { range: "Standart senaryo", action: "Sistemik UFH çoğu vakada verilmez" }
    ],
    decisionBands: [],
    notes: [
      "Uzun işlem, tromboemboli riski veya sol kalp geçişi varsa yaklaşım değişir."
    ]
  }
];

const ui = {
  topTabs: document.querySelectorAll(".top-tab"),
  tabPanels: document.querySelectorAll(".tab-panel"),
  languageSelect: document.getElementById("language-select"),
  procedureSelect: document.getElementById("procedure-select"),
  deviceSelect: document.getElementById("device-select"),
  weightInput: document.getElementById("weight-input"),
  doacCheck: document.getElementById("doac-check"),
  algorithmOutput: document.getElementById("algorithm-output"),
  caseIndicationSelect: document.getElementById("case-indication-select"),
  caseWeightInput: document.getElementById("case-weight-input"),
  caseActInput: document.getElementById("case-act-input"),
  caseDatetimeInput: document.getElementById("case-datetime-input"),
  caseDoseInput: document.getElementById("case-dose-input"),
  caseSaveDoseBtn: document.getElementById("case-save-dose-btn"),
  caseExtraDoseBlock: document.getElementById("case-extra-dose-block"),
  caseSaveStepBtn: document.getElementById("case-save-step-btn"),
  caseResetBtn: document.getElementById("case-reset-btn"),
  caseFeedback: document.getElementById("case-feedback"),
  caseInitialPlan: document.getElementById("case-initial-plan"),
  caseOutput: document.getElementById("case-output"),
  caseLogBody: document.getElementById("case-log-body"),
  caseCsvDownloadBtn: document.getElementById("case-csv-download-btn"),
  caseCsvPreviewBtn: document.getElementById("case-csv-preview-btn"),
  caseCsvPreview: document.getElementById("case-csv-preview"),
  caseLoginBtn: document.getElementById("case-login-btn"),
  caseLogoutBtn: document.getElementById("case-logout-btn"),
  caseLoginStatus: document.getElementById("case-login-status"),
  loginUserInput: document.getElementById("login-user-input"),
  loginPassInput: document.getElementById("login-pass-input"),
  casePatientIdInput: document.getElementById("case-patient-id-input"),
  casePatientNameInput: document.getElementById("case-patient-name-input")
};

const protocolNamesEn = {
  pci_standard: "Standard PCI (No GP IIb/IIIa)",
  pci_gpi: "PCI + GP IIb/IIIa",
  cto_pci: "Complex PCI / CTO",
  tavr: "TAVR",
  teer: "TEER (MitraClip/TriClip)",
  laao: "LAAO (Watchman/Amulet)",
  af_ablation: "AF / Left Atrial Ablation",
  vt_left: "Left-Heart VT/PVC Ablation",
  ep_right: "Right-Sided EP (AVNRT/Right Flutter)"
};

const protocolIndicationsEn = {
  pci_standard: "Elective or ACS PCI without potent GP IIb/IIIa inhibitor.",
  pci_gpi: "PCI with planned GP IIb/IIIa inhibitor use.",
  cto_pci: "Complex PCI or CTO with long procedures and multi-device usage.",
  tavr: "Transcatheter aortic valve procedures.",
  teer: "Transseptal edge-to-edge valve repair procedures.",
  laao: "Left atrial appendage occlusion procedures.",
  af_ablation: "Left atrial ablation procedures (RF/Cryo).",
  vt_left: "Ventricular ablation requiring left-heart catheterization.",
  ep_right: "Low-thrombotic-risk right-sided EP procedures."
};

const protocolLocaleEn = {
  pci_standard: {
    targets: {
      hemotec: "250-300 sec",
      hemochron: "300-350 sec"
    },
    firstCheck: "5-10 min after first bolus",
    maintenanceCheck: "Every 20-30 min in prolonged/complex procedures",
    fallback: "In some elective cases, a fixed 5000 U bolus may be used.",
    redose: [
      { range: "<200 sec", action: "40 U/kg or up to ~5000 U additional bolus; repeat ACT in 5-10 min" },
      { range: "200-249 sec", action: "20 U/kg or 2000-3000 U additional bolus; repeat ACT in 5-10 min" },
      { range: "250-300 sec", action: "Target range, no additional bolus required" },
      { range: ">300 sec", action: "No additional heparin; monitor clinically for bleeding signs" }
    ],
    decisionBands: [
      { label: "<200 sec", summary: "Markedly below target", action: "Additional UFH: 40 U/kg (up to ~5000 U) bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: "200-249 sec", summary: "Subtherapeutic", action: "Additional UFH: 20 U/kg (about 2000-3000 U) bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: "250-300 sec", summary: "Within target range", action: "No additional heparin, proceed with procedure.", nextCheck: "For prolonged procedures, monitor ACT every 20-30 min." },
      { label: ">300 sec", summary: "Above target", action: "No additional heparin; monitor for bleeding.", nextCheck: "Recheck ACT in about 20-30 min." }
    ],
    notes: [
      "In femoral access cases, sheath removal may require lower ACT levels.",
      "When using Hemochron, target interpretation is generally higher."
    ]
  },
  pci_gpi: {
    targets: {
      hemotec: "200-250 sec",
      hemochron: "200-250 sec"
    },
    firstCheck: "5-10 min after bolus",
    maintenanceCheck: "Every 20-30 min if procedure is prolonged",
    fallback: "Lower UFH range is preferred due to potent antiplatelet effect.",
    redose: [
      { range: "<180 sec", action: "20-30 U/kg additional bolus; repeat ACT in 5-10 min" },
      { range: "180-199 sec", action: "10-20 U/kg additional bolus" },
      { range: "200-250 sec", action: "Target range" },
      { range: ">250 sec", action: "No additional dose; monitor for bleeding" }
    ],
    decisionBands: [
      { label: "<180 sec", summary: "Markedly below target", action: "Additional UFH: 20-30 U/kg bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: "180-199 sec", summary: "Below target margin", action: "Additional UFH: 10-20 U/kg bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: "200-250 sec", summary: "Within target range", action: "No additional heparin.", nextCheck: "If prolonged, monitor ACT every 20-30 min." },
      { label: ">250 sec", summary: "Above target", action: "No additional dose; monitor for bleeding.", nextCheck: "Recheck ACT in about 20-30 min." }
    ],
    notes: [
      "With GPI use, very high ACT targets can increase bleeding risk."
    ]
  },
  cto_pci: {
    targets: {
      hemotec: ">300 sec (retrograde often >350 sec)",
      hemochron: ">350 sec"
    },
    firstCheck: "5-10 min",
    maintenanceCheck: "Every 20-30 min, more frequently if ACT decreases",
    fallback: "Additional bolus requirement is common in complex interventions.",
    redose: [
      { range: "<250 sec", action: "30-40 U/kg or 3000-5000 U additional bolus" },
      { range: "250-299 sec", action: "20 U/kg additional bolus" },
      { range: "300-350 sec", action: "Generally acceptable for antegrade CTO" },
      { range: ">350 sec", action: "Generally target range for retrograde CTO" }
    ],
    decisionBands: [
      { label: "<250 sec", summary: "Below target", action: "Additional UFH: 30-40 U/kg (or 3000-5000 U) bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: "250-299 sec", summary: "Borderline low", action: "Additional UFH: 20 U/kg bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: "300-350 sec", summary: "Acceptable for antegrade CTO", action: "May not need extra dose; judge by procedural context.", nextCheck: "Monitor ACT every 20-30 min." },
      { label: ">350 sec", summary: "Usually target for retrograde CTO", action: "No additional heparin.", nextCheck: "Monitor ACT every 20-30 min." }
    ],
    notes: [
      "Due to long procedure time, ACT decline is expected; periodic checks are essential.",
      "UFH is advantageous in perforation-risk cases because of reversibility."
    ]
  },
  tavr: {
    targets: {
      hemotec: "250-300 sec (at least >250)",
      hemochron: "250-300 sec"
    },
    firstCheck: "5-10 min after bolus",
    maintenanceCheck: "Every 15-30 min",
    fallback: "Some protocols may use a fixed 5000 U initial bolus.",
    redose: [
      { range: "<250 sec", action: "1000-2000 U additional bolus; repeat ACT shortly" },
      { range: "250-300 sec", action: "Target range" },
      { range: ">300 sec", action: "No additional dose required" }
    ],
    decisionBands: [
      { label: "<250 sec", summary: "Below target", action: "Additional UFH: 1000-2000 U bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: "250-300 sec", summary: "Within target range", action: "No additional heparin.", nextCheck: "Monitor ACT every 15-30 min." },
      { label: ">300 sec", summary: "Above target", action: "No additional dose; monitor bleeding/hemostasis clinically.", nextCheck: "Recheck ACT in 15-30 min." }
    ],
    notes: [
      "ACT-guided protamine at procedure end is commonly used for hemostasis.",
      "Large-bore access makes bleeding-thrombosis balance critical."
    ]
  },
  teer: {
    targets: {
      hemotec: ">250 sec",
      hemochron: ">250 sec"
    },
    firstCheck: "Soon after transseptal puncture (~10-15 min)",
    maintenanceCheck: "Every 15-30 min",
    fallback: "Early post-transseptal heparinization is considered critical.",
    redose: [
      { range: "<220 sec", action: "25-30 U/kg additional bolus" },
      { range: "220-249 sec", action: "10-20 U/kg additional bolus" },
      { range: ">=250 sec", action: "Target range" }
    ],
    decisionBands: [
      { label: "<220 sec", summary: "Markedly below target", action: "Additional UFH: 25-30 U/kg bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: "220-249 sec", summary: "Below target margin", action: "Additional UFH: 10-20 U/kg bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: ">=250 sec", summary: "Within target range", action: "Additional heparin may not be required.", nextCheck: "Monitor ACT every 15-30 min." }
    ],
    notes: [
      "Long left-atrial catheter manipulation increases thrombotic risk."
    ]
  },
  laao: {
    targets: {
      hemotec: "250-300 sec",
      hemochron: "250-300 sec"
    },
    firstCheck: "10-15 min after first bolus",
    maintenanceCheck: "Every 15-30 min",
    fallback: "Systemic anticoagulation is established after transseptal access.",
    redose: [
      { range: "<250 sec", action: "15-30 U/kg additional bolus" },
      { range: "250-300 sec", action: "Target range" },
      { range: ">300 sec", action: "No additional dose; monitor bleeding" }
    ],
    decisionBands: [
      { label: "<250 sec", summary: "Below target", action: "Additional UFH: 15-30 U/kg bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: "250-300 sec", summary: "Within target range", action: "No additional heparin.", nextCheck: "Monitor ACT every 15-30 min." },
      { label: ">300 sec", summary: "Above target", action: "No additional dose; monitor bleeding.", nextCheck: "Recheck ACT in 15-30 min." }
    ],
    notes: [
      "Avoid prolonged low ACT due to risk of silent cerebral embolization."
    ]
  },
  af_ablation: {
    targets: {
      hemotec: ">300 sec (many centers 300-350/400)",
      hemochron: ">300 sec"
    },
    firstCheck: "10-15 min",
    maintenanceCheck: "Every 15 min until target, then every 15-30 min",
    fallback: "Higher initial UFH may be needed in uninterrupted DOAC patients.",
    redose: [
      { range: "<150 sec", action: "100 U/kg additional bolus" },
      { range: "150-199 sec", action: "70 U/kg additional bolus" },
      { range: "200-249 sec", action: "50 U/kg additional bolus" },
      { range: "250-299 sec", action: "25 U/kg additional bolus" },
      { range: ">=300 sec", action: "Target range; no additional bolus" }
    ],
    decisionBands: [
      { label: "<150 sec", summary: "Severely below target", action: "Additional UFH: 100 U/kg bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: "150-199 sec", summary: "Markedly subtherapeutic", action: "Additional UFH: 70 U/kg bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: "200-249 sec", summary: "Subtherapeutic", action: "Additional UFH: 50 U/kg bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: "250-299 sec", summary: "Borderline low", action: "Additional UFH: 25 U/kg bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: ">=300 sec", summary: "Within target range", action: "No additional bolus.", nextCheck: "Monitor ACT every 15-30 min." }
    ],
    notes: [
      "Rapid ACT target attainment after left-atrial access reduces embolic risk.",
      "Uninterrupted DOAC patients may reach target ACT later."
    ]
  },
  vt_left: {
    targets: {
      hemotec: ">250-350 sec",
      hemochron: ">250-350 sec"
    },
    firstCheck: "Within first 15 min",
    maintenanceCheck: "Every 15 min until target, then every 15-30 min",
    fallback: "Bolus + infusion combinations can be used per center protocol.",
    redose: [
      { range: "<250 sec", action: "20-30 U/kg additional bolus" },
      { range: "250-300 sec", action: "Acceptable lower target band" },
      { range: ">300 sec", action: "Acceptable range in most centers" }
    ],
    decisionBands: [
      { label: "<250 sec", summary: "Below target", action: "Additional UFH: 20-30 U/kg bolus.", nextCheck: "Repeat ACT in 5-10 min." },
      { label: "250-300 sec", summary: "Acceptable lower target", action: "Assess need for extra dose in clinical context.", nextCheck: "Monitor ACT every 15-30 min." },
      { label: ">300 sec", summary: "Acceptable range", action: "Additional bolus may not be required.", nextCheck: "Monitor ACT every 15-30 min." }
    ],
    notes: [
      "If epicardial transition is planned, heparin timing requires separate planning."
    ]
  },
  ep_right: {
    targets: {
      hemotec: "No routine systemic ACT target",
      hemochron: "No routine systemic ACT target"
    },
    firstCheck: "Routine ACT check is often not required",
    maintenanceCheck: "Clinical-risk based decision",
    redose: [{ range: "Standard scenario", action: "Systemic UFH is usually not administered" }],
    notes: [
      "Approach changes if procedure is prolonged, thrombosis risk is high, or left-heart access is needed."
    ]
  }
};

const i18n = {
  tr: {
    protocolNotFound: "Protokol bulunamadı.",
    institutionProtocol: "Kurum protokolüne göre",
    noRoutineUfH: "Rutin sistemik UFH başlanması çoğu vakada gerekmez.",
    targetActTag: "Hedef ACT",
    doacTag: "DOAC seçili: daha yüksek başlangıç bolusu gerekebilir",
    kpiIndication: "Endikasyon",
    kpiInitial: "Başlangıç UFH",
    kpiFirst: "İlk ACT Ölçümü",
    kpiMaintain: "Hedefte Takip",
    tblAct: "ACT Sonucu",
    tblAction: "Ek Heparin / Aksiyon",
    step1: "Adım 1",
    step2: "Adım 2",
    step3: "Adım 3",
    step4: "Adım 4",
    algoStep1: "Endikasyona göre başlangıç UFH bolusunu uygula.",
    algoStep2: "{firstCheck} ACT ölç ve hedefe göre redose yap.",
    algoStep3: "Hedefe ulaşıldığında {maintenance} aralığında ACT izlemine devam et.",
    algoStep4: "İşlem sonu kanama/tromboz riskine göre reversiyon ve hemostaz planını netleştir.",
    criticalNotes: "Kritik Notlar",
    sessionReset: "Vaka günlüğü sıfırlandı.",
    changedProtocol: "Endikasyon değişti. Yeni vaka akışı başlatıldı.",
    caseReady: "Vaka başlatmaya hazır.",
    caseNoRoutine: "Bu endikasyonda rutin sistemik UFH/ACT takibi çoğu vakada zorunlu değildir. Klinik riske göre bireyselleştirilir.",
    caseComment: "Yorum",
    caseNoActYet: "ACT Bekleniyor",
    caseNoActYetBody: "ACT değerini yazdığında sistem anlık sonraki adımı gösterecek. {lastInfo}",
    lastActNone: "Henüz ACT adımı kaydedilmedi.",
    lastActInfo: "Son kaydedilen ACT: {act} sn ({date}).",
    invalidInput: "Geçersiz Giriş",
    invalidActBody: "Lütfen ACT için pozitif bir sayısal değer gir.",
    noBandBody: "{act} sn için bu protokolde net bir bant bulunamadı. Kurum protokolüne göre karar ver.",
    caseStepTag: "ACT Adımı {step}",
    enteredAct: "Girilen ACT: {act} sn",
    bandLabel: "Bant: {band}",
    outOfTarget: "Hedef Dışı",
    reviewed: "Değerlendirildi",
    whatNow: "Şimdi Ne Yap?",
    nextAct: "Sonraki ACT",
    keepFollow: "Hedefte İzlem",
    recordHint: "Bu adımı kaydetmek için \"ACT Adımını Kaydet\" butonunu kullan.",
    actionTitle: "Adım",
    followTitle: "Takip",
    recordTitle: "Kayıt",
    initRequiredWarn: "Bu endikasyonda başlangıç UFH kaydı zorunlu değil.",
    initAlready: "Başlangıç bolusu zaten kaydedilmiş.",
    initSaved: "Başlangıç bolusu vaka günlüğüne kaydedildi.",
    stepNoNeed: "Bu endikasyonda standart ACT adım kaydı gerekmeyebilir.",
    enterActWarn: "Önce geçerli bir ACT değeri gir.",
    noBandWarn: "Bu ACT için otomatik bant bulunamadı. Manuel karar verip not düşebilirsin.",
    enterDoseWarn: "ACT hedef dışında. Lütfen uygulanan ek UFH dozunu gir.",
    stepSaved: "ACT adımı kaydedildi. Yeni ACT değeriyle vakaya devam edebilirsin.",
    nextStepReady: "ACT adımı kaydedildi. ACT Adımı {step} için yeni değeri gir.",
    emptyLog: "Henüz vaka adımı kaydedilmedi.",
    csvNeedRows: "CSV için önce vaka adımı kaydet.",
    csvDownloaded: "CSV indirildi.",
    csvPreviewNeedRows: "CSV önizleme için önce vaka adımı kaydet.",
    loginOptional: "Giriş yapmadan da kullanabilirsin.",
    loginNeedCreds: "Login için kullanıcı adı ve şifre gir.",
    loginSuccess: "Lokal oturum açıldı: {user}",
    logoutSuccess: "Lokal oturum kapatıldı.",
    loggedAs: "Lokal oturum açık: {user}",
    startPlanIndication: "Endikasyon",
    startPlanTarget: "Hedef ACT (otomatik)",
    startPlanStart: "Başlangıç",
    startPlanBolusAction: "UFH bolus uygula.",
    startPlanStep: "ACT Adımı {step}",
    startPlanInstruction: "Bolustan/son ek dozdan 5-10 dk sonra ACT bak. (Endikasyona özgü not: {firstCheck})",
    noProtocolForCase: "Protokol bulunamadı.",
    doacFull: "Kesintisiz DOAC altında (özellikle AF ablasyon için heparin ihtiyacı artabilir)"
  },
  en: {
    protocolNotFound: "Protocol not found.",
    institutionProtocol: "Per institutional protocol",
    noRoutineUfH: "Routine systemic UFH is usually not required in this indication.",
    targetActTag: "Target ACT",
    doacTag: "DOAC selected: higher initial heparin bolus may be required",
    kpiIndication: "Indication",
    kpiInitial: "Initial UFH",
    kpiFirst: "First ACT Check",
    kpiMaintain: "Follow-up at Target",
    tblAct: "ACT Result",
    tblAction: "Additional Heparin / Action",
    step1: "Step 1",
    step2: "Step 2",
    step3: "Step 3",
    step4: "Step 4",
    algoStep1: "Administer initial UFH bolus based on indication.",
    algoStep2: "Check ACT at {firstCheck} and redose by target.",
    algoStep3: "Once at target, continue ACT monitoring at {maintenance}.",
    algoStep4: "At procedure end, finalize reversal and hemostasis strategy based on bleeding/thrombotic risk.",
    criticalNotes: "Critical Notes",
    sessionReset: "Case log reset.",
    changedProtocol: "Indication changed. New case workflow started.",
    caseReady: "Ready to start the case.",
    caseNoRoutine: "In this indication, routine systemic UFH/ACT tracking may not be mandatory. Individualize by clinical risk.",
    caseComment: "Comment",
    caseNoActYet: "Awaiting ACT",
    caseNoActYetBody: "Once you enter ACT, the next action will be generated automatically. {lastInfo}",
    lastActNone: "No ACT step has been logged yet.",
    lastActInfo: "Last ACT: {act} sec ({date}).",
    invalidInput: "Invalid Input",
    invalidActBody: "Please enter a positive numeric ACT value.",
    noBandBody: "No defined decision band for {act} sec in this protocol. Follow local protocol.",
    caseStepTag: "ACT Step {step}",
    enteredAct: "Entered ACT: {act} sec",
    bandLabel: "Band: {band}",
    outOfTarget: "Out of Target",
    reviewed: "Reviewed",
    whatNow: "What to Do Now?",
    nextAct: "Next ACT",
    keepFollow: "Target Follow-up",
    recordHint: "Use the \"Save ACT Step\" button to log this step.",
    actionTitle: "Action",
    followTitle: "Follow-up",
    recordTitle: "Record",
    initRequiredWarn: "Initial UFH logging is not required in this indication.",
    initAlready: "Initial bolus is already logged.",
    initSaved: "Initial bolus saved to case log.",
    stepNoNeed: "Standard ACT step logging may not be needed in this indication.",
    enterActWarn: "Enter a valid ACT value first.",
    noBandWarn: "No automatic band for this ACT. You can proceed with manual decision notes.",
    enterDoseWarn: "ACT is out of target. Please enter additional UFH dose applied.",
    stepSaved: "ACT step saved. Continue case with the next ACT value.",
    nextStepReady: "ACT step saved. Enter a new value for ACT Step {step}.",
    emptyLog: "No case steps logged yet.",
    csvNeedRows: "Log at least one case step before exporting CSV.",
    csvDownloaded: "CSV downloaded.",
    csvPreviewNeedRows: "Log at least one case step to preview CSV.",
    loginOptional: "You can use the app without login.",
    loginNeedCreds: "Enter username and password for optional login.",
    loginSuccess: "Local session started: {user}",
    logoutSuccess: "Local session closed.",
    loggedAs: "Logged in locally: {user}",
    startPlanIndication: "Indication",
    startPlanTarget: "Target ACT (auto)",
    startPlanStart: "Start",
    startPlanBolusAction: "Apply UFH bolus.",
    startPlanStep: "ACT Step {step}",
    startPlanInstruction: "Check ACT 5-10 min after bolus/last redose. (Procedure note: {firstCheck})",
    noProtocolForCase: "Protocol not found.",
    doacFull: "On uninterrupted DOAC (heparin requirement may increase, especially for AF ablation)"
  }
};

const staticText = {
  "hero-eyebrow": { tr: "KARDİYOLOJİ ANTİKOAGÜLASYON PANELİ", en: "CARDIOLOGY ANTICOAGULATION PANEL" },
  "hero-subtitle": {
    tr: "Girişimsel kardiyoloji, yapısal kalp girişimleri ve elektrofizyoloji için ACT hedefi, UFH doz başlangıcı ve dinamik takip algoritması.",
    en: "ACT targets, UFH initial dosing and dynamic follow-up algorithm for interventional cardiology, structural interventions and electrophysiology."
  },
  "hero-disclaimer": {
    tr: "Bu uygulama klinik karar desteği amaçlı bir çalışma taslağıdır. Nihai tedavi kararı için kurum protokolü ve sorumlu hekim değerlendirmesi esastır.",
    en: "This app is a clinical decision-support draft. Final treatment decisions must follow institutional protocols and physician judgment."
  },
  "tab-derleme": { tr: "1) ACT Derleme", en: "1) ACT Synthesis" },
  "tab-case": { tr: "2) Vaka Özel Algoritma", en: "2) Case-Specific Algorithm" },
  "controls-title": { tr: "Prosedür ve Parametreler", en: "Procedure and Parameters" },
  "algorithm-title": { tr: "Seçilen Prosedür Algoritması", en: "Selected Procedure Algorithm" },
  "synthesis-title": { tr: "ACT Derleme", en: "ACT Synthesis" },
  "syn-common": { tr: "Ortak Prensipler", en: "Common Principles" },
  "syn-common-1": { tr: "UFH, kateter laboratuvarında hızlı titre edilebilir ve protamin ile geri döndürülebilir.", en: "UFH can be rapidly titrated in the cath lab and reversed with protamine." },
  "syn-common-2": { tr: "ACT hedefi prosedür tipi ve kullanılan cihaza göre değişir.", en: "ACT targets vary by procedure type and measurement device." },
  "syn-common-3": { tr: "Hemochron ölçümleri, HemoTec/i-STAT'a göre yaklaşık daha yüksek kabul edilir.", en: "Hemochron readings are generally interpreted as higher than HemoTec/i-STAT." },
  "syn-common-4": { tr: "Uzayan işlemlerde tekrar ACT takibi zorunlu hale gelir.", en: "Repeated ACT checks become essential in prolonged procedures." },
  "syn-pci": { tr: "Koroner PCI Özeti", en: "Coronary PCI Summary" },
  "syn-pci-1": { tr: "GP IIb/IIIa yoksa: 70-100 U/kg, hedef ACT 250-300 (HemoTec) / 300-350 (Hemochron).", en: "Without GP IIb/IIIa: 70-100 U/kg, target ACT 250-300 (HemoTec) / 300-350 (Hemochron)." },
  "syn-pci-2": { tr: "GP IIb/IIIa varsa: 50-70 U/kg, hedef ACT 200-250.", en: "With GP IIb/IIIa: 50-70 U/kg, target ACT 200-250." },
  "syn-pci-3": { tr: "İlk ACT: bolustan 5-10 dk sonra.", en: "First ACT: 5-10 min after bolus." },
  "syn-pci-4": { tr: "Kompleks/uzun PCI: her 20-30 dk ACT yeniden kontrol.", en: "Complex/long PCI: recheck ACT every 20-30 min." },
  "syn-struct": { tr: "Yapısal Kalp Özeti", en: "Structural Heart Summary" },
  "syn-struct-1": { tr: "TAVR/TEER/LAAO'da hedef sıklıkla ACT >=250-300 aralığıdır.", en: "For TAVR/TEER/LAAO, target ACT is often >=250-300." },
  "syn-struct-2": { tr: "Büyük kılıf ve uzun intrakardiyak manipülasyon tromboz riskini artırır.", en: "Large sheaths and prolonged intracardiac manipulation increase thrombosis risk." },
  "syn-struct-3": { tr: "TAVR sonunda ACT rehberli protamin, kanamayı azaltmak için sık kullanılan yaklaşımdır.", en: "ACT-guided protamine after TAVR is commonly used to reduce bleeding." },
  "syn-struct-4": { tr: "İşleme özgü protokoller merkezler arasında heterojen olabilir.", en: "Procedure-specific protocols can vary across centers." },
  "syn-ep": { tr: "Elektrofizyoloji Özeti", en: "Electrophysiology Summary" },
  "syn-ep-1": { tr: "AF/sol atriyal ablasyonda ana hedef çoğu protokolde ACT >300 saniyedir.", en: "In AF/left atrial ablation, target ACT is >300 sec in most protocols." },
  "syn-ep-2": { tr: "DOAC altında hedef ACT'ye ulaşmak için daha yüksek UFH gerekebilir.", en: "On DOAC, higher UFH may be needed to reach target ACT." },
  "syn-ep-3": { tr: "Sol kalp VT/PVC ablasyonunda ACT tipik olarak >250-350 aralığında tutulur.", en: "In left-heart VT/PVC ablation, ACT is typically maintained at >250-350." },
  "syn-ep-4": { tr: "Saf sağ taraf EP işlemlerinde sistemik heparinizasyon her zaman gerekli değildir.", en: "In purely right-sided EP procedures, systemic heparinization is not always required." },
  "quick-compare-title": { tr: "Hızlı Karşılaştırma Tablosu", en: "Quick Comparison Table" },
  "th-procedure": { tr: "Prosedür", en: "Procedure" },
  "th-target": { tr: "Hedef ACT", en: "Target ACT" },
  "th-dose": { tr: "Başlangıç UFH", en: "Initial UFH" },
  "th-first": { tr: "İlk Kontrol", en: "First Check" },
  "th-follow": { tr: "Hedefte İzlem", en: "Follow-up at Target" },
  "row-pci-1": { tr: "Standart PCI (GP yok)", en: "Standard PCI (No GP)" },
  "row-pci-1-c2": { tr: "250-300 (HemoTec) / 300-350 (Hemochron)", en: "250-300 (HemoTec) / 300-350 (Hemochron)" },
  "row-pci-1-c3": { tr: "70-100 U/kg", en: "70-100 U/kg" },
  "row-pci-1-c4": { tr: "5-10 dk", en: "5-10 min" },
  "row-pci-1-c5": { tr: "20-30 dk (uzun işlem)", en: "20-30 min (long procedures)" },
  "row-pci-2": { tr: "PCI + GP IIb/IIIa", en: "PCI + GP IIb/IIIa" },
  "row-pci-2-c2": { tr: "200-250", en: "200-250" },
  "row-pci-2-c3": { tr: "50-70 U/kg", en: "50-70 U/kg" },
  "row-pci-2-c4": { tr: "5-10 dk", en: "5-10 min" },
  "row-pci-2-c5": { tr: "20-30 dk", en: "20-30 min" },
  "row-pci-3": { tr: "CTO / Kompleks PCI", en: "CTO / Complex PCI" },
  "row-pci-3-c2": { tr: ">300 (retrograd >350)", en: ">300 (retrograde >350)" },
  "row-pci-3-c3": { tr: "~100 U/kg + ek boluslar", en: "~100 U/kg + additional boluses" },
  "row-pci-3-c4": { tr: "5-10 dk", en: "5-10 min" },
  "row-pci-3-c5": { tr: "20-30 dk", en: "20-30 min" },
  "row-tavr": { tr: "TAVR", en: "TAVR" },
  "row-tavr-c2": { tr: "250-300 (en az >250)", en: "250-300 (at least >250)" },
  "row-tavr-c3": { tr: "50-100 U/kg (merkez protokolüne göre)", en: "50-100 U/kg (by center protocol)" },
  "row-tavr-c4": { tr: "5-10 dk", en: "5-10 min" },
  "row-tavr-c5": { tr: "15-30 dk", en: "15-30 min" },
  "row-ep": { tr: "AF Ablasyon", en: "AF Ablation" },
  "row-ep-c2": { tr: ">300 (çoğu merkez 300-350/400)", en: ">300 (many centers 300-350/400)" },
  "row-ep-c3": { tr: "100-130 U/kg", en: "100-130 U/kg" },
  "row-ep-c4": { tr: "10-15 dk", en: "10-15 min" },
  "row-ep-c5": { tr: "15-30 dk", en: "15-30 min" },
  "case-title": { tr: "Vaka Özel Algoritma", en: "Case-Specific Algorithm" },
  "case-desc": {
    tr: "Adım adım ilerler: önce endikasyon seçilir, hedef ACT otomatik belirlenir, UFH bolusu uygulanır, 5-10 dk sonrası ACT girilir ve sisteme göre bir sonraki yorum/öneri otomatik üretilir.",
    en: "Stepwise flow: select indication, auto-target ACT appears, apply UFH bolus, enter ACT at 5-10 min, then next recommendation is generated automatically."
  },
  "login-title": { tr: "Opsiyonel Kullanıcı Girişi", en: "Optional User Login" },
  "patient-title": { tr: "Opsiyonel Hasta Bilgisi", en: "Optional Patient Info" },
  "case-step1-title": { tr: "1) Endikasyon Seçimi", en: "1) Indication Selection" },
  "case-step2-title": { tr: "2) Otomatik Başlangıç Planı", en: "2) Automatic Initial Plan" },
  "case-step3-title": { tr: "3) 5-10 dk Sonrası ACT", en: "3) ACT at 5-10 min" },
  "extra-dose-title": { tr: "Uygulanan Ek UFH dozu (sadece hedef dışı ACT için)", en: "Additional UFH Dose Applied (only for out-of-target ACT)" },
  "case-log-title": { tr: "Vaka Günlüğü (Tarih - Doz - ACT)", en: "Case Log (Date - Dose - ACT)" },
  "footer-note": {
    tr: "ACT Navigator v1.0 | Klinik kullanım öncesi kurum protokolü ile doğrulayın.",
    en: "ACT Navigator v1.0 | Validate with institutional protocol before clinical use."
  },
  "case-save-step-btn": { tr: "ACT Adımını Kaydet", en: "Save ACT Step" },
  "case-save-dose-btn": { tr: "Bu Adımı Kaydet", en: "Save This Step" },
  "case-reset-btn": { tr: "Vakayı Sıfırla", en: "Reset Case" },
  "case-csv-download-btn": { tr: "CSV İndir", en: "Download CSV" },
  "case-csv-preview-btn": { tr: "CSV Görüntüle", en: "Preview CSV" },
  "case-login-btn": { tr: "Login (Opsiyonel)", en: "Login (Optional)" },
  "case-logout-btn": { tr: "Çıkış", en: "Logout" },
  "log-th-date": { tr: "Tarih/Saat", en: "Date/Time" },
  "log-th-user": { tr: "Kullanıcı", en: "User" },
  "log-th-patient": { tr: "Hasta", en: "Patient" },
  "log-th-step": { tr: "Adım", en: "Step" },
  "log-th-act": { tr: "ACT (sn)", en: "ACT (sec)" },
  "log-th-dose": { tr: "Doz (U)", en: "Dose (U)" },
  "log-th-action": { tr: "Yorum/Aksiyon", en: "Comment/Action" },
  "log-th-next": { tr: "Sonraki ACT", en: "Next ACT" },
  "case-hint": {
    tr: "ACT kutusunu boş bırakabilir, ölçüm geldikçe değeri yazabilirsin. İlk kayıtla başlangıç bolusu otomatik loglanır.",
    en: "You can leave ACT empty and enter values as they become available. Initial bolus is auto-logged with the first saved ACT step."
  },
  "patient-hint": {
    tr: "Bu alanlar boş bırakılabilir; CSV'ye otomatik eklenir.",
    en: "These fields are optional and will be included in CSV automatically."
  }
};

const labelPrefixText = {
  "lang-label": { tr: "Dil / Language", en: "Language" },
  "label-procedure": { tr: "Prosedür", en: "Procedure" },
  "label-device": { tr: "ACT cihazı", en: "ACT device" },
  "label-weight": { tr: "Hasta kilosu (kg)", en: "Patient weight (kg)" },
  "label-doac-line": { tr: "Kesintisiz DOAC altında (özellikle AF ablasyon için heparin ihtiyacı artabilir)", en: "On uninterrupted DOAC (heparin requirement may increase, especially for AF ablation)" },
  "login-user-label": { tr: "Kullanıcı adı", en: "Username" },
  "login-pass-label": { tr: "Şifre", en: "Password" },
  "patient-id-label": { tr: "Hasta ID", en: "Patient ID" },
  "patient-name-label": { tr: "Hasta adı/etiketi", en: "Patient name/label" },
  "case-indication-label": { tr: "Endikasyon / Prosedür", en: "Indication / Procedure" },
  "case-weight-label": { tr: "Hasta kilosu (kg)", en: "Patient weight (kg)" },
  "case-act-label": { tr: "ACT değeri (sn)", en: "ACT value (sec)" },
  "case-datetime-label": { tr: "Ölçüm tarihi/saati", en: "Measurement date/time" },
  "extra-dose-label": { tr: "Uygulanan ek UFH dozu (U)", en: "Additional UFH dose applied (U)" }
};

const placeholderText = {
  "weight-input": { tr: "Örn: 78", en: "e.g. 78" },
  "case-weight-input": { tr: "Örn: 82", en: "e.g. 82" },
  "case-act-input": { tr: "Örn: 235", en: "e.g. 235" },
  "case-dose-input": { tr: "Örn: 3000", en: "e.g. 3000" },
  "login-user-input": { tr: "Doktor kullanıcı adı", en: "Clinician username" },
  "login-pass-input": { tr: "Şifre", en: "Password" },
  "case-patient-id-input": { tr: "Örn: ACT-2026-001", en: "e.g. ACT-2026-001" },
  "case-patient-name-input": { tr: "Örn: Hasta A", en: "e.g. Patient A" }
};

const state = {
  language: "tr",
  selectedProtocolId: protocols[0].id,
  caseProtocolId: protocols[0].id,
  userSession: {
    loggedIn: false,
    userName: ""
  },
  caseSession: {
    rows: [],
    nextActStep: 1,
    activeBand: null,
    csvPreviewVisible: false
  }
};

function t(key, vars = {}) {
  const bundle = i18n[state.language] || i18n.tr;
  const fallback = i18n.tr[key] || key;
  let text = bundle[key] || fallback;
  Object.entries(vars).forEach(([k, v]) => {
    text = text.replaceAll(`{${k}}`, String(v));
  });
  return text;
}

function getProtocolDisplayName(protocol) {
  if (state.language === "en" && protocolNamesEn[protocol.id]) {
    return protocolNamesEn[protocol.id];
  }
  return protocol.name;
}

function getProtocolIndication(protocol) {
  if (state.language === "en" && protocolIndicationsEn[protocol.id]) {
    return protocolIndicationsEn[protocol.id];
  }
  return protocol.indication;
}

function localizeProtocol(protocol) {
  if (!protocol || state.language !== "en") return protocol;

  const override = protocolLocaleEn[protocol.id] || {};
  const localized = {
    ...protocol,
    name: getProtocolDisplayName(protocol),
    indication: getProtocolIndication(protocol)
  };

  if (override.firstCheck) localized.firstCheck = override.firstCheck;
  if (override.maintenanceCheck) localized.maintenanceCheck = override.maintenanceCheck;
  if (override.notes) localized.notes = override.notes;
  if (override.targets) {
    localized.targets = {
      ...localized.targets,
      ...override.targets
    };
  }

  if (localized.initialDose) {
    localized.initialDose = {
      ...localized.initialDose,
      fallback: override.fallback || localized.initialDose.fallback
    };
  }

  if (override.redose && Array.isArray(protocol.redose)) {
    localized.redose = protocol.redose.map((item, idx) => ({
      ...item,
      ...(override.redose[idx] || {})
    }));
  }

  if (override.decisionBands && Array.isArray(protocol.decisionBands)) {
    localized.decisionBands = protocol.decisionBands.map((item, idx) => ({
      ...item,
      ...(override.decisionBands[idx] || {})
    }));
  }

  return localized;
}

function getGroupDisplay(group) {
  if (state.language === "en") {
    if (group === "Koroner") return "Coronary";
    if (group === "Yapısal") return "Structural";
    if (group === "Elektrofizyoloji") return "Electrophysiology";
  }
  return group;
}

function formatUnits(value) {
  const locale = state.language === "en" ? "en-US" : "tr-TR";
  return Math.round(value).toLocaleString(locale);
}

function formatDateTimeForInput(dateObj) {
  const pad = (n) => String(n).padStart(2, "0");
  const y = dateObj.getFullYear();
  const m = pad(dateObj.getMonth() + 1);
  const d = pad(dateObj.getDate());
  const hh = pad(dateObj.getHours());
  const mm = pad(dateObj.getMinutes());
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

function formatDateTimeDisplay(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const locale = state.language === "en" ? "en-US" : "tr-TR";
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}

function csvCell(value) {
  const str = value === null || value === undefined ? "" : String(value);
  return `"${str.replaceAll("\"", "\"\"")}"`;
}

function setTextById(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setLabelPrefix(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const textNodes = Array.from(el.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE);
  const textNode = textNodes.find((node) => node.nodeValue && node.nodeValue.trim().length > 0) || textNodes[0];
  if (textNode) {
    textNode.nodeValue = `${value}\n`;
  }
}

function applyLanguage() {
  document.documentElement.lang = state.language === "en" ? "en" : "tr";
  document.title =
    state.language === "en"
      ? "ACT Navigator - ACT and Heparin Tracking in Cardiology Interventions"
      : "ACT Navigator - Kardiyoloji Girişimlerinde ACT ve Heparin Takibi";
  ui.languageSelect.value = state.language;

  Object.entries(staticText).forEach(([id, item]) => {
    setTextById(id, item[state.language] || item.tr);
  });

  Object.entries(labelPrefixText).forEach(([id, item]) => {
    setLabelPrefix(id, item[state.language] || item.tr);
  });

  Object.entries(placeholderText).forEach(([id, item]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = item[state.language] || item.tr;
  });

  ui.deviceSelect.options[0].textContent = state.language === "en" ? "HemoTec / i-STAT" : "HemoTec / i-STAT";
  ui.deviceSelect.options[1].textContent = state.language === "en" ? "Hemochron" : "Hemochron";

  fillProcedureSelect();
  updateLoginStatus();
  renderAlgorithm();
  renderCaseInitialPlan();
  renderCaseDecision();
  renderCaseLog();
}

function findProtocol(id) {
  const protocol = protocols.find((item) => item.id === id);
  return localizeProtocol(protocol);
}

function getDoseText(protocol, weight, doacChecked) {
  const dose = protocol.initialDose;

  if (!dose || dose.mode === "none") {
    return t("noRoutineUfH");
  }

  let min = dose.min;
  let max = dose.max;

  if (protocol.id === "af_ablation" && doacChecked) {
    min = Math.round(min * 1.1);
    max = Math.round(max * 1.15);
  }

  const unitSuffix = state.language === "en" ? "U/kg" : "U/kg";
  const rangeText = min === max ? `${min} ${unitSuffix}` : `${min}-${max} ${unitSuffix}`;
  const approx = state.language === "en" ? "approx." : "yaklaşık";

  if (!weight) {
    return `${rangeText} IV bolus. ${dose.fallback || ""}`.trim();
  }

  let lowUnits = weight * min;
  let highUnits = weight * max;

  if (dose.maxUnits) {
    lowUnits = Math.min(lowUnits, dose.maxUnits);
    highUnits = Math.min(highUnits, dose.maxUnits);
  }

  if (min === max) {
    return `${rangeText} ≈ ${formatUnits(lowUnits)} U (${approx}, ${weight} kg). ${dose.fallback || ""}`.trim();
  }

  return `${rangeText} ≈ ${formatUnits(lowUnits)}-${formatUnits(highUnits)} U (${approx}, ${weight} kg). ${dose.fallback || ""}`.trim();
}

function getTargetText(protocol, device) {
  return protocol.targets[device] || protocol.targets.hemotec || t("institutionProtocol");
}

function buildRedoseRows(redose) {
  return redose
    .map(
      (row) => `
        <tr>
          <td>${row.range}</td>
          <td>${row.action}</td>
        </tr>
      `
    )
    .join("");
}

function setCaseFeedback(message, tone = "info") {
  ui.caseFeedback.textContent = message;
  if (tone === "warn") {
    ui.caseFeedback.style.color = "#b85c00";
  } else if (tone === "ok") {
    ui.caseFeedback.style.color = "#217a5a";
  } else {
    ui.caseFeedback.style.color = "#4b6070";
  }
}

function updateLoginStatus() {
  if (state.userSession.loggedIn) {
    ui.caseLoginStatus.textContent = t("loggedAs", { user: state.userSession.userName });
  } else {
    ui.caseLoginStatus.textContent = t("loginOptional");
  }
}

function estimateNextMinutes(nextCheckText) {
  const text = (nextCheckText || "").toLowerCase();
  if (text.includes("5-10")) return 10;
  if (text.includes("10-15")) return 15;
  if (text.includes("15-30")) return 20;
  if (text.includes("20-30")) return 25;
  if (text.includes("30")) return 30;
  return 15;
}

function ensureCaseDatetime() {
  if (!ui.caseDatetimeInput.value) {
    ui.caseDatetimeInput.value = formatDateTimeForInput(new Date());
  }
}

function toggleExtraDoseBlock(show) {
  if (show) {
    ui.caseExtraDoseBlock.classList.remove("hidden");
  } else {
    ui.caseExtraDoseBlock.classList.add("hidden");
    ui.caseDoseInput.value = "";
  }
}

function renderAlgorithm() {
  const protocol = findProtocol(state.selectedProtocolId);
  if (!protocol) {
    ui.algorithmOutput.innerHTML = `<p>${t("protocolNotFound")}</p>`;
    return;
  }

  const weight = Number(ui.weightInput.value);
  const validWeight = Number.isFinite(weight) && weight >= 30 ? weight : null;

  const target = getTargetText(protocol, ui.deviceSelect.value);
  const doseText = getDoseText(protocol, validWeight, ui.doacCheck.checked);

  const tags = [
    `<span class="tag">${getGroupDisplay(protocol.group)}</span>`,
    `<span class="tag">${t("targetActTag")}: ${target}</span>`
  ];

  if (protocol.id === "af_ablation" && ui.doacCheck.checked) {
    tags.push(`<span class="tag warn">${t("doacTag")}</span>`);
  }

  const notesList = protocol.notes.map((note) => `<li>${note}</li>`).join("");

  ui.algorithmOutput.innerHTML = `
    <div class="tag-line">${tags.join("")}</div>

    <div class="output-grid">
      <div class="kpi">
        <h4>${t("kpiIndication")}</h4>
        <p>${getProtocolIndication(protocol)}</p>
      </div>
      <div class="kpi">
        <h4>${t("kpiInitial")}</h4>
        <p>${doseText}</p>
      </div>
      <div class="kpi">
        <h4>${t("kpiFirst")}</h4>
        <p>${protocol.firstCheck}</p>
      </div>
      <div class="kpi">
        <h4>${t("kpiMaintain")}</h4>
        <p>${protocol.maintenanceCheck}</p>
      </div>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>${t("tblAct")}</th>
            <th>${t("tblAction")}</th>
          </tr>
        </thead>
        <tbody>
          ${buildRedoseRows(protocol.redose)}
        </tbody>
      </table>
    </div>

    <div class="timeline">
      <div class="timeline-step"><strong>${t("step1")}:</strong> ${t("algoStep1")}</div>
      <div class="timeline-step"><strong>${t("step2")}:</strong> ${t("algoStep2", { firstCheck: protocol.firstCheck })}</div>
      <div class="timeline-step"><strong>${t("step3")}:</strong> ${t("algoStep3", { maintenance: protocol.maintenanceCheck })}</div>
      <div class="timeline-step"><strong>${t("step4")}:</strong> ${t("algoStep4")}</div>
    </div>

    <div class="kpi">
      <h4>${t("criticalNotes")}</h4>
      <ul>${notesList}</ul>
    </div>
  `;
}

function fillProcedureSelect() {
  const selectedMain = ui.procedureSelect.value || state.selectedProtocolId;
  const selectedCase = ui.caseIndicationSelect.value || state.caseProtocolId;

  const options = protocols
    .map((protocol) => `<option value="${protocol.id}">${getProtocolDisplayName(protocol)}</option>`)
    .join("");

  ui.procedureSelect.innerHTML = options;
  ui.caseIndicationSelect.innerHTML = options;

  ui.procedureSelect.value = protocols.some((p) => p.id === selectedMain) ? selectedMain : state.selectedProtocolId;
  ui.caseIndicationSelect.value = protocols.some((p) => p.id === selectedCase) ? selectedCase : state.caseProtocolId;

  state.selectedProtocolId = ui.procedureSelect.value;
  state.caseProtocolId = ui.caseIndicationSelect.value;
}

function setupMainTabs() {
  ui.topTabs.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.tabTarget;

      ui.topTabs.forEach((tab) => tab.classList.remove("active"));
      ui.tabPanels.forEach((panel) => panel.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(targetId).classList.add("active");
    });
  });
}

function resolveDecisionBand(protocol, actValue) {
  if (!protocol.decisionBands || protocol.decisionBands.length === 0) {
    return null;
  }

  return protocol.decisionBands.find((band) => {
    const minOk = band.min === undefined || actValue >= band.min;
    const maxOk = band.max === undefined || actValue <= band.max;
    return minOk && maxOk;
  });
}

function resetCaseSession(message = t("sessionReset"), tone = "info") {
  state.caseSession.rows = [];
  state.caseSession.nextActStep = 1;
  state.caseSession.activeBand = null;
  state.caseSession.csvPreviewVisible = false;
  ui.caseActInput.value = "";
  ui.caseDoseInput.value = "";
  ui.caseSaveStepBtn.disabled = false;
  toggleExtraDoseBlock(false);
  ui.caseCsvPreview.classList.add("hidden");
  ui.caseCsvPreview.textContent = "";
  ui.caseCsvPreviewBtn.classList.remove("active");
  ui.caseDatetimeInput.value = formatDateTimeForInput(new Date());
  setCaseFeedback(message, tone);
  renderCaseInitialPlan();
  renderCaseDecision();
  renderCaseLog();
}

function renderCaseInitialPlan() {
  const protocol = findProtocol(state.caseProtocolId);
  if (!protocol) {
    ui.caseInitialPlan.innerHTML = `<p>${t("noProtocolForCase")}</p>`;
    return;
  }

  const caseWeight = Number(ui.caseWeightInput.value);
  const validWeight = Number.isFinite(caseWeight) && caseWeight >= 30 ? caseWeight : null;
  const target = getTargetText(protocol, ui.deviceSelect.value);
  const doseText = getDoseText(protocol, validWeight, false);
  const nextStep = state.caseSession.nextActStep;
  const step3Title = document.getElementById("case-step3-title");
  if (step3Title) {
    step3Title.textContent =
      state.language === "en"
        ? `3) ACT at 5-10 min - ACT Step ${nextStep}`
        : `3) 5-10 dk Sonrası ACT - ACT Adımı ${nextStep}`;
  }

  ui.caseInitialPlan.innerHTML = `
    <div class="timeline-step"><strong>${t("startPlanIndication")}:</strong> ${getProtocolDisplayName(protocol)}</div>
    <div class="timeline-step"><strong>${t("startPlanTarget")}:</strong> ${target}</div>
    <div class="timeline-step"><strong>${t("startPlanStart")}:</strong> ${t("startPlanBolusAction")} <br/>${doseText}</div>
    <div class="timeline-step"><strong>${t("startPlanStep", { step: nextStep })}:</strong> ${t("startPlanInstruction", { firstCheck: protocol.firstCheck })}</div>
  `;
}

function renderCaseDecision() {
  toggleExtraDoseBlock(false);
  ui.caseSaveStepBtn.disabled = false;
  const protocol = findProtocol(state.caseProtocolId);
  if (!protocol) {
    ui.caseOutput.innerHTML = "";
    state.caseSession.activeBand = null;
    return;
  }

  if (protocol.initialDose.mode === "none") {
    state.caseSession.activeBand = null;
    ui.caseOutput.innerHTML = `
      <div class="kpi">
        <h4>${t("caseComment")}</h4>
        <p>${t("caseNoRoutine")}</p>
      </div>
    `;
    return;
  }

  const raw = ui.caseActInput.value;
  const actValue = Number(raw);

  if (!raw) {
    state.caseSession.activeBand = null;
    const lastActRow = [...state.caseSession.rows].reverse().find((row) => row.type === "act");
    const lastInfo = lastActRow
      ? t("lastActInfo", { act: lastActRow.act, date: lastActRow.datetimeDisplay })
      : t("lastActNone");

    ui.caseOutput.innerHTML = `
      <div class="kpi">
        <h4>${t("caseNoActYet")}</h4>
        <p>${t("caseNoActYetBody", { lastInfo })}</p>
      </div>
    `;
    return;
  }

  if (!Number.isFinite(actValue) || actValue <= 0) {
    state.caseSession.activeBand = null;
    ui.caseOutput.innerHTML = `
      <div class="kpi">
        <h4>${t("invalidInput")}</h4>
        <p>${t("invalidActBody")}</p>
      </div>
    `;
    return;
  }

  const band = resolveDecisionBand(protocol, actValue);
  state.caseSession.activeBand = band;

  if (!band) {
    ui.caseOutput.innerHTML = `
      <div class="kpi">
        <h4>${t("caseComment")}</h4>
        <p>${t("noBandBody", { act: actValue })}</p>
      </div>
    `;
    return;
  }

  if (band.tone === "warn") {
    toggleExtraDoseBlock(true);
    ui.caseSaveStepBtn.disabled = true;
  }

  const toneTag = band.tone === "warn" ? `<span class="tag warn">${t("outOfTarget")}</span>` : `<span class="tag">${t("reviewed")}</span>`;

  ui.caseOutput.innerHTML = `
    <div class="tag-line">
      <span class="tag">${t("caseStepTag", { step: state.caseSession.nextActStep })}</span>
      <span class="tag">${t("enteredAct", { act: actValue })}</span>
      <span class="tag">${t("bandLabel", { band: band.label })}</span>
      ${toneTag}
    </div>

    <div class="output-grid">
      <div class="kpi">
        <h4>${t("caseComment")}</h4>
        <p>${band.summary}</p>
      </div>
      <div class="kpi">
        <h4>${t("whatNow")}</h4>
        <p>${band.action}</p>
      </div>
      <div class="kpi">
        <h4>${t("nextAct")}</h4>
        <p>${band.nextCheck}</p>
      </div>
      <div class="kpi">
        <h4>${t("keepFollow")}</h4>
        <p>${protocol.maintenanceCheck}</p>
      </div>
    </div>

    <div class="timeline">
      <div class="timeline-step"><strong>${t("actionTitle")}:</strong> ${band.action}</div>
      <div class="timeline-step"><strong>${t("followTitle")}:</strong> ${band.nextCheck}</div>
      <div class="timeline-step"><strong>${t("recordTitle")}:</strong> ${t("recordHint")}</div>
    </div>
  `;
}

function hasInitialRow() {
  return state.caseSession.rows.some((row) => row.type === "initial");
}

function createRowBase(protocol) {
  const dateValue = ui.caseDatetimeInput.value || formatDateTimeForInput(new Date());
  const patientId = ui.casePatientIdInput.value.trim();
  const patientName = ui.casePatientNameInput.value.trim();
  return {
    datetime: dateValue,
    datetimeDisplay: formatDateTimeDisplay(dateValue),
    protocol: getProtocolDisplayName(protocol),
    target: getTargetText(protocol, ui.deviceSelect.value),
    user: state.userSession.loggedIn ? state.userSession.userName : "",
    patientId,
    patientName
  };
}

function pushCaseRow(row) {
  state.caseSession.rows.push(row);
  renderCaseLog();
}

function saveInitialBolus(silent = false) {
  const protocol = findProtocol(state.caseProtocolId);
  if (!protocol || protocol.initialDose.mode === "none") {
    if (!silent) setCaseFeedback(t("initRequiredWarn"), "warn");
    return false;
  }

  if (hasInitialRow()) {
    if (!silent) setCaseFeedback(t("initAlready"), "warn");
    return false;
  }

  ensureCaseDatetime();
  const weight = Number(ui.caseWeightInput.value);
  const validWeight = Number.isFinite(weight) && weight >= 30 ? weight : null;
  const doseText = getDoseText(protocol, validWeight, false);

  pushCaseRow({
    ...createRowBase(protocol),
    type: "initial",
    step: state.language === "en" ? "Initial" : "Başlangıç",
    act: "",
    dose: doseText,
    action: state.language === "en" ? "Initial UFH bolus applied." : "Başlangıç UFH bolusu uygulandı.",
    nextCheck: protocol.firstCheck
  });

  const currentDate = new Date(ui.caseDatetimeInput.value);
  const nextDate = new Date(currentDate.getTime() + estimateNextMinutes(protocol.firstCheck) * 60000);
  ui.caseDatetimeInput.value = formatDateTimeForInput(nextDate);

  if (!silent) setCaseFeedback(t("initSaved"), "ok");
  return true;
}

function saveActStep() {
  const protocol = findProtocol(state.caseProtocolId);
  if (!protocol) return;

  if (protocol.initialDose.mode === "none") {
    setCaseFeedback(t("stepNoNeed"), "warn");
    return;
  }

  const rawAct = ui.caseActInput.value.trim();
  const actValue = Number(rawAct);

  if (!rawAct || !Number.isFinite(actValue) || actValue <= 0) {
    setCaseFeedback(t("enterActWarn"), "warn");
    return;
  }

  const band = state.caseSession.activeBand || resolveDecisionBand(protocol, actValue);
  if (!band) {
    setCaseFeedback(t("noBandWarn"), "warn");
    return;
  }

  if (!hasInitialRow()) {
    saveInitialBolus(true);
  }

  ensureCaseDatetime();
  const doseInput = ui.caseDoseInput.value.trim();
  if (band.tone === "warn" && !doseInput) {
    setCaseFeedback(t("enterDoseWarn"), "warn");
    toggleExtraDoseBlock(true);
    ui.caseSaveStepBtn.disabled = true;
    return;
  }

  const doseValue = doseInput || "0";

  pushCaseRow({
    ...createRowBase(protocol),
    type: "act",
    step: state.language === "en" ? `ACT ${state.caseSession.nextActStep}` : `ACT ${state.caseSession.nextActStep}`,
    act: actValue,
    dose: doseValue,
    action: band.action,
    nextCheck: band.nextCheck
  });

  state.caseSession.nextActStep += 1;
  const currentDate = new Date(ui.caseDatetimeInput.value);
  const nextDate = new Date(currentDate.getTime() + estimateNextMinutes(band.nextCheck) * 60000);
  ui.caseDatetimeInput.value = formatDateTimeForInput(nextDate);

  ui.caseActInput.value = "";
  ui.caseDoseInput.value = "";
  ui.caseSaveStepBtn.disabled = false;
  renderCaseInitialPlan();
  renderCaseDecision();
  ui.caseActInput.focus();
  setCaseFeedback(t("nextStepReady", { step: state.caseSession.nextActStep }), "ok");
}

function renderCaseLog() {
  if (state.caseSession.rows.length === 0) {
    ui.caseLogBody.innerHTML = `
      <tr>
        <td colspan="8">${t("emptyLog")}</td>
      </tr>
    `;
    return;
  }

  ui.caseLogBody.innerHTML = state.caseSession.rows
    .map((row) => {
      const patientText = [row.patientId, row.patientName].filter(Boolean).join(" / ") || "-";
      const userText = row.user || "-";
      return `
        <tr>
          <td>${escapeHtml(row.datetimeDisplay)}</td>
          <td>${escapeHtml(userText)}</td>
          <td>${escapeHtml(patientText)}</td>
          <td>${escapeHtml(row.step)}</td>
          <td>${escapeHtml(row.act)}</td>
          <td>${escapeHtml(row.dose)}</td>
          <td>${escapeHtml(row.action)}</td>
          <td>${escapeHtml(row.nextCheck)}</td>
        </tr>
      `;
    })
    .join("");
}

function buildCaseCsv() {
  const headers =
    state.language === "en"
      ? ["date_time", "user", "patient_id", "patient_name", "procedure", "target_act", "step", "act_sec", "dose", "action", "next_act_check"]
      : ["tarih_saat", "kullanici", "hasta_id", "hasta_adi", "prosedur", "hedef_act", "adim", "act_sn", "doz", "aksiyon", "sonraki_act_kontrolu"];

  const lines = [headers.map(csvCell).join(",")];

  state.caseSession.rows.forEach((row) => {
    lines.push(
      [
        row.datetimeDisplay,
        row.user,
        row.patientId,
        row.patientName,
        row.protocol,
        row.target,
        row.step,
        row.act,
        row.dose,
        row.action,
        row.nextCheck
      ]
        .map(csvCell)
        .join(",")
    );
  });

  return lines.join("\n");
}

function downloadCaseCsv() {
  if (state.caseSession.rows.length === 0) {
    setCaseFeedback(t("csvNeedRows"), "warn");
    return;
  }

  const csv = buildCaseCsv();
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = formatDateTimeForInput(new Date()).replaceAll(":", "-");
  const prefix = state.language === "en" ? "act_case_log" : "act_vaka_log";
  link.href = url;
  link.download = `${prefix}_${stamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  setCaseFeedback(t("csvDownloaded"), "ok");
}

function toggleCsvPreview() {
  if (state.caseSession.rows.length === 0) {
    setCaseFeedback(t("csvPreviewNeedRows"), "warn");
    return;
  }

  state.caseSession.csvPreviewVisible = !state.caseSession.csvPreviewVisible;
  if (state.caseSession.csvPreviewVisible) {
    ui.caseCsvPreview.textContent = buildCaseCsv();
    ui.caseCsvPreview.classList.remove("hidden");
    ui.caseCsvPreviewBtn.classList.add("active");
  } else {
    ui.caseCsvPreview.classList.add("hidden");
    ui.caseCsvPreviewBtn.classList.remove("active");
  }
}

function handleLogin() {
  const user = ui.loginUserInput.value.trim();
  const pass = ui.loginPassInput.value.trim();
  if (!user || !pass) {
    setCaseFeedback(t("loginNeedCreds"), "warn");
    return;
  }

  state.userSession.loggedIn = true;
  state.userSession.userName = user;
  updateLoginStatus();
  setCaseFeedback(t("loginSuccess", { user }), "ok");
}

function handleLogout() {
  state.userSession.loggedIn = false;
  state.userSession.userName = "";
  ui.loginPassInput.value = "";
  updateLoginStatus();
  setCaseFeedback(t("logoutSuccess"), "info");
}

function setupListeners() {
  ui.languageSelect.addEventListener("change", (event) => {
    state.language = event.target.value === "en" ? "en" : "tr";
    applyLanguage();
  });

  ui.procedureSelect.addEventListener("change", (event) => {
    state.selectedProtocolId = event.target.value;
    renderAlgorithm();
  });

  ui.deviceSelect.addEventListener("change", () => {
    renderAlgorithm();
    renderCaseInitialPlan();
    renderCaseDecision();
    renderCaseLog();
  });

  ui.weightInput.addEventListener("input", renderAlgorithm);
  ui.doacCheck.addEventListener("change", renderAlgorithm);

  ui.caseIndicationSelect.addEventListener("change", (event) => {
    state.caseProtocolId = event.target.value;
    resetCaseSession(t("changedProtocol"), "info");
  });

  ui.caseWeightInput.addEventListener("input", () => {
    renderCaseInitialPlan();
  });

  ui.caseActInput.addEventListener("input", renderCaseDecision);

  ui.caseSaveStepBtn.addEventListener("click", saveActStep);
  if (ui.caseSaveDoseBtn) {
    ui.caseSaveDoseBtn.addEventListener("click", saveActStep);
  }
  ui.caseResetBtn.addEventListener("click", () => resetCaseSession(t("sessionReset"), "info"));
  ui.caseCsvDownloadBtn.addEventListener("click", downloadCaseCsv);
  ui.caseCsvPreviewBtn.addEventListener("click", toggleCsvPreview);
  ui.caseLoginBtn.addEventListener("click", handleLogin);
  ui.caseLogoutBtn.addEventListener("click", handleLogout);
}

function init() {
  fillProcedureSelect();
  ui.procedureSelect.value = state.selectedProtocolId;
  ui.caseIndicationSelect.value = state.caseProtocolId;
  ui.caseDatetimeInput.value = formatDateTimeForInput(new Date());

  setupMainTabs();
  setupListeners();
  applyLanguage();
  renderAlgorithm();
  renderCaseInitialPlan();
  renderCaseDecision();
  renderCaseLog();
  setCaseFeedback(t("caseReady"));
}

init();
