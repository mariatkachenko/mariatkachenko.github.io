# Theme Icons and Mobile Contact Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the text theme glyphs with supplied artwork and restore the compact mobile Contact arrow without reintroducing viewport overflow.

**Architecture:** Keep `FixedChrome` as the single shared interface and preserve its button behavior. Add two small runtime image assets, render them inside the existing theme buttons, and control active state, theme color, sizing, and responsive geometry through shared CSS.

**Tech Stack:** React, TypeScript, CSS, Vitest, PNG assets

## Global Constraints

- Change only `FixedChrome`, its tests, shared chrome styles, and the two supplied icon assets.
- Preserve the current separator, labels, pressed states, theme/language behavior, and route transitions.
- Keep the compact mobile header dimensions that prevent viewport overflow.
- Use `0.34` opacity only for inactive theme buttons.

---

### Task 1: Reference-based theme icons and safe mobile arrow

**Files:**
- Create: `public/assets/maria/theme-sun.png`
- Create: `public/assets/maria/theme-moon.png`
- Modify: `src/maria/FixedChrome.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

**Interfaces:**
- Consumes: existing `theme`, `onThemeChange`, `copy.lightTheme`, and `copy.darkTheme` values.
- Produces: two accessible theme buttons containing decorative images at `/assets/maria/theme-sun.png` and `/assets/maria/theme-moon.png`.

- [ ] **Step 1: Write failing component and CSS tests**

Require each theme button to contain its expected decorative image. Require fixed `24px` icon boxes on desktop, `18px` on mobile, dark-theme inversion, inactive opacity `0.34`, active opacity `1`, and a visible mobile Contact arrow sized at `8px` without changing the restored mobile header typography or avatar.

- [ ] **Step 2: Verify RED**

Run:

```bash
./node_modules/.bin/vitest run src/App.test.tsx src/styles.test.js
```

Expected: FAIL because the component still renders Unicode theme glyphs and CSS still hides the mobile Contact arrow.

- [ ] **Step 3: Add the supplied icon assets**

Copy the standalone `128×128` sun reference to `public/assets/maria/theme-sun.png` and the `76×128` crescent reference to `public/assets/maria/theme-moon.png`. Do not use the combined preview image at runtime.

- [ ] **Step 4: Render decorative icon images**

Replace `☀` and `◐` inside the existing buttons with:

```tsx
<img src="/assets/maria/theme-sun.png" alt="" />
<img src="/assets/maria/theme-moon.png" alt="" />
```

Keep all existing button props and accessible labels.

- [ ] **Step 5: Implement shared and responsive styles**

Set buttons to grid-centered `24px` boxes, images to `max-width:100%;height:24px;object-fit:contain`, and dark-theme images to `filter:invert(1)`. Keep inactive button opacity at `0.34` and active opacity at `1`. At `max-width:600px`, set button boxes and image heights to `18px`, retain the existing `10px` header and `34px` avatar, show the Contact arrow at `8px`, and use a small negative inline margin so it does not expand the grid footprint.

- [ ] **Step 6: Verify GREEN and complete checks**

Run:

```bash
./node_modules/.bin/vitest run src/App.test.tsx src/styles.test.js
./node_modules/.bin/vitest run
./node_modules/.bin/tsc -b
./node_modules/.bin/vite build
```

Expected: all targeted and full checks pass.

- [ ] **Step 7: Commit when repository metadata is available**

```bash
git add public/assets/maria/theme-sun.png public/assets/maria/theme-moon.png src/maria/FixedChrome.tsx src/App.test.tsx src/styles.css src/styles.test.js docs/superpowers/specs/2026-08-09-theme-icons-and-mobile-contact-design.md docs/superpowers/plans/2026-08-09-theme-icons-and-mobile-contact.md
git commit -m "style: add portfolio theme icons"
```

The current workspace has no `.git` directory, so skip the commit unless repository metadata becomes available.
