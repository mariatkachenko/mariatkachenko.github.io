# MTS Pay Card Artwork Hover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the MTS Pay cover and make only that artwork expand to 118% beyond the card crop on hover or keyboard focus, without shadows or other visual additions.

**Architecture:** Keep the existing cropped preview image as the resting layer. Add an opt-in breakout artwork layer to `WorksProjectCard`; only `ConceptProject` enables it. The breakout layer uses the same asset with `object-fit: contain`, appears above the preview on fine-pointer hover or focus, and can extend beyond the card while the footer and MTS flag remain above it.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Change only the MTS Pay project card on `/works`.
- Use the supplied PNG unchanged as the runtime artwork.
- Hover/focus enlargement is exactly `118%`.
- Do not add shadows, glow, tilt, rotation, or additional motion effects.
- Do not change carousel geometry, copy, MTS flag behavior, presentation modal, home page, `/hackathons`, or other project cards.
- Touch devices keep the cropped resting state.
- `prefers-reduced-motion` removes or minimizes the transition without removing the resting or expanded visual state.

---

### Task 1: Add the MTS Pay breakout artwork contract

**Files:**
- Create: `public/assets/maria/mts-pay-flex-artwork.png`
- Modify: `src/App.test.tsx:190-205`
- Modify: `src/maria/WorksCardCarousel.test.tsx:130-205`
- Modify: `src/maria/WorksProjectCard.tsx:1-47`
- Modify: `src/maria/ConceptProject.tsx:9-26`

**Interfaces:**
- Consumes: existing `WorksProjectCardProps`, `ConceptProject`, and supplied PNG at `/var/folders/ck/cfkrws29783_w4l2m0dqcbs80000gn/T/codex-clipboard-64f0ddc8-50d4-42d3-aaf0-8d1a77cd60b9.png`.
- Produces: optional `breakoutArtwork?: boolean` prop; `.has-breakout-artwork` card class; `.works-project-card__breakout-artwork` decorative image; `/assets/maria/mts-pay-flex-artwork.png` runtime asset.

- [ ] **Step 1: Add failing component assertions**

Update the `/works` route test in `src/App.test.tsx`:

```tsx
expect(cover.querySelector('img.concept-cover__image')).toHaveAttribute(
  'src',
  '/assets/maria/mts-pay-flex-artwork.png',
)
expect(cover.querySelector('.works-project-card')).toHaveClass('has-breakout-artwork')
expect(cover.querySelector('.works-project-card__breakout-artwork')).toHaveAttribute(
  'src',
  '/assets/maria/mts-pay-flex-artwork.png',
)
```

Update the carousel card test in `src/maria/WorksCardCarousel.test.tsx` so it proves only the real project owns the breakout layer:

```tsx
expect(cards[WORKS_PROJECT_INDEX].querySelectorAll('.works-project-card__breakout-artwork')).toHaveLength(1)
expect(container.querySelectorAll('.works-project-card__breakout-artwork')).toHaveLength(1)
```

Replace the old expected MTS cover URL with `/assets/maria/mts-pay-flex-artwork.png`.

- [ ] **Step 2: Run the targeted tests and verify RED**

Run:

```bash
./node_modules/.bin/vitest run src/App.test.tsx src/maria/WorksCardCarousel.test.tsx
```

Expected: FAIL because the new asset URL, opt-in class, and breakout artwork layer do not exist.

- [ ] **Step 3: Copy the supplied artwork unchanged**

Copy the PNG byte-for-byte to:

```text
public/assets/maria/mts-pay-flex-artwork.png
```

Verify the source and destination checksums match:

```bash
shasum -a 256 /var/folders/ck/cfkrws29783_w4l2m0dqcbs80000gn/T/codex-clipboard-64f0ddc8-50d4-42d3-aaf0-8d1a77cd60b9.png public/assets/maria/mts-pay-flex-artwork.png
```

- [ ] **Step 4: Add the opt-in breakout layer**

Extend `WorksProjectCardProps` and the component:

