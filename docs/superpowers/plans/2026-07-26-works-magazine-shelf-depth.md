# Works Magazine Shelf Depth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the Works carousel a continuous magazine-shelf rotation with a visible edge-on center card and CSS-generated physical depth.

**Architecture:** Keep fractional carousel position as the single source of truth. A pure pose helper maps wrapped distance from center to mirrored Y rotation while preserving scale and opacity; React input handlers stop changing position when input stops, without snapping. Two decorative child surfaces form the spine and page block.

**Tech Stack:** React 19, TypeScript, CSS 3D transforms, Vitest, Testing Library, Vite.

## Global Constraints

- Keep 14 cards and the existing MTS Pay modal.
- Remove all card title labels.
- Center offset `0` rotates `90deg`; offsets `1`, `2`, `3`, and `4+` rotate `68deg`, `46deg`, `24deg`, and `0deg`.
- Preserve equal scale, opacity, and vertical alignment.
- Do not snap fractional drag or wheel positions.
- Preserve drag, horizontal wheel, Shift+wheel, and direct MTS Pay click.
- No autoplay.

---

### Task 1: Continuous magazine rotation curve

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

**Interfaces:**
- Modify: `worksRowPose(offset: number): { rotateY: number; x: number; layer: number }`

- [ ] **Step 1: Write failing rotation tests**

```ts
expect(worksRowPose(0).rotateY).toBe(90)
expect(worksRowPose(-1).rotateY).toBe(-68)
expect(worksRowPose(1).rotateY).toBe(68)
expect(Math.abs(worksRowPose(2).rotateY)).toBe(46)
expect(Math.abs(worksRowPose(3).rotateY)).toBe(24)
expect(worksRowPose(4).rotateY).toBe(0)
expect(Math.abs(worksRowPose(0.5).rotateY)).toBe(79)
```

- [ ] **Step 2: Run focused tests and verify RED**

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: current constant `48deg` pose fails.

- [ ] **Step 3: Implement the continuous curve**

Use:

```ts
const magnitude = Math.max(0, 90 - Math.abs(offset) * 22)
const direction = offset === 0 ? 1 : Math.sign(offset)
const rotateY = magnitude * direction
```

Keep X position and layer calculation unchanged.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the same command. Expected: PASS.

### Task 2: Remove snapping and title labels

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Preserve: `WorksCardCarousel({ onOpen, language })`.

- [ ] **Step 1: Write failing interaction tests**

Assert:

```ts
expect(screen.queryByText('MTS Pay')).not.toBeInTheDocument()
expect(screen.queryByText('Coming soon')).not.toBeInTheDocument()

fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 420 })
fireEvent.pointerMove(carousel, { pointerId: 1, clientX: 95 })
fireEvent.pointerUp(carousel, { pointerId: 1, clientX: 95 })
expect(carousel).toHaveAttribute('data-works-position', '8.167')

fireEvent.wheel(carousel, { deltaX: 75, deltaY: 0 })
expect(carousel).toHaveAttribute('data-works-position', '7.667')
```

- [ ] **Step 2: Run focused tests and verify RED**

Expected: labels remain and pointer release rounds the position.

- [ ] **Step 3: Remove snap behavior and labels**

- On pointer release, keep `finalPosition` without `Math.round`.
- On wheel, update position immediately and remove the timeout ref/effect.
- Delete `.maria-works-deck-card__label` rendering.
- Keep click suppression and direct `ConceptProject` callback.

- [ ] **Step 4: Run Works and App tests and verify GREEN**

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx src/App.test.tsx
```

### Task 3: Add magazine spine and page-block surfaces

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Add child classes:
  - `.maria-works-deck-card__spine`
  - `.maria-works-deck-card__pages`
- Add CSS variable: `--works-magazine-depth`.

- [ ] **Step 1: Write failing component and CSS tests**

Assert 14 spine and 14 page-block nodes, plus:

```js
expect(styles).toContain('--works-magazine-depth:22px')
expect(styles).toContain('.maria-works-deck-card__spine')
expect(styles).toContain('.maria-works-deck-card__pages')
expect(styles).toContain('rotateY(90deg)')
expect(styles).not.toContain('.maria-works-deck-card__label')
```

- [ ] **Step 2: Run focused tests and verify RED**

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx src/styles.test.js
```

- [ ] **Step 3: Render and style the depth surfaces**

Render before the cover:

```tsx
<i className="maria-works-deck-card__spine" aria-hidden="true" />
<i className="maria-works-deck-card__pages" aria-hidden="true" />
```

Style the article with `transform-style:preserve-3d` and desktop depth `22px`. Create a full-height spine at the card edge using `translateZ` and `rotateY(90deg)`. Create a pale page surface with subtle repeating horizontal lines, a highlight, and contact shadow. Set mobile depth to `14px`. Give `.has-project` spine a restrained pink highlight.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the same Vitest command. Expected: PASS.

### Task 4: Full verification

**Files:**
- Verify all modified source and test files.

- [ ] **Step 1: Run all tests**

```bash
pnpm test -- --run
```

- [ ] **Step 2: Run production build**

```bash
pnpm build
```

- [ ] **Step 3: Verify the requirement checklist**

- no card labels;
- exact continuous rotation curve;
- center card visibly edge-on;
- equal card scale and opacity;
- physical spine and page depth;
- no pointer or wheel snapping;
- MTS Pay modal preserved;
- no autoplay.

- [ ] **Step 4: Report fresh test count and build result**

Do not claim completion unless both commands exit with code `0`.
