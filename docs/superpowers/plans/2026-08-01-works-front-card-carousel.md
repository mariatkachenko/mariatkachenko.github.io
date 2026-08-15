# Front-facing Works Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the center Works card face the viewer while neighboring cards form a symmetric continuous fan.

**Architecture:** Replace the edge-facing center formula in `worksRowPose` with a bounded distance-based rotation. Center the initial position on the MTS Pay project and reuse the same signed rotation value for the existing mobile `rotateX` mapping.

**Tech Stack:** React, TypeScript, Vitest, CSS custom properties

## Global Constraints

- Preserve manual drag and wheel behavior without snapping or autoplay.
- Preserve card size, spacing, content, depth surfaces, glow, hand, background, modal, and navigation.

---

### Task 1: Front-facing fan geometry

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

**Interfaces:**
- Consumes: `worksRowPose(offset)` and `WORKS_PROJECT_INDEX`.
- Produces: `rotateY = clamp(abs(offset) * 30, 0, 72) * -sign(offset)` and initial position equal to the project index.

- [ ] **Step 1: Write failing geometry tests**

Require `WORKS_INITIAL_POSITION === 6`, rotations `0`, `30`, `60`, and `72` degrees at offsets `0`, `±1`, `±2`, and `±3`, mirrored signs, and the center layer above neighbors.

- [ ] **Step 2: Verify RED**

Run `pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`. Expected: failures on the current `90deg` center and initial `6.42` position.

- [ ] **Step 3: Implement the minimal formula**

Set `WORKS_INITIAL_POSITION = WORKS_PROJECT_INDEX`. In `worksRowPose`, compute `magnitude = Math.min(72, Math.abs(offset) * 30)` and `rotateY = offset === 0 ? 0 : -Math.sign(offset) * magnitude`. Keep `x` and layer calculation unchanged. Remove obsolete retained-side state and argument.

- [ ] **Step 4: Verify focused behavior**

Run `pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`. Expected: all carousel tests pass.

- [ ] **Step 5: Verify the project**

Run `pnpm test -- --run` and `pnpm build`. Expected: all tests pass and build exits with code 0.

---

### Task 2: Equal card size on every device

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

- [ ] **Step 1: Write the failing test**

Require `mobileWorksLoopPose(...).scale` to equal `1` at the center, side, and rear positions while retaining the existing opacity and layer values.

- [ ] **Step 2: Verify RED**

Run `pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`. Expected: rear and side scale assertions fail on the old position-based values.

- [ ] **Step 3: Implement minimal behavior**

Set `scale: 1` in `mobileWorksLoopPose`; preserve `y`, `opacity`, and `layer` calculations.

- [ ] **Step 4: Verify**

Run the focused test, full test suite, and production build. All must exit with code 0.

---

### Task 3: Dark wine-pink card material

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Write a failing CSS regression test**

Require the shared card gradient `linear-gradient(145deg,#090407,#1d0713 48%,#310b20)`, a subtle inset pink highlight, and a matching dark project spine.

- [ ] **Step 2: Verify RED**

Run `pnpm test -- --run src/styles.test.js` and confirm failure on the old translucent card material.

- [ ] **Step 3: Implement the material**

Update only the card background, empty-card highlight, shared spine, project spine, and dark-theme override. Keep borders disabled and preserve all geometry.

- [ ] **Step 4: Verify**

Run the focused test, full suite, and production build. All must exit with code 0.
