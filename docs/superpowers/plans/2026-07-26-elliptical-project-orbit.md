# Elliptical Project Orbit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Hackathons card arc into a flattened elliptical orbit whose cards pass in front of and behind the astronaut with progressive perspective tilts.

**Architecture:** Add a pure `orbitPose` helper that converts the existing signed orbit offset into presentation metadata. Render rear and front cards in separate carousel layers while sharing the existing active index, autoplay, click, and swipe state.

**Tech Stack:** React 19, TypeScript, CSS transforms, Vitest, Testing Library, Vite.

## Global Constraints

- Keep seven cards and 3.2-second autoplay.
- Preserve click-to-centre and 42 px horizontal swipe.
- Active card remains at the lower-front centre.
- Rear cards render behind both porthole and astronaut.
- Mobile ellipse is narrower than desktop.

---

### Task 1: Orbit pose model

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`

**Interfaces:**
- Consumes: `orbitOffset(index: number, active: number, count: number): number`
- Produces: `orbitPose(offset: number): { layer: 'front' | 'rear'; scale: number; opacity: number; rotateY: number; rotateZ: number }`

- [ ] **Step 1: Write the failing pose tests**

Assert that offset `0` is front with scale and opacity `1`; offsets `1` and `-1` have opposite Y/Z rotation signs; offsets `3` and `-3` use the rear layer with smaller scale and opacity.

- [ ] **Step 2: Run tests and verify RED**

```bash
pnpm test -- --run
```

Expected: FAIL because `orbitPose` is not exported.

- [ ] **Step 3: Implement the pure pose mapping**

Return deterministic metadata for offsets `-3` through `3`, with symmetric scale/opacity and mirrored rotations.

- [ ] **Step 4: Run tests and verify GREEN**

```bash
pnpm test -- --run
```

Expected: all 14 tests pass.

### Task 2: Front and rear elliptical layers

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`
- Modify: `src/maria/HackathonsPage.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `orbitPose(offset)`
- Produces: `.maria-orbit-layer--rear`, `.maria-orbit-layer--front`, and per-card CSS properties `--orbit-scale`, `--orbit-opacity`, `--orbit-rotate-y`, `--orbit-rotate-z`

- [ ] **Step 1: Write the failing layer test**

Assert that the active card has `data-orbit-layer="front"` and both farthest cards have `data-orbit-layer="rear"`.

- [ ] **Step 2: Run tests and verify RED**

```bash
pnpm test -- --run
```

Expected: FAIL because cards have no orbit-layer marker.

- [ ] **Step 3: Render shared-state layers**

Render cards into rear and front layer containers according to `orbitPose`, without duplicating cards. Keep gesture handlers on the common full-screen section.

- [ ] **Step 4: Replace arc CSS with ellipse transforms**

Position offsets `±1`, `±2`, and `±3` along a flattened ellipse. Compose `translate3d`, `rotateY`, `rotateZ`, and `scale` from CSS variables. Place the rear layer at z-index `1`, the porthole at `2`, astronaut at `3`, and front layer at `4`. Use narrower horizontal translations in the existing mobile media query.

- [ ] **Step 5: Run full verification**

```bash
pnpm test -- --run
pnpm build
```

Expected: all 14 tests pass and Vite production build exits successfully.
