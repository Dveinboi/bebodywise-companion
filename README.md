# Be Bodywise 4% AHA BHA Underarm Roll-On Companion

A sleek, modern, mobile-responsive single-page web app built with **React**, **Vite**, and **Tailwind CSS** designed specifically for **Be Bodywise** underarm care.

Featuring a deep dark/teal-accented UI (`#060B0E` / `#00C2A8`), glassmorphic cards, responsive navigation, haptic-like acoustic feedback, and localStorage persistence.

---

## 🌟 Key Modules & Features

### 1. 🛡️ Safe-Grooming Checker (Anti-Sting Chemical Barrier Protocol)
- **Problem Solved:** Applying 4% active AHA/BHA (pH 3.8) immediately post-wax or shave causes intense stinging, chemical burns, and Post-Inflammatory Hyperpigmentation (PIH).
- **Hair Removal Methods:** Waxing (36h base buffer), Razor Shaving (20h buffer), Electric Trimming (4h buffer), and Hair Removal Creams (30h buffer).
- **Customized Skin Profiles:** Resilient, Sensitive (+30%), and Highly Reactive (+60%).
- **Symptom Flags:** Active redness/burning (+12h), bleeding micro-cuts (+24h), razor bumps (+10h).
- **Real-Time Countdown & Gauge:** Live second-by-second countdown clock, skin barrier recovery percentage (0–100%), and status states:
  - ⛔ `DO NOT APPLY YET` (High stinging risk)
  - ⚠️ `CAUTION / PATCH TEST` (Over 75% barrier restored)
  - ✅ `SAFE TO APPLY` (Stratum corneum fully re-epithelialized)
- **First-Aid Guidance:** Recommends chilling pure aloe vera or cica balm; explains the acid gradient science.
- **Interactive Reminders:** Web audio chimes, browser reminder notifications, and confetti triggers.

---

### 2. 🧴 Smart Bottle Depletion & Reorder Tracker
- **Realistic 50ml Roll-On Bottle:** Translucent glass SVG bottle with dynamic liquid level, glossy roller ball, and volume markings (50ml, 35ml, 20ml, 5ml).
- **Daily Application Logging:**
  - Configurable swipe count (1 swipe ~0.22ml, 2 swipes ~0.35ml standard, 3+ swipes ~0.50ml).
  - Daily frequency (once daily vs twice daily).
  - Interactive `+ Log Today's Application`, undo button, and calibration slider.
- **Stockout Prediction:** Real-time projected empty date, remaining days counter, and health warning flags.
- **Amazon Subscribe & Save Mismatch Resolver:**
  - Compares the user's burn rate against rigid 30/45/60/90-day Amazon cycles.
  - Highlights early stockout droughts or excess bottle hoarding with exact recommended delivery cadence.
- **1-Click Reorder Assistant Modal:** Quick bundle selector (Single 50ml, Duo Pack, Roll-on + 5% Niacinamide Lotion kit), official store coupon code `BODYWISE15` with 1-click clipboard copy, and direct links to Amazon & Be Bodywise stores.

---

### 3. 📅 Routine & Timeline Guide (8–12 Week Pigmentation & Winter Care)
- **8–12 Week Clinical Stepper:**
  - **Weeks 1–2:** Bacterial pH Reset & Odor Elimination (pH drops to 4.0; eliminates Corynebacterium).
  - **Weeks 3–4:** Keratin Clearance & Texture Smoothing (BHA dissolves sebum, softens strawberry skin).
  - **Weeks 5–6:** Melanin Dispersion & Patch Fading (Lactic + Mandelic shedding of pigmented cells).
  - **Weeks 7–8+:** Visible Tone Evening & Brightening (Peak clinical milestone).
  - **Weeks 9–12:** Sustained Glow & Barrier Mastery.
- **Interactive Before/After Clinical Comparison:** Drag the visual slider to inspect Day 1 friction shadow vs Week 8 brightened result.
- **Dry-Weather "Moisture Sandwich" Protocol:** 4 steps to prevent trans-epidermal water loss (TEWL) during cold winter months without neutralizing exfoliating acids.
- **Interactive Daily Regimen Checklist:** AM vs PM routines, summer vs winter season mode, and automatic "Grooming Day" safe mode.
- **Dermatologist FAQ & Myth Busters:** Expandable clinical explainer cards.

---

## 🚀 Quick Start

### Development Server
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🎨 Tech Stack & Design System
- **Framework:** React 18 + Vite 5
- **Styling:** Tailwind CSS (Custom Dark Slate `#060B0E`, Card `#0F1A22`, Brand Teal `#00C2A8`, Cyan `#06B6D4`)
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti
- **Audio Feedback:** Synthetic Web Audio API engine
- **Persistence:** LocalStorage sync
