# Mobile Works Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the mobile Works carousel as a continuous vertical oval loop with an outward-opening fan.

**Architecture:** Add a pure `mobileWorksLoopPose` helper that maps wrapped carousel offset to vertical position, frontness, scale, opacity, and layer. Expose those values as mobile-only CSS variables while leaving desktop pose variables and interaction state unchanged.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite

## Global Constraints

- Desktop carousel behavior and geometry remain unchanged.
- Mobile vertical drag and wheel behavior remain unchanged.
- Initial position remains `WORKS_PROJECT_INDEX + 0.42`.
- Mobile radius is 22 vh, scale range is 0.72–1, opacity range is 0.18–1.
- Mobile `rotateX` is the inverse of desktop pose rotation.

---

### Task 1: Mobile oval-loop geometry

**Files:**
- Modify: `src/maria/WorksCardCarousel.tsx`
- Test: `src/maria/WorksCardCarousel.test.tsx`

**Interfaces:**
- Produces: `mobileWorksLoopPose(offset, count): { y: number; scale: number; opacity: number; layer: number }`
- Produces CSS variables: `--works-loop-y-mobile`, `--works-loop-scale-mobile`, `--works-loop-opacity-mobile`, `--works-loop-layer-mobile`

- [ ] **Step 1: Add failing geometry tests**

Test front, quarter, and rear positions:

```ts
expect(mobileWorksLoopPose(0, 14)).toEqual({ y: 0, scale: 1, opacity: 1, layer: 20 })
expect(mobileWorksLoopPose(3.5, 14).y).toBeCloseTo(22)
expect(mobileWorksLoopPose(7, 14)).toEqual({ y: 0, scale: 0.72, opacity: 0.18, layer: 1 })
expect(mobileWorksLoopPose(-3.5, 14).y).toBeCloseTo(-22)
```

Assert rendered mobile rotation equals the negated desktop rotation and that all four loop variables are present.

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: helper and loop variables are absent.

- [ ] **Step 3: Implement geometry**

Use:

```ts
const angle = offset / count * Math.PI * 2
const frontness = (Math.cos(angle) + 1) / 2
return {
  y: Math.sin(angle) * 22,
  scale: 0.72 + frontness * 0.28,
  opacity: 0.18 + frontness * 0.82,
  layer: 1 + Math.round(frontness * 19),
}
```

Round only CSS output values to avoid long style strings. Set `--works-row-rotate-x-mobile` to `-pose.rotateY`.

- [ ] **Step 4: Verify GREEN**

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: all Works component tests pass.

### Task 2: Mobile loop rendering

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

**Interfaces:**
- Consumes: the four mobile loop variables from Task 1
- Produces: unclipped, depth-layered mobile oval rendering

- [ ] **Step 1: Add failing CSS tests**

Assert the mobile carousel uses `overflow:visible`, and the card uses loop Y, scale, opacity, and layer variables. Remove the old assertion requiring `overflow:hidden`.

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/styles.test.js
```

Expected: the mobile loop CSS is absent.

- [ ] **Step 3: Implement mobile CSS**

Set the mobile carousel to `overflow:visible`. Use:

```css
opacity:var(--works-loop-opacity-mobile);
z-index:var(--works-loop-layer-mobile);
transform:translate3d(-50%,calc(-50% + var(--works-loop-y-mobile)),0)
  rotateX(var(--works-row-rotate-x-mobile))
  scale(var(--works-loop-scale-mobile));
```

The enclosing page remains `overflow:hidden`, so no page scroll is introduced.

- [ ] **Step 4: Full verification**

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx src/styles.test.js
pnpm vitest run
pnpm build
```

Expected: all tests and the production build pass.
