# Works Cover Flow Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing works carousel into a tight reference-like Cover Flow and remove the duplicated pink focus outline from the MTS Pay card.

**Architecture:** Keep the existing five-card state, gesture handling, and modal integration. Change only the pose values and CSS transforms so side cards become tightly packed near-edge slices at 68/78 degrees, then unfold to 18 degrees on hover. Scope focus styling to the carousel: suppress the nested global pink outline and expose one white `:focus-within` ring on the outer card.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library, Vite

## Global Constraints

- Keep five cards, manual swipe/drag, side-card selection, circular navigation, and the existing presentation modal unchanged.
- Nearest side cards rotate 68 degrees; far cards rotate 78 degrees.
- Side cards stay close to the center and partially overlap rather than spreading into a wide fan.
- Hover unfolds side cards to approximately 18 degrees and brings them forward.
- MTS Pay shows one white focus treatment and no nested pink outline.
- Keep mobile behavior, themes, hand-and-phone image, fixed controls, and page overflow unchanged.
- Add no dependency and no automatic timer.

---

### Task 1: Reference-Like Cover Flow Poses

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

**Interfaces:**
- Consumes and preserves: `worksDeckPose(offset: number): WorksDeckPose`
- Changes only pose values for offsets `±1` and `±2`.

- [ ] **Step 1: Change pose tests to the required angles**

In `src/maria/WorksCardCarousel.test.tsx`, update the pose assertions:

```tsx
expect(worksDeckPose(1)).toEqual({
  scale: 0.9,
  opacity: 0.82,
  rotateY: -68,
  rotateZ: 0,
  layer: 4,
})
expect(worksDeckPose(-1)).toEqual({
  scale: 0.9,
  opacity: 0.82,
  rotateY: 68,
  rotateZ: 0,
  layer: 4,
})
expect(worksDeckPose(2)).toEqual({
  scale: 0.82,
  opacity: 0.52,
  rotateY: -78,
  rotateZ: 0,
  layer: 3,
})
expect(worksDeckPose(-2)).toEqual({
  scale: 0.82,
  opacity: 0.52,
  rotateY: 78,
  rotateZ: 0,
  layer: 3,
})
```

- [ ] **Step 2: Run the focused test to verify RED**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/maria/WorksCardCarousel.test.tsx -t "tilts"
```

Expected: FAIL because current angles are 28/44 degrees.

- [ ] **Step 3: Update the pose implementation**

Replace the side pose branches in `worksDeckPose`:

```tsx
if (distance === 1) {
  return {
    scale: 0.9,
    opacity: 0.82,
    rotateY: -68 * direction,
    rotateZ: 0,
    layer: 4,
  }
}
return {
  scale: 0.82,
  opacity: 0.52,
  rotateY: -78 * direction,
  rotateZ: 0,
  layer: 3,
}
```

- [ ] **Step 4: Run the component tests to verify GREEN**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: all 6 component/helper tests PASS.

---

### Task 2: Tight Cover Flow Geometry and Hover Unfold

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `--works-deck-rotate-y`, offsets `0`, `±1`, `±2`
- Preserves: card width, gesture hit area, modal and page structure.

- [ ] **Step 1: Add failing CSS contract assertions**

Add to the existing “works horizontal card deck” test:

```js
expect(styles).toContain('perspective:1800px')
expect(styles).toContain('transform-origin:center center')
expect(styles).toContain('clamp(112px,12vw,215px)')
expect(styles).toContain('clamp(188px,21vw,360px)')
expect(styles).toContain('rotateY(-18deg)')
expect(styles).toContain('rotateY(18deg)')
expect(styles).not.toContain('clamp(220px,29vw,500px)')
expect(styles).not.toContain('rotateY(-7deg)')
```

- [ ] **Step 2: Run CSS tests to verify RED**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/styles.test.js
```

Expected: FAIL because the current carousel uses wide fan spacing and 7/15-degree hover poses.

- [ ] **Step 3: Tighten perspective and base spacing**

In `.maria-works-carousel`, change:

```css
perspective:1800px;
```

In `.maria-works-deck-card`, add:

```css
transform-origin:center center;
```

Replace desktop offset transforms:

```css
.maria-works-deck-card[data-offset="1"]{transform:translate3d(calc(-50% + clamp(112px,12vw,215px)),-50%,20px) rotateY(var(--works-deck-rotate-y)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="-1"]{transform:translate3d(calc(-50% - clamp(112px,12vw,215px)),-50%,20px) rotateY(var(--works-deck-rotate-y)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="2"]{transform:translate3d(calc(-50% + clamp(188px,21vw,360px)),-50%,-70px) rotateY(var(--works-deck-rotate-y)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="-2"]{transform:translate3d(calc(-50% - clamp(188px,21vw,360px)),-50%,-70px) rotateY(var(--works-deck-rotate-y)) scale(var(--works-deck-scale))}
```

