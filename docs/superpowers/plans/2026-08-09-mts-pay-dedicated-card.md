# Dedicated MTS Pay Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the MTS Pay carousel item so its supplied artwork visibly extends beyond every project-card container only while that item is centered.

**Architecture:** `ConceptProject` becomes a dedicated button composed of four sibling visual layers, instead of wrapping `WorksProjectCard`. The normal preview clips itself, while the centered full artwork remains a direct child of the unclipped button and therefore can extend beyond the card; the existing carousel state continues to control which artwork is visible.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Change only the `/works` MTS Pay project card and its tests.
- Keep carousel position math, drag, wheel, mobile stacking, entry timing, modal behavior, and `WorksProjectCard` placeholders unchanged.
- Use `/assets/maria/mts-pay-flex-artwork.png` unchanged.
- Add no shadows, dark image background, hover enlargement, or MTS flag to the real project.
- The centered full artwork is `150%` of the normal preview width and must remain unclipped.

---

### Task 1: Replace the shared MTS markup with a dedicated four-layer card

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/ConceptProject.tsx`

**Interfaces:**
- Consumes: `ConceptProject({ onOpen, language })`, existing `.has-project.is-centered` article state, and `/assets/maria/mts-pay-flex-artwork.png`.
- Produces: `.mts-project-card` button with direct sibling children `.mts-project-card__surface`, `.mts-project-card__cropped-artwork`, `.mts-project-card__external-artwork`, and `.mts-project-card__footer`.

- [ ] **Step 1: Write failing structure and behavior tests**

```tsx
const cover = screen.getByRole('button', { name: /MTS Pay/i })
expect(cover).toHaveClass('mts-project-card')
expect(cover.querySelector('.works-project-card')).toBeNull()
expect(cover.querySelector('.concept-cover')).toBeNull()

const directClasses = Array.from(cover.children).map((node) => node.className)
expect(directClasses).toEqual([
  'mts-project-card__surface',
  'mts-project-card__cropped-artwork',
  'mts-project-card__external-artwork',
  'mts-project-card__footer',
])
expect(cover.querySelector('.mts-project-card__external-artwork')?.parentElement).toBe(cover)
expect(cover.querySelectorAll('.works-project-card__mts-flag')).toHaveLength(0)
```

Keep the existing click assertion that activation calls `onOpen`. Update carousel assertions so the real project has the dedicated structure and only the marked placeholder retains its flag.

- [ ] **Step 2: Run focused tests and verify the old shared markup fails**

Run: `npm test -- --run src/App.test.tsx src/maria/WorksCardCarousel.test.tsx`

Expected: FAIL because `ConceptProject` still renders `.concept-cover`, `WorksProjectCard`, and the old external artwork class.

- [ ] **Step 3: Implement the dedicated sibling markup**

Replace the `WorksProjectCard` import and render in `ConceptProject.tsx` with:

```tsx
<button
  type="button"
  className="mts-project-card"
  onClick={onOpen}
  aria-label={language === 'ru' ? 'Открыть презентацию MTS Pay' : 'Open MTS Pay presentation'}
>
  <span className="mts-project-card__surface" aria-hidden="true" />
  <img
    className="mts-project-card__cropped-artwork"
    src="/assets/maria/mts-pay-flex-artwork.png"
    alt=""
    draggable="false"
  />
  <img
    className="mts-project-card__external-artwork"
    src="/assets/maria/mts-pay-flex-artwork.png"
    alt=""
    aria-hidden="true"
    draggable="false"
  />
  <span className="mts-project-card__footer">
    <span className="mts-project-card__file-icon" aria-hidden="true">…existing file SVG…</span>
    <span className="mts-project-card__copy">
      <strong className="mts-project-card__title">{language === 'ru' ? 'Концепт v3 — Преза' : 'Concept v3 — Presentation'}</strong>
      <span className="mts-project-card__meta">{language === 'ru' ? 'Проект · МТС Финтех' : 'Project · MTS Fintech'}</span>
    </span>
  </span>
