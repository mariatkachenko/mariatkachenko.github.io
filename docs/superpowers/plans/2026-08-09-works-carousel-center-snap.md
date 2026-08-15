# Works Carousel Center Snap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every completed Works carousel interaction settle one card exactly in the center and reliably restore the MTS Pay expanded state whenever it returns there.

**Architecture:** Keep continuous pointer tracking during a drag, then normalize the final position through the existing release helper with snapping enabled on every viewport. Apply `.is-centered` from each card's zero offset instead of restricting the class to MTS Pay; existing MTS-specific CSS remains gated by `.has-project.is-centered`.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, Vite.

## Global Constraints

- Modify only Works carousel behavior and its tests.
- Keep card markup, artwork, modal behavior, directions, responsive composition, themes, and entry animation unchanged.
- Preserve circular wrapping.
- Exactly one card is centered after every settled interaction.

---

### Task 1: Unify settled positions and centered state

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

**Interfaces:**
- Consumes: `worksDragReleasePosition(position, count, snap)`, `continuousWorksOffset(index, position)`, pointer release, and wheel input.
- Produces: integer settled positions and `.is-centered` on whichever article has zero offset.

- [ ] **Step 1: Write failing recurrence and unified-center tests**

Update the desktop drag test to require release from `8.167` to settle at `8`. Add a test that wheels away from MTS Pay, continues around the circular carousel, and returns to position `6`, asserting that MTS Pay loses and then regains `.is-centered`. At position `7`, assert card 7 has `.is-centered`, MTS Pay does not, and exactly one centered card exists.

```tsx
fireEvent.pointerUp(carousel, { pointerId: 1, clientX: 95 })
expect(carousel).toHaveAttribute('data-works-position', '8')
expect(cards[8]).toHaveClass('is-centered')
expect(container.querySelectorAll('.maria-works-deck-card.is-centered')).toHaveLength(1)

fireEvent.wheel(carousel, { deltaX: 150, deltaY: 0 })
expect(project).not.toHaveClass('is-centered')
expect(cards[7]).toHaveClass('is-centered')

for (let step = 0; step < WORKS_CARD_COUNT - 1; step += 1) {
  fireEvent.wheel(carousel, { deltaX: 150, deltaY: 0 })
}
expect(carousel).toHaveAttribute('data-works-position', '6')
expect(project).toHaveClass('is-centered')
```

- [ ] **Step 2: Run the focused test and verify the current behavior fails**

Run: `PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`

Expected: FAIL because desktop release stays fractional and placeholder cards never receive `.is-centered`.

- [ ] **Step 3: Implement one settled-position rule and one centered-state rule**

In `finishDrag`, always pass `true` as the third argument:

```ts
setPosition(worksDragReleasePosition(finalPosition, WORKS_CARD_COUNT, true))
```

In `handleWheel`, round and normalize the next position:

```ts
setPosition((current) => worksDragReleasePosition(
  worksPositionAfterDelta(current, -delta),
  WORKS_CARD_COUNT,
  true,
))
```

For every rendered card, derive:

```ts
const centered = Math.abs(offset) < 0.001
```

Use `centered` in the article class independently of `projectCard`:

```tsx
className={`maria-works-deck-card${projectCard ? ' has-project' : ' is-empty'}${centered ? ' is-centered' : ''}${visible ? '' : ' is-hidden'}`}
```

- [ ] **Step 4: Run the focused carousel tests**

Run: `PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`

Expected: PASS.

- [ ] **Step 5: Run full verification**

Run: `PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH pnpm test -- --run`

Expected: all tests PASS.

Run: `PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH pnpm run build`

Expected: TypeScript and Vite build complete successfully.
