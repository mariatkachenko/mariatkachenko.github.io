# Card Expand Route Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace route slides with a restrained shared-element transition that expands and collapses the selected home card.

**Architecture:** A router helper wraps explicit navigation in the View Transitions API and falls back to immediate SPA navigation. Stable CSS transition names pair each home card with its subpage; existing route classes become fade-only fallbacks.

**Tech Stack:** React, TypeScript, CSS View Transitions API, Vitest, Vite

## Global Constraints

- Keep fixed navigation outside the transition.
- Preserve native popstate/system-swipe navigation.
- Use approximately `420ms` duration with no rotation, blur, or flash.
- Disable motion for `prefers-reduced-motion`.

---

### Task 1: Add transition-aware navigation

**Files:**
- Modify: `src/router.ts`
- Create: `src/router.test.ts`
- Modify: `src/maria/PortfolioCard.tsx`
- Modify: `src/maria/WorksPage.tsx`
- Modify: `src/maria/HackathonsPage.tsx`

**Interfaces:**
- Produces: `navigateWithTransition(path: RoutePath): ViewTransition | null`
- Consumes: existing `navigate(path)` and optional `document.startViewTransition`

- [ ] **Step 1: Write failing helper tests**

Test that supported navigation calls `startViewTransition`, invokes its update callback, and changes the path. Test that missing support navigates immediately.

- [ ] **Step 2: Run `pnpm vitest run src/router.test.ts` and confirm failure**

Expected: FAIL because `navigateWithTransition` does not exist.

- [ ] **Step 3: Implement the helper**

Call `document.startViewTransition()` when available and reduced motion is not requested. Invoke `navigate(path)` inside `flushSync()` so React commits the destination DOM before the new snapshot. The update callback must finish synchronously and must not request or await an animation frame. Otherwise call `navigate(path)` directly.

- [ ] **Step 4: Replace explicit navigation calls**

Use `navigateWithTransition` in both home cards and both visible Back buttons. Do not change native popstate handling.

- [ ] **Step 5: Run router and App tests**

Run:

```bash
pnpm vitest run src/router.test.ts src/App.test.tsx
```

Expected: PASS after updating the App expectation in Task 2.

### Task 1A: Remove the transition callback frame deadlock

**Files:**
- Modify: `src/router.ts`
- Modify: `src/router.test.ts`

**Interfaces:**
- Preserves: `navigateWithTransition(path: RoutePath): RouteViewTransition | null`

- [ ] **Step 1: Add a regression assertion**

Spy on `window.requestAnimationFrame`, call `navigateWithTransition('/works')` with a mocked `startViewTransition`, and assert the frame scheduler is not called.

- [ ] **Step 2: Run `pnpm vitest run src/router.test.ts`**

Expected: FAIL because the current callback schedules and awaits `requestAnimationFrame`.

- [ ] **Step 3: Implement the root-cause fix**

Import `flushSync` from `react-dom`, wrap `navigate(path)` with it inside the update callback, and remove the asynchronous frame wait.

- [ ] **Step 4: Run router and App tests**

Run:

```bash
pnpm vitest run src/router.test.ts src/App.test.tsx
```

Expected: PASS with no pending frame dependency.

---

### Task 2: Replace slide CSS with shared-element expansion

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `.maria-card--works`, `.maria-card--hackathons`, `.maria-works-page`, `.maria-hackathons-page`
- Produces: `works-route` and `about-route` shared transition pairs

- [ ] **Step 1: Write failing style and App assertions**

Assert that the old slide keyframes are absent, fade fallback is present, both shared transition names exist, duration is `.42s`, and App navigation no longer claims to slide.

- [ ] **Step 2: Run focused tests and confirm failure**

Run:

```bash
pnpm vitest run src/styles.test.js src/App.test.tsx
```

- [ ] **Step 3: Implement transition CSS**

Assign `view-transition-name:works-route` to the Works card/page pair and `view-transition-name:about-route` to the About card/page pair on desktop. Style both transition groups with `.52s cubic-bezier(.2,.8,.2,1)`. Hide the outgoing light card snapshot on forward navigation. On mobile, remove transition names from the cards and reveal pages from rounded masks near each source card. Collapse pages at full opacity into the exact destination-card bounds. Keep fixed header/footer transition groups static above route content. Replace directional translate keyframes with a short opacity-only fallback and disable it inside `@supports(view-transition-name:root)`.

- [ ] **Step 4: Preserve reduced motion**

Keep `.maria-route-content{animation:none!important}` in the existing reduced-motion query and set all custom transition-group durations to `0.01ms`.

- [ ] **Step 5: Run focused tests**

Run:

```bash
pnpm vitest run src/router.test.ts src/styles.test.js src/App.test.tsx
```

Expected: all focused tests PASS.

- [ ] **Step 6: Run full verification**

Run:

```bash
pnpm vitest run
pnpm build
```

Expected: all tests PASS and Vite builds successfully.

- [ ] **Step 7: Commit**

This workspace is not a Git repository. If Git is initialized later:

```bash
git add src/router.ts src/router.test.ts src/maria/PortfolioCard.tsx src/maria/WorksPage.tsx src/maria/HackathonsPage.tsx src/styles.css src/styles.test.js src/App.test.tsx
git commit -m "feat: expand pages from navigation cards"
```
