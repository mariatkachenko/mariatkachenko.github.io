# Works Carousel Continuous Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore smooth drag and trackpad movement while making the nearest visually central card reliably regain its centered state.

**Architecture:** Revert per-event wheel rounding and desktop release snapping, preserving the original continuous position data. Derive `.is-centered` for every card from the rounded normalized position, keeping MTS artwork switching purely derived from current position.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, Vite.

## Global Constraints

- Change only Works carousel behavior and tests.
- Keep mobile release snapping, circular wrapping, directions, card visuals, modal, themes, and entry animation unchanged.
- Add no timer or magnetic settling animation.

---

### Task 1: Restore continuous input and derive the visual center

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

**Interfaces:**
- Consumes: existing position helpers and offsets.
- Produces: continuous desktop position, accumulated wheel deltas, and `.is-centered` for the nearest normalized card index.

- [ ] **Step 1: Write failing regression tests**

Restore the desktop release expectation to `8.167`. Replace the single rounded wheel expectation with three `deltaX: 25` events that produce positions `6.167`, `6.333`, and `6.5`; assert MTS remains centered through `6.333` and loses the state at the exact tie. Then send `deltaX: 1` to reach `6.507`, assert card 7 becomes centered, and verify only one centered card exists. Add the reverse path to `6.333` and assert MTS regains its state.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`

Expected: FAIL because current wheel events round independently and desktop release snaps.

- [ ] **Step 3: Implement the minimal correction**

Restore viewport-specific pointer release snapping:

```ts
setPosition(worksDragReleasePosition(
  finalPosition,
  WORKS_CARD_COUNT,
  pointerOrigin.current.isMobile,
))
```

Restore continuous wheel accumulation:

```ts
setPosition((current) => worksPositionAfterDelta(current, -delta))
```

Derive one centered index before rendering cards:

```ts
const centeredIndex = normalizeWorksPosition(Math.round(position))
const centered = index === centeredIndex
```

- [ ] **Step 4: Run focused tests**

Run: `PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`

Expected: PASS.

- [ ] **Step 5: Run full verification**

Run: `PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH pnpm test -- --run`

Expected: all tests PASS.

Run: `PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH pnpm run build`

Expected: TypeScript and Vite build complete successfully.
