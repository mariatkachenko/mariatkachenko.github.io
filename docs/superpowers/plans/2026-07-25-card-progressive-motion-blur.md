# Card Progressive Motion Blur Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the astronaut light rays and add progressive hover motion trails to both portfolio cards.

**Architecture:** Delete the light markup and CSS. Add three decorative blur layers inside each card, positioned behind its content and animated through opacity, offset, and filter on hover/focus.

**Tech Stack:** React, TypeScript, CSS, Vitest, Vite

## Global Constraints

- Card content remains sharp.
- Trails are hidden at rest.
- Reduced-motion keeps trails hidden.
- Preserve routes, model motion, particles, and themes.

---

### Task 1: Test the desired markup

**Files:**
- Modify: `src/App.test.tsx`

- [ ] Assert that light rays are absent.
- [ ] Assert that both card links contain one blur container with three layers.
- [ ] Run tests and confirm failure.

### Task 2: Implement and style

**Files:**
- Modify: `src/maria/InteractiveBackground.tsx`
- Modify: `src/maria/PortfolioCard.tsx`
- Modify: `src/styles.css`

- [ ] Remove light markup and all related CSS.
- [ ] Add three blur layers to each card.
- [ ] Add progressive offsets, blur, opacity, hover/focus transitions, per-card direction, and reduced-motion handling.
- [ ] Run `pnpm test -- --run` and `pnpm build`.
