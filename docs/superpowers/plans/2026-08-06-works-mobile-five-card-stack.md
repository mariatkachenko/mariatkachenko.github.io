# Works Mobile Five-Card Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render a five-card mobile Works stack with one large front card and four alternating tilted cards behind it.

**Architecture:** Extend the existing pure mobile deck pose helper with a stable depth rank and Z-axis tilt. Render all five already-visible carousel cards and let the mobile media query consume the new pose variables without changing desktop geometry.

**Tech Stack:** React, TypeScript, CSS, Vitest, Vite.

## Global Constraints

- Mobile only, up to 600 px wide.
- Five cards remain visible.
- Front card is full-size and has zero Z-axis tilt.
- Four rear cards move upward, shrink progressively, and alternate left/right tilt.
- Desktop layout and vertical carousel position remain unchanged.

---

### Task 1: Five-card mobile stack pose

**Files:**
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

**Interfaces:**
- Produces: `mobileWorksDeckPose(offset)` with `y`, `scale`, `rotateX`, `rotateZ`, and `layer`.
- Removes: `isMobileLowerWorksCard` and `.is-mobile-lower` hiding.

- [ ] Write failing tests for the front pose and four rear depth ranks.
- [ ] Run focused tests and verify failure from missing alternating Z rotation.
- [ ] Extend the pose helper and pass `--works-deck-rotate-z-mobile` to each card.
- [ ] Update mobile transforms to consume `rotateZ(...)` and remove lower-card hiding.
- [ ] Run focused tests, then the full suite, TypeScript compiler, and production build.
