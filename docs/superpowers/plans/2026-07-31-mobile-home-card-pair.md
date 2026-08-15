# Mobile Home Card Pair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recompose the two mobile home cards as an equal mirrored pair with stable shared-element transition geometry.

**Architecture:** Change only the existing `@media(max-width:600px)` card declarations. Preserve route names and transition machinery while replacing the staggered, nearly-square positions with equal wide cards on one responsive baseline.

**Tech Stack:** CSS, Vitest, Vite

## Global Constraints

- Desktop layout must remain unchanged.
- Both cards have equal width, height, baseline, and visual weight.
- Keep `works-route` and `about-route` shared-element names unchanged.
- Do not add mobile-specific keyframes or JavaScript.

---

### Task 1: Mobile mirrored card pair

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: existing `.maria-card`, `.maria-card--works`, and `.maria-card--hackathons` mobile selectors.
- Produces: equal `49vw` cards with `aspect-ratio:1.08`, a shared `bottom:clamp(76px,12vh,104px)`, and mirrored low-angle transforms.

- [x] **Step 1: Write the failing test**

Add a `mobile home card mirrored pair` test requiring:

```js
expect(styles).toContain('.maria-card{width:min(49vw,215px);height:auto;aspect-ratio:1.08;padding:0}')
expect(styles).toContain('.maria-card--works{left:0;top:auto;bottom:clamp(76px,12vh,104px);transform:perspective(900px) rotateY(5deg) rotateZ(-1deg)}')
expect(styles).toContain('.maria-card--hackathons{right:0;top:auto;bottom:clamp(76px,12vh,104px);transform:perspective(900px) rotateY(-5deg) rotateZ(1deg);z-index:11}')
expect(styles).not.toContain('.maria-card--works{left:8px;top:auto;bottom:128px')
expect(styles).not.toContain('.maria-card--hackathons{right:8px;top:auto;bottom:24px')
```

- [x] **Step 2: Verify RED**

Run `pnpm test -- --run src/styles.test.js` with the configured Node runtime. Expected: the new mirrored-pair test fails because the old staggered positions remain.

- [x] **Step 3: Implement minimal CSS**

Replace only the mobile card sizing, positioning, and hover/focus transforms. Use equal dimensions and baseline, mirrored `rotateY(±5deg) rotateZ(±1deg)`, and a reduced hover depth of `translateZ(12px)` while preserving the same final angles.

- [x] **Step 4: Verify GREEN**

Run the focused test. Expected: all style tests pass.

- [x] **Step 5: Full verification**

Run the full test suite and production build. Expected: 0 failures and a successful Vite build.
