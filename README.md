# PlaySpin 🎡✨

> **A screen-free before and after school activity randomizer for kids.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-swindon.github.io%2FPlay--Spin-blue?style=flat&logo=github)](https://swindon.github.io/Play-Spin)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable%20%26%20Offline-green?style=flat)](https://swindon.github.io/Play-Spin)
[![Built with React 19](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react)](https://react.dev/)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow?style=flat&logo=buy-me-a-coffee)](https://buymeacoffee.com/scottwindon)

PlaySpin helps parents and kids beat screen fatigue and decision paralysis. Spin the wheel to pick fun, screen-free activities tailored to daily routines—whether it's quiet morning play before the school bell or active decompressing after a busy day in the classroom.

👉 **Play it live:** [https://swindon.github.io/Play-Spin](https://swindon.github.io/Play-Spin)

---

## ✨ Features

- 🎡 **Tactile Spinner Wheel** — Smooth canvas-rendered spinning wheel with realistic physics, acceleration, friction, and click sounds.
- 🤹 **Solo & Group Play Modes** — Filter between independent quiet activities, sibling/group games, or all options.
- ⏰ **Smart Routine Filtering** — Filter activities by routine block:
  - **Morning (Before School):** Gentle, independent wake-up activities that keep kids off devices before school.
  - **After School (Decompress):** High-energy and outdoor movement to release pent-up school energy.
  - **Focus & Create:** Crafts, puzzles, building blocks, and creative challenges.
  - **Pre-Dinner (Pitch In):** Engaging chore games and helpful family habits.
  - **Evening (Wind Down):** Calming, cozy bedtime-friendly wind-down activities.
  - **Boredom Jar:** Quick sparks of imagination when kids say "I'm bored!"
- 🃏 **Interactive Activity Flip Cards** — View activity descriptions, duration, practical tips, and mark activities as completed.
- 📅 **7-Day History & Weekly Plan** — Track past spins, celebrate completed activities, and view a structured weekly plan breakdown.
- ➕ **Custom Activities** — Add personalized household favorites directly into the spinner pool.
- 🎉 **Celebrations & Sound Engine** — Synthesized Web Audio sound effects (no heavy audio files to load) and celebratory confetti cannons with full mute control.
- 📱 **Installable Progressive Web App (PWA)** — Install directly onto iOS, Android, macOS, or Windows home screens with offline support.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Motion](https://motion.dev/) (Framer Motion)
- **Icons:** [Lucide React](https://lucide.dev/)
- **PWA & Offline:** [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Workbox caching)
- **Audio & Visuals:** Web Audio API (zero external assets) & HTML5 Canvas

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (recommended: Node 22+)
- npm or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/swindon/Play-Spin.git
   cd Play-Spin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server on port 3000. |
| `npm run build` | Builds the production bundle and PWA service worker into `dist/`. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`). |
| `npm run deploy` | Deploys the built distribution to GitHub Pages. |

---

## 🌐 Deployment

PlaySpin is automatically built and deployed to GitHub Pages on every push to `main` using GitHub Actions (see [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

Live deployment URL:
**[https://swindon.github.io/Play-Spin](https://swindon.github.io/Play-Spin)**

---

## 💛 Support

If you or your kids enjoy PlaySpin, consider buying a coffee to support continued development:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/scottwindon)

Or visit: [https://buymeacoffee.com/scottwindon](https://buymeacoffee.com/scottwindon)

