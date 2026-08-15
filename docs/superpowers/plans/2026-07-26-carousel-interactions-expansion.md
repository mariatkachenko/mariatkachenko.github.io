# Carousel Interactions Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a symmetric 14-card works Cover Flow and make the hackathon orbit continuously draggable and horizontally scrollable across multiple cards.

**Architecture:** `WorksCardCarousel` changes from a single-active-index model to an even center-pair model with half-step offsets. `HackathonOrbitCarousel` changes from integer-only state to a floating-point orbit position shared by drag, wheel, snap, and click navigation. Pure exported math helpers define normalization, fractional offsets, interpolation, and distance-to-card conversion so interaction behavior is deterministic and testable without browser animation mocks.

**Tech Stack:** React, TypeScript, CSS custom properties, Pointer Events, Wheel Events, Vitest, Testing Library, Vite

## Global Constraints

- Works renders 14 cards: one MTS Pay card and 13 empty cards.
- Works has two inward-facing center cards and no flat single center.
- MTS Pay belongs to the initial center pair.
- Works cards use `clamp(310px,35vw,650px)` on desktop and `80vw` on mobile.
- Hackathon drag follows the pointer continuously and may cross multiple cards.
- Hackathon horizontal wheel/trackpad scroll uses the same floating-point orbit position.
- Desktop hackathon card step is 180px; mobile step is 130px.
- Ordinary vertical wheel is ignored unless Shift is held.
- Remove hackathon automatic rotation.
- Preserve modal, project data, themes, fixed controls, hand asset, astronaut model, and page overflow.
- Add no dependency.

---

### Task 1: Symmetric Works Pair Mathematics

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

**Interfaces:**
- Produces: `WORKS_CARD_COUNT = 14`
- Produces: `WORKS_PROJECT_INDEX = 6`
- Produces: `WORKS_DRAG_STEP_PX = 120`
- Produces: `worksPairOffset(index: number, pairStart: number, count?: number): number`
- Produces: `worksPairStartAfterDrag(pairStart: number, deltaX: number, count?: number, stepPx?: number): number`
- Updates: `worksDeckPose(offset: number)` to accept half-step offsets.

- [ ] **Step 1: Replace integer-center helper tests with pair tests**

Add these assertions in `src/maria/WorksCardCarousel.test.tsx`:

```tsx
expect(WORKS_CARD_COUNT).toBe(14)
expect(WORKS_PROJECT_INDEX).toBe(6)
expect(worksPairOffset(6, 6)).toBe(-0.5)
expect(worksPairOffset(7, 6)).toBe(0.5)
expect(worksPairOffset(5, 6)).toBe(-1.5)
expect(worksPairOffset(8, 6)).toBe(1.5)
expect(worksPairOffset(0, 6)).toBe(-6.5)
expect(worksPairOffset(13, 6)).toBe(6.5)
expect(worksPairStartAfterDrag(6, -119)).toBe(6)
expect(worksPairStartAfterDrag(6, -260)).toBe(8)
expect(worksPairStartAfterDrag(1, 250)).toBe(13)
```

Assert inward center poses:

```tsx
expect(worksDeckPose(-0.5).rotateY).toBe(58)
expect(worksDeckPose(0.5).rotateY).toBe(-58)
expect(worksDeckPose(-0.5).opacity).toBe(1)
expect(worksDeckPose(0.5).opacity).toBe(1)
expect(worksDeckPose(-1.5).rotateY).toBe(72)
expect(worksDeckPose(1.5).rotateY).toBe(-72)
```

- [ ] **Step 2: Run the focused tests to verify RED**

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/maria/WorksCardCarousel.test.tsx -t "geometry"
```

Expected: FAIL because the current count is 5 and pair helpers do not exist.

- [ ] **Step 3: Implement pair helpers**

In `WorksCardCarousel.tsx`:

```tsx
export const WORKS_CARD_COUNT = 14
export const WORKS_PROJECT_INDEX = 6
export const WORKS_DRAG_STEP_PX = 120

export function worksPairOffset(index: number, pairStart: number, count = WORKS_CARD_COUNT) {
  let relative = (index - pairStart + count) % count
  if (relative > count / 2) relative -= count
  return relative - 0.5
}

