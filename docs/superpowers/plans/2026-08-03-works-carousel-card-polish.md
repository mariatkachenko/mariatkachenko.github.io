# Works Carousel Card Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Works cards opaque, clean, Figma-file-like components and limit the visible carousel window to five cards.

**Architecture:** Keep the existing continuous carousel position and pose functions. Add a pure visibility helper, expose the result through card state/classes, remove decorative magazine depth nodes, and refine the reusable `WorksProjectCard` footer and theme styles.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Keep all 14 carousel items and infinite drag/wheel behavior.
- Show exactly five cards around the nearest integer carousel position, including during fractional drag positions.
- Preserve current visible-card spacing.
- Keep MTS Pay as the only interactive project.
- Remove right-side `spine/pages` strips completely.
- Preserve modal, hand artwork, route transitions, and gesture guards.

---

### Task 1: Five-card visibility window

**Files:**
- Modify: `src/maria/WorksCardCarousel.tsx`
- Test: `src/maria/WorksCardCarousel.test.tsx`

**Interfaces:**
- Produces: `visibleWorksCardIndices(position: number, count?: number): Set<number>`

- [ ] Add failing tests for exactly five visible indices at integer and fractional positions and for five visible cards after dragging.
- [ ] Run the focused test and confirm failure.
- [ ] Implement `visibleWorksCardIndices`, set `aria-hidden`, inert pointer state/class, and remove depth nodes.
- [ ] Run the focused test and confirm success.

### Task 2: Opaque Figma-file card styling

**Files:**
- Modify: `src/maria/WorksProjectCard.tsx`
- Modify: `src/styles.css`
- Test: `src/maria/WorksCardCarousel.test.tsx`
- Test: `src/styles.test.js`

**Interfaces:**
- `WorksProjectCard` renders `.works-project-card__file-icon`, preview, and footer copy.

- [ ] Add failing DOM/style assertions for the icon, regular title weight, opaque theme backgrounds, thin borders, clipped smooth geometry, hidden cards, and absence of depth-strip styles.
- [ ] Run the tests and confirm the expected failures.
- [ ] Add the decorative blue Figma-file icon and implement the theme/mobile CSS.
- [ ] Run focused tests and confirm success.

### Task 3: Temporary project cover assets

**Files:**
- Add: `public/assets/maria/works-cover-01.jpg` through `works-cover-05.jpg`
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/maria/WorksProjectCard.tsx`
- Test: `src/maria/WorksCardCarousel.test.tsx`

- [ ] Add failing assertions that every card has an image, MTS retains its own cover, and the five new sources repeat across placeholders.
- [ ] Copy the supplied files into local assets and add per-cover object-position hooks.
- [ ] Pass each placeholder cover through `WorksProjectCard` and verify the focused tests.

### Task 4: Card projection glow

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

- [ ] Add failing assertions that remove the triangular polygon and require theme-specific elliptical glow plus a compact mobile override.
- [ ] Replace the card `::after` projection and verify the focused style tests.

### Task 5: Distance-based card focus

**Files:**
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/styles.css`
- Test: `src/maria/WorksCardCarousel.test.tsx`
- Test: `src/styles.test.js`

- [ ] Add failing tests for centered, neighboring, and edge brightness variables in light and dark themes.
- [ ] Implement continuous clamped focus values and CSS theme selection without changing scale or opacity.
- [ ] Verify focused tests.

### Task 6: Regression verification

**Files:**
- Verify all modified source and test files.

- [ ] Run `pnpm test -- --run` with the bundled Node runtime on `PATH` and confirm all tests pass.
- [ ] Run `pnpm build` with the bundled Node runtime on `PATH` and confirm production output succeeds.
