# MTS Pay Vanishing Flyout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the MTS Pay logo and butterfly fly strongly toward the viewer, progressively blur, and disappear.

**Architecture:** Keep the existing three-layer markup and centered-card trigger. Replace foreground centered transitions with dedicated CSS keyframes and responsive custom properties.

**Tech Stack:** CSS, Vitest.

## Global Constraints

- Change only MTS Pay motion on `/works`.
- Keep the stage zoom, carousel behavior, pattern, graffiti, home, and About unchanged.
- Disable decorative flyouts under reduced motion.

---

### Task 1: Define and implement the vanishing flyout

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [x] Write assertions for the two keyframes, stagger, strong scale, progressive blur/fade, mobile values, and reduced-motion fallback.
- [x] Run the CSS test and confirm failure against the transition-based implementation.
- [x] Implement the keyframes and responsive values.
- [x] Run targeted and full tests, TypeScript, and production build.