export function worksPairStartAfterDrag(
  pairStart: number,
  deltaX: number,
  count = WORKS_CARD_COUNT,
  stepPx = WORKS_DRAG_STEP_PX,
) {
  const steps = Math.round(-deltaX / stepPx)
  return (pairStart + steps + count) % count
}
```

Update `worksDeckPose`:

```tsx
export function worksDeckPose(offset: number): WorksDeckPose {
  const side = Math.sign(offset)
  const ring = Math.max(0, Math.abs(offset) - 0.5)
  if (ring === 0) return { scale: 1, opacity: 1, rotateY: -58 * side, rotateZ: 0, layer: 14 }
  if (ring === 1) return { scale: 0.94, opacity: 0.84, rotateY: -72 * side, rotateZ: 0, layer: 13 }
  const distance = Math.min(ring, 6)
  return {
    scale: Math.max(0.72, 0.94 - distance * 0.04),
    opacity: Math.max(0.2, 0.84 - distance * 0.11),
    rotateY: -82 * side,
    rotateZ: 0,
    layer: 13 - Math.round(distance),
  }
}
```

Remove obsolete `activeWorksIndexAfterSwipe`.

- [ ] **Step 4: Run helper tests**

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/maria/WorksCardCarousel.test.tsx -t "geometry"
```

Expected: pair geometry tests PASS.

---

### Task 2: Render 14 Works Cards and Navigate by Pair

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: pair helpers from Task 1.
- Preserves: `WorksCardCarousel({ onOpen, language })`.

- [ ] **Step 1: Update component tests**

Assert:

```tsx
expect(container.querySelectorAll('.maria-works-deck-card')).toHaveLength(14)
expect(container.querySelectorAll('.maria-works-deck-card__empty[aria-hidden="true"]')).toHaveLength(13)
expect(container.querySelectorAll('.concept-cover')).toHaveLength(1)
expect(cards[6]).toHaveAttribute('data-offset', '-0.5')
expect(cards[7]).toHaveAttribute('data-offset', '0.5')
```

Add a long-drag test:

```tsx
fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 420 })
fireEvent.pointerUp(carousel, { pointerId: 1, clientX: 150 })
expect(cards[8]).toHaveAttribute('data-offset', '-0.5')
expect(cards[9]).toHaveAttribute('data-offset', '0.5')
```

Verify MTS Pay opens when its absolute offset is `0.5`, and when outside the pair its first click updates `pairStart` without opening.

Update the Works route test in `src/App.test.tsx` from 5/4 to 14/13.

- [ ] **Step 2: Run tests to verify RED**

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/maria/WorksCardCarousel.test.tsx src/App.test.tsx -t "Works"
```

Expected: FAIL against the current five-card renderer.

- [ ] **Step 3: Convert component state to `pairStart`**

Use:

```tsx
const [pairStart, setPairStart] = useState(WORKS_PROJECT_INDEX)
```

Render `WORKS_CARD_COUNT` cards and calculate:

```tsx
const offset = worksPairOffset(index, pairStart)
const inCenterPair = Math.abs(offset) === 0.5
```

On pointer release:

```tsx
setPairStart((current) => worksPairStartAfterDrag(current, deltaX))
```

For side-card click, place the selected card into the nearer center side:

```tsx
const offset = worksPairOffset(index, pairStart)
setPairStart(offset < 0 ? index : (index - 1 + WORKS_CARD_COUNT) % WORKS_CARD_COUNT)
```

Allow MTS Pay’s `onOpen` only when `Math.abs(worksPairOffset(WORKS_PROJECT_INDEX, pairStart)) === 0.5`.

- [ ] **Step 4: Run Works tests**

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/maria/WorksCardCarousel.test.tsx src/App.test.tsx
```

Expected: Works and modal tests PASS.

---

### Task 3: Resize and Reposition the 14-Card Works Deck

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes half-step `data-offset` values and works pose variables.

- [ ] **Step 1: Add failing CSS assertions**

```js
expect(styles).toContain('width:clamp(310px,35vw,650px)')
expect(styles).toContain('[data-offset="-0.5"]')
expect(styles).toContain('[data-offset="0.5"]')
expect(styles).toContain('[data-offset="-1.5"]')
expect(styles).toContain('[data-offset="1.5"]')
expect(styles).toContain('width:80vw')
```

