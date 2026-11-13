# Polski Helper

Developer-grade web application for mastering Polish grammar and vocabulary through focused drills, structured reference guides, and spaced repetition (SRS).

---

## Features

### 1. Grammatical Gender (Singular)
- Immediate identification of masculine (*męski* / *ten*), feminine (*żeński* / *ta*), and neuter (*nijaki* / *to*) nouns.
- Keyboard-driven controls with `<kbd>` badges (`1`, `2`, `3`).
- Audio pronunciation via Web Speech API on demand.

### 2. Plural: Non-Virile (rodzaj niemęskoosobowy)
- Target endings for inanimate nouns, animals, and feminine groups (`-y`, `-i`, `-e`, `-a`).
- Noun drills, adjective drills (`-e`, `-ie`), and paired phrase drills (e.g. *nowa szkoła → nowe szkoły*).
- Decision-flow reference guide (`[ Rule ]`) for fast 5-second lookups.

### 3. Plural: Virile (rodzaj męskoosobowy)
- Nominative plural endings for masculine personal nouns and mixed groups (`-owie`, `-e`, `-y`, `-i`).
- Inlined consonant alternation mapping: *t → ci*, *d → dzi*, *k → cy*, *g → dzy*, *r → rzy*, *-ec/-ca → -cy*.
- Clear categorization of irregular forms (*ludzie*, *bracia*, *księża*).

### 4. Vocabulary & Spaced Repetition (In Progress)
- Cloud-synced personal dictionary backed by Supabase (PostgreSQL 17 + Row Level Security).
- Bulk word import supporting both delimited plain text and JSON.
- Anki-style flip cards with four-button memory rating (`Again`, `Hard`, `Good`, `Easy`).

---

## Design System

Strictly aligned with [`AGENTS.md`](./AGENTS.md):
- **Zero AI-Slop & Anti-Gamification:** No emojis, no streaks, no trophies, and no congratulatory modals.
- **Aesthetics:** Clean, developer-grade interface inspired by Linear, Raycast, and shadcn/ui.
- **Theming:** Full dark and light mode support with zinc/slate base and Polish carmine accent (`rose-600` / `rose-500`).
- **Typography & Layout:** Restrained font weights, generous whitespace, and subtle feedback states without solid fills.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Icons:** Lucide React (`strokeWidth={1.75}`)
- **Audio:** Web Speech API (TTS) and Web Audio API synthesized feedback chimes
- **Backend & Database:** Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **Code Quality:** Oxlint (linter), strict TypeScript checks

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aiko-tmpx/polski-helper.git
   cd polski-helper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open the displayed URL in your browser (typically `http://localhost:5173`).

---

## Scripts

- `npm run dev` — Starts the Vite development server.
- `npm run build` — Type-checks (`tsc -b`) and bundles for production (`vite build`).
- `npm run lint` — Runs `oxlint` for high-performance static analysis.
- `npm run preview` — Previews the production build locally.
