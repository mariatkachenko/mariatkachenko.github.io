# Maria Tkachenko Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Grain Archive with a responsive single-page Maria Tkachenko portfolio matching Figma node `604:485`.

**Architecture:** Keep Vite, React, TypeScript, Vitest, and plain CSS. Replace the router-driven Grain Archive UI with one focused portfolio page composed from a header, hero portrait, and two reusable collage cards, using durable local Figma assets and CSS breakpoints.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, plain CSS.

## Global Constraints

- `/` is the only visible page; unknown paths resolve to `/`.
- Figma assets live under `public/assets/maria/`.
- Production source contains no `figma.com/api/mcp/asset` URLs.
- No new routing, styling, or animation dependencies.
- The document has no horizontal overflow at 375, 768, or 1440 px.
- The workspace has no Git repository, so commit steps are replaced by test/build checkpoints.

---

### Task 1: Export and validate Figma assets

**Files:**
- Create: `public/assets/maria/*`

**Interfaces:**
- Produces stable `/assets/maria/<filename>` URLs for page components.

- [ ] **Step 1: Read the complete design context** for node `604:485` and record every referenced asset URL and visual role.
- [ ] **Step 2: Download each exact asset** with a descriptive filename such as `portrait.png`, `works-paper.png`, `hackathons-paper.png`, and `profile-avatar.png`.
- [ ] **Step 3: Validate the downloaded files** with `file public/assets/maria/*`; expected: every item is a recognized image format.
- [ ] **Step 4: Run `rg "figma\\.com/api/mcp/asset" src public`**; expected after implementation: no matches.

### Task 2: Replace the old route contract with the portfolio contract

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Create: `src/maria/PortfolioPage.tsx`

**Interfaces:**
- Produces `PortfolioPage(): JSX.Element`.
- `App` renders `PortfolioPage` for every pathname and normalizes the address to `/` when necessary.

- [ ] **Step 1: Replace the old route tests** with failing assertions for heading “Мария Ткаченко”, email `mery.tkachenko@gmail.com`, handle `@marykllj`, city `Moscow`, language controls `RU` and `EN`, links “Работы” and “Хакатоны”, and absence of “Grain Archive”.
- [ ] **Step 2: Run `pnpm test -- --run`**; expected: failures because the old Grain Archive application still renders.
- [ ] **Step 3: Create the minimal page shell** with semantic `<header>`, `<main>`, heading, navigation/contact links, language controls, and the two portfolio entry links.
- [ ] **Step 4: Replace router selection in `App.tsx`** with `<PortfolioPage />` and normalize unknown history paths to `/` without reloading.
- [ ] **Step 5: Run `pnpm test -- --run`**; expected: the new portfolio tests pass.

### Task 3: Build the desktop collage

**Files:**
- Create: `src/maria/PortfolioCard.tsx`
- Modify: `src/maria/PortfolioPage.tsx`
- Replace: `src/styles.css`

**Interfaces:**
- `PortfolioCard({ title, href, className, paper, decorations }): JSX.Element` renders one accessible visual entry.
- `PortfolioPage` composes the header, portrait, works card, hackathons card, language control, and theme decoration.

- [ ] **Step 1: Add a component test** asserting that both portfolio cards are links with their descriptive accessible names.
- [ ] **Step 2: Run the test**; expected: failure until `PortfolioCard` is introduced.
- [ ] **Step 3: Implement `PortfolioCard`** using exported paper and decoration assets; keep decorations `aria-hidden` and empty-alt.
- [ ] **Step 4: Implement the desktop composition** at the Figma reference proportions: silver background, portrait centered and anchored to the bottom, works card left, hackathons card right, monospaced header across the top, language switch bottom-left, and theme icon bottom-right.
- [ ] **Step 5: Match Figma typography, rotations, layer ordering, clipping, shadows, and image crops** using plain CSS custom properties and absolute positioning inside a bounded hero canvas.
- [ ] **Step 6: Run `pnpm test -- --run`**; expected: all portfolio tests pass.

### Task 4: Add responsive tablet and mobile compositions

**Files:**
- Modify: `src/styles.css`

**Interfaces:**
- Existing component markup remains unchanged; media queries control composition.

- [ ] **Step 1: Add CSS at `max-width: 900px`** to compact the header, reduce overlaps, keep the portrait centered, and place the two cards within the viewport.
- [ ] **Step 2: Add CSS at `max-width: 600px`** to create a vertical editorial sequence: identity/contact, portrait, works card, hackathons card, footer controls.
- [ ] **Step 3: Add fluid type and spacing** with `clamp()` while preserving the Figma visual hierarchy.
- [ ] **Step 4: Add `overflow-x: clip`, visible keyboard focus, touch-friendly link sizes, and reduced-motion behavior.**
- [ ] **Step 5: Verify layout calculations** at 375, 768, and 1440 px; expected document width equals viewport width.

### Task 5: Production and localhost verification

**Files:**
- Modify as observed: `src/maria/*.tsx`, `src/styles.css`.

**Interfaces:**
- Produces the final localhost portfolio.

- [ ] **Step 1: Run `pnpm test -- --run`**; expected: all tests pass with no warnings.
- [ ] **Step 2: Run `pnpm build`**; expected: TypeScript and Vite build exit successfully.
- [ ] **Step 3: Run `rg "figma\\.com/api/mcp/asset|Grain Archive" src public`**; expected: no production matches.
- [ ] **Step 4: Start Vite on an available `127.0.0.1` port** and verify `/` returns HTTP 200.
- [ ] **Step 5: Verify every `/assets/maria/` URL referenced by the page** returns HTTP 200 with an image content type.
- [ ] **Step 6: Compare the desktop rendering to the Figma screenshot** and correct only observed differences in geometry, crop, layer order, and typography.
- [ ] **Step 7: Check 768 and 375 px renderings** for readable content, usable links, and no horizontal overflow.
- [ ] **Step 8: Re-run tests, build, source scan, and localhost HTTP checks** after the final visual adjustment.
