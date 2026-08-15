# Works Horizontal Card Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single MTS Pay cover on “Рабочие задачи” with a manually controlled horizontal five-card deck above the existing hand-and-phone image.

**Architecture:** A new focused `WorksCardCarousel` component owns deck state, circular offset calculation, pointer gestures, and side-card selection. `WorksPage` continues to own the presentation modal and passes its existing `onOpen` callback into the carousel; `ConceptProject` remains the only project-bearing card. CSS custom properties map each card offset to layered horizontal transforms, perspective, opacity, hover rotation, responsive geometry, and reduced-motion behavior.

**Tech Stack:** React, TypeScript, CSS, Testing Library, Vitest, Vite

## Global Constraints

- Render five visible cards: one center card, two left cards, and two right cards.
- Only MTS Pay contains project content and may open the existing presentation modal.
- Four empty cards contain no project links or modal-opening action.
- No automatic carousel rotation or timer.
- Navigation is manual through horizontal swipe, pointer drag, and side-card click/tap.
- Keep the page locked to one viewport with no horizontal or vertical page scroll.
- Keep the existing hand-and-phone asset, presentation iframe, modal dimensions, fixed navigation, language controls, and theme controls unchanged.
- Add no dependencies or third-party carousel library.

---

### Task 1: Deck Geometry and Gesture Helpers

**Files:**
- Create: `src/maria/WorksCardCarousel.tsx`
- Create: `src/maria/WorksCardCarousel.test.tsx`

**Interfaces:**
- Produces: `WORKS_CARD_COUNT: 5`
- Produces: `WORKS_SWIPE_THRESHOLD_PX: 42`
- Produces: `worksDeckOffset(index: number, active: number, count?: number): number`
- Produces: `activeWorksIndexAfterSwipe(active: number, deltaX: number, count?: number, threshold?: number): number`
- Produces: `worksDeckPose(offset: number): { scale: number; opacity: number; rotateY: number; rotateZ: number; layer: number }`

- [ ] **Step 1: Write failing helper tests**

Create `src/maria/WorksCardCarousel.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest'
import {
  WORKS_CARD_COUNT,
  WORKS_SWIPE_THRESHOLD_PX,
  activeWorksIndexAfterSwipe,
  worksDeckOffset,
  worksDeckPose,
} from './WorksCardCarousel'

describe('works card deck geometry', () => {
  it('maps five cards to a circular horizontal deck', () => {
    expect(WORKS_CARD_COUNT).toBe(5)
    expect(worksDeckOffset(2, 2)).toBe(0)
    expect(worksDeckOffset(0, 4)).toBe(1)
    expect(worksDeckOffset(4, 0)).toBe(-1)
    expect(worksDeckOffset(0, 2)).toBe(-2)
    expect(worksDeckOffset(4, 2)).toBe(2)
  })

  it('changes index only after a horizontal swipe threshold', () => {
    expect(WORKS_SWIPE_THRESHOLD_PX).toBe(42)
    expect(activeWorksIndexAfterSwipe(2, -41)).toBe(2)
    expect(activeWorksIndexAfterSwipe(2, -60)).toBe(3)
    expect(activeWorksIndexAfterSwipe(2, 60)).toBe(1)
    expect(activeWorksIndexAfterSwipe(4, -60)).toBe(0)
    expect(activeWorksIndexAfterSwipe(0, 60)).toBe(4)
  })

  it('tilts, fades, and lowers the layer as cards move away from center', () => {
    expect(worksDeckPose(0)).toEqual({
      scale: 1,
      opacity: 1,
      rotateY: 0,
      rotateZ: 0,
      layer: 5,
    })
    expect(worksDeckPose(1)).toEqual({
      scale: 0.86,
      opacity: 0.72,
      rotateY: -28,
      rotateZ: 4,
      layer: 4,
    })
    expect(worksDeckPose(-1)).toEqual({
      scale: 0.86,
      opacity: 0.72,
      rotateY: 28,
      rotateZ: -4,
      layer: 4,
    })
    expect(worksDeckPose(2).layer).toBe(3)
    expect(worksDeckPose(2).opacity).toBe(0.4)
  })
})
```

