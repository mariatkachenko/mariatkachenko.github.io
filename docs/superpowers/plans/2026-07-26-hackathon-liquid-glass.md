# Hackathon Liquid Glass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a performant liquid-glass treatment to the project cards on the “Хакатоны и хобби” page while preserving the existing carousel layout, motion, sizing, swipe, and click behavior.

**Architecture:** Keep the current React carousel and add one hidden, reusable SVG displacement filter next to its cards. Apply the filter only to each card’s backdrop in capable Chromium browsers, while CSS blur, translucency, chromatic edge light, and specular highlights provide a consistent fallback in Safari, Firefox, and mobile browsers. No new runtime dependency, canvas, or WebGL layer is required.

**Tech Stack:** React, TypeScript, CSS, SVG filters, Vitest, Testing Library, Vite

---

## Task 1: Add the reusable SVG liquid-glass filter

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`

### Step 1: Write the failing component test

Extend the existing hackathon carousel test in `src/App.test.tsx` with assertions that the page renders exactly one hidden filter definition:

```tsx
const liquidFilter = document.querySelector('#hackathon-liquid-glass')

expect(liquidFilter).toBeInTheDocument()
expect(document.querySelectorAll('#hackathon-liquid-glass')).toHaveLength(1)
expect(liquidFilter?.closest('svg')).toHaveAttribute('aria-hidden', 'true')
expect(liquidFilter?.querySelector('feTurbulence')).toBeInTheDocument()
expect(liquidFilter?.querySelector('feColorMatrix')).toBeInTheDocument()
expect(liquidFilter?.querySelector('feDisplacementMap')).toHaveAttribute('scale', '8')
```

Keep these assertions inside the current carousel behavior test so the filter is verified together with the actual page rather than as an isolated implementation detail.

### Step 2: Run the focused test to verify it fails

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/App.test.tsx
```

Expected: FAIL because `#hackathon-liquid-glass` does not exist.

### Step 3: Add the SVG filter definition

Inside the root `<section className="maria-orbit-carousel">` in `src/maria/HackathonOrbitCarousel.tsx`, before rendering the project buttons, add:

```tsx
<svg
  className="maria-liquid-glass-filter"
  width="0"
  height="0"
  aria-hidden="true"
  focusable="false"
>
  <defs>
    <filter
      id="hackathon-liquid-glass"
      x="-20%"
      y="-20%"
      width="140%"
      height="140%"
      colorInterpolationFilters="sRGB"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.008 0.014"
        numOctaves="2"
        seed="7"
        result="liquidNoise"
      />
      <feColorMatrix
        in="liquidNoise"
        type="matrix"
        values="1 0 0 0 0  0 0.75 0 0 0.12  0 0 1 0 0  0 0 0 1 0"
        result="softNoise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softNoise"
        scale="8"
        xChannelSelector="R"
        yChannelSelector="B"
      />
    </filter>
  </defs>
</svg>
```

The filter must remain a sibling of the cards, not repeated inside each card. Do not change any carousel state, transforms, timers, pointer handlers, links, or card data.

