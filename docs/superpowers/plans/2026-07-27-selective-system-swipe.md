# Selective System Swipe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore native browser history swipe outside carousels while keeping both carousel interaction zones isolated.

**Architecture:** Remove horizontal gesture restrictions from the document and application roots. Keep the existing `touch-action: none` and event cancellation behavior local to the Works and About carousel containers.

**Tech Stack:** React, TypeScript, CSS, Vitest, Vite

## Global Constraints

- Preserve all carousel movement and route-transition behavior.
- Keep `touch-action: none` on exactly the Works and About carousel containers.
- Do not add JavaScript history navigation.

---

### Task 1: Localize gesture containment to carousels

**Files:**
- Modify: `src/styles.css:6-8`
- Test: `src/styles.test.js:5-15`

**Interfaces:**
- Consumes: native browser gesture handling and existing carousel pointer/wheel handlers
- Produces: unrestricted root gestures plus isolated carousel gestures

- [ ] **Step 1: Write the failing test**

Replace the current global containment assertions with:

```js
expect(styles).not.toContain('overscroll-behavior-x:none')
expect(styles).not.toContain('touch-action:pan-y pinch-zoom')
expect(styles).toContain('.maria-works-carousel{')
expect(styles).toContain('.maria-orbit-carousel{')
expect(styles.match(/touch-action:none/g)).toHaveLength(2)
```

- [ ] **Step 2: Verify the focused test fails**

Run:

```bash
pnpm vitest run src/styles.test.js
```

Expected: FAIL because both global restrictions are still present.

- [ ] **Step 3: Remove only the global restrictions**

Delete `overscroll-behavior-x:none` from `html,body,#root` and `.maria-app`. Delete `touch-action:pan-y pinch-zoom` from `.maria-app`. Do not modify either carousel selector.

- [ ] **Step 4: Run focused interaction tests**

Run:

```bash
pnpm vitest run src/styles.test.js src/maria/WorksCardCarousel.test.tsx src/maria/HackathonOrbitCarousel.test.tsx
```

Expected: all focused tests PASS.

- [ ] **Step 5: Run full verification**

Run:

```bash
pnpm vitest run
pnpm build
```

Expected: all tests PASS and Vite builds successfully.

- [ ] **Step 6: Commit**

This workspace is not a Git repository. If Git is initialized later:

```bash
git add src/styles.css src/styles.test.js
git commit -m "fix: localize swipe containment to carousels"
```

