# Task Backlog: Polski Helper

Refactoring Status: **Completed**  
Target Design Language: **Developer-grade (shadcn/ui, Linear, Raycast, Vercel)**  
Color Palette: **Neutral Zinc / Slate + Carmine (Rose) Accent**  
Theme Support: **Dark & Light**

---

## Completed Tasks: Core UI/UX Refactoring

- [x] **0. Backlog Initialization**
  - Initialized `BACKLOG.md` with project architecture and refactoring criteria.

- [x] **1. Theme System (Light/Dark) & Tailwind Tokens**
  - Configured `class="dark"` on `<html>`.
  - Utility `src/utils/theme.ts` with `localStorage` persistence (`polski_helper_theme`, default: dark).
  - Pre-render script in `index.html` to prevent flash of unstyled theme (FOUC).
  - Clean palette: Zinc/Slate, carmine brand accent (`rose-600` / `rose-500`), subtle mnemonic shades for grammatical genders (indigo, rose, amber).

- [x] **2. Complete Removal of Stats, Gamification & Sound Effects**
  - Dropped all streak counters, fires, daily streaks, win series, and trophy badges.
  - Removed answer counters, percentage precision displays, and stats resets.
  - Removed Web Audio synthesizer sound effects, volume button, and confetti (`canvas-confetti`).
  - Removed `src/utils/storage.ts` and `src/utils/confetti.ts`.
  - Kept natural Polish pronunciation via `SpeechSynthesis` in `src/utils/audio.ts` (triggered strictly on explicit user click).

- [x] **3. Minimalist Header & Branding**
  - Created `src/components/Header.tsx`.
  - Clean title "Polski Helper" (`font-semibold`, 15–16px) on the left (clickable to return to main menu).
  - Minimalist theme toggle (Lucide `Sun` / `Moon`, stroke 1.75px) on the right.
  - Removed secondary flag badges and decorative tags.

- [x] **4. Main Menu Hub Refactoring**
  - Strict h1 heading ("Grammar") with concise subtitle.
  - Module cards in shadcn/ui style without visual noise.
  - Compact `[ Rule ]` button with `BookOpen` icon in card headers.
  - Mode selections formatted as flat list rows:
    - Row title (`font-medium`).
    - Single-line muted practical example (`text-xs font-mono text-zinc-500`, e.g. `okno → okna`).
    - Minimalist `ChevronRight` arrow on the right.
  - Complete removal of rule spoilers and ending chips from menu buttons.
  - Zero emojis across all views.

- [x] **5. Interactive Practice Screens Refactoring**
  - Tested word: clean typography, `font-semibold` (weight 600), natural kerning.
  - Answer options in neutral shadcn style (`bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800`).
  - Hotkeys 1, 2, 3... as Linear-style `<kbd>` badges in top-right corner of each button.
  - Subtle answer feedback: accent border (`border-emerald-500/60` / `border-rose-500/60`) and 10% background tint (`bg-emerald-500/10` / `bg-rose-500/10`), no solid neon fills.
  - Rule explanations in a callout block with `border-l-2` without emojis.
  - Card body non-clickable (navigation strictly via "Next" button or Enter/Space).

- [x] **6. Fullscreen Grammar Reference Refactoring**
  - Removed pill-badges around individual words in examples (clean table grid of Polish words and translations).
  - Warning/caution blocks: callout with `border-l-2 border-amber-500/80`.
  - Short / Detailed mode segmented control in shadcn tabs style.
  - Decision flow checklist for instant lookup without nested boxes.

- [x] **7. Final Verification, Build & Linter**
  - Production build verification (`npm run build`).
  - Linter check (`npm run lint` via `oxlint`) — 0 errors, 0 warnings.
  - Zero emoji verification across the repository.

---

## Active Epic: Vocabulary & Spaced Repetition (SRS)

Status: **In Implementation (Phase 8 completed, moving to Phase 9)**  
Backend: **Supabase (PostgreSQL 17 + Auth + Row Level Security)**  
Learning Methodology: **Spaced Repetition System (SRS, Anki / SM-2 algorithm)**  
Design System: **AGENTS.md (Developer-grade, Linear/shadcn, zero emojis, zero gamification)**

### Tasks:

- [x] **8. Supabase Database & Security Schema (Data Layer)**
  - Created `user_words` table: `id` (uuid), `user_id` (uuid), `word` (text), `translation` (text), `notes` (text), `interval_days` (int), `repetition_count` (int), `ease_factor` (numeric 2.5), `next_review_at` (timestamptz), `created_at` (timestamptz).
  - Created composite index `idx_user_words_review` on `(user_id, next_review_at)`.
  - Enabled Row Level Security (RLS) with optimized policy `Users can manage only their own words` (`(select auth.uid()) = user_id`) for single-evaluation performance.
  - Supabase security audit passed with 0 vulnerabilities.

- [x] **9. Supabase Client & Dedicated Auth Screen (Auth UI)**
  - Installed `@supabase/supabase-js`.
  - Configured `.env.local`, `.env.example`, and `src/utils/supabase.ts` client.
  - Added `[ Sign In ]` button with `User` icon (and active email indicator with `[ Sign Out ]`) in Header.
  - Built dedicated full-page authentication screen (`src/components/AuthScreen.tsx`) supporting clean Email + Password with mode switcher (`Sign In` / `Sign Up`).
  - Integrated active session listener in `src/App.tsx`.

- [x] **10. App Shell Architecture & Dictionary Management (App Shell & Vocabulary)**
  - Implemented top-level App Shell navigation in Header (`Practice` / `Dictionary`):
    - `Practice`: Active drills hub (daily review queue banner + grammar modules).
    - `Dictionary`: Dedicated library screen with real-time search, word count, single word addition, and delete actions.
  - "Import Words" modal (`BulkImportModal.tsx`):
    - Smart text parsing supporting delimited lines (`word - translation`, `word;translation`, tabs) and JSON.
    - Instant live preview before saving ("Found: X words").
    - Chunked batch insert into Supabase `user_words` table.
  - Completely eliminated box-in-a-box nested borders across main menu cards.

- [ ] **11. Spaced Repetition Flashcards Trainer (SRS Flashcards Trainer)**
  - Query words due for today: `next_review_at <= NOW()`.
  - Anki-style flashcard interface:
    - Front: Polish word prominent (36px, `font-semibold`) + TTS audio button.
    - Cue: `<kbd>Space</kbd> flip`.
    - Back: translation + grammar notes.
    - Keyboard rating evaluation (Linear `<kbd>` badges):
      - `<kbd>1</kbd> Again` (reset interval to 0, review today).
      - `<kbd>2</kbd> Hard` (interval 1 day).
      - `<kbd>3</kbd> Good` (interval expands: 1 → 3 → 7 → 16 → 35 days).
      - `<kbd>4</kbd> Easy` (interval expands with bonus factor).
  - Calculate intervals and update next review timestamp in Supabase.

- [ ] **12. End-to-End Testing & Verification**
  - Verify complete loop: registration → import 300 words → card review session → verify interval updates in DB.
  - Production build & Oxlint verification.

- [x] **13. Documentation Localization & Standardization (English)**
  - Translated all project guidelines and documentation (`AGENTS.md`, `BACKLOG.md`, `README.md`) into professional English.

- [ ] **14. Design System Enhancement: Mobbin UI Pattern Integration**
  - Connect Mobbin plugin (`antigravity-plugins-partners/plugin/mobbin`) for production mobile/web design patterns (Anki, Quizlet, Duolingo, Linear).
  - Audit and refine interactive flashcard transitions and dictionary layout against top-tier language learning applications.
