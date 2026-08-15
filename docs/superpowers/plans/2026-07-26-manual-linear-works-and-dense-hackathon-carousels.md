# Manual Linear Works and Dense Hackathon Carousels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a level, manually controlled Works card row and a denser twelve-position Hackathons orbit without autoplay.

**Architecture:** Both carousels use a fractional numeric position as their single source of truth. Pure geometry helpers convert card index and carousel position into wrapped offsets and stable visual poses; React pointer and wheel handlers only update position. Existing project rendering and MTS Pay modal behavior remain intact.

**Tech Stack:** React 19, TypeScript, CSS 3D transforms, Vitest, Testing Library, Vite.

## Global Constraints

- Works contains exactly 14 equal-size cards in one straight row.
- MTS Pay uses the visible title `MTS Pay`; all placeholders use `Coming soon`.
- Both carousels support continuous pointer drag and horizontal wheel/trackpad input.
- Plain vertical wheel input is not captured.
- Neither carousel uses autoplay.
- Hackathons contains seven existing projects plus five non-interactive placeholders.
- Existing navigation, astronaut, sphere, page controls, and MTS Pay modal are preserved.

---

### Task 1: Works continuous row geometry

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

**Interfaces:**
- Produces: `normalizeWorksPosition(position: number, count?: number): number`
- Produces: `continuousWorksOffset(index: number, position: number, count?: number): number`
- Produces: `worksPositionAfterDelta(position: number, deltaPx: number, stepPx?: number, count?: number): number`
- Produces: `worksRowPose(offset: number): { rotateY: number; x: number; layer: number }`

- [ ] **Step 1: Write failing geometry tests**

Add tests asserting:

```ts
expect(normalizeWorksPosition(-0.5)).toBe(13.5)
expect(continuousWorksOffset(0, 1.5)).toBe(-1.5)
expect(continuousWorksOffset(13, 0.5)).toBe(-1.5)
expect(worksPositionAfterDelta(0, -300, 150)).toBe(2)
expect(worksRowPose(-2)).toEqual({ rotateY: 48, x: -2, layer: 12 })
expect(worksRowPose(2)).toEqual({ rotateY: -48, x: 2, layer: 12 })
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: FAIL because the continuous helpers are not exported.

- [ ] **Step 3: Implement the pure geometry helpers**

Use wrapped fractional offsets:

```ts
export function normalizeWorksPosition(position: number, count = WORKS_CARD_COUNT) {
  return ((position % count) + count) % count
}

export function continuousWorksOffset(index: number, position: number, count = WORKS_CARD_COUNT) {
  let offset = index - position
  const half = count / 2
  while (offset > half) offset -= count
  while (offset < -half) offset += count
  return offset
}
```

Keep row pose scale and opacity fixed at CSS level. Geometry only varies horizontal position, inward Y rotation, and stacking layer.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the same Vitest command. Expected: PASS.

### Task 2: Works drag, wheel, titles, and modal behavior

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: Task 1 continuous Works geometry helpers.
- Preserves: `WorksCardCarousel({ onOpen, language })`.

- [ ] **Step 1: Write failing component tests**

Assert:

```ts
expect(cards).toHaveLength(14)
expect(screen.getByText('MTS Pay')).toBeInTheDocument()
expect(screen.getAllByText('Coming soon')).toHaveLength(13)

fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 420 })
fireEvent.pointerMove(carousel, { pointerId: 1, clientX: 120 })
expect(carousel).toHaveAttribute('data-works-position', '2')

fireEvent.wheel(carousel, { deltaX: 150, deltaY: 0 })
expect(carousel).toHaveAttribute('data-works-position', '1')
```

Also assert a plain `{ deltaX: 0, deltaY: 120 }` wheel event does not change position, and clicking MTS Pay without a preceding drag calls `onOpen` once.

- [ ] **Step 2: Run the focused test and verify RED**

Expected failures: missing title nodes, missing fractional position attribute, and no Works wheel handler.

- [ ] **Step 3: Replace pair selection with fractional position state**

Implement:

- `position` state initialized to `WORKS_PROJECT_INDEX`;
- pointer origin `{ x, position }`;
- continuous `onPointerMove`;
- snap to nearest integer on release;
- horizontal and Shift+vertical wheel support with a 140 ms snap timer;
- click suppression only after actual drag;
- no interval or autoplay.

Render every article with:

```tsx
<span className="maria-works-deck-card__label">
  {projectCard ? 'MTS Pay' : 'Coming soon'}
</span>
```

Keep `ConceptProject` and its existing `onOpen` callback inside the project card.

- [ ] **Step 4: Run Works and App tests and verify GREEN**

Run:

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx src/App.test.tsx
```

