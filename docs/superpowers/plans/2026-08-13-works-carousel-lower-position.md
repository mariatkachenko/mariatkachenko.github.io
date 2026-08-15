# Works Carousel Lower Position Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the `/works` carousel slightly lower on desktop and mobile.

**Architecture:** Change only the responsive `top` coordinates of the existing carousel container; preserve all child geometry and interaction behavior.

**Tech Stack:** CSS, Vitest, Vite.

## Global Constraints

- Desktop top is `16vh`.
- Mobile top is `34vh`.
- Do not change the hand, cards, interactions, home, or About pages.

---

### Task 1: Update carousel vertical positions

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: existing `.maria-works-carousel` desktop and mobile rules.
- Produces: approved `16vh` and `34vh` top positions.

- [ ] Update CSS assertions to require the new positions.
- [ ] Run `pnpm test -- --run src/styles.test.js` and confirm failure.
- [ ] Change only the two carousel `top` values.
- [ ] Run focused tests, the full suite, and `pnpm run build`.
