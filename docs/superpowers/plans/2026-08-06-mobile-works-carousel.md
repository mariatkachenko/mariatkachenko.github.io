# Mobile Works Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mobile Works carousel's stacked perspective behavior with a direct vertical drag rail that snaps to the nearest card.

**Architecture:** Keep the existing continuous `position` state and desktop pose functions. Add mobile-specific release and vertical pose helpers, then consume them in the current component and mobile CSS so drag remains continuous and release becomes discrete.

**Tech Stack:** React 19, TypeScript, CSS transforms, Vitest, Testing Library, Vite.

## Global Constraints

- Do not alter desktop carousel behavior.
- Do not alter project card content, navigation, hand imagery, or theme assets.
- Mobile cards must not rotate on any axis.
- During drag, card movement must follow pointer movement without transition lag.

---

### Task 1: Define mobile release and vertical pose behavior

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

**Interfaces:**
- Produces: `worksDragReleasePosition(position, count, snap): number`
- Produces: `mobileWorksRailPose(offset): { y: number; scale: number; layer: number }`

- [ ] **Step 1: Write failing tests**

Add literal expectations proving mobile release rounds to the nearest card and mobile poses place offsets `-2..2` on a vertical rail with no rotation fields.

- [ ] **Step 2: Run focused tests and verify expected failures**

Run: `./node_modules/.bin/vitest run src/maria/WorksCardCarousel.test.tsx`

- [ ] **Step 3: Implement minimal helpers**

Round and normalize only when `snap` is true. Return mobile rail `y`, `scale`, and `layer` from distance and signed offset.

- [ ] **Step 4: Run focused tests**

Run: `./node_modules/.bin/vitest run src/maria/WorksCardCarousel.test.tsx`

### Task 2: Wire direct mobile drag and simple rail styles

**Files:**
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

**Interfaces:**
- Consumes: `worksDragReleasePosition(position, count, snap)`
- Consumes: `mobileWorksRailPose(offset)`

- [ ] **Step 1: Write failing component/style tests**

Assert that mobile drag release requests snapping, the mobile transform contains only translate and scale, and the settling transition is disabled under `.is-dragging`.

- [ ] **Step 2: Run focused tests and verify expected failures**

Run: `./node_modules/.bin/vitest run src/maria/WorksCardCarousel.test.tsx src/styles.test.js`

- [ ] **Step 3: Implement mobile behavior and CSS**

Use a shorter mobile drag step, snap only mobile release, expose rail pose variables, remove mobile perspective transforms, and keep five visible cards.

- [ ] **Step 4: Run focused tests**

Run: `./node_modules/.bin/vitest run src/maria/WorksCardCarousel.test.tsx src/styles.test.js`

### Task 3: Verify the complete project

**Files:**
- Verify only.

- [ ] **Step 1: Run all tests**

Run: `./node_modules/.bin/vitest run`

- [ ] **Step 2: Run TypeScript and production builds**

Run: `./node_modules/.bin/tsc -b && ./node_modules/.bin/vite build`

- [ ] **Step 3: Review the diff for scope**

Confirm only the mobile Works carousel behavior, tests, and its design/plan documents changed.

