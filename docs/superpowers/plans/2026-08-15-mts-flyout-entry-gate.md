# MTS Flyout Entry Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Start the initial MTS flyout only after the existing 600 ms works-carousel entrance finishes, without changing any other motion or layout.

**Architecture:** `WorksCardCarousel` exposes a single optional completion callback driven by its existing entrance timer. `WorksPage` keeps the overlay hidden on first mount and reveals it from a stable callback only when MTS Pay remains centered; later carousel activations continue through the existing centered-index logic.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, Vite.

## Global Constraints

- Do not change CSS or keyframes.
- Do not change View Transition or router behavior.
- Do not change carousel geometry, autoplay, wheel/drag, or the 600 ms entry duration.
- Do not change the home page or About page.
- Preserve the exact four-step rollback documented in the approved design spec.

---

### Task 1: Expose carousel entrance completion

**Files:**
- Modify: `src/maria/WorksCardCarousel.tsx`
- Test: `src/maria/WorksCardCarousel.test.tsx`

**Interfaces:**
- Consumes: existing `WORKS_ENTRY_DURATION_MS = 600` timer.
- Produces: optional prop `onEntryComplete?: () => void`, invoked once when the entrance timer completes.

- [x] **Step 1: Write the failing timer test**

Add a fake-timer test that renders the carousel with `onEntryComplete`, verifies zero calls at 599 ms, one call at 600 ms, and no additional calls after more elapsed time.

- [x] **Step 2: Run the focused test and verify failure**

Run: `pnpm exec vitest run src/maria/WorksCardCarousel.test.tsx`

Expected: FAIL because `onEntryComplete` is not part of the component contract and is never called.

- [x] **Step 3: Implement the minimal callback**

Add the optional prop and invoke it in the existing timer callback immediately after `setIsEntering(false)`. Keep timer duration and all interaction logic unchanged.

- [x] **Step 4: Run the focused test and verify success**

Run: `pnpm exec vitest run src/maria/WorksCardCarousel.test.tsx`

Expected: PASS.

### Task 2: Gate the initial overlay in WorksPage

**Files:**
- Modify: `src/maria/WorksPage.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `onEntryComplete?: () => void` from `WorksCardCarousel`.
- Produces: initial `flyoutVisible = false` and a stable `finishCarouselEntry` callback that reveals the overlay only when `previousCenteredIndex.current === WORKS_PROJECT_INDEX`.

- [x] **Step 1: Write the failing route-level timing test**

Add a fake-timer test that opens `/works`, verifies the MTS flyout overlay is not visible immediately, advances 600 ms, and verifies it becomes visible.

- [x] **Step 2: Run the focused test and verify failure**

Run: `pnpm exec vitest run src/App.test.tsx`

Expected: FAIL because the overlay is currently visible in the first frame.

- [x] **Step 3: Implement the page-level gate**

Initialize `flyoutVisible` to `false`, create `finishCarouselEntry` with `useCallback`, and pass it as `onEntryComplete`. Do not modify `updateCenteredIndex`, except that its current later-return behavior remains intact.

- [x] **Step 4: Run both focused suites**

Run: `pnpm exec vitest run src/maria/WorksCardCarousel.test.tsx src/App.test.tsx`

Expected: PASS.

### Task 3: Regression verification and rollback documentation

**Files:**
- Modify: `PROJECT_HANDOFF.md`

**Interfaces:**
- Consumes: completed timing gate.
- Produces: a concise note describing the initial gate and its isolated rollback.

- [x] **Step 1: Document the timing gate and rollback boundary**

Record that the first flyout waits for the existing 600 ms carousel entrance callback and that removing the callback wiring plus restoring `flyoutVisible = true` fully reverts this command.

- [x] **Step 2: Run the full regression suite**

Run: `pnpm test -- --run`

Expected: all tests PASS.

- [x] **Step 3: Run the production build**

Run: `pnpm build`

Expected: build completes successfully with no TypeScript or Vite errors.
