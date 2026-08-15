# Home Card Dissolve Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace forward card-to-page geometry stretching with a 400 ms dissolve on desktop and mobile.

**Architecture:** Mark each native View Transition as forward or back in `router.ts`. During forward navigation, remove the selected card/page shared-element pairing and crossfade the root route snapshots while the fixed chrome keeps its independent transition layer; preserve the existing shared-element behavior for back navigation.

**Tech Stack:** React, TypeScript, CSS View Transitions API, Vitest.

## Global Constraints

- Forward transitions from `/` to `/works` and `/hackathons` last 400 ms.
- Do not add blur, scale, or directional movement.
- Desktop and mobile use the same dissolve.
- Fixed header and bottom controls remain visually stable.
- `prefers-reduced-motion: reduce` remains effectively instant.
- Do not change destination layouts, carousel geometry, or page content.

---

### Task 1: Forward-only route dissolve

**Files:**
- Modify: `src/router.ts`
- Test: `src/router.test.ts`
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

**Interfaces:**
- Consumes: `navigateWithTransition(path: RoutePath): RouteViewTransition | null` and existing `data-transition-route` route marker.
- Produces: temporary `data-transition-direction="forward" | "back"` on `<html>` and forward-only dissolve CSS.

- [ ] **Step 1: Write failing tests for transition direction and dissolve CSS**

Add router assertions that navigation from `/` to `/works` sets `data-transition-direction="forward"` until `transition.finished`, and navigation from `/works` to `/` sets `back`. Update the style contract to require forward-only root opacity keyframes, 400 ms duration, and selected shared-element names disabled only during forward navigation; reject the old forward `.52s` geometry interpolation contract.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `./node_modules/.bin/vitest run src/router.test.ts src/styles.test.js`

Expected: FAIL because `data-transition-direction` and the dissolve CSS do not exist.

- [ ] **Step 3: Add the minimal direction marker**

In `navigateWithTransition`, derive direction before starting the transition:

```ts
const transitionDirection = currentPath === '/' && path !== '/' ? 'forward' : 'back'
document.documentElement.dataset.transitionDirection = transitionDirection
```

Remove it in the existing `transition.finished.finally(...)` cleanup only when it still matches the transition being completed.

- [ ] **Step 4: Replace forward geometry interpolation with dissolve CSS**

Add opacity-only keyframes:

```css
@keyframes maria-route-dissolve-out{from{opacity:1}to{opacity:0}}
@keyframes maria-route-dissolve-in{from{opacity:0}to{opacity:1}}
```

For `html[data-transition-direction="forward"]`, disable the selected shared-element `view-transition-name`, animate `::view-transition-old(root)` and `::view-transition-new(root)` for `.4s ease-out`, and keep fixed chrome on its existing stable named layers. Leave back-transition group behavior unchanged.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `./node_modules/.bin/vitest run src/router.test.ts src/styles.test.js`

Expected: both files PASS.

- [ ] **Step 6: Run complete verification**

Run:

```bash
./node_modules/.bin/vitest run
./node_modules/.bin/tsc -b
./node_modules/.bin/vite build
```

Expected: all tests, TypeScript, and production build PASS.

- [ ] **Step 7: Record visual QA**

Verify `/` → `/works` and `/` → `/hackathons` at desktop and mobile widths in light and dark themes: the home route dissolves without a growing rectangle, the destination appears smoothly, fixed controls do not flash, and destination entrance animation remains intact.

- [ ] **Step 8: Commit if Git metadata becomes available**

```bash
git add src/router.ts src/router.test.ts src/styles.css src/styles.test.js docs/superpowers/specs/2026-08-09-home-card-dissolve-transition-design.md docs/superpowers/plans/2026-08-09-home-card-dissolve-transition.md
git commit -m "fix: dissolve home card route transitions"
```

The current workspace has no accessible Git repository, so this step is skipped unless repository metadata is restored.
