# Liquid Glass Sphere Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Place the interactive astronaut model inside a layered transparent glass sphere.

**Architecture:** Render a back glass layer, the existing animated model wrapper, and a front glass layer as ordered siblings. Build the glass material entirely with CSS gradients, pseudo-elements, filters, shadows, and blend modes.

**Tech Stack:** React, TypeScript, CSS, Vitest, Vite

## Global Constraints

- Preserve pointer orbit, idle floating, cursor particles, cards, and fixed UI.
- Keep the sphere non-interactive.
- Add no raster assets or dependencies.
- Preserve model readability in both themes.

---

### Task 1: Replace the porthole with layered sphere markup

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/InteractiveBackground.tsx`

- [ ] Write a test asserting back sphere, model wrapper, and front sphere exist in that DOM order, while `.maria-porthole` does not.
- [ ] Run `pnpm test -- --run` and confirm failure.
- [ ] Render the two sphere layers around `.maria-model-float`.

### Task 2: Create the glass material

**Files:**
- Modify: `src/styles.css`

- [ ] Remove porthole styles.
- [ ] Add responsive spherical geometry, back volume, caustics, front refraction, highlights, dispersion, and theme variants.
- [ ] Run `pnpm test -- --run` and `pnpm build`; expect all tests and build to pass.
