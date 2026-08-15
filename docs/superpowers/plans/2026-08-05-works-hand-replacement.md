# Works Hand Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Works page hand image and keep its phone horizontal, centered beneath the carousel on desktop and mobile.

**Architecture:** Preserve the existing component and public asset URL, replacing only the PNG bytes. Add final-pose CSS variables to the existing `.maria-works-hand` wrapper so layout rotation is independent of the existing entrance animation, with a mobile override inside the current media query.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Vite

## Global Constraints

- The hand remains below the carousel layer.
- The existing entrance animation and reduced-motion behavior remain unchanged.
- The carousel, cards, modal, routes, and fixed navigation are not modified.
- Desktop and mobile use separate size and position values.
- No new runtime dependency is introduced.

---

### Task 1: Replace and reposition the Works hand

**Files:**
- Modify: `public/assets/maria/works-phone-hand.png`
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`
- Test: `src/styles.test.js`

**Interfaces:**
- Consumes: the existing `/assets/maria/works-phone-hand.png` URL rendered by `WorksPage`.
- Produces: CSS custom properties `--works-hand-final-rotation`, `--works-hand-x`, and `--works-hand-y` used by `.maria-works-hand img`.

- [ ] **Step 1: Strengthen the component and CSS tests**

Keep the existing image URL assertion in `src/App.test.tsx` and add CSS assertions in `src/styles.test.js`:

```js
expect(styles).toContain('--works-hand-final-rotation:-90deg')
expect(styles).toContain('transform:translate3d(var(--works-hand-x),var(--works-hand-y),0) rotate(var(--works-hand-final-rotation))')
expect(styles).toContain('--works-hand-final-rotation:-90deg')
```

- [ ] **Step 2: Run the focused tests and confirm the new CSS contract fails**

Run:

```bash
pnpm test -- --run src/App.test.tsx src/styles.test.js
```

Expected: FAIL because the final-pose variables and image transform are not present.

- [ ] **Step 3: Replace the PNG at the existing public URL**

Copy `/Users/mary/Downloads/ChatGPT Image 5 авг. 2026 г., 16_18_55-Photoroom.png` over `public/assets/maria/works-phone-hand.png` without changing the URL referenced by `WorksPage`.

- [ ] **Step 4: Add desktop final-pose composition**

Update the desktop wrapper and image rules in `src/styles.css`:

```css
.maria-works-hand{
  --works-hand-final-rotation:-90deg;
  --works-hand-x:0;
  --works-hand-y:0;
  bottom:-49vh;
  width:min(55vw,940px);
  translate:-18.2% 0;
}
.maria-works-hand img{
  transform:translate3d(var(--works-hand-x),var(--works-hand-y),0)
    rotate(var(--works-hand-final-rotation));
  transform-origin:50% 50%;
}
```

Do not change `z-index:1`, `view-transition-name:works-hand`, or the existing entrance animation.

- [ ] **Step 5: Add mobile final-pose composition**

Inside the existing `@media(max-width:600px)` rule, override only the composition values:

```css
.maria-works-hand{
  --works-hand-final-rotation:-90deg;
  --works-hand-x:0;
  --works-hand-y:0;
  bottom:-21vh;
  width:124vw;
  translate:-18.2% 0;
}
```

Keep the existing mobile entrance animation and carousel rules unchanged.

The `124vw` width enlarges the phone body on mobile without changing its centering or vertical position. The mobile carousel cards use `width:80vw`.

The mobile carousel is positioned at `top:20vh` so it sits `5vh` lower than the previous layout.

- [ ] **Step 6: Run focused tests**

Run:

```bash
pnpm test -- --run src/App.test.tsx src/styles.test.js
```

Expected: PASS.

- [ ] **Step 7: Run complete verification**

Run:

```bash
pnpm test -- --run
pnpm build
```

Expected: all tests pass and Vite completes the production build.

- [ ] **Step 8: Commit if the workspace is a Git repository**

```bash
git add public/assets/maria/works-phone-hand.png src/styles.css src/App.test.tsx src/styles.test.js docs/superpowers/specs/2026-08-05-works-hand-replacement-design.md docs/superpowers/plans/2026-08-05-works-hand-replacement.md
git commit -m "feat: replace works page hand"
```

If `.git` is absent, report that the verified files are ready but cannot be committed from this workspace.
