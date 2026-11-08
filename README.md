# Sony WH-1000XM6 — Cinematic Scrollytelling Experience

An Apple-level, Awwwards-inspired scrollytelling product landing page for the flagship **Sony WH-1000XM6** wireless noise-cancelling headphones. Driven by a high-resolution 238-frame scroll-linked exploded diagram sequence rendered on an HTML5 canvas, the experience combines cinematic product storytelling, fluid typography, and interactive audio engineering showcases.

---

## ✨ Features

- **Scroll-Linked Exploded Animation**: A 238-frame ultra-high-resolution image sequence where the WH-1000XM6 disassembles into internal components (acoustic chambers, carbon-bio drivers, neural processors, microphones) and reassembles as the user scrolls.
- **High-Performance Canvas Rendering**:
  - Canvas sized to `window.innerWidth * window.devicePixelRatio` for retina clarity.
  - Cover scaling with automatic aspect ratio preservation and window resize handling.
  - Zero-flicker double-buffered frame drawing (never clears buffer before the next frame is ready).
  - Explicit high-quality smoothing (`ctx.imageSmoothingQuality = "high"`).
- **Dynamic Frame Ingestion**: Automatically detects and reads the actual frame count from the real files in `public/frames/` rather than hardcoding.
- **Seamless Void Blending**: Page background (`#050505`) dynamically matches image background tones via corner-pixel sampling, creating a borderless floating void.
- **Storytelling Narrative Beats (0% – 100% Scroll)**:
  1. **Hero Beauty Shot (0% – 15%)**: Assembled flagship headphones floating with rim lighting.
  2. **Engineering Reveal (15% – 40%)**: Ear cushions, acoustic cavities, and driver baffles gently drifting apart.
  3. **Neural Noise Cancelling (40% – 65%)**: Highlight of the 8-beamforming microphone array and dual QN3 + V3 processors.
  4. **Audiophile Transducers (65% – 85%)**: Floating carbon-bio diaphragm, magnetic voice coils, and LDAC/DSEE Ultimate capabilities.
  5. **Master Reassembly & CTA (85% – 100%)**: Final lock into place with primary call to action.
- **Apple-Style Minimalist Navbar**: Translucent glassmorphism header (`backdrop-blur-md`) that smoothly transitions from transparent to blurred dark acrylic on scroll.
- **Engineering Bento Grid**: Modular luxury cards detailing battery endurance (45h), charging speeds (3 min = 5 hrs), and spatial head tracking.
- **Interactive Acoustic Simulator**: Interactive toggle between *Active Noise Cancelling* (-42 dB), *Ambient Transparency Mode*, and *Passive Seal* with real-time waveform reactions.
- **Finish Showcase**: Interactive color selector featuring *Matte Obsidian Black*, *Platinum Silver*, and *Midnight Navy*.
- **Technical Specification Matrix**: Expandable accordion detailing frequency response, Bluetooth 5.4 codecs, battery parameters, and inbox accessories.
- **Interactive Reservation Drawer**: Pre-order modal with finish picker and complimentary laser monogram customization.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router mental model)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Motion & Interactions**: [Framer Motion](https://www.framer.com/motion/)
- **Rendering Engine**: HTML5 Canvas 2D Context with hardware-accelerated transforms

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.17.0 or higher
- npm, yarn, or pnpm

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Heshwanth-7/sony-xm6-site.git
   cd sony-xm6-site
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Production Build

To test or generate the optimized production bundle:
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```
sony-xm6-site/
├── app/
│   ├── api/
│   │   └── frames/
│   │       └── route.ts         # Dynamic frame detection & API endpoint
│   ├── globals.css              # Custom styling, glow utilities, dark theme
│   ├── layout.tsx               # Root layout, metadata & viewport
│   └── page.tsx                 # Server component reading real frame files
├── components/
│   ├── AcousticShowcase.tsx     # Interactive ANC waveform simulator
│   ├── CanvasSequence.tsx       # Core scroll-linked canvas playback engine
│   ├── ColorSelector.tsx        # Interactive finish & color selector
│   ├── FeatureGrid.tsx          # Engineering Bento Box architecture
│   ├── Footer.tsx               # Sony-style luxury editorial footer
│   ├── Navbar.tsx               # Apple-inspired glassmorphism top nav
│   ├── PreOrderModal.tsx        # Priority reservation & engraving drawer
│   ├── ProductPage.tsx          # Main page coordinator component
│   └── TechSpecs.tsx            # Comprehensive technical datasheet
├── public/
│   └── frames/                  # Master 1920-wide image sequence (frame_0001.webp -> frame_0238.webp)
├── .gitignore                   # Git exclusion rules
├── next.config.mjs              # Next.js configuration
├── package.json                 # Scripts and dependencies
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind theme & color tokens
└── tsconfig.json                # TypeScript compiler configuration
```

---

## 🎞 How the Frames Work

1. **Storage**: High-resolution 1920-wide frames reside in `public/frames/` (`frame_0001.webp` through `frame_0238.webp`).
2. **Dynamic Detection**: Rather than relying on a hardcoded frame count, `app/page.tsx` and `/api/frames` read the real directory contents using Node's filesystem module (`fs.readdirSync`) and sort them numerically.
3. **Preloading**: `CanvasSequence.tsx` loads the image files in controlled batches on client mount. A sleek calibration screen displays loading progress until the full sequence is ready in memory.
4. **Scroll Mapping**: As the user scrolls through the 480vh sticky viewport, the scroll progress `[0, 1]` is mapped to the frame index `[0, frameCount - 1]`.
5. **Drawing & Buffer**: Each frame is rendered onto the `<canvas>` with `ctx.drawImage` using cover scaling. The canvas is never cleared prior to a draw call, eliminating flickering and guaranteeing 60fps/120fps smoothness.

---

## ⚠️ Disclaimer

This project is an **unofficial conceptual demo** created strictly for portfolio, educational, and creative web design demonstration purposes. It is **not** an official product page and is **not** affiliated with, sponsored, authorized, or endorsed by Sony Group Corporation or any of its subsidiaries. All product names, logos, and brands are property of their respective owners.
