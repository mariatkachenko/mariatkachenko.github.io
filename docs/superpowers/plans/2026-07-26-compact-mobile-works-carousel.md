# Compact Mobile Works Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the mobile Works carousel compact, closely spaced, and initially balanced between two visibly open cards.

**Architecture:** Keep the existing continuous carousel state and desktop pose calculations. Add explicit mobile layout constants for vertical spacing and initial fractional positioning, expose them through the existing card CSS variables, and constrain the mobile carousel with CSS to the free area between fixed interface elements.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite

## Global Constraints

- Apply the layout change only at viewport widths up to 600 px.
- Keep vertical pointer drag and vertical wheel behavior.
- Do not add snapping or automatic movement.
- Do not change the desktop carousel.
- Keep native card and image dragging disabled.

---

### Task 1: Compact mobile spacing and balanced initial pose

**Files:**
- Modify: `src/maria/WorksCardCarousel.tsx`
- Test: `src/maria/WorksCardCarousel.test.tsx`

**Interfaces:**
- Produces: `WORKS_MOBILE_CARD_STEP_VH: number`
- Produces: `WORKS_INITIAL_POSITION: number`
- Consumes: `worksRowPose(offset, retainedSide)` and existing continuous position helpers

- [ ] **Step 1: Write the failing behavior tests**

Assert that the mobile step is `19`, the initial position has a fractional component outside the `0.18` center edge zone, and the rendered `--works-row-y-mobile` values use the new step.

```ts
expect(WORKS_MOBILE_CARD_STEP_VH).toBe(19)
expect(Math.abs(WORKS_INITIAL_POSITION % 1)).toBeGreaterThan(WORKS_CENTER_EDGE_ZONE)
expect(cards[0].style.getPropertyValue('--works-row-y-mobile')).toBe(
  `${continuousWorksOffset(0, WORKS_INITIAL_POSITION) * WORKS_MOBILE_CARD_STEP_VH}vh`,
)
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: failure because `WORKS_MOBILE_CARD_STEP_VH` is not exported and the old mobile value uses `28vh`.

- [ ] **Step 3: Implement the compact layout constants**

Add:

```ts
export const WORKS_MOBILE_CARD_STEP_VH = 19
export const WORKS_INITIAL_POSITION = WORKS_PROJECT_INDEX + 0.42
```

Render the mobile position with:

```ts
'--works-row-y-mobile': `${pose.x * WORKS_MOBILE_CARD_STEP_VH}vh`
```

The `0.42` fractional start keeps the two nearest cards balanced while remaining outside the `0.18` fully edge-on zone.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: all Works carousel tests pass.

### Task 2: Restrict the mobile carousel to free page space

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

**Interfaces:**
- Consumes: `--works-row-y-mobile`
- Produces: a mobile-only carousel viewport between navigation and bottom content

- [ ] **Step 1: Write the failing CSS assertions**

Add exact mobile assertions:

```js
expect(styles).toContain('.maria-works-carousel{top:19vh;height:48vh}')
expect(styles).toContain('overflow:hidden')
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm vitest run src/styles.test.js
```

Expected: failure because the current mobile bounds are `top:15vh;height:66vh` and the carousel is not clipped.

- [ ] **Step 3: Implement the mobile bounds**

Inside `@media(max-width:600px)`, set:

```css
.maria-works-carousel{top:19vh;height:48vh;overflow:hidden}
```

Retain the existing mobile card width, magazine depth, `rotateX`, and vertical translation.

- [ ] **Step 4: Run focused tests**

Run:

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx src/styles.test.js
```

Expected: both test files pass.

### Task 3: Full verification

**Files:**
- Verify only

**Interfaces:**
- Consumes: completed Tasks 1 and 2
- Produces: tested production build

- [ ] **Step 1: Run the full test suite**

```bash
pnpm vitest run
```

Expected: all tests pass.

- [ ] **Step 2: Run the production build**

```bash
pnpm build
```

Expected: TypeScript and Vite build complete successfully.

- [ ] **Step 3: Review the mobile invariants**

Confirm from the rendered styles and component output that desktop uses `--works-row-x` and `rotateY`, mobile uses `--works-row-y-mobile` and `rotateX`, and no pointer or wheel handler introduces snapping.
