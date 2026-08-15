# Mobile Vertical Works and Orbit Autoplay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a vertical mobile Works magazine stack and restore a large mobile Hackathons orbit with interaction-aware autoplay.

**Architecture:** Works selects gesture axis and visual axis from the mobile media query while retaining shared fractional position and pose magnitude. Hackathons uses a small autoplay pause state plus interval/resume timers; separate mobile orbit variables let CSS expand the trajectory without changing desktop.

**Tech Stack:** React 19, TypeScript, CSS 3D transforms, Vitest fake timers, Testing Library, Vite.

## Global Constraints

- Works desktop remains horizontal.
- Works mobile translates vertically at `28vh` per offset and rotates with `rotateX`.
- Works mobile drag uses `clientY`; mobile wheel uses `deltaY`.
- Hackathons autoplay interval is `3200ms`, resume delay is `1800ms`.
- Reduced motion disables autoplay.
- Mobile Hackathons cards are `clamp(178px,48vw,195px)` and wrap around the astronaut.

---

### Task 1: Mobile Works axis helpers and gestures

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

- [ ] **Step 1: Write failing tests**

Test helpers:

```ts
expect(worksPointerCoordinate({ clientX: 20, clientY: 80 }, false)).toBe(20)
expect(worksPointerCoordinate({ clientX: 20, clientY: 80 }, true)).toBe(80)
expect(worksWheelDelta(10, 70, false, true)).toBe(70)
```

Test each card exposes `--works-row-y-mobile` and `--works-row-rotate-x-mobile`.

- [ ] **Step 2: Run focused tests and verify RED**

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

- [ ] **Step 3: Implement axis helpers**

Use `matchMedia('(max-width:600px)')` in pointer start/move/release and wheel handlers. Render mobile Y as `pose.x * 28vh`; render mobile X rotation from the same pose angle.

- [ ] **Step 4: Run focused tests and verify GREEN**

### Task 2: Mobile Works vertical CSS

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing CSS assertions**

Require mobile transform:

```css
translate3d(-50%,calc(-50% + var(--works-row-y-mobile)),0)
rotateX(var(--works-row-rotate-x-mobile))
```

- [ ] **Step 2: Run styles test and verify RED**
- [ ] **Step 3: Replace the mobile Y-axis transform while preserving width, depth, scale, and desktop rules**
- [ ] **Step 4: Run Works and styles tests and verify GREEN**

### Task 3: Hackathons autoplay lifecycle

**Files:**
- Modify: `src/maria/HackathonOrbitCarousel.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`

**Interfaces:**
- Add `HACKATHON_AUTOPLAY_MS = 3200`
- Add `HACKATHON_AUTOPLAY_RESUME_MS = 1800`

- [ ] **Step 1: Write failing fake-timer tests**

Verify one-position advance after `3200ms`, no advance during pointer hold, delayed resume after `1800ms`, and no interval when reduced motion matches.

- [ ] **Step 2: Run focused tests and verify RED**
- [ ] **Step 3: Implement interval, pause state, resume timeout, wheel pause, and cleanup**
- [ ] **Step 4: Run focused tests and verify GREEN**

### Task 4: Expanded mobile astronaut orbit

**Files:**
- Modify: `src/maria/HackathonOrbitCarousel.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing tests for `--orbit-x-mobile`, `--orbit-y-mobile`, and mobile width**
- [ ] **Step 2: Run focused tests and verify RED**
- [ ] **Step 3: Render wider mobile ellipse variables and apply `clamp(178px,48vw,195px)` plus mobile transforms**
- [ ] **Step 4: Run Hackathons, styles, and App tests and verify GREEN**

### Task 5: Full verification

- [ ] **Step 1: Run `pnpm test -- --run`**
- [ ] **Step 2: Run `pnpm build`**
- [ ] **Step 3: Verify vertical Works mobile behavior, Hackathons autoplay/pause, expanded astronaut orbit, and unchanged desktop**
- [ ] **Step 4: Report fresh test count and build result**
