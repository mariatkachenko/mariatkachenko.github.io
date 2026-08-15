# Works Mobile Spacing and Drag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve mobile Works carousel spacing and ensure gestures move only the carousel without native card/image dragging.

**Architecture:** Preserve the shared fractional carousel state while selecting a device-specific drag step. Render separate desktop/mobile translation variables and let the mobile media query choose the wider spacing.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Desktop spacing stays `11.5vw`.
- Mobile spacing is `28vw`.
- Desktop drag step stays `150px`; mobile drag step is `220px`.
- Preserve the fan curve, center stability, magazine depth, initial position `6.5`, and modal behavior.
- Prevent native drag and text selection.

---

### Task 1: Mobile drag step and native drag prevention

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

**Interfaces:**
- Add: `WORKS_MOBILE_DRAG_STEP_PX = 220`
- Add: `worksDragStep(isMobile: boolean): number`

- [ ] **Step 1: Write failing tests**

```ts
expect(worksDragStep(false)).toBe(150)
expect(worksDragStep(true)).toBe(220)
expect(cards[0]).toHaveStyle({
  '--works-row-x': '-74.75vw',
  '--works-row-x-mobile': '-182vw',
})
```

Fire `dragStart` on a card and assert the event is cancelled.

- [ ] **Step 2: Run focused test and verify RED**

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

- [ ] **Step 3: Implement mobile drag selection and drag blocking**

Select the drag step with `matchMedia('(max-width: 600px)')`. Use it in pointer move/release. Add `onDragStart={(event) => event.preventDefault()}` to the carousel. Render `--works-row-x-mobile` as `pose.x * 28vw`.

- [ ] **Step 4: Run focused test and verify GREEN**

Run the same command.

### Task 2: Mobile CSS spacing

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing CSS tests**

Require mobile transform using `--works-row-x-mobile`, `user-select:none`, and `-webkit-user-drag:none`.

- [ ] **Step 2: Run styles test and verify RED**

```bash
pnpm vitest run src/styles.test.js
```

- [ ] **Step 3: Implement CSS**

Add selection and native image drag blocking to the carousel. In `@media(max-width:600px)`, override the card transform translation with `var(--works-row-x-mobile)` while preserving rotation and scale.

- [ ] **Step 4: Run Works and styles tests and verify GREEN**

```bash
pnpm vitest run src/maria/WorksCardCarousel.test.tsx src/styles.test.js
```

### Task 3: Full verification

- [ ] **Step 1: Run `pnpm test -- --run`**
- [ ] **Step 2: Run `pnpm build`**
- [ ] **Step 3: Confirm mobile spacing, drag-only carousel movement, click behavior, and desktop preservation**
- [ ] **Step 4: Report fresh test count and build result**
