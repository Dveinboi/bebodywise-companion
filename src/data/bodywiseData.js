// Clinical and product data for Be Bodywise Underarm Roll-On
export const PRODUCT_INFO = {
  name: "Be Bodywise Underarm Roll-On",
  tagline: "Dermatologically formulated for all-day odor protection & skin brightening",
  volumeMl: 50,
  averageSwipesPerBottle: 140, // ~0.35ml per dual underarm application
  activeIngredients: [
    { name: "Gentle Brightening Complex", role: "Sheds dead hyperpigmented cells, balances skin pH & restores even underarm tone" },
    { name: "Niacinamide & Mandelic Complex", role: "Targets stubborn friction darkness and dark patches without irritation" },
    { name: "Pore-Clearing Actives", role: "Penetrates hair follicles, clears trapped keratin & prevents ingrown bumps" },
    { name: "Chamomile & Aloe Vera", role: "Anti-inflammatory botanical shield that calms skin and protects barrier health" }
  ]
};

export const GROOMING_METHODS = [
  {
    id: "waxing",
    name: "Waxing (Hot / Cold Strips)",
    icon: "Sparkles",
    baseHours: 36,
    riskLevel: "High",
    description: "Pulls hair from follicle & strips outer stratum corneum. High stinging risk if roll-on applied too early.",
    color: "coral"
  },
  {
    id: "shaving",
    name: "Razor Shaving",
    icon: "Scissors",
    baseHours: 20,
    riskLevel: "Moderate to High",
    description: "Blade causes invisible epidermal micro-abrasions. Direct roll-on contact burns sensitized skin.",
    color: "amber"
  },
  {
    id: "trimming",
    name: "Electric Trimming",
    icon: "Zap",
    baseHours: 4,
    riskLevel: "Low",
    description: "Leaves ~0.5mm stubble with zero blade friction on skin. Safe to apply after minimal cooling period.",
    color: "emerald"
  },
  {
    id: "cream",
    name: "Hair Removal Cream (Epilation)",
    icon: "ShieldAlert",
    baseHours: 30,
    riskLevel: "High",
    description: "Chemical thioglycolates dissolve keratin, leaving skin chemically vulnerable for 24-36 hours.",
    color: "coral"
  }
];

export const SENSITIVITY_LEVELS = [
  { id: "normal", label: "Resilient / Normal", multiplier: 1.0, note: "Standard skin barrier recovery window." },
  { id: "sensitive", label: "Sensitive Skin", multiplier: 1.3, note: "+30% recovery buffer recommended to prevent redness." },
  { id: "reactive", label: "Highly Reactive / Eczema-prone", multiplier: 1.6, note: "+60% extended healing window with mandatory patch test." }
];

export const POST_GROOM_SYMPTOMS = [
  { id: "redness", label: "Active redness or burning sensation", addedHours: 12 },
  { id: "microcuts", label: "Bleeding micro-cuts or razor nicks", addedHours: 24 },
  { id: "bumps", label: "Razor bumps or itching irritation", addedHours: 10 }
];