- [ ] **Step 2: Run helper tests to verify RED**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: FAIL because `WorksCardCarousel.tsx` and its exports do not exist.

- [ ] **Step 3: Implement the minimal geometry helpers**

Create `src/maria/WorksCardCarousel.tsx` with:

```tsx
import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import ConceptProject from './ConceptProject'
import type { Language } from './i18n'

export const WORKS_CARD_COUNT = 5
export const WORKS_SWIPE_THRESHOLD_PX = 42
const PROJECT_INDEX = 2

export type WorksDeckPose = {
  scale: number
  opacity: number
  rotateY: number
  rotateZ: number
  layer: number
}

export function worksDeckOffset(index: number, active: number, count = WORKS_CARD_COUNT) {
  let offset = index - active
  const half = Math.floor(count / 2)
  if (offset > half) offset -= count
  if (offset < -half) offset += count
  return offset
}

export function activeWorksIndexAfterSwipe(
  active: number,
  deltaX: number,
  count = WORKS_CARD_COUNT,
  threshold = WORKS_SWIPE_THRESHOLD_PX,
) {
  if (Math.abs(deltaX) < threshold) return active
  const direction = deltaX < 0 ? 1 : -1
  return (active + direction + count) % count
}

export function worksDeckPose(offset: number): WorksDeckPose {
  const distance = Math.abs(offset)
  const direction = Math.sign(offset)
  if (distance === 0) return { scale: 1, opacity: 1, rotateY: 0, rotateZ: 0, layer: 5 }
  if (distance === 1) {
    return {
      scale: 0.86,
      opacity: 0.72,
      rotateY: -28 * direction,
      rotateZ: 4 * direction,
      layer: 4,
    }
  }
  return {
    scale: 0.7,
    opacity: 0.4,
    rotateY: -44 * direction,
    rotateZ: 7 * direction,
    layer: 3,
  }
}
```

Do not add timers or effects.

- [ ] **Step 4: Run helper tests to verify GREEN**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: 3 tests PASS.

---

### Task 2: Carousel Rendering and Manual Navigation

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`

**Interfaces:**
- Consumes: `ConceptProject({ onOpen, language })`
- Produces: `WorksCardCarousel({ onOpen, language }: { onOpen: () => void; language: Language })`
- Produces: `.maria-works-carousel`, five `.maria-works-deck-card` items, four `.maria-works-deck-card__empty` shells

- [ ] **Step 1: Add failing component behavior tests**

Append to `src/maria/WorksCardCarousel.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import WorksCardCarousel from './WorksCardCarousel'

describe('WorksCardCarousel', () => {
  it('renders one project card and four empty decorative cards', () => {
    const onOpen = vi.fn()
    const { container } = render(<WorksCardCarousel onOpen={onOpen} language="ru" />)
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
    const cards = container.querySelectorAll('.maria-works-deck-card')

    expect(carousel).toBeInTheDocument()
    expect(cards).toHaveLength(5)
    expect(screen.getByRole('button', { name: 'Открыть презентацию «МТС Финтех. Концепт»' })).toBeInTheDocument()
    expect(container.querySelectorAll('.maria-works-deck-card__empty[aria-hidden="true"]')).toHaveLength(4)
    expect(container.querySelectorAll('.maria-works-deck-card__empty a')).toHaveLength(0)
    expect(container.querySelectorAll('.maria-works-deck-card__empty button')).toHaveLength(0)
    expect(cards[2]).toHaveAttribute('data-offset', '0')
  })

  it('centers side cards by click and pointer swipe without opening the project', () => {
    const onOpen = vi.fn()
    const { container } = render(<WorksCardCarousel onOpen={onOpen} language="ru" />)
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
    const cards = container.querySelectorAll<HTMLElement>('.maria-works-deck-card')

    fireEvent.click(cards[3])
    expect(cards[3]).toHaveAttribute('data-offset', '0')
    expect(onOpen).not.toHaveBeenCalled()

    fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 210 })
    fireEvent.pointerUp(carousel, { pointerId: 1, clientX: 130 })
    expect(cards[4]).toHaveAttribute('data-offset', '0')
    expect(onOpen).not.toHaveBeenCalled()

    fireEvent.pointerDown(carousel, { pointerId: 2, clientX: 200 })
    fireEvent.pointerUp(carousel, { pointerId: 2, clientX: 180 })
    expect(cards[4]).toHaveAttribute('data-offset', '0')
  })

  it('first centers the project from the side and opens it only when active', () => {
    const onOpen = vi.fn()
    render(<WorksCardCarousel onOpen={onOpen} language="ru" />)
    const project = screen.getByRole('button', { name: 'Открыть презентацию «МТС Финтех. Концепт»' })
    const projectShell = project.closest('.maria-works-deck-card')
    const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })

    fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 200 })
    fireEvent.pointerUp(carousel, { pointerId: 1, clientX: 120 })
    expect(projectShell).not.toHaveAttribute('data-offset', '0')

    fireEvent.click(project)
    expect(projectShell).toHaveAttribute('data-offset', '0')
    expect(onOpen).not.toHaveBeenCalled()

    fireEvent.click(project)
    expect(onOpen).toHaveBeenCalledTimes(1)
  })
})
```

Merge the React and Vitest imports so each module has only one import per package.

- [ ] **Step 2: Run component tests to verify RED**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: FAIL because the default component and carousel markup are missing.

- [ ] **Step 3: Implement manual carousel behavior**

Complete `WorksCardCarousel.tsx` with this component after the helper functions:

```tsx
type WorksCardCarouselProps = {
  onOpen: () => void
  language: Language
}

