# Mobile Hackathon Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enlarge the astronaut composition on mobile, raise the orbital project cards to overlap it around knee level, and add reliable one-card horizontal swipe navigation.

**Architecture:** Keep the existing carousel state and circular offset calculation. Add a pure swipe helper plus pointer gesture state inside `HackathonOrbitCarousel`, while mobile-only visual changes remain isolated in the existing `max-width: 600px` CSS media query.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Apply composition changes only on screens up to 600 px wide.
- Keep the existing 3.2-second automatic advance.
- Use a 42 px horizontal swipe threshold.
- Left swipe selects the next project and right swipe selects the previous project.
- Preserve click-to-centre and disabled page scrolling.
- Desktop presentation remains unchanged.

---

### Task 1: Swipe navigation

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`

**Interfaces:**
- Consumes: existing `orbitOffset(index: number, active: number, count: number): number`
- Produces: `activeIndexAfterSwipe(active: number, deltaX: number, count: number, threshold?: number): number`

- [ ] **Step 1: Write the failing helper and interaction tests**

Add assertions that `activeIndexAfterSwipe(0, -60, 7)` returns `1`, `activeIndexAfterSwipe(0, 60, 7)` returns `6`, and movement below 42 px keeps the active index. Render the Hackathons route, fire `pointerDown` and `pointerUp` events 80 px apart on the carousel, then assert the next card has `data-offset="0"`.

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm test -- --run
```

Expected: FAIL because `activeIndexAfterSwipe` and pointer navigation do not exist.

- [ ] **Step 3: Implement minimal pointer navigation**

Export a pure helper that wraps indices in both directions. Track the pointer start X coordinate with a ref, pause autoplay on pointer down, use pointer capture when available, and update the active card on pointer up only when the 42 px threshold is reached. Clear the gesture on pointer cancel and resume autoplay when the interaction ends.

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
pnpm test -- --run
```

Expected: all 14 tests pass.

### Task 2: Mobile composition

**Files:**
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `.maria-hackathons-page`, `.maria-model-pose`, `.maria-hackathons-porthole`, `.maria-orbit-card`
- Produces: mobile-only scale and placement overrides inside `@media(max-width:600px)`

- [ ] **Step 1: Add test-visible mobile style markers**

Add stable custom properties under the mobile Hackathons selector:

```css
.maria-hackathons-page{--mobile-model-scale:1.25;--mobile-porthole-size:min(188vw,148vh);--mobile-card-bottom:18vh}
```

Extend the existing Hackathons test to assert that the stylesheet contains these exact tokens.

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm test -- --run
```

Expected: FAIL because the mobile custom properties are absent.

- [ ] **Step 3: Apply the mobile layout**

Within `@media(max-width:600px)`, scale `.maria-hackathons-page .maria-model-pose` to `var(--mobile-model-scale)`, set `.maria-hackathons-porthole` width to `var(--mobile-porthole-size)`, and set the cards’ bottom position to `var(--mobile-card-bottom)`. Keep the existing three-card mobile visibility and offset transforms.

- [ ] **Step 4: Run tests and production build**

Run:

```bash
pnpm test -- --run
pnpm build
```

Expected: all 14 tests pass and Vite exits successfully with generated `dist/index.html`.
