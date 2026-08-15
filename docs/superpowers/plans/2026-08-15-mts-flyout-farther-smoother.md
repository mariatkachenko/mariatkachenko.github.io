# MTS Pay Farther and Smoother Flyout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the centered MTS Pay Figma-logo and butterfly flyout without slowing its approved dynamic motion.

**Architecture:** Keep the existing two decorative image layers, shared `left:50%` anchor, and CSS keyframes. Change only their animation durations/easing and the mirrored 92%/100% trajectory coordinates; protect the behavior with the existing CSS regression suite.

**Tech Stack:** React 19, TypeScript, CSS keyframes, Vitest.

## Global Constraints

- Final scale remains exactly `13x` for both layers.
- Both layers move `8vh` lower using `top:calc(10% + 8vh)` for the logo and `top:calc(3% + 8vh)` for the butterfly.
- The total starting gap increases by `10vh`, split symmetrically with `translateX(calc(-98% - 5vh))` and `translateX(calc(-2% + 5vh))`.
- Every keyframe carries the same `-5vh/+5vh` horizontal offset so the pair remains centered.
- The 52% positions remain `-180%/80%`.
- The 92% positions become `-397%/297%` with `translateY(-143%)` and `translateZ(1380px)`.
- The 100% positions become `-587%/487%` with `translateY(-202%)` and `translateZ(1955px)`.
- Logo timing becomes `1.58s cubic-bezier(.18,.72,.16,1)`.
- Butterfly timing becomes `1.68s cubic-bezier(.18,.72,.16,1) .06s`.
- Phase boundaries are 18% and 82%, with a late-blur checkpoint at 94%.
- Scale grows continuously through `.28/.3 → 1.4 → 7 → 10.5 → 13`.
- Blur is `0` through 82%, `12px` at 94%, and `42px` at 100%.
- Opacity remains `1` through 94% and reaches `0` only at 100%.
- Each phase declares a compatible segment easing so velocity does not drop to zero at 18%, 82%, or 94%.
- Flyout layers use `image-rendering:auto`, `transform-origin:center`, and `will-change:opacity,filter` without permanent `will-change:transform`.
- Every phase uses `translate(...) rotate(...) scale(...)`; no flyout keyframe uses `translate3d(...)`.
- Logo filters contain only their approved blur values and no `drop-shadow`.
- Every butterfly filter includes `drop-shadow(0 8px 14px rgba(155,175,255,.28))`; no gray, black, or pink shadow is added.
- Reduced-motion behavior remains unchanged.
- Card layout, carousel behavior, artwork, other animations, home page, and about page remain unchanged.

---

### Task 1: Extend the MTS flyout and restore its speed

**Files:**
- Modify: `src/styles.test.js:288-296,475-490`
- Modify: `src/styles.css:145-151`

**Interfaces:**
- Consumes: existing `.mts-project-card__logo-flyout`, `.mts-project-card__butterfly-flyout`, and `.maria-works-deck-card.is-centered` selectors.
- Produces: revised `mts-logo-flyout-to-viewer` and `mts-butterfly-flyout-to-viewer` CSS animations.

- [ ] **Step 1: Write failing regression expectations**

Replace the current rendering and keyframe expectations with assertions for 2D scale-led transforms, full-resolution-friendly layer properties, three continuous phases, late blur, lowered position, and symmetric `5vh` offsets:

```js
expect(styles).toContain('animation:mts-logo-flyout-to-viewer 1.58s cubic-bezier(.18,.72,.16,1) both')
expect(styles).toContain('animation:mts-butterfly-flyout-to-viewer 1.68s cubic-bezier(.18,.72,.16,1) .06s both')
expect(styles).toContain('.mts-project-card__logo-flyout{left:50%;top:calc(10% + 8vh)')
expect(styles).toContain('.mts-project-card__butterfly-flyout{left:50%;top:calc(3% + 8vh)')
expect(styles).toContain('image-rendering:auto;transform-origin:center;will-change:opacity,filter')
expect(styles).toContain('filter:blur(0) drop-shadow(0 8px 14px rgba(155,175,255,.28))')
expect(styles).not.toContain('rgba(255,150,205')
expect(styles).not.toContain('will-change:transform,opacity,filter')
expect(styles).toContain('18%{opacity:1;filter:blur(0);transform:translate(calc(-125% - 5vh),-58%) rotate(-8deg) scale(1.4)')
expect(styles).toContain('82%{opacity:1;filter:blur(0);transform:translate(calc(-330% - 5vh),-120%) rotate(-30deg) scale(7)')
expect(styles).toContain('94%{opacity:1;filter:blur(12px);transform:translate(calc(-450% - 5vh),-158%) rotate(-39deg) scale(10.5)')
expect(styles).toContain('translate(calc(-587% - 5vh),-202%)')
expect(styles).toContain('translate(calc(487% + 5vh),-202%)')
expect(styles).not.toContain('@keyframes mts-logo-flyout-to-viewer{0%{opacity:0;filter:blur(0);transform:translate3d(')
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm test -- --run src/styles.test.js
```

Expected: FAIL because the stylesheet still permanently promotes `transform` and uses `translate3d(...)` in every phase.

- [ ] **Step 3: Implement the minimal CSS change**

Set the centered animation declarations to:

```css
.maria-works-deck-card.is-centered .mts-project-card__logo-flyout{animation:mts-logo-flyout-to-viewer 1.92s cubic-bezier(.16,.76,.18,1) both}
.maria-works-deck-card.is-centered .mts-project-card__butterfly-flyout{animation:mts-butterfly-flyout-to-viewer 2.04s cubic-bezier(.16,.76,.18,1) .08s both}
```

Keep all approved percentages, offsets, rotation, scale, blur, timing, and 2D rendering properties. Remove shadow filters from the shared rule and every logo keyframe. Add the exact cool shadow only to the butterfly's base rule and every butterfly keyframe, including its late-blur phases.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
pnpm test -- --run src/styles.test.js
```

Expected: all tests in `src/styles.test.js` pass.

- [ ] **Step 5: Run complete verification**

Run:

```bash
pnpm test -- --run
pnpm build
```

Expected: all tests pass and Vite completes the production build.

- [ ] **Step 6: Commit when working in a Git repository**

```bash
git add src/styles.css src/styles.test.js docs/superpowers/specs/2026-08-15-mts-flyout-farther-smoother-design.md docs/superpowers/plans/2026-08-15-mts-flyout-farther-smoother.md
git commit -m "feat: extend MTS flyout"
```

If the source directory has no Git metadata, report that limitation and do not modify the separate deploy repository unless explicitly requested.
