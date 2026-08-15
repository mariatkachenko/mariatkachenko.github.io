# Raised Sharp Orbit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise the complete card orbit by another 6 vh and remove all motion-blur behaviour.

**Architecture:** Delete the temporary React moving state and related CSS filters, then adjust the shared desktop and mobile card baselines without touching ellipse transforms.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Vite.

## Global Constraints

- Desktop baseline becomes `14.5vh`.
- Mobile baseline becomes `28vh`.
- Rear depth blur remains.
- Autoplay, click, swipe, scale, opacity, and tilts remain unchanged.

---

### Task 1: Remove motion state and raise orbit

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`
- Modify: `src/maria/HackathonsPage.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing expectations**

Update the mobile baseline assertion to `28vh`, assert that clicking a card does not add `is-moving`, and remove assertions/imports for the blur helper.

- [ ] **Step 2: Verify RED**

```bash
pnpm test -- --run
```

- [ ] **Step 3: Remove motion blur**

Delete `MOTION_DURATION_MS`, `motionBlurDirection`, moving state, timer refs/effect, moving class, card blur variables, moving filter rules, and reduced-motion blur override.

- [ ] **Step 4: Raise the cards**

Set desktop `.maria-orbit-card` bottom to `14.5vh` and mobile `--mobile-card-bottom` to `28vh`.

- [ ] **Step 5: Verify**

```bash
pnpm test -- --run
pnpm build
```

Expected: all 14 tests pass and Vite build exits successfully.
