# Mobile Works Showcase Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mobile Works carousel loop with a vertical five-card showcase deck while preserving the desktop row and all existing project content.

**Architecture:** Keep the existing carousel position state, wrapping, visibility window, and card markup. Introduce a pure `mobileWorksDeckPose(offset)` function that supplies mobile-only vertical offset, scale, X-axis tilt, opacity, and layer values through CSS custom properties; snap only mobile pointer releases to the nearest card.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite

## Global Constraints

- Only the `max-width:600px` presentation and mobile pointer release behavior change.
- Exactly five cards remain visible.
- The central card is front-facing and visually dominant.
- Desktop drag and wheel behavior remain continuous and unchanged.
- Card content, hand image, background, modal, fixed navigation, and routes remain unchanged.
- No new asset or runtime dependency is introduced.

---

### Task 1: Add mobile showcase-deck geometry

**Files:**
- Modify: `src/maria/WorksCardCarousel.tsx`
- Test: `src/maria/WorksCardCarousel.test.tsx`

**Interfaces:**
- Produces: `MobileWorksDeckPose` and `mobileWorksDeckPose(offset)`.
- Supplies CSS variables `--works-deck-y-mobile`, `--works-deck-scale-mobile`, `--works-deck-rotate-x-mobile`, `--works-deck-opacity-mobile`, and `--works-deck-layer-mobile`.

- [ ] **Step 1: Write failing unit tests for the center and adjacent poses**

Assert that offset `0` is `{ y:0, scale:1, rotateX:0, opacity:1, layer:20 }`, offsets `±1` move symmetrically to `±9vh`, scale to `.9`, tilt oppositely by `8deg`, and offsets `±2` move to `±18vh`, scale to `.8`, opacity to `.56`, and use a lower layer.

- [ ] **Step 2: Run the focused carousel test and verify it fails because `mobileWorksDeckPose` is absent**

Run `pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`.

- [ ] **Step 3: Implement the pure pose function and expose its values as CSS variables on every card**

Use a clamped absolute distance of `2`, symmetric signs, three-decimal rounding, and no DOM measurement.

- [ ] **Step 4: Run the focused test and verify the geometry passes**

Run `pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`.

### Task 2: Add mobile-only release snapping

**Files:**
- Modify: `src/maria/WorksCardCarousel.tsx`
- Test: `src/maria/WorksCardCarousel.test.tsx`

**Interfaces:**
- Produces: a normalized integer position on mobile pointer release.
- Preserves: fractional desktop pointer release.

- [ ] **Step 1: Write a failing interaction test**

Stub `(max-width: 600px)` to match, drag vertically far enough to produce a fractional position, assert continuous movement during `pointerMove`, then assert an integer `data-works-position` after `pointerUp`.

- [ ] **Step 2: Run the focused test and verify the release remains fractional**

Run `pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`.

- [ ] **Step 3: Snap the computed final position with `Math.round` only when the stored pointer origin is mobile**

Keep click suppression and pointer capture behavior unchanged.

- [ ] **Step 4: Run the focused interaction tests**

Run `pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`.

### Task 3: Style the mobile vertical showcase deck

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

**Interfaces:**
- Consumes: the five `--works-deck-*-mobile` variables from Task 1.
- Produces: a centered vertical stack with mobile-only transform and transition rules.

- [ ] **Step 1: Replace old mobile-loop CSS expectations with deck expectations**

Assert mobile transform uses centered translation plus deck Y offset, X-axis rotation, and deck scale; assert opacity/layer variables and separate dragging/non-dragging transition behavior.

- [ ] **Step 2: Run the style test and verify it fails on the old loop transform**

Run `pnpm test -- --run src/styles.test.js`.

- [ ] **Step 3: Implement the mobile CSS override**

Keep `width:80vw`. Center cards in the carousel, apply the deck variables, preserve the glow, use a smooth transform/opacity/filter transition while idle, and disable the transition during drag.

- [ ] **Step 4: Run focused style and carousel tests**

Run `pnpm test -- --run src/styles.test.js src/maria/WorksCardCarousel.test.tsx`.

### Task 4: Verify the complete application

**Files:**
- Verify only.

- [ ] **Step 1: Run all tests**

Run `pnpm test -- --run`; expect all test files and tests to pass.

- [ ] **Step 2: Build production output**

Run `pnpm build`; expect TypeScript and Vite to finish with exit code `0`.
