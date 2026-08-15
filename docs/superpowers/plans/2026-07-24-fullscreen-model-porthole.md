# Fullscreen Model Porthole Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the split portrait/model background with a full-screen interactive model over a responsive light/dark porthole.

**Architecture:** Simplify `InteractiveBackground` to a static scene containing a CSS porthole layer, the existing model viewer, and the cursor trail. Theme-specific CSS variables and pseudo-elements provide pearl-metal styling in light mode and pink neon styling in dark mode.

**Tech Stack:** React, TypeScript, CSS, Vitest, Vite

## Global Constraints

- The model remains interactive across the full viewport.
- The portrait assets are no longer rendered.
- Cards, fixed navigation, controls, and cursor trail remain unchanged.
- No new image assets or dependencies.

---

### Task 1: Replace split background with full-screen model scene

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/InteractiveBackground.tsx`

**Interfaces:**
- Produces: `.maria-porthole` decorative element and one `.maria-model-viewer`.
- Removes: `backgroundModeForPointer`, `.maria-hover-portrait`, and `data-background-mode`.

- [ ] **Step 1: Write a failing test**

Assert that `.maria-porthole` and `.maria-model-viewer` exist, and that portrait elements and `data-background-mode` do not.

- [ ] **Step 2: Verify the test fails**

Run `pnpm test -- --run`. Expected: FAIL because the portrait mode still exists.

- [ ] **Step 3: Implement the static scene**

Render the porthole layer, model, and shimmer trail without pointer-driven mode state.

- [ ] **Step 4: Add responsive theme styling**

Use gradients, borders, shadows, and pseudo-elements for light pearl silver and dark pink neon variants.

- [ ] **Step 5: Verify**

Run `pnpm test -- --run` and `pnpm build`. Expected: all tests pass and build exits successfully.