export default function WorksCardCarousel({ onOpen, language }: WorksCardCarouselProps) {
  const [active, setActive] = useState(PROJECT_INDEX)
  const pointerStartX = useRef<number | null>(null)
  const suppressClick = useRef(false)

  const beginSwipe = (event: ReactPointerEvent<HTMLElement>) => {
    pointerStartX.current = event.clientX
    suppressClick.current = false
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const finishSwipe = (event: ReactPointerEvent<HTMLElement>) => {
    if (pointerStartX.current === null) return
    const deltaX = event.clientX - pointerStartX.current
    suppressClick.current = Math.abs(deltaX) >= WORKS_SWIPE_THRESHOLD_PX
    setActive((current) => activeWorksIndexAfterSwipe(current, deltaX))
    pointerStartX.current = null
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  const cancelSwipe = () => {
    pointerStartX.current = null
    suppressClick.current = false
  }

  return <section
    className="maria-works-carousel"
    aria-label={language === 'ru' ? 'Карусель рабочих проектов' : 'Work project carousel'}
    onPointerDown={beginSwipe}
    onPointerUp={finishSwipe}
    onPointerCancel={cancelSwipe}
    onClickCapture={(event) => {
      if (suppressClick.current) {
        event.preventDefault()
        event.stopPropagation()
        suppressClick.current = false
        return
      }
      const shell = (event.target as HTMLElement).closest<HTMLElement>('.maria-works-deck-card')
      if (!shell) return
      const index = Number(shell.dataset.index)
      if (index === active) return
      event.preventDefault()
      event.stopPropagation()
      setActive(index)
    }}
  >
    {Array.from({ length: WORKS_CARD_COUNT }, (_, index) => {
      const offset = worksDeckOffset(index, active)
      const pose = worksDeckPose(offset)
      const projectCard = index === PROJECT_INDEX
      return <article
        className={`maria-works-deck-card${offset === 0 ? ' is-active' : ''}${projectCard ? ' has-project' : ' is-empty'}`}
        data-index={index}
        data-offset={offset}
        data-layer={pose.layer}
        key={index}
        style={{
          '--works-deck-scale': pose.scale,
          '--works-deck-opacity': pose.opacity,
          '--works-deck-rotate-y': `${pose.rotateY}deg`,
          '--works-deck-rotate-z': `${pose.rotateZ}deg`,
          '--works-deck-layer': pose.layer,
        } as CSSProperties}
      >
        {projectCard
          ? <ConceptProject onOpen={onOpen} language={language} />
          : <div className="maria-works-deck-card__empty" aria-hidden="true" />}
      </article>
    })}
  </section>
}
```

- [ ] **Step 4: Run component tests to verify GREEN**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/maria/WorksCardCarousel.test.tsx
```

Expected: all helper and component tests PASS.

---

### Task 3: Integrate the Deck into the Works Page

**Files:**
- Modify: `src/maria/WorksPage.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `WorksCardCarousel({ onOpen, language })`
- Preserves: `PresentationModal({ open, onClose, language })`

- [ ] **Step 1: Update the existing route test first**

In the “opens Work Projects as a separate route” test in `src/App.test.tsx`, replace the old `.maria-works-grid` assertion with:

```tsx
const carousel = screen.getByRole('region', { name: 'Карусель рабочих проектов' })
expect(container.querySelector('.maria-works-page')).toContainElement(carousel)
expect(carousel.querySelectorAll('.maria-works-deck-card')).toHaveLength(5)
expect(carousel.querySelectorAll('.maria-works-deck-card__empty[aria-hidden="true"]')).toHaveLength(4)
expect(carousel).toContainElement(cover)
expect(container.querySelector('.maria-works-grid')).not.toBeInTheDocument()
```

Keep the existing hand, modal trigger, fixed navigation, and fixed controls assertions.

- [ ] **Step 2: Run the route test to verify RED**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/App.test.tsx -t "opens Work Projects"
```

Expected: FAIL because `WorksPage` still renders `.maria-works-grid`.

- [ ] **Step 3: Replace the single-card grid**

Update imports in `src/maria/WorksPage.tsx`:

```tsx
import WorksCardCarousel from './WorksCardCarousel'
```

Remove the direct `ConceptProject` import. Replace:

```tsx
<section className="maria-works-grid" aria-label={copy.worksLabel}>
  <ConceptProject onOpen={() => setPresentationOpen(true)} language={language} />
</section>
```

with:

```tsx
<WorksCardCarousel onOpen={() => setPresentationOpen(true)} language={language} />
```

Do not change modal state, the hand asset, back navigation, or page wrapper.

- [ ] **Step 4: Run the route and modal tests**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/App.test.tsx -t "Work Projects|complete Figma presentation"
```

Expected: both tests PASS.

---

### Task 4: Horizontal Deck Styling and Hover Turn

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `.maria-works-carousel`, `.maria-works-deck-card`, `data-offset`, `.is-active`, `.has-project`, `.is-empty`
- Preserves: `.presentation-modal` and `.maria-works-hand`

- [ ] **Step 1: Write failing CSS contract tests**

Add to `src/styles.test.js`:

```js
describe('works horizontal card deck', () => {
  it('layers a manual horizontal deck above the phone with hover and mobile states', () => {
    expect(styles).toContain('.maria-works-carousel{position:absolute;z-index:3;')
    expect(styles).toContain('perspective:1400px')
    expect(styles).toContain('.maria-works-deck-card[data-offset="0"]')
    expect(styles).toContain('.maria-works-deck-card[data-offset="1"]')
    expect(styles).toContain('.maria-works-deck-card[data-offset="-1"]')
    expect(styles).toContain('.maria-works-deck-card[data-offset="2"]')
    expect(styles).toContain('.maria-works-deck-card[data-offset="-2"]')
    expect(styles).toContain('@media(hover:hover) and (pointer:fine)')
    expect(styles).toContain('.maria-works-deck-card:not(.is-active):hover')
    expect(styles).toContain('.maria-works-deck-card.is-active.has-project:hover')
    expect(styles).toContain('backdrop-filter:blur(18px) saturate(1.16)')
    expect(styles).toContain('@media(max-width:600px)')
    expect(styles).toContain('@media(prefers-reduced-motion:reduce)')
    expect(styles).toContain('.maria-works-deck-card{transition:none}')
  })
})
```

Update the existing works-page test:

```js
expect(styles).not.toContain('.maria-works-grid{')
expect(styles).toContain('.maria-works-hand{position:absolute;z-index:1;right:0;')
expect(styles).toContain('.maria-works-carousel')
expect(styles).toContain('.presentation-modal>iframe{width:min(92vw,calc(92vh * 1.7777778),1920px)')
```

- [ ] **Step 2: Run CSS tests to verify RED**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/styles.test.js
```

Expected: FAIL because deck styles are absent and `.maria-works-grid` still exists.

- [ ] **Step 3: Replace the old works grid and project sizing**

Remove:

```css
.maria-works-grid{position:relative;z-index:2;min-height:calc(100svh - 240px);display:grid;place-items:center}
.maria-works-page .concept-cover{width:min(660px,50%)}
```

Add:

```css
.maria-works-carousel{position:absolute;z-index:3;left:0;right:0;top:17vh;height:58vh;overflow:visible;perspective:1400px;touch-action:none}
.maria-works-deck-card{position:absolute;left:50%;top:50%;width:clamp(280px,32vw,590px);aspect-ratio:16/9;overflow:hidden;border:1px solid rgba(255,255,255,.62);border-radius:clamp(24px,3vw,48px);background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,220,237,.12));box-shadow:inset 0 1px rgba(255,255,255,.68),0 30px 70px rgba(54,31,45,.18);backdrop-filter:blur(18px) saturate(1.16);-webkit-backdrop-filter:blur(18px) saturate(1.16);opacity:var(--works-deck-opacity);z-index:var(--works-deck-layer);transform-style:preserve-3d;will-change:transform,opacity;transition:transform .68s cubic-bezier(.2,.78,.18,1),opacity .45s ease,box-shadow .3s ease,background .3s ease}
.maria-works-deck-card .concept-cover{width:100%;height:100%;border:0;border-radius:inherit;box-shadow:none}
.maria-works-deck-card__empty{position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,255,255,.2),transparent 42%,rgba(255,178,217,.1))}
.theme-dark .maria-works-deck-card{border-color:rgba(255,220,238,.3);background:linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,65,161,.07));box-shadow:inset 0 1px rgba(255,255,255,.25),0 32px 76px rgba(0,0,0,.27)}
```

- [ ] **Step 4: Add the five horizontal poses**

Add:

```css
.maria-works-deck-card[data-offset="0"]{transform:translate3d(-50%,-50%,90px) rotateY(0) rotateZ(0) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="1"]{transform:translate3d(calc(-50% + clamp(220px,29vw,500px)),-50%,10px) rotateY(var(--works-deck-rotate-y)) rotateZ(var(--works-deck-rotate-z)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="-1"]{transform:translate3d(calc(-50% - clamp(220px,29vw,500px)),-50%,10px) rotateY(var(--works-deck-rotate-y)) rotateZ(var(--works-deck-rotate-z)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="2"]{transform:translate3d(calc(-50% + clamp(350px,47vw,780px)),-50%,-80px) rotateY(var(--works-deck-rotate-y)) rotateZ(var(--works-deck-rotate-z)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="-2"]{transform:translate3d(calc(-50% - clamp(350px,47vw,780px)),-50%,-80px) rotateY(var(--works-deck-rotate-y)) rotateZ(var(--works-deck-rotate-z)) scale(var(--works-deck-scale))}
```

The carousel is allowed to overlap the hand visually, but `.maria-works-page` and `.maria-subpage` must retain `overflow:hidden`.

- [ ] **Step 5: Add hover/focus deck opening**

Add:

```css
@media(hover:hover) and (pointer:fine){
  .maria-works-deck-card:not(.is-active):hover{
    opacity:.94;
    filter:saturate(1.08);
    box-shadow:inset 0 1px rgba(255,255,255,.82),0 38px 85px rgba(54,31,45,.24);
  }
  .maria-works-deck-card[data-offset="1"]:hover{transform:translate3d(calc(-50% + clamp(205px,27vw,460px)),-53%,100px) rotateY(-7deg) rotateZ(1deg) scale(.94)}
  .maria-works-deck-card[data-offset="-1"]:hover{transform:translate3d(calc(-50% - clamp(205px,27vw,460px)),-53%,100px) rotateY(7deg) rotateZ(-1deg) scale(.94)}
  .maria-works-deck-card[data-offset="2"]:hover{transform:translate3d(calc(-50% + clamp(325px,43vw,720px)),-52%,30px) rotateY(-15deg) rotateZ(2deg) scale(.8)}
  .maria-works-deck-card[data-offset="-2"]:hover{transform:translate3d(calc(-50% - clamp(325px,43vw,720px)),-52%,30px) rotateY(15deg) rotateZ(-2deg) scale(.8)}
  .maria-works-deck-card.is-active.has-project:hover{transform:translate3d(-50%,-54%,110px) rotateY(0) rotateZ(0) scale(1.015)}
}
.maria-works-deck-card:focus-within{box-shadow:inset 0 1px rgba(255,255,255,.82),0 0 0 3px var(--pink),0 38px 85px rgba(54,31,45,.24)}
```

- [ ] **Step 6: Add mobile and reduced-motion rules**

Inside the existing `@media(max-width:600px)` block add:

```css
.maria-works-carousel{top:19vh;height:53vh}
.maria-works-deck-card{width:74vw;border-radius:22px}
.maria-works-deck-card[data-offset="1"]{transform:translate3d(calc(-50% + 56vw),-50%,0) rotateY(var(--works-deck-rotate-y)) rotateZ(var(--works-deck-rotate-z)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="-1"]{transform:translate3d(calc(-50% - 56vw),-50%,0) rotateY(var(--works-deck-rotate-y)) rotateZ(var(--works-deck-rotate-z)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="2"]{transform:translate3d(calc(-50% + 88vw),-50%,-60px) rotateY(var(--works-deck-rotate-y)) rotateZ(var(--works-deck-rotate-z)) scale(var(--works-deck-scale))}
.maria-works-deck-card[data-offset="-2"]{transform:translate3d(calc(-50% - 88vw),-50%,-60px) rotateY(var(--works-deck-rotate-y)) rotateZ(var(--works-deck-rotate-z)) scale(var(--works-deck-scale))}
```

Change the existing mobile `.maria-works-page .concept-cover{width:72%}` rule to:

```css
.maria-works-deck-card .concept-cover{width:100%}
```

Extend the existing reduced-motion media rule:

```css
@media(prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *{scroll-behavior:auto!important;transition:none!important}
  .maria-model-float{animation:none}
  .maria-works-deck-card{transition:none}
}
```

- [ ] **Step 7: Run CSS and component tests**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/styles.test.js src/maria/WorksCardCarousel.test.tsx src/App.test.tsx
```

Expected: all tests PASS.

---

### Task 5: Full Verification

**Files:**
- Verify: `src/maria/WorksCardCarousel.tsx`
- Verify: `src/maria/WorksPage.tsx`
- Verify: `src/styles.css`
- Verify: `src/App.test.tsx`
- Verify: `src/maria/WorksCardCarousel.test.tsx`
- Verify: `src/styles.test.js`

**Interfaces:**
- Verifies all interfaces and constraints produced by Tasks 1–4.

- [ ] **Step 1: Run the full automated suite**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm test -- --run
```

Expected: every test file passes with zero failed tests.

- [ ] **Step 2: Run the production build**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm build
```

Expected: TypeScript and Vite complete with exit code 0; `dist/index.html`, `dist/404.html`, CSS, and JS assets are produced.

- [ ] **Step 3: Verify on localhost**

Open `/works` and check desktop and mobile widths:

1. Five cards form a horizontal layered deck above the hand and phone.
2. The MTS Pay project starts centered and remains the only content-bearing card.
3. The hand and phone remain recognizable behind the deck.
4. Side-card hover turns the card toward the viewer and brings it forward.
5. Active project hover lifts it without changing its size abruptly.
6. Side-card click, mouse drag, and touch swipe navigate one card at a time.
7. A short drag below 42 px does not navigate.
8. No card moves automatically.
9. Clicking MTS Pay while it is off-center only centers it; clicking it while centered opens the unchanged presentation modal.
10. Empty centered cards do not open anything.
11. No page scrollbar appears at any supported viewport.
12. Light and dark themes retain readable card boundaries.

- [ ] **Step 4: Inspect changed files directly**

Because this workspace is not a Git repository, run:

```bash
rg -n "WorksCardCarousel|maria-works-carousel|maria-works-deck-card|WORKS_CARD_COUNT|activeWorksIndexAfterSwipe" src
```

Confirm there is no interval/timer in `WorksCardCarousel.tsx`, no new dependency in `package.json`, and no changes to `PresentationModal.tsx` or the hand asset path.

