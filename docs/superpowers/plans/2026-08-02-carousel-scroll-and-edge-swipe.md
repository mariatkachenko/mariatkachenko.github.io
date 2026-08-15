# Carousel Scroll Direction and Edge-Swipe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reverse wheel/trackpad carousel rotation and keep native browser navigation from interrupting gestures inside the Works and About carousels on desktop and mobile.

**Architecture:** Keep direct pointer manipulation unchanged and invert only accepted wheel deltas at the point each carousel updates its position. Contain overscroll and prevent browser gesture handling locally on the two carousel surfaces, leaving navigation gestures outside them untouched.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Drag and touch movement remain natural and are not inverted.
- Browser back/forward gestures remain available outside carousel regions.
- Existing autoplay, snapping, click suppression, card order, visuals, and routing remain unchanged.
- Desktop and mobile behavior must both be covered.

---

### Task 1: Reverse Works Carousel Wheel Input

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

**Interfaces:**
- Consumes: `worksWheelDelta(deltaX, deltaY, shiftKey, isMobile): number`
- Produces: wheel handling that passes `-delta` to `worksPositionAfterDelta`, while pointer drag still passes its original delta.

- [ ] **Step 1: Change the wheel behavior test to expect the opposite position**

```tsx
fireEvent.wheel(carousel, { deltaX: 75, deltaY: 0 })
expect(carousel).toHaveAttribute('data-works-position', '6.5')
```

Add a mobile wheel case with `matchMedia('(max-width: 600px)')` returning true and verify positive `deltaY` also increases the carousel position.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`

Expected: the wheel direction assertions fail because the current result is `5.5`.

- [ ] **Step 3: Invert only accepted wheel input**

```tsx
setPosition((current) => worksPositionAfterDelta(current, -delta))
```

Do not change `moveDrag` or `finishDrag`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`

Expected: all Works carousel tests pass.

### Task 2: Reverse About Carousel Wheel Input

**Files:**
- Modify: `src/maria/HackathonOrbitCarousel.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`

**Interfaces:**
- Consumes: `horizontalWheelDelta(deltaX, deltaY, shiftKey): number`
- Produces: wheel handling that passes `-delta` to `orbitPositionAfterDelta`, while pointer drag and autoplay stay unchanged.

- [ ] **Step 1: Change the continuous wheel test to expect the opposite position**

```tsx
fireEvent.wheel(carousel, { deltaX: 180, deltaY: 0 })
expect(carousel).toHaveAttribute('data-orbit-position', '3')
```

Use fake timers consistently with the existing snap test and assert before its 140 ms snap timer fires.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test -- --run src/maria/HackathonOrbitCarousel.test.tsx`

Expected: the new wheel direction assertion fails because the current result decreases.

- [ ] **Step 3: Invert only accepted wheel input**

```tsx
setPosition((current) => orbitPositionAfterDelta(
  current,
  -delta,
  HACKATHON_DRAG_STEP_DESKTOP,
  HACKATHON_ORBIT_COUNT,
))
```

Do not change drag, snap timing, or autoplay direction.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `pnpm test -- --run src/maria/HackathonOrbitCarousel.test.tsx`

Expected: all About carousel tests pass.

### Task 3: Contain Native Navigation Gestures Within Carousels

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`

**Interfaces:**
- Produces: carousel surfaces with `overscroll-behavior-x: contain`, existing `touch-action: none`, and active pointer moves whose default browser handling is prevented.

- [ ] **Step 1: Add behavioral/style contract tests**

Update the stylesheet tests so both `.maria-works-carousel` and `.maria-orbit-carousel` must contain:

```css
overscroll-behavior-x:contain;
```

In each component test, start a pointer drag and assert `fireEvent.pointerMove(...)` returns `false`, proving the handler cancelled default browser behavior.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `pnpm test -- --run src/styles.test.js src/maria/WorksCardCarousel.test.tsx src/maria/HackathonOrbitCarousel.test.tsx`

Expected: containment assertions and pointer-move cancellation assertions fail.

- [ ] **Step 3: Implement local gesture containment**

Add `overscroll-behavior-x:contain` to both carousel CSS rules. At the start of an active `moveDrag`, call:

```tsx
event.preventDefault()
```

Keep the call after the guard so unrelated pointer moves are not cancelled.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `pnpm test -- --run src/styles.test.js src/maria/WorksCardCarousel.test.tsx src/maria/HackathonOrbitCarousel.test.tsx`

Expected: focused tests pass.

### Task 4: Full Verification

**Files:**
- Verify only.

**Interfaces:**
- Validates all prior task outputs together.

- [ ] **Step 1: Run the complete test suite**

Run: `pnpm test -- --run`

Expected: all test files and tests pass without warnings.

- [ ] **Step 2: Build the production site**

Run: `pnpm build`

Expected: TypeScript and Vite production build complete successfully.

- [ ] **Step 3: Review the change boundary**

Confirm that only carousel input direction, local gesture containment, corresponding tests, and documentation changed. This folder is not a Git repository, so commit steps are intentionally omitted.

### Task 5: Scope the Browser Navigation Guard to Pointer Hover

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`

**Interfaces:**
- Produces: a non-passive window wheel guard that calls `preventDefault()` for horizontal input only while the pointer is over the carousel.

- [ ] **Step 1: Add failing hover-scope tests**

Dispatch a cancelable horizontal `WheelEvent` on `window` before hover, during hover, and after pointer leave. Assert `defaultPrevented` is respectively `false`, `true`, and `false` for each carousel.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `pnpm test -- --run src/maria/WorksCardCarousel.test.tsx src/maria/HackathonOrbitCarousel.test.tsx`

Expected: the during-hover assertions fail because no window-level guard exists.

- [ ] **Step 3: Add the minimal window guard**

Track hover with a ref updated by `onPointerEnter` and `onPointerLeave`. Register one window `wheel` capture listener with `{ passive: false }`; cancel only non-zero horizontal deltas while the ref is true. Remove the listener on unmount.

- [ ] **Step 4: Run focused and full verification**

Run: `pnpm test -- --run`, then `pnpm build`.

Expected: all tests and the production build pass.
