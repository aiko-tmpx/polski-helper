# UI/UX & Engineering Guidelines (Polski Helper)

This document establishes the binding design, architectural, and layout constraints for the project, incorporating proven design-system principles from `cursor-designer` (Spencer Goldade) and modern product design (Linear, Raycast, shadcn/ui). All modifications must strictly adhere to these rules.

---

## 1. Zero AI-Slop & Anti-Gamification
- **No Emojis:** Strictly forbidden to use emojis anywhere in the UI, buttons, text, examples, or grammar rules.
- **No Aggressive Gamification:** No streaks, fires, trophies, congratulatory modals, or confetti animations.
- **Vector Icons Only:** Exclusively use consistent Lucide SVG icons (`lucide-react`) with `strokeWidth={1.75}` (or `1.5`).
- **No Decorative Graphics:** No arbitrary decorative badges, marketing illustrations, or visual noise.

---

## 2. UX Writing & Microcopy (Cursor-Designer Principles)
- **Direct, Human Language:** Plain, concise language over AI-generated robotic copy.
  - *Bad:* "24 words are ready for spaced repetition memory intervals."
  - *Good:* "24 words due today."
  - *Bad:* "Log in to access your personal synchronized dictionary."
  - *Good:* "Log In" / "Sign In".
- **Zero Filler Subtitles:** Never invent generic descriptive paragraphs under headings or cards. If the label is self-explanatory, let whitespace do the work.
- **Action-Oriented Labels:** Button and link labels must clearly describe the outcome (e.g., "Start Session", "Import Words", "Save", not generic "Submit" or "Proceed").
- **Calm & Objective Tone:** Neutral tone for routine actions, helpful and specific for errors.

---

## 3. Information Architecture (IA) & App Shell
- **Shallow Navigation (Max 2-3 Levels):**
  - Primary navigation belongs in the top **App Shell** (Header navigation: `Practice` / `Dictionary`).
  - Keep the active study view focused on drills. Never mix a heavy database table/admin panel into an active daily drill screen.
- **Clear "You Are Here" States:** Visible active indicators for navigation items.
- **Single Primary Action per View:** Each screen or card must have at most one primary visual action button. Secondary actions should be understated outline/ghost buttons or links.

---

## 4. UI Layout, Spacing & Density
- **No "Box-in-a-Box" Anti-Pattern:** Never nest bordered containers inside already bordered parent cards.
- **Flat Composable Primitives:** Use flat stacks, lists with subtle dividers (`divide-zinc-100 dark:divide-zinc-800`), and generous padding.
- **Strict Spacing Scale:** Rely strictly on 4px/8px Tailwind spacing tokens (`gap-2`, `gap-4`, `p-4`, `p-6`). Never introduce ad-hoc arbitrary pixels.
- **Form Inputs:** Clean, developer-grade inputs without tacky floating icons or overcrowded borders. Padding and focus states must be crisp (`focus-visible:ring-1 focus:border-zinc-400`).

---

## 5. Aesthetics & Theme Tokens
- **Dark Theme:** background `bg-zinc-950` (#09090b), card surface `bg-white/5` or `bg-zinc-900/60`, borders `border-zinc-800`.
- **Light Theme:** clean background `bg-zinc-50`, card surface `bg-white`, borders `border-zinc-200`, soft shadows `shadow-xs`.
- **Brand Accent:** restrained Polish carmine `rose-600` (light) / `rose-500` (dark), or neutral monochrome `zinc-900` / `zinc-100`. Avoid default saturated blues.
- **Typography:** Headings maximum `font-semibold` (600), h1 maximum `font-bold` (700) with natural kerning (`tracking-tight`). Secondary text muted `text-zinc-500 dark:text-zinc-400`. Technical markers & hotkeys `font-mono text-xs`.

---

## 6. Hotkeys & Interaction Feedback
- Hotkeys `[1]`, `[2]`, `[Space]` must ALWAYS be rendered as Linear-style `<kbd>` badges (`font-mono`, border `border-zinc-300 dark:border-zinc-700`, background `bg-zinc-100 dark:bg-zinc-800`).
- Feedback states: delicate indication (thin accent border `border-emerald-500/50` / `border-rose-500/50` and subtle 10% background tint `bg-emerald-500/10` / `bg-rose-500/10`), never solid saturated fills.

---

## 7. Vocabulary & Spaced Repetition (SRS) Specifications
- **Authentication:** Dedicated minimalist screen or header placement (`user@email` + `[ Sign Out ]`). Clean Email/Password inputs without marketing fluff.
- **Bulk Import:** Fast, friction-free textarea supporting delimited lines `word - translation`, `word;translation`, or JSON `[{"word":"...", "translation":"..."}]` with live counter preview ("Found: 300 words").
- **Flashcards Trainer (Anki-style SM-2):**
  - Front side: Polish word prominent (`font-semibold`, 36px) + TTS audio button. Cue: `<kbd>Space</kbd> flip`.
  - Back side: translation, notes.
  - Keyboard rating evaluation:
    - `<kbd>1</kbd> Again` (rose)
    - `<kbd>2</kbd> Hard` (amber)
    - `<kbd>3</kbd> Good` (emerald)
    - `<kbd>4</kbd> Easy` (sky)
