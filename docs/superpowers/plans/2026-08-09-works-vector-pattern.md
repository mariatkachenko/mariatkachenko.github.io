# Works Vector Pattern Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use the supplied vector pattern as the full-screen Works page background in both themes.

**Architecture:** Copy the supplied SVG into the existing Maria asset directory. Keep the page color on `.maria-works-page` and render the SVG through its existing `::before` layer, with theme-specific opacity and filter values.

**Tech Stack:** CSS, SVG, Vitest, Vite.

## Global Constraints

- Do not alter carousel, hand, card, or route behavior.
- Use one SVG asset for light and dark themes.
- Light background must be exactly `#F9F7F7` and pattern opacity exactly `0.5`.

---

### Task 1: Replace the Works background asset and theme styles

**Files:**
- Create: `public/assets/maria/works-vector-pattern.svg`
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

- [ ] Add failing CSS expectations for the asset URL, light base, light opacity, and dark treatment.
- [ ] Run `./node_modules/.bin/vitest run src/styles.test.js` and confirm failure against the old raster background.
- [ ] Copy the supplied SVG and implement the minimal theme CSS.
- [ ] Run focused and full tests.
- [ ] Run TypeScript and production builds.

