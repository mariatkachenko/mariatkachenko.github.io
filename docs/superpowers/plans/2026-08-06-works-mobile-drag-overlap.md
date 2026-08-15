# Works Mobile Drag and Phone Overlap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lower the mobile Works carousel and make mobile drag retain the same continuous position as wheel scrolling.

**Architecture:** Extract the pointer-release position decision into a pure helper and remove the mobile rounding branch. Update only the mobile media-query offset.

**Tech Stack:** React, TypeScript, CSS, Vitest, Vite.

## Global Constraints

- Mobile carousel uses `top: 32vh`.
- Pointer drag retains fractional position on release.
- Five-card mobile stack and desktop behavior remain unchanged.

---

### Task 1: Continuous mobile drag

**Files:**
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

- [ ] Write failing tests for fractional pointer-release position and `top:32vh`.
- [ ] Run focused tests and confirm the expected failures.
- [ ] Implement the pure release helper, use it in `finishDrag`, and update mobile CSS.
- [ ] Run focused tests, full tests, TypeScript, and the production build.
