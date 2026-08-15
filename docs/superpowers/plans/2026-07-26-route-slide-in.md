# Route Slide-In Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Animate incoming route content horizontally while fixed navigation remains stationary.

**Architecture:** Add a pure route-direction helper and track the previous route in `App` with a ref. Render the selected page inside a keyed route-content wrapper whose modifier class triggers one of two CSS entry animations.

**Tech Stack:** React 19, TypeScript, CSS animations, Vitest, Testing Library, Vite

## Global Constraints

- Forward navigation enters from the right.
- Back navigation to home enters from the left.
- Duration is 480 ms.
- Initial render does not animate.
- Fixed header and bottom controls remain outside the wrapper.
- Reduced-motion mode disables the route animation.

---

### Task 1: Route direction and animated wrapper

**Files:**
- Modify: `src/router.ts`
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `routeTransitionDirection(from, to): 'forward' | 'back' | null`
- Produces: `.maria-route-content--forward` and `.maria-route-content--back` wrapper modifiers

- [ ] **Step 1: Write failing tests**

```ts
expect(routeTransitionDirection('/', '/works')).toBe('forward')
expect(routeTransitionDirection('/hackathons', '/')).toBe('back')
expect(routeTransitionDirection('/', '/')).toBeNull()
```

Render `App`, assert that the initial route wrapper has no direction modifier, click `Работы`, assert `forward`, click `Назад`, and assert `back`. Confirm `.maria-header` and `.maria-controls` are direct children of `.maria-app`, not descendants of `.maria-route-content`.

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/App.test.tsx
```

Expected: helper and route wrapper are absent.

- [ ] **Step 3: Implement direction tracking**

In `router.ts`, return `null` for identical routes, `back` when the destination is `/`, and `forward` otherwise.

In `App`, add:

```ts
const [transitionDirection, setTransitionDirection] = useState<'forward' | 'back' | null>(null)
const pathRef = useRef(path)
```

On `popstate`, calculate the next normalized path, derive direction from `pathRef.current`, update the ref, direction, and route state. Wrap only the selected page:

```tsx
<div key={path} className={`maria-route-content${transitionDirection ? ` maria-route-content--${transitionDirection}` : ''}`}>
  {page}
</div>
```

- [ ] **Step 4: Verify GREEN**

```bash
pnpm vitest run src/App.test.tsx
```

Expected: all App tests pass.

### Task 2: Slide-in CSS and accessibility

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

**Interfaces:**
- Consumes: route-content modifier classes from Task 1
- Produces: 480 ms forward/back entry motion

- [ ] **Step 1: Write failing CSS assertions**

Assert that styles contain:

```css
@keyframes maria-route-in-forward
@keyframes maria-route-in-back
animation:maria-route-in-forward .48s
animation:maria-route-in-back .48s
```

Also assert a reduced-motion override sets `animation:none`.

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/styles.test.js
```

Expected: route animation declarations are absent.

- [ ] **Step 3: Implement CSS**

Define a full-viewport `.maria-route-content` wrapper. Use `translate3d(7vw,0,0)` to `translate3d(0,0,0)` for forward motion and `-7vw` for back motion, with opacity from `.72` to `1`, 480 ms duration, and `cubic-bezier(.2,.8,.2,1)`.

Add `.maria-route-content{animation:none!important}` inside the existing reduced-motion media query.

- [ ] **Step 4: Full verification**

```bash
pnpm vitest run
pnpm build
```

Expected: all tests and production build pass.
