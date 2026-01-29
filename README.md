# 🚀 CodePulse X | Cinematic Cognitive Development Lab 🖤

 Deployed on Vercel: [Live Demo 🚀](https://code-pulse-x.vercel.app/)

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)  
[![Google AI Studio](https://img.shields.io/badge/Powered%20by-Google%20AI%20Studio-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://studio.google.com/)  
[![React](https://img.shields.io/badge/React-JS-61DAFB?style=for-the-badge&logo=react&logoColor=cyan)](https://reactjs.org/)  

**CodePulse X** is an elite, industrial-grade cognitive development lab for developers. It measures typing speed, code accuracy, and mental resilience under tactical stress in a cinematic, high-performance environment.

---

## 📑 Table of Contents

- [Core Identity & Aesthetic](#core-identity--aesthetic)  
- [Navigation & State Flow](#navigation--state-flow)  
- [Gaming Engine (Game Modes)](#gaming-engine-game-modes)  
- [Terminal Logic & Mistake Tracking](#terminal-logic--mistake-tracking)  
- [AI Performance Analysis](#ai-performance-analysis)  
- [Data Persistence & Analytics](#data-persistence--analytics)  
- [Technical Requirements](#technical-requirements)  
- [Deployment](#deployment)  

---

## 🎨 Core Identity & Aesthetic

**Frameworks & Libraries:**  
- ⚛️ React  
- 🎨 Tailwind CSS  
- 🎬 Framer Motion  
- 📊 Recharts  

**Palette:**  
- Background: `#050505`  
- Surface Containers: `#0c0a09`  
- Accent Colors (user-selectable): Solar Amber 🌞, Cyber Blue 💧, Electric Violet ⚡, Plasma Green 🟢, Crimson Red 🔴, Neutral Zinc ⚪  

**Visual Elements:**  
- 🕹 Persistent 40px tactical grid  
- 🔄 Moving horizontal scanline overlay with variable opacity  
- 🎯 Custom reticle-style crosshair cursor that expands/rotates on interactive hover  

**Typography:**  
- JetBrains Mono for all code and data  
- Inter for headlines (Black, Italic, Tight tracking)  

---

## 🗺 Navigation & State Flow

**State Machine Overview:**  
1. **Splash Scene:** ✨ Particle-physics intro with industrial square particles and accent-colored linkages  
2. **Mode Selector:**  
   - Left Pane: Tactical mode list with accent color picker 🖌  
   - Right Pane: Cinematic preview of the selected mode 🎥  
3. **Language Network:** 🌐 Circular node-graph for selecting programming environments  
4. **Terminal:** ⌨️ Core typing environment  
5. **Post-Analysis:** 📊 High-density dashboard for results  
6. **Progress Lab:** 🗄 Scrollable archive for historical session data  

---

## 🎮 Gaming Engine (Game Modes)

1. **Speed Test 🏎:** Standard typing performance  
2. **Syntax Fixer (Debug) 🐞:** Correct pre-injected errors in code snippets  
3. **Blind Typing (Silent Error) 🙈:** Errors revealed only at the end  
4. **Glitch Mode (Bug Injection) 💥:** Random spelling errors injected mid-typing  
5. **Language Swap 🔄:** Snippet and language switch every 20 seconds  
6. **Mirror View 🪞:** Terminal interface is horizontally flipped  
7. **Focus Test (Distraction) ⚠️:** Random popups (“Critical Error”, “Incoming Call”) appear  
8. **Ultimate Challenge (Boss Fight) 🏆:** 120-second gauntlet combining mirroring, swaps, and distractions across 3 languages  

---

## ⌨️ Terminal Logic & Mistake Tracking

- **Input Engine:** Hidden textarea driving a reactive display layer  
- **Mistake Logic:**  
  - Total Mistakes ❌: Every incorrect keystroke  
  - Final Errors ⚠️: Characters remaining incorrect at completion  
  - Visual Feedback: Correct keys ✅ use accent color; mistakes ❌ are white text on crimson background  
- **Auto-Termination ⏱:** Locks terminal when timer reaches zero and triggers analysis  
- **Auto-Indentation ↵:** Enter key inserts correct spaces/tabs based on snippet  

---

## 🤖 AI Performance Analysis

**Integration:** [@google/genai](https://www.npmjs.com/package/@google/genai) (model: `gemini-3-flash-preview`)  

**Input Metrics:**  
- WPM ⌨️  
- Accuracy 🎯  
- Total Mistakes ❌  
- Cognitive Load 🧠 (0–100%)  
- Consistency 📈  

--- 

## 📊 Data Persistence & Analytics

- History 🗂: Stores last 50 sessions in localStorage

- Analysis Dashboard:
  - WPM Graph 📈: Cinematic AreaChart showing speed over time
  - Syntax Audit 🔍: Code heatmap showing mistake locations
  - Stat Tiles 🖥: Large italicized displays for WPM, Accuracy %, Total Mistakes

---

 ## Deployment/Clone Repository

Steps to Deploy:

1. Fork/clone this repository by using:
```bash
git clone https://github.com/hameed-afsar-km/CodePulse-x.git
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Start local development:
```bash
npm run dev
```
`Push to GitHub & link repository on Vercel
 for automatic deployment`