- [ ] **Step 4: Replace hover poses with reference-like unfolding**

Replace the four side hover transforms:

```css
.maria-works-deck-card[data-offset="1"]:hover{transform:translate3d(calc(-50% + clamp(168px,18vw,315px)),-53%,120px) rotateY(-18deg) scale(.96)}
.maria-works-deck-card[data-offset="-1"]:hover{transform:translate3d(calc(-50% - clamp(168px,18vw,315px)),-53%,120px) rotateY(18deg) scale(.96)}
.maria-works-deck-card[data-offset="2"]:hover{transform:translate3d(calc(-50% + clamp(245px,27vw,465px)),-52%,55px) rotateY(-18deg) scale(.87)}
.maria-works-deck-card[data-offset="-2"]:hover{transform:translate3d(calc(-50% - clamp(245px,27vw,465px)),-52%,55px) rotateY(18deg) scale(.87)}
```

Keep the existing active-card hover lift.

- [ ] **Step 5: Tighten mobile offsets**

Inside `@media(max-width:600px)`, replace side offsets:

```css
.maria-works-deck-card[data-offset="1"]{transform:translate3d(calc(-50% + 26vw),-50%,10px) rotateY(var(--works-deck-rotate-y)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="-1"]{transform:translate3d(calc(-50% - 26vw),-50%,10px) rotateY(var(--works-deck-rotate-y)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="2"]{transform:translate3d(calc(-50% + 43vw),-50%,-60px) rotateY(var(--works-deck-rotate-y)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="-2"]{transform:translate3d(calc(-50% - 43vw),-50%,-60px) rotateY(var(--works-deck-rotate-y)) scale(var(--works-deck-scale))}
```

- [ ] **Step 6: Run CSS and carousel tests**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/styles.test.js src/maria/WorksCardCarousel.test.tsx
```

Expected: all tests PASS.

---

### Task 3: Remove the Duplicated Pink Focus Ring

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Preserves global `:focus-visible` for the rest of the site.
- Produces one white deck-specific `:focus-within` ring.

- [ ] **Step 1: Add failing focus assertions**

Add to the deck CSS test:

```js
expect(styles).toContain('.maria-works-deck-card .concept-cover:focus-visible{outline:none}')
expect(styles).toContain('.maria-works-deck-card:focus-within')
expect(styles).toContain('0 0 0 2px rgba(255,255,255,.82)')
expect(styles).not.toContain('0 0 0 3px var(--pink)')
```

- [ ] **Step 2: Run CSS test to verify RED**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/styles.test.js
```

Expected: FAIL because the current outer ring is pink and the nested button still inherits the global pink outline.

- [ ] **Step 3: Scope the focus treatment**

Add:

```css
.maria-works-deck-card .concept-cover:focus-visible{outline:none}
```

Replace `.maria-works-deck-card:focus-within` with:

```css
.maria-works-deck-card:focus-within{box-shadow:inset 0 1px rgba(255,255,255,.82),0 0 0 2px rgba(255,255,255,.82),0 38px 85px rgba(54,31,45,.24)}
```

Do not change the global `:focus-visible` rule.

- [ ] **Step 4: Run all focused tests**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/styles.test.js src/maria/WorksCardCarousel.test.tsx src/App.test.tsx
```

Expected: all tests PASS.

---

### Task 4: Full Verification

**Files:**
- Verify: `src/maria/WorksCardCarousel.tsx`
- Verify: `src/styles.css`
- Verify: `src/styles.test.js`
- Verify: `src/maria/WorksCardCarousel.test.tsx`

**Interfaces:**
- Verifies all constraints from Tasks 1–3.

- [ ] **Step 1: Run the full test suite**

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm test -- --run
```

Expected: zero failed tests.

- [ ] **Step 2: Run the production build**

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm build
```

Expected: TypeScript and Vite finish with exit code 0.

- [ ] **Step 3: Check the works page on localhost**

Verify:

1. Center card faces forward.
2. Nearest side cards appear as tight 68-degree slices.
3. Far side cards appear as narrower 78-degree slices.
4. The deck remains clustered above the phone instead of spanning the viewport.
5. Side hover unfolds a card to approximately 18 degrees and brings it forward.
6. Clicking or keyboard-focusing MTS Pay shows one white ring, not a pink double border.
7. Manual click, drag, swipe, modal opening, themes, mobile layout, and overflow behavior remain unchanged.

