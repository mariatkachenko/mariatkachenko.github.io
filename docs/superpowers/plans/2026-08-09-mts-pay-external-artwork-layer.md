# MTS Pay External Artwork Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the ineffective internal MTS breakout overlay with a 140% external sibling layer that visibly exceeds the preview and card bounds when centered.

**Architecture:** `ConceptProject` owns two representations of the same PNG: a cropped image inside `WorksProjectCard` and an external decorative sibling directly inside the project button. The carousel's existing `.is-centered` state reveals the external sibling and hides the cropped preview. `WorksProjectCard` returns to a generic card component with no breakout-specific markup.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Change only the MTS Pay card on `/works`.
- External centered artwork is `140%` of preview width with matching 16:9 height.
- The external artwork is not a descendant of `WorksProjectCard` or its preview.
- Footer remains above the external artwork.
- Off-center state keeps the cropped preview.
- No dark preview background, hover enlargement, or flag reveal.
- Do not change carousel geometry, copy, modal, home page, `/hackathons`, or placeholder artwork.

---

### Task 1: Move breakout markup to `ConceptProject`

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/ConceptProject.tsx`
- Modify: `src/maria/WorksProjectCard.tsx`

**Interfaces:**
- Produces: `.concept-cover__external-artwork` as a direct child of `.concept-cover` and sibling immediately before `.works-project-card`.
- Removes: `breakoutArtwork?: boolean`, `.has-breakout-artwork`, and `.works-project-card__breakout-artwork`.

- [ ] **Step 1: Write failing structure assertions**

In the `/works` route test:

```tsx
const externalArtwork = cover.querySelector<HTMLImageElement>('.concept-cover__external-artwork')
const projectCard = cover.querySelector('.works-project-card')
expect(externalArtwork).toHaveAttribute('src', '/assets/maria/mts-pay-flex-artwork.png')
expect(externalArtwork?.parentElement).toBe(cover)
expect(externalArtwork?.nextElementSibling).toBe(projectCard)
expect(projectCard?.querySelector('.concept-cover__external-artwork')).toBeNull()
```

Update the carousel test:

```tsx
expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('.concept-cover__external-artwork')).toHaveLength(1)
expect(container.querySelectorAll('.concept-cover__external-artwork')).toHaveLength(1)
expect(container.querySelectorAll('.works-project-card__breakout-artwork')).toHaveLength(0)
```

- [ ] **Step 2: Run targeted tests and verify RED**

```bash
export PATH="/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
./node_modules/.bin/vitest run src/App.test.tsx src/maria/WorksCardCarousel.test.tsx
```

Expected: FAIL because the artwork still lives inside `WorksProjectCard`.

- [ ] **Step 3: Implement external sibling markup**

In `ConceptProject`, render before `WorksProjectCard`:

```tsx
<img
  className="concept-cover__external-artwork"
  src="/assets/maria/mts-pay-flex-artwork.png"
  alt=""
  aria-hidden="true"
  draggable="false"
/>
```

Keep `imageSrc="/assets/maria/mts-pay-flex-artwork.png"` on `WorksProjectCard`, but remove `breakoutArtwork`.

From `WorksProjectCard`, remove the `breakoutArtwork` prop, `.has-breakout-artwork` class, and internal breakout image.

- [ ] **Step 4: Run targeted tests and verify GREEN**

```bash
./node_modules/.bin/vitest run src/App.test.tsx src/maria/WorksCardCarousel.test.tsx
```

Expected: PASS.

---

### Task 2: Size and reveal the external layer

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `.maria-works-deck-card.has-project.is-centered` and `.concept-cover__external-artwork`.
- Produces: 140% external centered layer and off-center cropped fallback.

- [ ] **Step 1: Write failing visual-contract assertions**

Replace internal breakout assertions with:

```js
expect(styles).toContain('.concept-cover__external-artwork{position:absolute;z-index:5;left:50%;top:-15%;width:140%;height:auto;aspect-ratio:16/9')
expect(styles).toContain('transform:translateX(-50%)')
expect(styles).toContain('.maria-works-deck-card.has-project.is-centered .concept-cover{overflow:visible}')
expect(styles).toContain('.maria-works-deck-card.has-project.is-centered .concept-cover__external-artwork{opacity:1}')
expect(styles).toContain('.maria-works-deck-card.has-project.is-centered .works-project-card__preview{opacity:0}')
expect(styles).not.toContain('.works-project-card__breakout-artwork{')
expect(styles).not.toContain('.has-breakout-artwork')
```

Keep assertions that MTS hover scale is `1` and flag reveal selectors are absent.

- [ ] **Step 2: Run style test and verify RED**

```bash
./node_modules/.bin/vitest run src/styles.test.js
```

Expected: FAIL because the stylesheet still targets the internal overlay.

- [ ] **Step 3: Replace internal breakout CSS**

Delete `.works-project-card__breakout-artwork`, `.has-breakout-artwork`, and centered internal-card clipping overrides.

Add:

```css
.concept-cover__external-artwork{position:absolute;z-index:5;left:50%;top:-15%;width:140%;height:auto;aspect-ratio:16/9;display:block;object-fit:contain;object-position:center;opacity:0;pointer-events:none;transform:translateX(-50%);transform-origin:center;transition:opacity .14s ease}
.maria-works-deck-card.has-project .works-project-card__preview{background:transparent;transition:opacity .14s ease}
.maria-works-deck-card.has-project.is-centered .concept-cover{overflow:visible}
.maria-works-deck-card.has-project.is-centered .concept-cover__external-artwork{opacity:1}
.maria-works-deck-card.has-project.is-centered .works-project-card__preview{opacity:0}
.maria-works-deck-card.has-project .works-project-card__footer{position:relative;z-index:7}
```

The deck article and carousel already use `overflow: visible`; do not alter their geometry.

- [ ] **Step 4: Run targeted tests and verify GREEN**

```bash
./node_modules/.bin/vitest run src/styles.test.js src/App.test.tsx src/maria/WorksCardCarousel.test.tsx
```

Expected: PASS.

---

### Task 3: Verify the structural fix

**Files:**
- Verify: `src/maria/ConceptProject.tsx`
- Verify: `src/maria/WorksProjectCard.tsx`
- Verify: `src/styles.css`

- [ ] **Step 1: Run full automated verification**

```bash
./node_modules/.bin/vitest run
./node_modules/.bin/tsc -b
./node_modules/.bin/vite build
```

Expected: all commands exit `0`.

- [ ] **Step 2: Confirm visual states**

```text
centered MTS: external 140% layer visible beyond preview/card/button
off-center MTS: only cropped preview visible
footer: above external art
hover/focus: no resizing and no flags
desktop/mobile, light/dark: same centered-state contract
```
