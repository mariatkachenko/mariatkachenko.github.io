# About Sphere Refraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a restrained optical-glass glow and internal refraction to the existing sphere on the “About” page in both themes.

**Architecture:** Keep the existing DOM and layer order unchanged. Extend only the existing `.maria-hackathons-porthole::before` CSS treatment with layered radial and conic gradients plus inset/outset shadows; provide a separate dark-theme palette.

**Tech Stack:** React, CSS, Vitest, Vite

## Global Constraints

- Preserve the sphere’s size, position, transparent center, DOM, model, carousel, pattern, navigation, and animation behavior.
- Light theme: white/pink pearl edge with a subtle cyan accent.
- Dark theme: pink/purple glow with a small cyan accent.
- Add no animation and no new dependency.

---

### Task 1: Optical sphere styling

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: existing `.maria-hackathons-porthole::before` and `.theme-dark .maria-hackathons-porthole::before` selectors.
- Produces: static layered CSS refraction treatment; no JavaScript interface changes.

- [x] **Step 1: Write the failing test**

Extend the existing `about page space background` test to require:

```js
expect(styles).toContain('conic-gradient(from 214deg at 50% 50%')
expect(styles).toContain('rgba(131,229,255,.28)')
expect(styles).toContain('inset 22px -18px 44px rgba(128,226,255,.12)')
expect(styles).toContain('rgba(120,224,255,.32)')
expect(styles).toContain('inset 24px -20px 48px rgba(58,188,255,.14)')
```

These expectations fail if the asymmetric optical rim, cyan refraction, or theme-specific internal lens lighting is removed.

- [x] **Step 2: Run the focused test to verify RED**

Run:

```bash
PATH="/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm test -- --run src/styles.test.js
```

Expected: FAIL in `about page space background` because the new optical gradient and shadow literals are absent.

- [x] **Step 3: Implement the minimal CSS**

Replace only the two existing `::before` declarations with layered gradients that include:

```css
conic-gradient(from 214deg at 50% 50%, ...)
radial-gradient(circle at 20% 22%, ... rgba(131,229,255,.28) ...)
box-shadow: ... inset 22px -18px 44px rgba(128,226,255,.12) ...;
```

and the dark-theme counterparts:

```css
radial-gradient(circle at 20% 22%, ... rgba(120,224,255,.32) ...)
box-shadow: ... inset 24px -20px 48px rgba(58,188,255,.14) ...;
```

Keep the selectors, inset, border radius, dimensions, positioning, and pointer behavior unchanged.

- [x] **Step 4: Run the focused test to verify GREEN**

Run the focused command from Step 2.

Expected: all `src/styles.test.js` tests PASS.

- [x] **Step 5: Run full verification**

Run:

```bash
PATH="/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm test -- --run
PATH="/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH" pnpm build
```

Expected: all tests pass and the Vite production build exits with code 0.
