# Inverted Glass Window Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all glass effects outside a clean circular window containing the astronaut.

**Architecture:** Replace the two sphere layers with a full-viewport glass field using an inverse radial mask. Render a separate circular rim above it while keeping the model below both decorative layers.

**Tech Stack:** React, TypeScript, CSS, Vitest, Vite

## Global Constraints

- Keep the central circle visually unfiltered.
- Preserve model orbit, idle float, particles, and UI.
- Add no assets or dependencies.

---

### Task 1: Replace sphere markup

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/InteractiveBackground.tsx`

- [ ] Test the order: model wrapper, glass field, window rim, shimmer trail.
- [ ] Confirm the test fails with the old sphere markup.
- [ ] Render `.maria-glass-field` and `.maria-glass-window-rim`; remove sphere elements.

### Task 2: Invert the optical styling

**Files:**
- Modify: `src/styles.css`

- [ ] Replace sphere CSS with a full-screen inverse radial mask.
- [ ] Apply refraction, caustics, dispersion, and facets to the masked exterior only.
- [ ] Style the rim for light and dark themes and preserve mobile sizing.
- [ ] Run `pnpm test -- --run` and `pnpm build`.
