# MTS Pay Flyout Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen the dynamically balanced Figma-logo and butterfly flyout when the MTS Pay card reaches the carousel center.

**Architecture:** Keep the two existing decorative image layers and change only their CSS anchors and keyframes. Use a shared `left: 50%` coordinate system and mirrored horizontal transforms so the combined motion remains centered while scaling toward the viewer.

**Tech Stack:** React 19, TypeScript, CSS keyframes, Vitest.

## Global Constraints

- Final scale is exactly `13x` for both flyout layers.
- Start positions are `translateX(-98%)` and `translateX(-2%)`.
- Mirrored horizontal positions are `-180%/80%` at 52%, `-310%/210%` at 92%, and `-453%/353%` at 100%.
- Both layers remain at full opacity through 92% of the animation and reach zero opacity only at 100%.
- The logo uses the existing `1.92s` timing and the butterfly uses `2.04s` with its existing `.08s` stagger.
- Blur starts late at 92% and becomes strong only at the final faded frame.
- Motion is distributed through 10%, 52%, 92%, and 100% keyframes.
- The Figma logo exits left and the butterfly exits right on visually symmetric trajectories.
- Card layout, carousel behavior, artwork, footer, other animations, home page, and about page remain unchanged.
- The existing `prefers-reduced-motion` behavior remains unchanged.

---

### Task 1: Center and enlarge the MTS Pay flyout motion

**Files:**
- Modify: `src/styles.test.js:475-488`
- Modify: `src/styles.css:145-151`

**Interfaces:**
- Consumes: the existing `.mts-project-card__logo-flyout`, `.mts-project-card__butterfly-flyout`, and `.maria-works-deck-card.is-centered` selectors.
- Produces: centered, mirrored `mts-logo-flyout-to-viewer` and `mts-butterfly-flyout-to-viewer` keyframes.

- [ ] **Step 1: Write the failing CSS regression expectations**

Update the MTS flyout test to require both layers to use `left:50%`, retain their existing timing and stagger, use the expanded mirrored transforms, remain visible at 92%, blur late, and reach `scale(13)` at 100%.

```js
expect(styles).toContain('.mts-project-card__logo-flyout{left:50%;top:10%;width:24%')
expect(styles).toContain('.mts-project-card__butterfly-flyout{left:50%;top:3%;width:25%')
expect(styles).toContain('animation:mts-logo-flyout-to-viewer 1.92s cubic-bezier(.16,.76,.18,1) both')
expect(styles).toContain('animation:mts-butterfly-flyout-to-viewer 2.04s cubic-bezier(.16,.76,.18,1) .08s both')
expect(styles).toContain('92%{opacity:1;filter:blur(12px)')
expect(styles).toContain('100%{opacity:0;filter:blur(42px)')
expect(styles).toContain('scale(13)')
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
pnpm test -- --run src/styles.test.js
```

Expected: FAIL because the current flyout does not contain the expanded mirrored transforms and final `13x` scale.

- [ ] **Step 3: Implement the balanced keyframes**

In `src/styles.css`, keep both layers anchored at `left:50%`. Retain the existing animation durations, easing, and butterfly stagger. Apply the approved mirrored positions and scales, keep opacity at `1` through 92%, introduce blur at 92%, and combine the strongest blur with the fade to `0` at 100%.

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

- [ ] **Step 6: Publish through the deploy repository when requested**

After explicit publication approval, copy the verified `dist/` output to `work/mariatkachenko.github.io/`, commit the generated files there, and push `main`.
