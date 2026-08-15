# MTS Pay Centered Artwork Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the MTS Pay artwork permanently enlarged to 118% only while its card is centered, with the butterfly and Figma logo outside every project-card frame, no dark preview background, no hover enlargement, and no flag reveal.

**Architecture:** `WorksCardCarousel` derives an explicit centered class from the card's continuous offset. CSS uses that state—not hover—to release the project button, card, and preview clipping and reveal the existing full-art overlay. Off-center cards retain the existing cropped preview.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Change only `/works` MTS Pay centered composition and the existing MTS flag reveal behavior.
- Centered artwork scale is exactly `118%`.
- The butterfly and Figma logo cross the preview, card, and project-button boundaries.
- MTS preview background is transparent in light and dark themes.
- Hover and focus do not enlarge the MTS artwork or reveal flags.
- Mobile uses the same centered-state rule.
- Do not change carousel geometry, copy, presentation modal, home page, `/hackathons`, or placeholder artwork.

---

### Task 1: Expose the centered MTS card state

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

**Interfaces:**
- Consumes: the existing `offset` returned by `continuousWorksOffset(index, position)`.
- Produces: `.is-centered` on the project article exactly when `projectCard && Math.abs(offset) < 0.001`.

- [ ] **Step 1: Add a failing centered-state test**

In the existing carousel structure test, add:

```tsx
expect(cards[WORKS_PROJECT_INDEX]).toHaveClass('has-project', 'is-centered')
expect(container.querySelectorAll('.maria-works-deck-card.is-centered')).toHaveLength(1)
```

In a separate interaction test, move the carousel with its supported wheel interaction and assert the project loses the centered class:

```tsx
fireEvent.wheel(carousel, { deltaX: 180, deltaY: 0 })
expect(cards[WORKS_PROJECT_INDEX]).not.toHaveClass('is-centered')
```

- [ ] **Step 2: Run the test and verify RED**

```bash
export PATH="/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
./node_modules/.bin/vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: FAIL because `.is-centered` is absent.

- [ ] **Step 3: Add the state-derived class**

After `projectCard` is calculated, derive:

```tsx
const centeredProjectCard = projectCard && Math.abs(offset) < 0.001
```

Update the article class:

```tsx
className={`maria-works-deck-card${projectCard ? ' has-project' : ' is-empty'}${centeredProjectCard ? ' is-centered' : ''}${visible ? '' : ' is-hidden'}`}
```

- [ ] **Step 4: Run the targeted test and verify GREEN**

```bash
./node_modules/.bin/vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: PASS.

---

### Task 2: Move the breakout from hover to centered state

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `.has-project.is-centered`, `.has-breakout-artwork`, `.works-project-card__preview`, `.works-project-card__breakout-artwork`, and `.concept-cover`.
- Produces: permanent centered breakout, transparent MTS preview, hidden flags, and stable MTS hover scale.

- [ ] **Step 1: Replace the previous hover-contract test with centered-state assertions**

```js
it('breaks the centered MTS artwork out at 118 percent without hover effects', () => {
  expect(styles).toContain('.has-breakout-artwork .works-project-card__preview{background:transparent')
  expect(styles).toContain('.maria-works-deck-card.has-project.is-centered .concept-cover{overflow:visible}')
  expect(styles).toContain('.maria-works-deck-card.has-project.is-centered .works-project-card.has-breakout-artwork{overflow:visible;clip-path:none}')
  expect(styles).toContain('.maria-works-deck-card.has-project.is-centered .works-project-card__preview{opacity:0}')
  expect(styles).toContain('.maria-works-deck-card.has-project.is-centered .works-project-card__breakout-artwork{transform:scale(1.18);opacity:1}')
  expect(styles).not.toContain('.maria-works-deck-card:hover .works-project-card__breakout-artwork')
  expect(styles).toContain('.maria-works-deck-card.has-project:hover{scale:1}')
})
```

Update the flag test so it requires no reveal selectors:

```js
expect(styles).not.toContain('.maria-works-deck-card:hover .works-project-card__mts-flag')
expect(styles).not.toContain('.maria-works-deck-card:focus-within .works-project-card__mts-flag')
expect(styles).not.toContain('.maria-works-deck-card:active .works-project-card__mts-flag')
```

- [ ] **Step 2: Run the style test and verify RED**

```bash
./node_modules/.bin/vitest run src/styles.test.js
```

Expected: FAIL because the current implementation is hover-driven, has a dark preview background, and reveals flags.

- [ ] **Step 3: Implement the centered composition**

Replace the breakout hover selectors with:

```css
.has-breakout-artwork .works-project-card__preview{background:transparent;transition:opacity .14s ease}
.maria-works-deck-card.has-project.is-centered .concept-cover{overflow:visible}
.maria-works-deck-card.has-project.is-centered .works-project-card.has-breakout-artwork{overflow:visible;clip-path:none}
.maria-works-deck-card.has-project.is-centered .works-project-card__preview{opacity:0}
.maria-works-deck-card.has-project.is-centered .works-project-card__breakout-artwork{transform:scale(1.18);opacity:1}
```

The full-art overlay already sits directly inside the project card. Releasing `concept-cover` and `works-project-card` clipping allows the butterfly and Figma logo to cross all project-component boundaries while the carousel remains unchanged.

- [ ] **Step 4: Remove flag reveal and MTS hover scale**

Delete the combined rule that changes `.works-project-card__mts-flag` to visible on hover/focus/active. Keep its default hidden transform and opacity.

Inside the fine-pointer block, preserve the general card hover and add an MTS override:

```css
.maria-works-deck-card.has-project:hover{scale:1}
```

Outside it, prevent focus enlargement only for the MTS card:

```css
.maria-works-deck-card.has-project:focus-within{scale:1}
```

- [ ] **Step 5: Run targeted tests and verify GREEN**

```bash
./node_modules/.bin/vitest run src/styles.test.js src/App.test.tsx src/maria/WorksCardCarousel.test.tsx
```

Expected: all targeted tests PASS.

---

### Task 3: Verify the complete `/works` change

**Files:**
- Verify: `src/maria/WorksCardCarousel.tsx`
- Verify: `src/styles.css`
- Verify: `public/assets/maria/mts-pay-flex-artwork.png`

**Interfaces:**
- Consumes: completed Tasks 1–2.
- Produces: fresh regression evidence for the centered artwork composition.

- [ ] **Step 1: Run all tests**

```bash
./node_modules/.bin/vitest run
```

Expected: zero failed test files.

- [ ] **Step 2: Run TypeScript and production build**

```bash
./node_modules/.bin/tsc -b
./node_modules/.bin/vite build
```

Expected: both exit `0`.

- [ ] **Step 3: Verify visual-state contracts**

Confirm in `/works`:

```text
MTS centered: full artwork at 118%, butterfly and Figma logo outside every project-card frame
MTS off-center: cropped artwork, no overlap into neighboring cards
hover/focus: no artwork or MTS-card enlargement, no flags
light/dark: no explicit dark MTS preview rectangle
mobile: centered breakout and off-center crop follow the same state rule
```

Confirm clicking still opens the presentation and drag/wheel still move the carousel.