- [ ] **Step 2: Run CSS test to verify RED**

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/styles.test.js
```

- [ ] **Step 3: Replace single-center offset rules**

Set card width:

```css
width:clamp(310px,35vw,650px);
```

Use symmetric center-pair transforms:

```css
.maria-works-deck-card[data-offset="-0.5"]{transform:translate3d(calc(-50% - clamp(38px,4vw,74px)),-50%,95px) rotateY(var(--works-deck-rotate-y)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="0.5"]{transform:translate3d(calc(-50% + clamp(38px,4vw,74px)),-50%,95px) rotateY(var(--works-deck-rotate-y)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="-1.5"]{transform:translate3d(calc(-50% - clamp(112px,12vw,215px)),-50%,25px) rotateY(var(--works-deck-rotate-y)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="1.5"]{transform:translate3d(calc(-50% + clamp(112px,12vw,215px)),-50%,25px) rotateY(var(--works-deck-rotate-y)) scale(var(--works-deck-scale))}
```

For all other cards, expose a JS-calculated `--works-deck-x` value and use:

```css
.maria-works-deck-card{transform:translate3d(calc(-50% + var(--works-deck-x)),-50%,-80px) rotateY(var(--works-deck-rotate-y)) scale(var(--works-deck-scale))}
```

Set `--works-deck-x` in React to:

```tsx
`${Math.sign(offset) * Math.min(46, 13 + Math.abs(offset) * 6)}vw`
```

Place the explicit center-pair rules after the generic rule.

Inside mobile styles set width `80vw` and use 5vw/27vw center spacing.

- [ ] **Step 4: Run Works and CSS tests**

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/styles.test.js src/maria/WorksCardCarousel.test.tsx src/App.test.tsx
```

Expected: PASS.

---

### Task 4: Fractional Hackathon Orbit Mathematics

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`

**Interfaces:**
- Produces: `HACKATHON_DRAG_STEP_DESKTOP = 180`
- Produces: `HACKATHON_DRAG_STEP_MOBILE = 130`
- Produces: `normalizeOrbitPosition(position: number, count: number): number`
- Produces: `continuousOrbitOffset(index: number, position: number, count: number): number`
- Produces: `interpolatedOrbitPose(offset: number): OrbitPose`
- Produces: `orbitPositionAfterDelta(position: number, deltaPx: number, stepPx: number, count: number): number`
- Produces: `horizontalWheelDelta(deltaX: number, deltaY: number, shiftKey: boolean): number`

- [ ] **Step 1: Add failing helper tests**

```tsx
expect(normalizeOrbitPosition(7.4, 7)).toBeCloseTo(0.4)
expect(normalizeOrbitPosition(-0.25, 7)).toBeCloseTo(6.75)
expect(continuousOrbitOffset(1, 0.5, 7)).toBeCloseTo(0.5)
expect(continuousOrbitOffset(6, 0.5, 7)).toBeCloseTo(-1.5)
expect(interpolatedOrbitPose(0.5).scale).toBeCloseTo(0.93)
expect(interpolatedOrbitPose(0.5).opacity).toBeCloseTo(0.91)
expect(orbitPositionAfterDelta(0, 180, 180, 7)).toBeCloseTo(6)
expect(orbitPositionAfterDelta(0, -450, 180, 7)).toBeCloseTo(2.5)
expect(horizontalWheelDelta(75, 20, false)).toBe(75)
expect(horizontalWheelDelta(0, 75, true)).toBe(75)
expect(horizontalWheelDelta(0, 75, false)).toBe(0)
```

- [ ] **Step 2: Run test to verify RED**

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/App.test.tsx -t "Hackathons"
```

- [ ] **Step 3: Implement pure orbit helpers**

Normalize positions with modulo, calculate shortest circular fractional offsets, and linearly interpolate every `OrbitPose` numeric field between `orbitPose(Math.floor(abs(offset)))` and the next distance pose. Preserve direction signs for rotations.

Use:

```tsx
export function orbitPositionAfterDelta(position: number, deltaPx: number, stepPx: number, count: number) {
  return normalizeOrbitPosition(position - deltaPx / stepPx, count)
}

export function horizontalWheelDelta(deltaX: number, deltaY: number, shiftKey: boolean) {
  if (deltaX !== 0) return deltaX
  return shiftKey ? deltaY : 0
}
```

- [ ] **Step 4: Run helper tests**

Expected: helper assertions PASS.

---

### Task 5: Continuous Hackathon Drag, Wheel, and Snap

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes Task 4 helpers.
- Preserves seven project cards and click-to-center.

- [ ] **Step 1: Add interaction tests**

Use pointer move before release:

```tsx
fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 400 })
fireEvent.pointerMove(carousel, { pointerId: 1, clientX: 130 })
expect(Number(carousel.getAttribute('data-orbit-position'))).toBeCloseTo(1.5)
fireEvent.pointerUp(carousel, { pointerId: 1, clientX: 130 })
expect(carousel).toHaveAttribute('data-orbit-position', '2')
```

Test a 450px drag crosses multiple cards, `wheel({ deltaX: 180 })` changes one position, Shift+`deltaY` works, ordinary `deltaY` does not, and no interval is installed. Use fake timers only for the wheel snap debounce.

- [ ] **Step 2: Run interaction tests to verify RED**

Expected: FAIL because current movement updates only one integer card on pointer release and still has an interval.

- [ ] **Step 3: Replace active integer state**

Use:

```tsx
const [position, setPosition] = useState(0)
const dragOrigin = useRef<{ x: number; position: number } | null>(null)
const wheelSnapTimer = useRef<number | null>(null)
```

Remove the automatic `useEffect` interval.

On pointer move:

```tsx
const step = window.matchMedia('(max-width: 600px)').matches
  ? HACKATHON_DRAG_STEP_MOBILE
  : HACKATHON_DRAG_STEP_DESKTOP
setPosition(orbitPositionAfterDelta(dragOrigin.current.position, event.clientX - dragOrigin.current.x, step, PROJECT_COUNT))
```

On pointer release, snap with:

```tsx
setPosition((current) => normalizeOrbitPosition(Math.round(current), PROJECT_COUNT))
```

On wheel, calculate horizontal input, prevent default only when non-zero, update fractional position, clear the previous 120ms timer, and schedule nearest-integer snap.

Render `data-orbit-position={Number(position.toFixed(3))}`.

Clicking a project sets `position` to its integer index.

- [ ] **Step 4: Render continuous transforms**

For every card:

```tsx
const offset = continuousOrbitOffset(index, position, PROJECT_COUNT)
const pose = interpolatedOrbitPose(offset)
const angle = offset * Math.PI / 3
const orbitX = Math.sin(angle) * 34
const orbitY = -(Math.abs(offset) === 0 ? 0 : 4 + Math.abs(offset) * 8)
```

Expose:

```tsx
'--orbit-x': `${orbitX}vw`,
'--orbit-y': `${orbitY}vh`,
```

Replace offset-specific CSS transforms with one:

```css
.maria-orbit-card{transform:translate3d(calc(-50% + var(--orbit-x)),var(--orbit-y),0) rotateY(var(--orbit-rotate-y)) rotateZ(var(--orbit-rotate-z)) scale(var(--orbit-position-scale)) scale(var(--orbit-card-size-scale)) scale(var(--orbit-active-scale))}
.maria-orbit-carousel{cursor:grab}
.maria-orbit-carousel.is-dragging{cursor:grabbing}
```

- [ ] **Step 5: Run focused tests**

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/App.test.tsx src/styles.test.js
```

Expected: PASS.

---

### Task 6: Full Verification

**Files:**
- Verify all modified source and test files.

- [ ] **Step 1: Run the full suite**

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm test -- --run
```

- [ ] **Step 2: Run production build**

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm build
```

- [ ] **Step 3: Verify on localhost**

Check 14 works cards, symmetric center pair, larger sizing, MTS Pay modal behavior, multi-card works drag, continuous hackathon drag, horizontal wheel, Shift+wheel, multi-card travel, snap, mobile step distance, themes, fixed controls, and absence of page scrollbars or automatic rotation.
