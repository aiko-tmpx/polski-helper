# UI/UX & Engineering Guidelines (Polski Helper)

This document establishes the binding design, architectural, and layout constraints for the project. All modifications must strictly adhere to these rules.

---

## 1. Zero AI-Slop & Anti-Gamification
- **No Emojis:** Strictly forbidden to use emojis (🏷️, ✨, 🔥, 🏆, 📦, 🎨, 📎, 🟡, 🟢, etc.) anywhere in the UI, buttons, text, examples, or grammar rules.
- **No Aggressive Gamification:** No streaks, fires, trophies, congratulatory modals, or confetti animations.
- **Vector Icons Only:** Exclusively use consistent Lucide SVG icons (`lucide-react`) with `strokeWidth={1.75}` (or `1.5`).

---

## 2. Aesthetics & Styling (Developer-Grade: Linear, Raycast, shadcn/ui)

### Typography:
- No ultra-heavy font weights (`font-black`, `font-extrabold`).
- Headings: maximum `font-semibold` (600), h1 maximum `font-bold` (700) with natural kerning (`tracking-tight`).
- Secondary and explanatory text: muted `text-zinc-500 dark:text-zinc-400`.
- Examples, hotkeys, and technical markers: `font-mono text-xs`.

### Color Palette:
- **Dark Theme:** background `bg-zinc-950` (#09090b), card surface `bg-white/5` or `bg-zinc-900/60`, borders `border-zinc-800`.
- **Light Theme:** clean background `bg-zinc-50`, card surface `bg-white`, borders `border-zinc-200`, soft shadows `shadow-xs`.
- **Brand Accent:** restrained Polish carmine `rose-600` (light) / `rose-500` (dark), or neutral monochrome `zinc-900` / `zinc-100`. Avoid default saturated blues.

### Layout & Breathing Room:
- **No "Box-in-a-Box" Anti-pattern:** Do not nest bordered grey containers inside already bordered parent cards.
- Use generous padding/gaps and subtle dividers (`divide-zinc-100 dark:divide-zinc-800`).

---

## 3. Interactivity & Hotkeys
- Hotkeys `[1]`, `[2]`, `[Space]` must ALWAYS be rendered as Linear-style `<kbd>` badges (`font-mono`, border `border-zinc-300 dark:border-zinc-700`, background `bg-zinc-100 dark:bg-zinc-800`).
- Feedback states: delicate indication (thin accent border `border-emerald-500/50` / `border-rose-500/50` and subtle 10% background tint `bg-emerald-500/10` / `bg-rose-500/10`), never solid saturated fills.

---

## 4. Vocabulary & Spaced Repetition (SRS) Specifications

### Authentication (Auth):
- Header placement next to theme toggle: minimal `[ Sign In ]` (Lucide `User` icon) or `user@email` + `[ Sign Out ]`.
- Modal (shadcn Dialog): clean Email/Password inputs, primary button `[ Sign In ]` / `[ Register ]`, without marketing banners or decorative graphics.

### Bulk Import:
- Simple, friction-free input area:
  - Auto-parsing for delimited lines `word - translation`, `word;translation`, or valid JSON `[{"word":"...", "translation":"..."}]`.
  - Instant live preview before committing to DB ("Found: 300 words").

### Flashcards Trainer (Anki-style):
- Front side: Polish word centered and prominent (`font-semibold`, 36px) + TTS audio button.
- Cue: `<kbd>Space</kbd> flip`.
- Back side: translation, grammar notes.
- Keyboard rating evaluation:
  - `<kbd>1</kbd> Again` (rose)
  - `<kbd>2</kbd> Hard` (amber)
  - `<kbd>3</kbd> Good` (emerald)
  - `<kbd>4</kbd> Easy` (sky)
