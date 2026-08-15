# Works Page Graffiti Pattern Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generated Works-page graffiti layer with the supplied opaque, repeating raster pattern.

**Architecture:** Store the reference image as a static Maria asset and render it through the existing `.maria-works-page::before` decorative layer. CSS keeps the layer behind all content, repeats an `840px × 471px` tile at full opacity, and leaves the carousel and phone untouched.

**Tech Stack:** React, TypeScript, CSS, Vite, Vitest

## Global Constraints

- Apply the supplied image only to the Works page.
- Do not change carousel layout, card transforms, phone positioning, modal behavior, or other pages.
- Use the same centered, repeating `840px × 471px` tile on desktop and mobile.

---

### Task 1: Replace the Works-page decorative background

**Files:**
- Create: `public/assets/maria/works-graffiti-pattern.jpg`
- Modify: `src/styles.css:64-66`
- Test: `src/styles.test.js`

**Interfaces:**
- Consumes: the browser-served static asset path `/assets/maria/works-graffiti-pattern.jpg`
- Produces: a non-interactive `.maria-works-page::before` raster background layer

- [ ] **Step 1: Write the failing style test**

Add assertions to the existing Works-page style test:

```js
expect(styles).toContain("url('/assets/maria/works-graffiti-pattern.jpg')")
expect(styles).toContain('background-size:840px 471px')
expect(styles).toContain('background-position:center')
expect(styles).toContain('background-repeat:repeat')
expect(styles).toContain('opacity:1')
expect(styles).not.toContain("background-image:linear-gradient(rgba(200,200,202,.38)")
expect(styles).not.toContain('.theme-dark .maria-works-page::before')
expect(styles).not.toContain('repeating-linear-gradient(112deg')
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
pnpm vitest run src/styles.test.js
```

Expected: FAIL because the current implementation uses a cover-sized, translucent raster with a gray overlay and a dark-theme filter.

- [ ] **Step 3: Copy the supplied source asset into the public asset directory**

Copy:

```text
/Users/mary/Downloads/Telegram Desktop/photo_2026-07-27_23-00-58.jpg
```

to:

```text
public/assets/maria/works-graffiti-pattern.jpg
```

Preserve the original JPEG bytes; do not recompress the source during this task.

- [ ] **Step 4: Implement the muted raster background**

Replace the current muted raster rules with:

```css
.maria-works-page::before{
  content:"";
  position:absolute;
  z-index:0;
  inset:0;
  background-image:url('/assets/maria/works-graffiti-pattern.jpg');
  background-size:840px 471px;
  background-position:center;
  background-repeat:repeat;
  opacity:1;
  pointer-events:none;
}
```

Remove the `.theme-dark .maria-works-page::before` override. Keep `.maria-works-page{isolation:isolate}` unchanged so the pseudo-element remains behind Works-page content.

- [ ] **Step 5: Run the focused tests**

Run:

```bash
pnpm vitest run src/styles.test.js src/App.test.tsx
```

Expected: all focused tests PASS.

- [ ] **Step 6: Run full verification**

Run:

```bash
pnpm vitest run
pnpm build
```

Expected: all tests PASS and Vite produces `dist/` successfully.

- [ ] **Step 7: Commit**

This workspace is not currently a Git repository, so no commit can be created. If Git is initialized later, commit these files with:

```bash
git add public/assets/maria/works-graffiti-pattern.jpg src/styles.css src/styles.test.js
git commit -m "feat: add graffiti pattern to works page"
```
