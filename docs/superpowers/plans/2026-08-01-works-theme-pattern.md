# Works Theme Pattern Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Works-page pattern visibly switch palettes between light and dark themes, matching the clarity of the About-page theme change.

**Architecture:** Keep the existing Works pseudo-element and JPG rendering unchanged in the light theme. Add a dark-theme gradient, blend mode, and color correction while preserving the asset, tiling dimensions, position, repetition, and opacity.

**Tech Stack:** React, Vite, CSS, Vitest

## Global Constraints

- Keep the existing Works JPG unchanged.
- Keep pattern tiling, positioning, scale, and `opacity: .6` unchanged.
- Do not change the Works page base background, hand artwork, carousel, controls, motion, layout, or responsive behavior.

---

### Task 1: Theme-aware Works pattern

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `.maria-works-page::before` and `.theme-dark .maria-works-page::before` CSS selectors.
- Produces: a shared SVG mask with separate light and dark gradient fills.

- [ ] **Step 1: Write the failing CSS regression test**

Update the Works-page test to require the SVG mask, the unchanged repeat/size/position/opacity values, and a separate dark-theme fill:

```js
expect(styles).toContain("url('/assets/maria/works-graffiti-pattern.jpg')")
expect(styles).toContain('background-size:840px 471px')
expect(styles).toContain('background-position:center')
expect(styles).toContain('background-repeat:repeat')
expect(styles).toContain('opacity:.6')
expect(styles).toContain('.theme-dark .maria-works-page::before{background-image:')
expect(styles).toContain('background-blend-mode:multiply;filter:contrast(1.12) saturate(1.45)')
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm test -- --run src/styles.test.js
```

Expected: FAIL because the Works page has no dark-theme pseudo-element override.

- [ ] **Step 3: Implement the minimal CSS change**

Change only the pattern pseudo-element:

```css
.theme-dark .maria-works-page::before {
  background-image: radial-gradient(circle at 18% 16%, rgba(255,60,160,.86), rgba(75,28,88,.82) 48%, rgba(16,31,53,.9)), url('/assets/maria/works-graffiti-pattern.jpg');
  background-blend-mode: multiply;
  filter: contrast(1.12) saturate(1.45);
}
```

Preserve the existing positioning, stacking, and pointer-event declarations on `.maria-works-page::before`.

- [ ] **Step 4: Run focused and full verification**

Run:

```bash
pnpm test -- --run src/styles.test.js
pnpm test -- --run
pnpm build
```

Expected: all tests pass and the production build exits with code 0.

- [ ] **Step 5: Commit if a Git repository is available**

```bash
git add src/styles.css src/styles.test.js docs/superpowers/specs/2026-08-01-works-theme-pattern-design.md docs/superpowers/plans/2026-08-01-works-theme-pattern.md
git commit -m "style: clarify works pattern theme switch"
```

If the directory is not a Git repository, report that no commit was created.
