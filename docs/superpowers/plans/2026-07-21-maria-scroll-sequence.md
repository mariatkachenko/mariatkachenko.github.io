# Maria Scroll Sequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Animate Maria's supplied portrait sequence in direct response to vertical scroll.

**Architecture:** A small pure frame-selection helper maps normalized scroll progress to a frame index. A focused React canvas component preloads local WebP frames, draws them with cover cropping, and updates through `requestAnimationFrame`; the existing portfolio page supplies the sticky scroll stage.

**Tech Stack:** React 19, TypeScript, Canvas 2D, Vite, Vitest, plain CSS.

## Global Constraints

- Keep the current Figma collage layout, links, copy, and responsive behavior.
- Use the supplied 16 frames in their existing order.
- Use only local optimized assets and no animation dependency.
- Respect `prefers-reduced-motion` with a static first frame.

---

### Task 1: Frame assets and frame-selection contract

**Files:**
- Create: `public/assets/maria/scroll/frame-001.webp` through `frame-016.webp`
- Create: `src/maria/scrollFrames.ts`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Produces `SCROLL_FRAME_URLS: readonly string[]` and `frameIndexForProgress(progress: number, count: number): number`.

- [ ] Add tests asserting progress `0`, `0.5`, and `1` returns valid first, middle, and last indexes.
- [ ] Run `pnpm test -- --run` and confirm the new import/test fails before the helper exists.
- [ ] Extract the archive and convert all 16 PNG files to numbered WebP assets.
- [ ] Implement clamped frame selection with `Math.round(progress * (count - 1))`.
- [ ] Run `pnpm test -- --run` and confirm all tests pass.

### Task 2: Scroll-driven canvas

**Files:**
- Create: `src/maria/ScrollPortrait.tsx`
- Modify: `src/maria/PortfolioPage.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Produces `ScrollPortrait(): JSX.Element` using `SCROLL_FRAME_URLS`.

- [ ] Add a component test asserting the portrait canvas has an accessible portrait label and a static fallback image.
- [ ] Run the test and confirm it fails before `ScrollPortrait` exists.
- [ ] Implement frame preloading, cover-cropped canvas rendering, resize handling, passive scroll handling, and request-animation-frame batching.
- [ ] Replace the static portrait with `ScrollPortrait` and change the page to a two-viewport scroll scene with sticky visual content.
- [ ] Add reduced-motion CSS and runtime behavior that keeps frame one static.
- [ ] Run tests and the production build.

### Task 3: Final verification

**Files:**
- Verify: `public/assets/maria/scroll/*`
- Verify: `src/maria/*`

**Interfaces:**
- Produces a localhost page whose full scroll range controls all 16 frames.

- [ ] Confirm exactly 16 WebP frames exist and no source path references `/Users/mary/Downloads`.
- [ ] Run `pnpm test -- --run` and require zero failures.
- [ ] Run `pnpm build` and require exit code zero.
- [ ] Verify the local page retains portfolio links and has no horizontal overflow.