</button>
```

Copy the existing file SVG paths from `WorksProjectCard` so the footer remains visually consistent. Do not pass or render `mtsFlag` in this component.

- [ ] **Step 4: Run focused component tests**

Run: `npm test -- --run src/App.test.tsx src/maria/WorksCardCarousel.test.tsx`

Expected: PASS.

### Task 2: Establish independent clipped and breakout visual layers

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: the four direct-child classes from Task 1 and `.maria-works-deck-card.has-project.is-centered`.
- Produces: a self-clipped resting preview and an unclipped `150%` centered artwork layer with footer above it.

- [ ] **Step 1: Write failing CSS contract tests**

```js
expect(styles).toContain('.mts-project-card{position:relative;width:100%;height:100%;overflow:visible')
expect(styles).toContain('.mts-project-card__cropped-artwork{position:absolute;z-index:1;')
expect(styles).toContain('clip-path:inset(0 round')
expect(styles).toContain('.mts-project-card__external-artwork{position:absolute;z-index:5;left:50%;top:-20%;width:150%;')
expect(styles).toContain('.mts-project-card__footer{position:absolute;z-index:7;')
expect(styles).toContain('.maria-works-deck-card.has-project.is-centered .mts-project-card__cropped-artwork{opacity:0}')
expect(styles).toContain('.maria-works-deck-card.has-project.is-centered .mts-project-card__external-artwork{opacity:1}')
expect(styles).not.toContain('.concept-cover__external-artwork')
```

Also assert that the dedicated button has no shadow and its hover/focus rules do not transform or resize it.

- [ ] **Step 2: Run the style tests and verify they fail**

Run: `npm test -- --run src/styles.test.js`

Expected: FAIL because the old `.concept-cover__external-artwork` architecture remains.

- [ ] **Step 3: Replace old MTS-only CSS with dedicated layer styles**

Add dedicated rules with these exact visual responsibilities:

```css
.mts-project-card{position:relative;width:100%;height:100%;overflow:visible;padding:0;border:0;border-radius:inherit;background:transparent;box-shadow:none;color:inherit;text-align:left;cursor:pointer}
.mts-project-card__surface{position:absolute;z-index:0;inset:0;overflow:hidden;border-radius:inherit;background:var(--works-card-surface)}
.mts-project-card__cropped-artwork{position:absolute;z-index:1;left:4px;top:4px;width:calc(100% - 8px);height:72%;display:block;object-fit:cover;border-radius:inherit;clip-path:inset(0 round 18px);transition:opacity .14s ease}
.mts-project-card__external-artwork{position:absolute;z-index:5;left:50%;top:-20%;width:150%;height:auto;display:block;object-fit:contain;pointer-events:none;opacity:0;transform:translateX(-50%);transition:opacity .14s ease}
.mts-project-card__footer{position:absolute;z-index:7;left:0;right:0;bottom:0;display:grid;grid-template-columns:28px minmax(0,1fr);align-items:center;gap:9px;padding:9px 7px 5px}
.maria-works-deck-card.has-project.is-centered .mts-project-card__cropped-artwork{opacity:0}
.maria-works-deck-card.has-project.is-centered .mts-project-card__external-artwork{opacity:1}
.mts-project-card:hover,.mts-project-card:focus-visible{transform:none;box-shadow:none}
```

Use the existing light/dark card surface colors and footer typography values already defined for `WorksProjectCard`. Remove `.concept-cover__external-artwork`, the centered `.concept-cover` overflow override, and the old centered generic preview-hiding rule. Add mobile sizing only for the dedicated footer/icon/type where the shared mobile rules no longer apply.

- [ ] **Step 4: Run style and focused component tests**

Run: `npm test -- --run src/styles.test.js src/App.test.tsx src/maria/WorksCardCarousel.test.tsx`

Expected: PASS.

- [ ] **Step 5: Verify the whole project**

Run: `npm test -- --run`

Expected: all tests PASS.

Run: `npm run build`

Expected: TypeScript and Vite production build complete successfully.

- [ ] **Step 6: Inspect the resulting `/works` composition**

Confirm the centered card shows the PNG without a dark image rectangle, the butterfly and Figma logo cross the card edges, the footer stays readable above the image, off-center cards use the cropped version, hover causes no scaling, and clicking still opens the presentation.