export const TIMELINE_WEEKS = [
  {
    week: "Weeks 1–2",
    title: "Bacterial pH Reset & Odor Elimination",
    status: "Active Acclimation",
    percentage: 20,
    badge: "Odor Control",
    description: "The roll-on actively optimizes underarm pH to an optimal slightly acidic barrier. Odor-causing bacteria cannot thrive in this balanced environment.",
    clinicalMilestones: [
      "Zero aluminum sweat pore blockage: sweat remains natural, but odor is completely neutralized.",
      "Skin barrier acclimates smoothly with cooling comfort.",
      "Dead surface cell buildup starts naturally clearing during warm showers."
    ],
    patientExpectation: "Don't expect hyperpigmentation to vanish immediately. This initial phase establishes 24h odor control and calms the skin barrier."
  },
  {
    week: "Weeks 3–4",
    title: "Keratin Clearance & Texture Smoothing",
    status: "Cellular Exfoliation",
    percentage: 45,
    badge: "Texture Refining",
    description: "Clears lipid buildup within hair follicles. The rough 'strawberry skin' texture and tiny friction bumps begin to smooth out noticeably.",
    clinicalMilestones: [
      "Rough chicken-skin texture (keratosis pilaris) reduces noticeably.",
      "Fewer trapped ingrown hairs post-grooming.",
      "Underarm surface feels silky and frictionless against clothing."
    ],
    patientExpectation: "Dark shadows caused by rough uneven texture begin to soften under natural light."
  },
  {
    week: "Weeks 5–6",
    title: "Melanin Dispersion & Patch Fading",
    status: "Pigment Breakdown",
    percentage: 70,
    badge: "Pigment Fading",
    description: "Accelerated cellular turnover pushes melanin-dense surface cells to shed naturally. Stubborn friction-induced dark borders begin to break apart.",
    clinicalMilestones: [
      "Deep dark friction marks begin lightening to match natural skin tone.",
      "Acanthosis nigricans or shave-shadow starts visibly dissipating.",
      "Skin tone uniformity improves noticeably across the armpit fold."
    ],
    patientExpectation: "Take progress photos in consistent bathroom lighting. The contrast difference is clearly visible here."
  },
  {
    week: "Weeks 7–8+",
    title: "Visible Tone Evening & Brightening",
    status: "Peak Transformation",
    percentage: 90,
    badge: "Clinical Results",
    description: "The primary 8-week clinical milestone. Melanin production is balanced, underarm skin tone matches your natural body shade, and recurring darkening is held at bay.",
    clinicalMilestones: [
      "Underarms appear visibly brighter, even-toned, and clear of chronic darkening.",
      "Confidence to wear sleeveless tops without hesitation.",
      "Resilient barrier that resists friction darkening from tight clothing."
    ],
    patientExpectation: "Maintain results by continuing usage daily or 3-4 times per week as part of your standard hygiene routine."
  },
  {
    week: "Weeks 9–12",
    title: "Sustained Glow & Barrier Mastery",
    status: "Maintenance Mode",
    percentage: 100,
    badge: "Maintenance",
    description: "Skin barrier is strong, cellular turnover is continuous, and past razor burns and discoloration are healed.",
    clinicalMilestones: [
      "Continuous protection against future razor burn and ingrown hairs.",
      "Sustained 24h odor control with balanced microbiome.",
      "Velvety soft, deeply hydrated underarms."
    ],
    patientExpectation: "You've completed the full clinical cycle! Seamlessly manage your refill cadence to maintain this glow."
  }
];

export const DRY_WEATHER_STEPS = [
  {
    step: 1,
    title: "Cleanse with Gentle Non-Stripping Wash",
    time: "Shower",
    icon: "Droplets",
    desc: "Wash with lukewarm water and a sulphate-free moisturizing body cleanser. Avoid harsh alkaline bar soaps that dry out delicate armpit skin."
  },
  {
    step: 2,
    title: "The Bone-Dry Rule (Crucial!)",
    time: "0 mins post-shower",
    icon: "Sun",
    desc: "Pat underarms completely dry with a soft towel. Applying roll-on on damp skin can cause excessive absorption and temporary tingling."
  },
  {
    step: 3,
    title: "Apply 2 Thin Glides of Underarm Roll-On",
    time: "+30 seconds",
    icon: "Sparkles",
    desc: "Glide the roll-on evenly twice per underarm. Allow it to absorb and dry down undisturbed for 3 to 5 minutes."
  },
  {
    step: 4,
    title: "Lock In with Hydrating Body Lotion",
    time: "+5 mins dry down",
    icon: "ShieldCheck",
    desc: "The 'Moisture Sandwich' step: Layer a lightweight ceramide or niacinamide body lotion over the dried roll-on to stop trans-epidermal moisture loss (TEWL) in dry weather."
  }
];

export const FAQS = [
  {
    q: "Why does roll-on sting if used immediately after shaving or waxing?",
    a: "Grooming temporarily removes or abrades the stratum corneum (the top protective skin barrier). When active deodorizing and brightening ingredients touch exposed micro-cuts, it causes sharp stinging and inflammation, which can paradoxically trigger Post-Inflammatory Hyperpigmentation (PIH). Always wait until the Safe-Grooming Checker turns green!"
  },
  {
    q: "Is Be Bodywise Roll-On an antiperspirant?",
    a: "No, and that is by design! Traditional antiperspirants use harsh aluminum salts to artificially plug your sweat pores. Be Bodywise allows your body to sweat naturally, but balances skin pH so odor-causing bacteria cannot survive. Clean odor protection with zero toxic aluminum pore plugs."
  },
  {
    q: "How long does a 50ml bottle actually last?",
    a: "At 2 swipes per arm once daily, each application uses ~0.35ml of liquid, giving approximately 135–145 applications (about 4.5 months!). If used twice daily (morning & night), it will last ~70 days. Use our Usage Tracker tab to avoid stockouts!"
  },
  {
    q: "Can I wear deodorant spray or perfume on top?",
    a: "Avoid spraying alcohol-heavy aerosol deodorants directly over the roll-on, as denatured alcohol dehydrates the skin and causes irritation. If you want fragrance, spray your favorite perfume onto your clothes instead."
  }
];
