# Maria Futuristic Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing Maria portfolio as a polished single-screen futuristic editorial composition.

**Architecture:** Preserve `PortfolioPage`, the portrait asset, semantic navigation, and the two-link `PortfolioCard` interface. Simplify card markup and replace the scrapbook CSS with glass-panel styling and breakpoint-specific one-screen compositions.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, plain CSS.

## Global Constraints

- Preserve all current accessible identity/contact/language/link behavior.
- Keep one viewport-height page without lower content sections.
- No new dependencies or remote Figma URLs.
- No horizontal overflow at 375, 768, or 1440 px.
- Git is unavailable; use test and build checkpoints instead of commits.

---

### Task 1: Replace scrapbook card markup

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/PortfolioCard.tsx`

**Interfaces:**
- Preserve `PortfolioCard({ title, href, variant })`.

- [ ] **Step 1: Add a failing test** asserting `.maria-card__eyebrow` exists twice and `.maria-card__sticker` is absent.
- [ ] **Step 2: Run `pnpm test -- --run`**; expected: failure because scrapbook stickers still render.
- [ ] **Step 3: Replace sticker/tab/chain spans** with an eyebrow (`Selected work` or `Collaboration`), title, index, and arrow.
- [ ] **Step 4: Run the tests**; expected: all tests pass.

### Task 2: Implement the futuristic editorial visual system

**Files:**
- Replace: `src/styles.css`

**Interfaces:**
- Existing page/component class names remain the styling hooks.

- [ ] **Step 1: Define color, glass, glow, spacing, and typography variables** in `:root`.
- [ ] **Step 2: Style the desktop composition** with full-viewport portrait, glass header, left/right translucent cards, hot-pink accents, bottom controls, and visible focus states.
- [ ] **Step 3: Add tablet composition at `max-width: 900px`** with a two-row header and inward card placement.
- [ ] **Step 4: Add mobile composition at `max-width: 600px`** with compact header, portrait occupying the upper viewport, and two overlapping cards inside the lower viewport.
- [ ] **Step 5: Add reduced-motion overrides** disabling transitions.

### Task 3: Verify and hand off

**Files:**
- Modify as observed: `src/styles.css`, `src/maria/*.tsx`.

**Interfaces:**
- Produces the final redesigned single-screen portfolio.

- [ ] **Step 1: Run `pnpm test -- --run`**; expected: all tests pass without warnings.
- [ ] **Step 2: Run `pnpm build`**; expected: TypeScript and Vite build successfully.
- [ ] **Step 3: Run `rg "figma\\.com/api/mcp/asset|maria-card__sticker" src`**; expected: no matches.
- [ ] **Step 4: Confirm the only production image dependency is `/assets/maria/portrait.png`** and it is a valid PNG.

