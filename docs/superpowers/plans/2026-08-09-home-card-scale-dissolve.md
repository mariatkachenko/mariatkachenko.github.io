# Home Card Scale Dissolve Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Animate only the selected home card from scale `1` to `1.25` on opening and from `1.25` to `1` on closing while route snapshots dissolve.

**Architecture:** Reuse the existing `data-transition-route` and `data-transition-direction` markers. Dynamically assign a dedicated `home-card-scale` View Transition layer to the matching card, disable the old card-to-page shared geometry during both directions, and animate the isolated old or new card snapshot independently from the route dissolve.

**Tech Stack:** CSS View Transitions API, Vitest CSS contract tests.

## Global Constraints

- Opening and closing last 400 ms.
- Selected card scale is exactly `1 ↔ 1.25`.
- Do not add blur, directional movement, or page scaling.
- Desktop and mobile use the same ratio and timing.
- Fixed chrome and destination-specific animations remain unchanged.
- Reduced motion is effectively instant.

---

### Task 1: Isolated selected-card scale layer

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

**Interfaces:**
- Consumes: `data-transition-route="works" | "hackathons"` and `data-transition-direction="forward" | "back"` on `<html>`.
- Produces: `view-transition-name:home-card-scale` only for the matching home card and opacity/scale animations for its old or new snapshot.

- [ ] **Step 1: Write the failing CSS contract test**

Require exact selectors that assign `home-card-scale` to the works card only when `data-transition-route="works"`, and to the about card only when `data-transition-route="hackathons"`. Require these keyframes:

```css
@keyframes maria-home-card-open{from{opacity:1;scale:1}to{opacity:0;scale:1.25}}
@keyframes maria-home-card-close{from{opacity:0;scale:1.25}to{opacity:1;scale:1}}
```

Require a stable transition group above route snapshots, `.4s ease-out` old/new animations, backward root dissolve, and reduced-motion overrides.

- [ ] **Step 2: Run the focused style test and verify RED**

Run:

```bash
export PATH="/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
./node_modules/.bin/vitest run src/styles.test.js
```

Expected: FAIL because the dedicated card transition layer and scale keyframes do not exist.

- [ ] **Step 3: Implement minimal transition CSS**

Replace the forward-only shared-name suppression with suppression for both transition directions. Assign `home-card-scale` to the route-matching card with route-specific selectors. Add a non-moving `::view-transition-group(home-card-scale)` above the route layers, animate its old snapshot during forward navigation and its new snapshot during back navigation, and apply the existing root dissolve to both directions.

- [ ] **Step 4: Add reduced-motion coverage**

In the existing reduced-motion media query, set both isolated card snapshot animations and both root dissolve animations to `.01ms!important` while retaining their final visual states.

- [ ] **Step 5: Run focused test and verify GREEN**

Run: `./node_modules/.bin/vitest run src/styles.test.js`

Expected: 19 style tests PASS.

- [ ] **Step 6: Run full verification**

Run:

```bash
./node_modules/.bin/vitest run
./node_modules/.bin/tsc -b
./node_modules/.bin/vite build
```

Expected: all tests, TypeScript, and production build PASS.

- [ ] **Step 7: Check visual states**

Check `/` ↔ `/works` and `/` ↔ `/hackathons` at desktop and mobile widths in light and dark themes. The matching card alone grows on opening and settles on closing; the other card only dissolves; fixed chrome stays stable.

- [ ] **Step 8: Commit if Git metadata becomes available**

```bash
git add src/styles.css src/styles.test.js docs/superpowers/specs/2026-08-09-home-card-scale-dissolve-design.md docs/superpowers/plans/2026-08-09-home-card-scale-dissolve.md
git commit -m "feat: scale home card during route dissolve"
```

The current workspace has no accessible Git repository, so this step is skipped unless repository metadata is restored.