```tsx
type WorksProjectCardProps = {
  title: string
  meta: string
  imageSrc?: string
  imagePosition?: string
  placeholder?: boolean
  mtsFlag?: boolean
  breakoutArtwork?: boolean
}

export default function WorksProjectCard({
  title,
  meta,
  imageSrc,
  imagePosition = 'center',
  placeholder = false,
  mtsFlag = false,
  breakoutArtwork = false,
}: WorksProjectCardProps) {
  return <div className={`works-project-card${placeholder ? ' is-placeholder' : ''}${breakoutArtwork ? ' has-breakout-artwork' : ''}`}>
    {breakoutArtwork && imageSrc && <img
      className="works-project-card__breakout-artwork"
      src={imageSrc}
      alt=""
      aria-hidden="true"
      draggable="false"
    />}
    {/* Keep the existing flag, preview, and footer unchanged. */}
  </div>
}
```

In `ConceptProject`, use the new asset and enable the layer:

```tsx
<WorksProjectCard
  title={language === 'ru' ? 'Концепт v3 — Преза' : 'Concept v3 — Presentation'}
  meta={language === 'ru' ? 'Проект · МТС Финтех' : 'Project · MTS Fintech'}
  imageSrc="/assets/maria/mts-pay-flex-artwork.png"
  mtsFlag
  breakoutArtwork
/>
```

- [ ] **Step 5: Run targeted tests and verify GREEN**

Run:

```bash
./node_modules/.bin/vitest run src/App.test.tsx src/maria/WorksCardCarousel.test.tsx
```

Expected: both files PASS.

- [ ] **Step 6: Commit the component contract if Git metadata is available**

```bash
git add public/assets/maria/mts-pay-flex-artwork.png src/App.test.tsx src/maria/WorksCardCarousel.test.tsx src/maria/WorksProjectCard.tsx src/maria/ConceptProject.tsx
git commit -m "feat: add MTS Pay breakout artwork"
```

If this workspace still has no `.git` metadata, record that fact and continue without a commit.

---

### Task 2: Add the restrained 118% breakout interaction

**Files:**
- Modify: `src/styles.test.js:255-335`
- Modify: `src/styles.css:138-161`
- Modify: `src/styles.css:217-225`
- Modify: `src/styles.css:228-230`

**Interfaces:**
- Consumes: `.has-breakout-artwork` and `.works-project-card__breakout-artwork` from Task 1.
- Produces: cropped resting state, fine-pointer hover/focus breakout state, touch-safe fallback, and reduced-motion transition override.

- [ ] **Step 1: Add failing visual-contract assertions**

Add one focused test to the `works responsive card deck` block in `src/styles.test.js`:

```js
it('lets only the MTS artwork break out at 118 percent without added shadow', () => {
  expect(styles).toContain('.works-project-card__breakout-artwork{')
  expect(styles).toContain('object-fit:contain')
  expect(styles).toContain('transform:scale(1)')
  expect(styles).toContain('.maria-works-deck-card:hover .works-project-card.has-breakout-artwork')
  expect(styles).toContain('.maria-works-deck-card:focus-within .works-project-card.has-breakout-artwork')
  expect(styles).toContain('transform:scale(1.18);opacity:1')
  expect(styles).toContain('.has-breakout-artwork .works-project-card__footer{position:relative;z-index:7}')
  expect(styles).not.toContain('works-project-card__breakout-artwork{filter:drop-shadow')
  expect(styles).not.toContain('works-project-card__breakout-artwork{box-shadow')
})
```

- [ ] **Step 2: Run the CSS test and verify RED**

Run:

```bash
./node_modules/.bin/vitest run src/styles.test.js
```

Expected: FAIL because breakout artwork styles and interaction selectors do not exist.

- [ ] **Step 3: Implement the resting layer**

Add styles adjacent to the existing works-card rules:

```css
.works-project-card__breakout-artwork{position:absolute;z-index:5;left:0;top:0;width:100%;height:auto;aspect-ratio:16/9;display:block;object-fit:contain;object-position:center;opacity:0;pointer-events:none;transform:scale(1);transform-origin:center center;transition:transform .26s cubic-bezier(.2,.82,.25,1),opacity .14s ease}
.has-breakout-artwork .works-project-card__footer{position:relative;z-index:7}
```

