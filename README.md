# STRATEGOS // RASPUTIN INTERFACE

![Version](https://img.shields.io/badge/version-1.0.0_SIVA-red) ![Status](https://img.shields.io/badge/status-OPERATIONAL-red) ![React](https://img.shields.io/badge/react-19.2.0-blue)

> **"If things to come cast their shadows in advance, then past events leave their engravements for sure."**

STRATEGOS is an immersive, lore-accurate Web Interface inspired by Destiny 2's **Warmind Rasputin**. It combines high-fidelity 3D rendering with a simulated military "War Room" OS, featuring bilingual decryption, procedural audio, and reactive particle systems.

## 🚀 Features

### 1. The "Tyrant" Visual Core
- **Complex Geometry:** A multi-layered Dyson Sphere structure (Inner Core + Wireframe Shell + Rotating Rings).
- **SIVA Particles:** Interactive particle swarm that reacts to system states (Idle vs. Critical).
- **Post-Processing Pipeline:** Bloom, Noise, Vignette, Chromatic Aberration, and Screen Glitch effects.

### 2. Tactical OS (HUD)
- **Archives Panel:** File management interface with security theming and hover glitch effects.
- **Telemetry:** Real-time neural load monitoring and orbital grid status.
- **Command Deck:** Floating input console for executing Warmind directives.

### 3. Lore Integration
- **Bilingual Decryption:** Text flashes in **Russian (Cyrillic)** before scrambling into English, mimicking in-game cinematics.
- **Audio Engine:** Procedural web-audio generation for typing, alarms, and execution sounds (no assets required).
- **SIVA Mode:** Type `SIVA`, `ATTACK`, or `MIDNIGHT` to trigger a critical system state (Red Alert, Camera Shake, Aggressive Audio).

## 🛠 Tech Stack

- **Core:** React 19 + Vite
- **3D Engine:** Three.js (@react-three/fiber)
- **Effects:** Post-processing (@react-three/postprocessing)
- **Styling:** Tailwind CSS + Framer Motion
- **Icons:** Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/strategos.git
   cd strategos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Ignite the Warmind**
   ```bash
   npm run dev
   ```

## 🎮 Directives (How to Use)

The input console accepts specific lore-accurate commands to trigger visual states:

| Command  | Effect | State |
|----------|--------|-------|
| STATUS   | System check and orbital alignment. | Idle |
| SIVA     | Triggers SIVA particle swarm and red alert. | Critical |
| MIDNIGHT | Initiates "Midnight Exigent" protocol (Morality: OFF). | Critical |
| HELP     | Lists available directives. | Processing |

**Note:** The interface also includes "Idle Chatter" where the AI will output Russian philosophy logs if left alone.

## 🏗 Architecture & Optimization

- **Performance:** Optimized Three.js rendering (antialias: false), useMemo for geometry calculations, and React Error Boundaries for WebGL stability.
- **State Management:** Complex state machine (idle, processing, siva) drives audio, camera shake, and post-processing intensity simultaneously.
- **Accessibility:** Semantic HTML structure and reduced motion support (via state toggle).

## 🔮 Future Roadmap

- [ ] OpenAI Integration: Replace simulated responses with a real LLM (GPT-4o) acting as Rasputin.
- [ ] RAG System: Ability to ingest PDF/Text files and query them via the Archives panel.
- [ ] PWA Support: Offline functionality for mobile field use.

## 📜 License

Distributed under the MIT License. See LICENSE for more information.

// AI-COM/RSPN: SIGNOFF. MIDNIGHT EXIGENT PROTOCOL STANDBY.
