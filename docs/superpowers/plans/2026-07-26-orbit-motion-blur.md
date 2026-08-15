# Orbit Motion Blur Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise the elliptical project orbit by 4 vh and show a brief directional card trail only while the carousel is moving.

**Architecture:** Keep the existing card transforms intact. Add a pure blur-direction helper and a 720 ms moving state in `HackathonOrbitCarousel`, then render the trail with a card pseudo-element controlled entirely by CSS.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Raise the complete orbit by exactly 4 vh on every viewport.
- Moving state lasts 720 ms and restarts after repeated navigation.
- Resting cards remain sharp.
- Disable trails for reduced-motion users.
- Preserve autoplay, click, swipe, and depth layers.

---

### Task 1: Carousel moving state

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`

**Interfaces:**
- Produces: `motionBlurDirection(offset: number): -1 | 0 | 1`
- Produces: `.is-moving` on the carousel for 720 ms after an active-index change

- [ ] **Step 1: Write failing tests**

Assert mirrored helper results for negative and positive offsets, zero for the centre, and `.is-moving` immediately after clicking a non-active project card.

- [ ] **Step 2: Verify RED**

```bash
pnpm test -- --run
```

- [ ] **Step 3: Implement moving state**

Track `isMoving`, restart a single timeout whenever active changes after initial render, clear it on unmount, and expose signed blur direction through `--motion-direction`.

- [ ] **Step 4: Verify GREEN**

```bash
pnpm test -- --run
```

### Task 2: Raised orbit and directional trail

**Files:**
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `.maria-orbit-carousel.is-moving` and `--motion-direction`
- Produces: `transform: translateY(-4vh)` on the shared orbit container and a transient pseudo-element trail

- [ ] **Step 1: Raise the orbit**

Translate the carousel by `-4vh`, leaving all card-relative ellipse positions unchanged.

- [ ] **Step 2: Add motion trail**

Use an additional card pseudo-element with repeated low-opacity card-coloured layers offset along `--motion-direction`. Animate its opacity during `.is-moving`; keep active-card intensity lower and rear-card intensity higher.

- [ ] **Step 3: Add reduced-motion override**

Hide the trail and remove its animation under `prefers-reduced-motion: reduce`.

- [ ] **Step 4: Run full verification**

```bash
pnpm test -- --run
pnpm build
```

Expected: all 14 tests pass and the Vite production build exits successfully.
