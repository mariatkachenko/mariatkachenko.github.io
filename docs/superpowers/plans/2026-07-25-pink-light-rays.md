# Pink Light Rays Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three subtle pink light beams and a soft lower light source behind the astronaut.

**Architecture:** Insert one decorative light container before the existing model wrapper. Use child elements and CSS gradients for three independently positioned beams and one oval source glow.

**Tech Stack:** React, TypeScript, CSS, Vitest, Vite

## Global Constraints

- Keep the gray background.
- Keep rays behind the model and UI.
- Preserve model interaction, idle motion, particles, and themes.
- Disable pulsing for reduced-motion.

---

### Task 1: Add the light layer

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/InteractiveBackground.tsx`

- [ ] Test that `.maria-light-rays` is the first scene child and `.maria-model-float` is the second.
- [ ] Run tests and confirm the expected failure.
- [ ] Render three ray elements and one source glow inside the light layer.

### Task 2: Style and verify

**Files:**
- Modify: `src/styles.css`

- [ ] Style diffuse pink cones and the oval lower source for both themes.
- [ ] Add subtle opacity pulsing and disable it for reduced-motion.
- [ ] Run `pnpm test -- --run` and `pnpm build`.
