# Model Idle Float Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a subtle autonomous vertical float to the model without interfering with pointer-driven camera orbit.

**Architecture:** Wrap the existing `model-viewer` in a full-screen presentation container. Apply a CSS keyframe animation only to the wrapper and disable it for reduced-motion preferences.

**Tech Stack:** React, TypeScript, CSS, Vitest, Vite

## Global Constraints

- Vertical travel is at most 14 px.
- Cycle duration is 5.6 seconds.
- Pointer-driven camera orbit remains unchanged.
- Reduced-motion disables the animation.

---

### Task 1: Add model float wrapper and animation

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/InteractiveBackground.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write a failing test**

Assert that `.maria-model-float` contains `.maria-model-viewer`.

- [ ] **Step 2: Verify the test fails**

Run `pnpm test -- --run`. Expected: FAIL because the wrapper does not exist.

- [ ] **Step 3: Implement the wrapper**

Wrap `ModelBackground` with `<div className="maria-model-float">`.

- [ ] **Step 4: Add animation**

Define a 5.6-second infinite ease-in-out keyframe animation from `translateY(-7px)` to `translateY(7px)`, and disable it in the existing reduced-motion media query.

- [ ] **Step 5: Verify**

Run `pnpm test -- --run` and `pnpm build`. Expected: all tests pass and build exits successfully.