The original preview remains cropped by `.works-project-card__preview`; the new layer is invisible at rest.

- [ ] **Step 4: Implement hover and keyboard focus without shadows**

Inside the existing `@media(hover:hover) and (pointer:fine)` block, add:

```css
.maria-works-deck-card:hover .works-project-card.has-breakout-artwork,.maria-works-deck-card:focus-within .works-project-card.has-breakout-artwork{overflow:visible;clip-path:none}
.maria-works-deck-card:hover .works-project-card.has-breakout-artwork .works-project-card__preview,.maria-works-deck-card:focus-within .works-project-card.has-breakout-artwork .works-project-card__preview{opacity:0}
.maria-works-deck-card:hover .works-project-card__breakout-artwork,.maria-works-deck-card:focus-within .works-project-card__breakout-artwork{transform:scale(1.18);opacity:1}
```

Do not add `filter`, `box-shadow`, rotation, or translation to the breakout artwork.

- [ ] **Step 5: Preserve reduced-motion behavior**

Inside the existing `@media(prefers-reduced-motion:reduce)` block, add:

```css
.works-project-card__breakout-artwork{transition:none}
```

- [ ] **Step 6: Run targeted style and component tests**

Run:

```bash
./node_modules/.bin/vitest run src/styles.test.js src/App.test.tsx src/maria/WorksCardCarousel.test.tsx
```

Expected: all targeted tests PASS.

- [ ] **Step 7: Commit the interaction if Git metadata is available**

```bash
git add src/styles.css src/styles.test.js
git commit -m "feat: animate MTS Pay artwork beyond card frame"
```

If this workspace still has no `.git` metadata, record that fact and continue without a commit.

---

### Task 3: Verify the finished `/works` card

**Files:**
- Verify: `public/assets/maria/mts-pay-flex-artwork.png`
- Verify: `src/maria/ConceptProject.tsx`
- Verify: `src/maria/WorksProjectCard.tsx`
- Verify: `src/styles.css`

**Interfaces:**
- Consumes: the completed asset, component, and CSS changes from Tasks 1–2.
- Produces: fresh evidence that the requested visual behavior is integrated without regressions.

- [ ] **Step 1: Verify the asset is unchanged**

Run:

```bash
shasum -a 256 /var/folders/ck/cfkrws29783_w4l2m0dqcbs80000gn/T/codex-clipboard-64f0ddc8-50d4-42d3-aaf0-8d1a77cd60b9.png public/assets/maria/mts-pay-flex-artwork.png
```

Expected: identical hashes.

- [ ] **Step 2: Run the complete automated test suite**

Run:

```bash
./node_modules/.bin/vitest run
```

Expected: exit code `0` with no failed test files.

- [ ] **Step 3: Run TypeScript and the production build**

Run:

```bash
./node_modules/.bin/tsc -b
./node_modules/.bin/vite build
```

Expected: both commands exit `0`.

- [ ] **Step 4: Inspect the four visual states**

Open `/works` and verify:

```text
desktop light: cropped at rest; full artwork at 118% on hover; no added shadow
desktop dark: same geometry and no glow or shadow on the artwork
mobile light: cropped resting state; no sticky expanded state
mobile dark: cropped resting state; no sticky expanded state
keyboard focus: same 118% breakout as hover
```

Also confirm the footer and flag remain readable, neighboring cards do not move, and clicking the MTS Pay card still opens the presentation.

- [ ] **Step 5: Record final diff scope**

Confirm the only source/runtime changes are:

```text
public/assets/maria/mts-pay-flex-artwork.png
src/maria/WorksProjectCard.tsx
src/maria/ConceptProject.tsx
src/App.test.tsx
src/maria/WorksCardCarousel.test.tsx
src/styles.css
src/styles.test.js
```

Documentation changes may additionally include this plan and its approved design spec.
