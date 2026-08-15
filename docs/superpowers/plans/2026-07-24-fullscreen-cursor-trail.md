# Fullscreen Cursor Trail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing pink pixel cursor trail emit across the full viewport.

**Architecture:** Keep the canvas renderer and particle system unchanged. Broaden only the pure emission predicate used by the pointer handler, with a regression test covering both viewport halves.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, Vite

## Global Constraints

- Preserve the existing particle color, shape, density, size, drift, and fade.
- Preserve portrait/model background switching.
- Keep the trail canvas non-interactive.

---

### Task 1: Enable full-viewport trail emission

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/ShimmerTrail.tsx`

**Interfaces:**
- Consumes: `shouldEmitShimmer(clientX: number, viewportWidth: number): boolean`
- Produces: The same function signature, returning `true` for positions in either viewport half.

- [ ] **Step 1: Write the failing test**

Change the existing assertions to:

```ts
expect(shouldEmitShimmer(100, 1000)).toBe(true)
expect(shouldEmitShimmer(900, 1000)).toBe(true)
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm test -- --run
```

Expected: FAIL because `shouldEmitShimmer(100, 1000)` still returns `false`.

- [ ] **Step 3: Write the minimal implementation**

Replace the half-screen predicate with:

```ts
export function shouldEmitShimmer(_clientX: number, _viewportWidth: number) {
  return true
}
```

- [ ] **Step 4: Run verification**

Run:

```bash
pnpm test -- --run
pnpm build
```

Expected: 12 tests pass and the production build exits successfully.
