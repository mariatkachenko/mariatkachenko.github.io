# Works Hand Entry and Persistent Fixed Chrome Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lift the Works-page phone hand from below while keeping the header and bottom controls continuously above route transitions.

**Architecture:** Give the hand its own View Transition snapshot so its lift remains visible instead of being frozen inside the Works-page snapshot. Animate the real element as a fallback, and assign stable zero-duration top-layer transition groups to the fixed chrome.

**Tech Stack:** React, CSS View Transitions API, Vitest, Vite

## Global Constraints

- Keep the hand’s final size and position unchanged.
- Use a `650ms` desktop lift with an `80ms` delay and no bounce.
- Keep one shared header and one shared bottom control panel across all pages.
- Disable motion under reduced-motion preferences.

---

### Task 1: Animate the Works hand as a separate transition layer

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

**Interfaces:**
- Consumes: `.maria-works-hand`
- Produces: `view-transition-name:works-hand` and `maria-works-hand-enter`

- [ ] **Step 1: Write failing style assertions**

Assert the hand uses `transform-origin:100% 54%`, its own transition name, a `.52s` animation with no delay, and rotation-only keyframes from `rotate(-48deg)` to rest. Assert mobile and reduced-motion overrides exist.

- [ ] **Step 2: Run `pnpm vitest run src/styles.test.js`**

Expected: FAIL because no hand-entry motion exists.

- [ ] **Step 3: Implement fallback and View Transition motion**

Animate the real hand for browsers without View Transitions. Inside `@supports(view-transition-name:root)`, disable the real-element animation and apply the rotation to `::view-transition-new(works-hand)` so the snapshot animates during page expansion. Assign the Works page, hand, and carousel transition groups z-index values `1`, `2`, and `3`.

- [ ] **Step 4: Add mobile and reduced-motion handling**

On screens up to `600px`, use `rotate(-36deg)` and a `.52s` duration. Under reduced motion, disable both the element and transition snapshot animations.

---

### Task 2: Keep fixed chrome above all route transitions

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`
- Verify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `.maria-header`, `.maria-controls`
- Produces: `fixed-header` and `fixed-controls` transition groups

- [ ] **Step 1: Add failing assertions**

Assert stable view-transition names on both fixed elements, zero-duration group animation, and a group z-index above route transition groups.

- [ ] **Step 2: Run focused tests and confirm failure**

Run:

```bash
pnpm vitest run src/styles.test.js src/App.test.tsx
```

- [ ] **Step 3: Implement fixed transition layers**

Assign unique transition names. Set both group durations to `.01ms`, keep the old snapshots static, hide the new snapshots, and set `z-index:1000`. Leave the React component structure unchanged.

- [ ] **Step 4: Run focused tests**

Run:

```bash
pnpm vitest run src/styles.test.js src/App.test.tsx
```

Expected: PASS.

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
git commit -m "feat: animate works hand and preserve fixed chrome"
```
