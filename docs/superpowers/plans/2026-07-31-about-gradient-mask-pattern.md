# About Gradient Mask Pattern Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the About page pattern with the supplied transparent tile and color it through theme-aware CSS gradients.

**Architecture:** Keep the existing `::before` layer but convert it from a visible background image into a repeating alpha mask. Apply separate page-background and mask-fill gradients for light and dark themes without touching the sphere or foreground layers.

**Tech Stack:** CSS masks, PNG, Vitest, Vite

## Global Constraints

- Preserve the sphere, astronaut, carousel, navigation, DOM, and transitions.
- Use one PNG for both themes.
- Use `clamp(360px,46vw,620px)` for responsive tile size.
- Add no animation or dependency.

---

### Task 1: Theme-aware masked pattern

**Files:**
- Replace: `public/assets/maria/about-space-pattern.png`
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `.maria-hackathons-page` and `.maria-hackathons-page::before`.
- Produces: light and dark page gradients plus a repeating theme-colored mask.

- [x] **Step 1: Write the failing test**

Update `about page space background` to require `mask-image`, `mask-repeat:repeat`, `mask-size:clamp(360px,46vw,620px)`, a light page gradient, and `.theme-dark` overrides for both the page and mask fill.

- [x] **Step 2: Verify RED**

Run the focused style test. Expected: failure because the current code uses `background-image` directly.

- [x] **Step 3: Replace asset and implement CSS**

Copy the supplied PNG to the existing asset path. Set light page background to layered pale pink/cyan radial gradients over `#c9cbd1`; set dark page background to restrained magenta/violet radial gradients over `#050710`. Use the PNG as standard and WebKit masks and fill it with a composed linear/radial gradient.

- [x] **Step 4: Verify GREEN**

Run the focused style test. Expected: all style tests pass.

- [x] **Step 5: Full verification**

Run the complete test suite and production build. Expected: 0 failures and successful Vite output.
