# Works Center Crossing Stability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Start the Works carousel on a tight central pair and prevent magazines from visibly flipping while crossing the center.

**Architecture:** Keep fractional position state, but add a retained rotation-side map keyed by card index. The pure pose helper accepts the retained side; the component updates a card's side only after its wrapped offset exits a `0.18` center edge zone.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, Vite.

## Global Constraints

- Initial position is exactly `6.5`.
- Initial offsets for indices `6` and `7` are `-0.5` and `0.5`.
- Absolute offsets `<= 0.18` remain at `90deg`.
- Rotation side changes only outside the center zone.
- Preserve fractional drag/wheel position, magazine depth, modal opening, and no autoplay.

---

### Task 1: Stable center pose helper

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

**Interfaces:**
- Add: `WORKS_CENTER_EDGE_ZONE = 0.18`
- Modify: `worksRowPose(offset: number, retainedSide?: -1 | 1)`

- [ ] **Step 1: Write failing helper tests**

```ts
expect(worksRowPose(-0.1, 1).rotateY).toBe(90)
expect(worksRowPose(0, 1).rotateY).toBe(90)
expect(worksRowPose(0.1, 1).rotateY).toBe(90)
expect(worksRowPose(0.19, 1).rotateY).toBeLessThan(0)
expect(worksRowPose(-0.19, -1).rotateY).toBeGreaterThan(0)
```

- [ ] **Step 2: Run focused test and verify RED**

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

- [ ] **Step 3: Implement center-zone pose**

Inside the edge zone return `rotateY: 90 * retainedSide`. Outside it, use the existing mirrored fan sign. Preserve X and layer values.

- [ ] **Step 4: Run focused test and verify GREEN**

Run the same command.

### Task 2: Initial pair and retained sides

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`
- Verify: `src/App.test.tsx`

**Interfaces:**
- Add: `WORKS_INITIAL_POSITION = WORKS_PROJECT_INDEX + 0.5`

- [ ] **Step 1: Write failing component tests**

Assert initial `data-works-position="6.5"` and card offsets `-0.5` / `0.5`. Simulate movement from `-0.1` to `0.1` around a card and assert its rotation-side CSS variable stays unchanged until offset exceeds `0.18`.

- [ ] **Step 2: Run focused test and verify RED**

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

- [ ] **Step 3: Implement initial position and retained side refs**

Initialize state to `WORKS_INITIAL_POSITION`. Store per-card sides in a ref initialized from the starting offsets. During render, update a card's retained side only when `Math.abs(offset) > WORKS_CENTER_EDGE_ZONE`, then pass it to `worksRowPose`.

- [ ] **Step 4: Run Works and App tests and verify GREEN**

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx src/App.test.tsx
```

### Task 3: Full verification

**Files:**
- Verify all source and test files.

- [ ] **Step 1: Run all tests**

```bash
pnpm test -- --run
```

- [ ] **Step 2: Run production build**

```bash
pnpm build
```

- [ ] **Step 3: Confirm initial pair, center-zone stability, interaction preservation, modal behavior, and no autoplay**

- [ ] **Step 4: Report the fresh test count and build result**
