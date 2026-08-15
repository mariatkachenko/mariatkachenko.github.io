# Page Pattern Contrast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Balance the perceived background and pattern contrast between the Works and About pages.

**Architecture:** Adjust only page-level background gradients, pattern opacity, and the existing Works dark-theme filter. Preserve assets, geometry, stacking, and all content components.

**Tech Stack:** CSS, Vitest, Vite

## Global Constraints

- Do not change the sphere, astronaut, hand, cards, controls, motion, layout, or responsive behavior.
- Keep existing pattern assets, repetition, scale, and positioning unchanged.

---

### Task 1: Balance page contrast

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Write the failing test**

Require Works opacity `0.60`, dark correction `contrast(1.12) saturate(1.42)`, About light opacity `0.56`, About dark opacity `0.47`, and comparable page-background glow alpha values.

- [ ] **Step 2: Verify RED**

Run `pnpm test -- --run src/styles.test.js` and confirm failure on the old values.

- [ ] **Step 3: Implement minimal CSS**

Change only `.maria-works-page`, `.maria-works-page::before`, `.theme-dark .maria-works-page`, `.theme-dark .maria-works-page::before`, `.maria-hackathons-page`, `.maria-hackathons-page::before`, `.theme-dark .maria-hackathons-page`, and `.theme-dark .maria-hackathons-page::before` color/opacity declarations.

- [ ] **Step 4: Verify GREEN and build**

Run `pnpm test -- --run src/styles.test.js`, `pnpm test -- --run`, and `pnpm build`. All must exit with code 0.
