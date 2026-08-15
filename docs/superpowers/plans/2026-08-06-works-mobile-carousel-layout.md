# Works Mobile Carousel Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lower the Works navigation and mobile carousel while removing the two mobile cards below the centered card.

**Architecture:** Add one pure offset classifier beside the existing Works carousel geometry helpers, expose its result as a semantic card class, and apply the visibility change only inside the existing `max-width: 600px` media query. Keep desktop rendering and carousel state unchanged.

**Tech Stack:** React, TypeScript, CSS, Vitest, Vite.

## Global Constraints

- Desktop “На Главную” uses `top: 86px`.
- Mobile “На Главную” uses `top: 94px`.
- Mobile Works carousel uses `top: 27vh`.
- Mobile shows the centered card and two cards above it; two cards below it are hidden.
- Desktop continues to show five cards.

---

### Task 1: Mobile upper-stack composition

**Files:**
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

**Interfaces:**
- Produces: `isMobileLowerWorksCard(offset: number): boolean`
- Consumes: continuous signed card offsets already calculated in `WorksCardCarousel`

- [ ] **Step 1: Write failing behavior tests**

Add table-driven assertions that offsets `1` and `2` are mobile-lower cards while `0`, `-1`, and `-2` are not. Add stylesheet assertions for desktop `top:86px`, mobile `top:94px`, mobile carousel `top:27vh`, and mobile hiding of `.is-mobile-lower`.

- [ ] **Step 2: Run tests and verify the expected failures**

Run `./node_modules/.bin/vitest run src/App.test.tsx src/styles.test.js` with the bundled Node runtime on `PATH`. Expected: failure because the classifier and new layout values do not exist.

- [ ] **Step 3: Implement the minimal behavior**

Export `isMobileLowerWorksCard`, append `is-mobile-lower` to cards with positive offsets, set the desktop and mobile offsets, and hide `.is-mobile-lower` only in the mobile media query using `opacity:0;pointer-events:none`.

- [ ] **Step 4: Run focused tests**

Run `./node_modules/.bin/vitest run src/App.test.tsx src/styles.test.js`. Expected: all focused tests pass.

- [ ] **Step 5: Run full verification**

Run `./node_modules/.bin/vitest run`, `./node_modules/.bin/tsc -b`, and `./node_modules/.bin/vite build`. Expected: all tests pass and production build exits successfully.

- [ ] **Step 6: Commit if a Git repository is available**

Run `git status --short`; if the directory is not a repository, report that fact without initializing one.
