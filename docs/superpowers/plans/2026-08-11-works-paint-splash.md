# Works Paint Splash Effect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a responsive full-screen vector paint splash whenever placeholder card index `8` newly becomes centered on `/works`.

**Architecture:** `WorksCardCarousel` will expose the already-derived centered card index through a callback. `WorksPage` will detect a transition into index `8`, increment an activation counter, and render a dedicated `WorksPaintSplash` SVG overlay keyed by that counter. CSS owns the impact, scatter, drip, dissolve, theme, and reduced-motion presentation.

**Tech Stack:** React, TypeScript, inline SVG, CSS keyframes, Vitest, Testing Library.

## Global Constraints

- Change only `/works`; do not modify the home page or `/hackathons`.
- Keep `WORKS_CARD_COUNT = 14`, carousel geometry, autoplay, drag, wheel, modal behavior, and fixed chrome unchanged.
- Trigger only when card index `8` newly enters the centered position.
- The overlay must use `pointer-events: none` and be decorative.
- Use no raster, video, or new runtime dependency.
- Disable scatter and dripping under `prefers-reduced-motion: reduce`.

---

### Task 1: Center-entry trigger contract

**Files:**
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/maria/WorksCardCarousel.test.tsx`

**Interfaces:**
- Produces: optional prop `onCenteredIndexChange?: (index: number) => void`.
- Consumes: existing `centeredCardIndex` derived from `normalizeWorksPosition(Math.round(position))`.

- [ ] **Step 1: Write the failing callback test**

Add a test that renders the ready carousel with `onCenteredIndexChange`, verifies the initial call is `6`, moves fractionally without crossing the center boundary, then crosses to `7` and expects exactly one additional call:

```tsx
const onCenteredIndexChange = vi.fn()
render(<WorksCardCarousel onOpen={vi.fn()} onCenteredIndexChange={onCenteredIndexChange} language="ru" />)
expect(onCenteredIndexChange).toHaveBeenLastCalledWith(6)
fireEvent.wheel(carousel, { deltaX: 25, deltaY: 0 })
expect(onCenteredIndexChange).toHaveBeenCalledTimes(1)
fireEvent.wheel(carousel, { deltaX: 50, deltaY: 0 })
expect(onCenteredIndexChange).toHaveBeenLastCalledWith(7)
expect(onCenteredIndexChange).toHaveBeenCalledTimes(2)
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: FAIL because `onCenteredIndexChange` is not a component prop.

- [ ] **Step 3: Implement the callback**

Extend the props and notify only when the rounded centered index changes:

```tsx
type WorksCardCarouselProps = {
  onOpen: () => void
  onPositionChange?: (position: number) => void
  onCenteredIndexChange?: (index: number) => void
  language: Language
}

useEffect(() => {
  onCenteredIndexChange?.(centeredCardIndex)
}, [centeredCardIndex, onCenteredIndexChange])
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the command from Step 2. Expected: all `WorksCardCarousel` tests pass.

---

### Task 2: Vector paint overlay and activation lifecycle

**Files:**
- Create: `src/maria/WorksPaintSplash.tsx`
- Create: `src/maria/WorksPaintSplash.test.tsx`
- Modify: `src/maria/WorksPage.tsx`

**Interfaces:**
- Produces: `WorksPaintSplash({ activation }: { activation: number })`.
- Produces: `shouldTriggerWorksPaintSplash(previousIndex: number | null, nextIndex: number): boolean`.
- Consumes: `WORKS_MTS_PLACEHOLDER_INDEX` and `onCenteredIndexChange` from Task 1.

- [ ] **Step 1: Write failing trigger and accessibility tests**

Test the pure entry rule and overlay contract:

```tsx
expect(shouldTriggerWorksPaintSplash(7, 8)).toBe(true)
expect(shouldTriggerWorksPaintSplash(8, 8)).toBe(false)
expect(shouldTriggerWorksPaintSplash(9, 8)).toBe(true)
expect(shouldTriggerWorksPaintSplash(8, 9)).toBe(false)

const { container, rerender } = render(<WorksPaintSplash activation={1} />)
expect(container.querySelector('.works-paint-splash')).toHaveAttribute('aria-hidden', 'true')
expect(container.querySelector('svg')).toHaveAttribute('focusable', 'false')
rerender(<WorksPaintSplash activation={2} />)
expect(container.querySelector('.works-paint-splash')).toHaveAttribute('data-activation', '2')
```

- [ ] **Step 2: Run the new test and verify RED**

Run:

```bash
PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/vitest run src/maria/WorksPaintSplash.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Create the SVG component**

Create a fixed-composition SVG with `viewBox="0 0 1600 1000"`. Include:

- a central impact group with three asymmetrical organic `<path>` shapes;
- two large edge splashes;
- at least twelve droplet `<circle>` or `<ellipse>` nodes distributed across all quadrants;
- four drip groups, each containing a rounded vertical path and terminal droplet;
- gradient definitions for pink→raspberry, violet→pink, and cyan→violet;
- restrained blur filters for the largest shapes only.

