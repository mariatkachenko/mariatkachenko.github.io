# Disable System Page Swipe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Suppress accidental browser history navigation from horizontal overscroll without breaking carousel gestures.

**Architecture:** Use document-level CSS overscroll containment and constrain the application’s default touch action to vertical panning and pinch zoom. Retain the existing `touch-action: none` declarations on interactive carousels.

**Tech Stack:** CSS, Vitest, Vite

## Global Constraints

- Do not add JavaScript touch interception.
- Keep Works and Hackathons carousel dragging unchanged.
- Keep vertical panning and pinch zoom available.

---

### Task 1: Add root overscroll protection

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

**Interfaces:**
- Produces: root `overscroll-behavior-x:none`
- Produces: application `touch-action:pan-y pinch-zoom`

- [ ] **Step 1: Add failing CSS tests**

```js
expect(styles).toContain('html,body,#root{')
expect(styles).toContain('overscroll-behavior-x:none')
expect(styles).toContain('.maria-app{')
expect(styles).toContain('touch-action:pan-y pinch-zoom')
expect(styles).toContain('.maria-works-carousel{')
expect(styles).toContain('.maria-orbit-carousel{')
expect(styles.match(/touch-action:none/g)).toHaveLength(2)
```

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/styles.test.js
```

Expected: root overscroll and application touch-action assertions fail.

- [ ] **Step 3: Implement minimal CSS fix**

Add `overscroll-behavior-x:none` to the existing `html,body,#root` rule and `.maria-app`. Add `touch-action:pan-y pinch-zoom` to `.maria-app`. Leave both carousel rules unchanged.

- [ ] **Step 4: Verify all behavior**

```bash
pnpm vitest run src/styles.test.js src/maria/WorksCardCarousel.test.tsx src/maria/HackathonOrbitCarousel.test.tsx
pnpm vitest run
pnpm build
```

Expected: all tests and the production build pass.