### Step 4: Run the focused test to verify it passes

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/App.test.tsx
```

Expected: PASS.

---

## Task 2: Build the cross-browser liquid-glass card surface

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

### Step 1: Write the failing CSS contract tests

Add a `describe('hackathon liquid glass')` block to `src/styles.test.js` that checks the stylesheet for:

```js
expect(styles).toContain('.maria-liquid-glass-filter')
expect(styles).toContain('backdrop-filter:blur(18px) saturate(1.25) brightness(1.04)')
expect(styles).toContain('@supports (backdrop-filter:url("#hackathon-liquid-glass"))')
expect(styles).toContain('backdrop-filter:url("#hackathon-liquid-glass") blur(12px) saturate(1.22) brightness(1.05)')
expect(styles).toContain('inset 1px 0 0 rgba(146,238,255,.28)')
expect(styles).toContain('inset -1px 0 0 rgba(255,112,190,.3)')
expect(styles).toContain('.maria-orbit-card::after')
```

Also assert that the existing mobile media query contains a plain CSS backdrop filter for `.maria-orbit-card`, ensuring the SVG displacement is not used on screens up to 600px:

```js
expect(styles).toMatch(
  /@media\(max-width:600px\)[\s\S]*?\.maria-orbit-card\{[\s\S]*?backdrop-filter:blur\(14px\) saturate\(1\.18\)/
)
```

### Step 2: Run the CSS test to verify it fails

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/styles.test.js
```

Expected: FAIL because the liquid-glass rules are missing.

### Step 3: Add the hidden-filter layout rule

Add near the carousel styles in `src/styles.css`:

```css
.maria-liquid-glass-filter{
  position:absolute;
  width:0;
  height:0;
  overflow:hidden;
  pointer-events:none;
}
```

### Step 4: Replace the card surface with the CSS fallback

Update only the visual surface properties of `.maria-orbit-card`; keep its dimensions, positioning, transforms, opacity calculations, transitions, cursor, and interaction layers unchanged:

```css
.maria-orbit-card{
  border:1px solid rgba(255,255,255,.6);
  background:linear-gradient(145deg,rgba(255,255,255,.24),rgba(255,210,232,.09));
  box-shadow:
    inset 1px 0 0 rgba(146,238,255,.28),
    inset -1px 0 0 rgba(255,112,190,.3),
    inset 0 1px 0 rgba(255,255,255,.72),
    inset 0 -18px 28px rgba(89,40,70,.08),
    0 18px 42px rgba(56,34,48,.16);
  backdrop-filter:blur(18px) saturate(1.25) brightness(1.04);
  -webkit-backdrop-filter:blur(18px) saturate(1.25) brightness(1.04);
}
```

Merge these declarations into the existing rule rather than creating a duplicate rule. Preserve the existing border radius.

### Step 5: Add restrained Fresnel and specular layers

Retain `.maria-orbit-card::before`, but revise it to produce a diagonal white reflection that does not obscure text. Add `.maria-orbit-card::after` for the inner rim and chromatic sheen:

```css
.maria-orbit-card::before{
  content:"";
  position:absolute;
  inset:0;
  z-index:0;
  border-radius:inherit;
  pointer-events:none;
  background:
    linear-gradient(122deg,rgba(255,255,255,.32) 0%,rgba(255,255,255,.06) 28%,transparent 46%),
    radial-gradient(circle at 18% 12%,rgba(255,255,255,.42),transparent 34%);
  opacity:.72;
}

.maria-orbit-card::after{
  content:"";
  position:absolute;
  inset:1px;
  z-index:0;
  border:1px solid rgba(255,255,255,.28);
  border-radius:inherit;
  background:linear-gradient(100deg,rgba(130,235,255,.08),transparent 36%,rgba(255,112,190,.1));
  mix-blend-mode:screen;
  pointer-events:none;
}
```

Confirm existing card content stays at `z-index:1` or higher. Keep the settings control above it at its current higher layer.

### Step 6: Add active-card and dark-theme tuning

Make the active card slightly clearer and brighter without changing its scale:

```css
.maria-orbit-card.is-active{
  border-color:rgba(255,255,255,.78);
  background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,210,232,.11));
  box-shadow:
    inset 1px 0 0 rgba(146,238,255,.36),
    inset -1px 0 0 rgba(255,112,190,.38),
    inset 0 1px 0 rgba(255,255,255,.82),
    inset 0 -18px 30px rgba(89,40,70,.07),
    0 22px 52px rgba(74,42,62,.2);
}
```

Update the existing dark-theme card rules to use the same optical model with lower white fill and a restrained luminous pink rim. Do not darken the cards into opaque panels:

```css
.theme-dark .maria-orbit-card{
  border-color:rgba(255,255,255,.27);
  background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,66,166,.055));
  box-shadow:
    inset 1px 0 0 rgba(119,221,255,.22),
    inset -1px 0 0 rgba(255,74,174,.34),
    inset 0 1px 0 rgba(255,255,255,.3),
    inset 0 -20px 32px rgba(0,0,0,.11),
    0 20px 48px rgba(0,0,0,.24);
}
```

### Step 7: Enable SVG displacement only when supported

Place this block after the base card styles but before the mobile media rules:

```css
@supports (backdrop-filter:url("#hackathon-liquid-glass")){
  .maria-orbit-card{
    backdrop-filter:url("#hackathon-liquid-glass") blur(12px) saturate(1.22) brightness(1.05);
  }
}
```

Do not apply the SVG filter to the card element itself through `filter`; that would distort the text and controls.

### Step 8: Keep mobile on the lightweight fallback

Within the existing `@media(max-width:600px)` block, add or retain:

```css
.maria-orbit-card{
  backdrop-filter:blur(14px) saturate(1.18);
  -webkit-backdrop-filter:blur(14px) saturate(1.18);
}
```

Because this rule appears after the `@supports` block, it must override the displacement variant on mobile without changing card size or carousel geometry.

### Step 9: Run the focused tests

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm vitest run src/styles.test.js src/App.test.tsx
```

Expected: PASS.

---

## Task 3: Verify behavior, build output, and visual regressions

**Files:**
- Verify: `src/maria/HackathonOrbitCarousel.tsx`
- Verify: `src/styles.css`
- Verify: `src/App.test.tsx`
- Verify: `src/styles.test.js`

### Step 1: Run the full automated test suite

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm test -- --run
```

Expected: all tests pass.

### Step 2: Run the production build

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm build
```

Expected: TypeScript and Vite build complete without errors.

### Step 3: Perform browser verification on localhost

Open the “Хакатоны и хобби” route on the current localhost build and verify:

1. Cards remain semi-transparent and show the page behind them.
2. Chromium shows subtle refraction near card surfaces, without visible warping of card text.
3. The center card is marginally brighter, but its size and position are unchanged.
4. Side cards retain their existing scale, tilt, opacity, and back/front stacking.
5. Automatic rotation, click navigation, manual swipe, and project links still work.
6. Dark theme uses a restrained glowing pink edge without making the cards opaque.
7. At viewport widths up to 600px, interaction remains smooth and cards use blur/highlights without SVG displacement.
8. No horizontal or vertical page scroll is introduced.

### Step 4: Inspect the final diff

Run:

```bash
git diff -- src/maria/HackathonOrbitCarousel.tsx src/styles.css src/App.test.tsx src/styles.test.js
```

If the workspace is not a Git repository, inspect the four files directly with `sed` and `rg`. Confirm no dependencies, carousel geometry, routing, or project data were changed.