Use stable classes: `works-paint-splash`, `works-paint-splash__svg`, `works-paint-splash__impact`, `works-paint-splash__burst`, `works-paint-splash__drop`, and `works-paint-splash__drip`.

The root contract is:

```tsx
export function shouldTriggerWorksPaintSplash(previousIndex: number | null, nextIndex: number) {
  return previousIndex !== WORKS_MTS_PLACEHOLDER_INDEX
    && nextIndex === WORKS_MTS_PLACEHOLDER_INDEX
}

export default function WorksPaintSplash({ activation }: { activation: number }) {
  if (activation === 0) return null
  return <div
    key={activation}
    className="works-paint-splash"
    data-activation={activation}
    aria-hidden="true"
  >
    <svg className="works-paint-splash__svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" focusable="false">
      {/* deterministic paths and droplets described above */}
    </svg>
  </div>
}
```

- [ ] **Step 4: Wire activation into `WorksPage`**

Track the previous centered index in a ref and activation in state:

```tsx
const previousCenteredIndex = useRef<number | null>(WORKS_INITIAL_POSITION)
const [paintActivation, setPaintActivation] = useState(0)

const updateCenteredIndex = useCallback((nextIndex: number) => {
  if (shouldTriggerWorksPaintSplash(previousCenteredIndex.current, nextIndex)) {
    setPaintActivation((current) => current + 1)
  }
  previousCenteredIndex.current = nextIndex
}, [])
```

Pass `updateCenteredIndex` to `WorksCardCarousel` and render `<WorksPaintSplash activation={paintActivation} />` after the carousel so it forms a separate screen-glass layer.

- [ ] **Step 5: Run the component and carousel tests**

Run:

```bash
PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/vitest run src/maria/WorksPaintSplash.test.tsx src/maria/WorksCardCarousel.test.tsx
```

Expected: both files pass.

---

### Task 3: Impact, scatter, drips, theme, and reduced motion

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

**Interfaces:**
- Consumes: the stable SVG class names from Task 2.
- Produces: a `2.8s` non-interactive full-screen animation above fixed chrome.

- [ ] **Step 1: Write failing CSS contract assertions**

Add assertions for:

```js
expect(styles).toContain('.works-paint-splash{position:fixed;z-index:1200;inset:0;overflow:hidden;pointer-events:none')
expect(styles).toContain('@keyframes works-paint-impact')
expect(styles).toContain('@keyframes works-paint-scatter')
expect(styles).toContain('@keyframes works-paint-drip')
expect(styles).toContain('@keyframes works-paint-dissolve')
expect(styles).toContain('.works-paint-splash__drip')
expect(styles).toContain('@media(prefers-reduced-motion:reduce)')
expect(styles).toContain('.works-paint-splash__drop,.works-paint-splash__drip{animation:none!important}')
```

- [ ] **Step 2: Run the CSS test and verify RED**

Run:

```bash
PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/vitest run src/styles.test.js
```

Expected: FAIL because the paint-layer selectors and keyframes are absent.

- [ ] **Step 3: Implement the animation system**

Add CSS with these exact behaviors:

- root fixed at `z-index:1200`, `pointer-events:none`, total dissolve duration `2.8s`;
- SVG overflow visible and covering `100vw × 100vh`;
- impact shapes scale from `.12` to `1.08` to `1` over `420ms`;
- burst shapes rotate and expand over `720ms`;
- droplets use per-node custom properties `--drop-x`, `--drop-y`, `--drop-delay`, and `--drop-scale` to scatter over `820ms`;
- drips scale vertically and translate downward over `1.9s`, with four staggered delays;
- the root opacity holds after impact, then fades during the final `650ms`;
- light theme uses a soft multiply-like shadow; dark theme increases highlight opacity without adding neon bloom;
- mobile scales the overall SVG to keep splashes visible near the viewport edges;
- reduced motion disables droplet and drip animations and replaces the root sequence with a short static `480ms` fade.

- [ ] **Step 4: Run CSS and component tests**

Run:

```bash
PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/vitest run src/styles.test.js src/maria/WorksPaintSplash.test.tsx src/maria/WorksCardCarousel.test.tsx
```

Expected: all targeted tests pass.

---

### Task 4: Full verification

**Files:**
- Verify only; no additional production files.

**Interfaces:**
- Consumes: completed Tasks 1–3.
- Produces: evidence that the feature integrates without regressions.

- [ ] **Step 1: Run all tests**

```bash
PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/vitest run
```

Expected: all test files pass with zero failures.

- [ ] **Step 2: Run TypeScript**

```bash
PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/tsc -b
```

Expected: exit code `0` with no diagnostics.

- [ ] **Step 3: Run production build**

```bash
PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH ./node_modules/.bin/vite build
```

Expected: Vite completes successfully and writes `dist/`.

- [ ] **Step 4: Inspect implementation scope**

Confirm only `/works` source, its tests, and the approved spec/plan changed. Confirm no home or `/hackathons` component was edited.