Expected: PASS.

### Task 3: Level Works row styling

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes CSS variables `--works-row-x`, `--works-row-rotate-y`, and `--works-row-layer`.

- [ ] **Step 1: Write failing CSS assertions**

Require:

```js
expect(styles).toContain('opacity:1')
expect(styles).toContain('scale(1)')
expect(styles).toContain('.maria-works-deck-card__label')
expect(styles).toContain('transform:translate3d(calc(-50% + var(--works-row-x)),-50%,0)')
expect(styles).not.toContain('var(--works-deck-scale)')
```

- [ ] **Step 2: Run styles test and verify RED**

Run:

```bash
pnpm vitest run src/styles.test.js
```

- [ ] **Step 3: Implement the level row CSS**

Make all Works cards:

- the same width, scale `1`, and opacity `1`;
- vertically aligned at the same `top`;
- translated only through `--works-row-x`;
- rotated through `--works-row-rotate-y`;
- transitioned in 180–220 ms for responsive drag.

Place `.maria-works-deck-card__label` above the card using absolute positioning and `overflow:visible` on the article. Move card clipping to the card content/empty cover so titles are not clipped. Preserve the visible focus ring and existing modal dimensions.

- [ ] **Step 4: Run styles and Works tests and verify GREEN**

Run:

```bash
pnpm vitest run src/styles.test.js src/maria/WorksCardCarousel.test.tsx
```

### Task 4: Dense twelve-position Hackathons orbit

**Files:**
- Modify: `src/maria/HackathonOrbitCarousel.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Produces: `HACKATHON_ORBIT_COUNT = 12`
- Preserves: seven `projectsFor(language)` entries.

- [ ] **Step 1: Write failing orbit content tests**

Assert:

```ts
expect(HACKATHON_ORBIT_COUNT).toBe(12)
expect(screen.getAllByRole('button')).toHaveLength(7)
expect(container.querySelectorAll('.maria-orbit-card--placeholder')).toHaveLength(5)
expect(container.querySelectorAll('.maria-orbit-card')).toHaveLength(12)
```

Also assert placeholders use `aria-hidden="true"` and do not contain buttons or project labels.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
pnpm vitest run src/maria/HackathonOrbitCarousel.test.tsx src/App.test.tsx
```

- [ ] **Step 3: Render project buttons and decorative placeholder articles**

Change orbit count to 12. Render indices `0–6` as the existing buttons and `7–11` as:

```tsx
<article
  className="maria-orbit-card maria-orbit-card--placeholder"
  aria-hidden="true"
  data-offset={...}
  style={...}
/>
```

Both node types use the same continuous offset and pose calculation. Placeholder nodes have `pointer-events:none`.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run the same Vitest command. Expected: PASS.

### Task 5: Compact Hackathons spacing and responsive tuning

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`

**Interfaces:**
- Consumes CSS variables `--orbit-x` and `--orbit-y`.

- [ ] **Step 1: Write failing compact-spacing assertions**

Assert that CSS contains placeholder styling and that component tests observe reduced orbit variables for offset `1`, with horizontal amplitude below the current `34vw`.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
pnpm vitest run src/styles.test.js src/maria/HackathonOrbitCarousel.test.tsx
```

- [ ] **Step 3: Reduce orbit amplitudes**

Use:

```ts
const orbitX = Math.sin(offset * Math.PI / 4.2) * 27
const orbitY = Math.abs(offset) < 0.001 ? 0 : -(3 + Math.abs(offset) * 5.6)
```

Add translucent placeholder styling without text, controls, or hover behavior. Keep depth, tilt, opacity, and the existing mobile card size variables.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the same Vitest command. Expected: PASS.

### Task 6: Full verification

**Files:**
- Verify all modified files.

**Interfaces:**
- Consumes all prior tasks.

- [ ] **Step 1: Run all tests**

```bash
pnpm test -- --run
```

Expected: all test files and tests pass with exit code 0.

- [ ] **Step 2: Run the production build**

```bash
pnpm build
```

Expected: TypeScript and Vite complete with exit code 0.

- [ ] **Step 3: Review requirement checklist**

Verify in code and tests:

- 14 equal Works cards in one level row;
- `MTS Pay` plus 13 `Coming soon` labels;
- Works drag and horizontal wheel, no autoplay;
- 12 Hackathons positions with five non-interactive placeholders;
- denser orbit geometry;
- plain vertical wheel remains unhandled;
- modal and navigation preserved.

- [ ] **Step 4: Report the result**

Include test count, build result, and the localhost URL already used by the project. Do not claim success without the fresh command outputs above.
