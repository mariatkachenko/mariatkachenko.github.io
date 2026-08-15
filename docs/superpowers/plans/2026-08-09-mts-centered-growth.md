# MTS Centered Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Animate the MTS Pay external artwork visibly from normal-card scale to its 150% centered size and keep it above neighboring cards.

**Architecture:** Keep the external image canvas at 150% width, use transform scale to animate its visible size from `0.67` to `1`, and transition opacity in parallel. Raise the centered project article above normal carousel layers while preserving its footer as the top internal layer.

**Tech Stack:** CSS, Vitest, Vite.

## Global Constraints

- Do not change carousel input or centered-state logic.
- Keep hover/focus size-neutral.
- Add no shadows.
- Keep the footer above the artwork.

---

### Task 1: Animate and layer the centered artwork

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `.maria-works-deck-card.has-project.is-centered`, `.mts-project-card__external-artwork`, `.mts-project-card__cropped-artwork`, and `.mts-project-card__footer`.
- Produces: 450ms scale/fade transition and centered article z-index `100`.

- [ ] **Step 1: Add failing CSS assertions**

Assert default external transform is `translateX(-50%) scale(.67)`, transition includes `transform .45s cubic-bezier(.2,.8,.2,1),opacity .45s ease`, centered transform is `translateX(-50%) scale(1)`, centered article has `z-index:100`, footer z-index exceeds external artwork, and the project article has no shadow.

- [ ] **Step 2: Run style tests and confirm failure**

Run: `PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH pnpm test -- --run src/styles.test.js`

Expected: FAIL because current artwork only fades over 140ms.

- [ ] **Step 3: Implement the CSS transition and stacking**

Set the external artwork to z-index `50`, default scale `.67`, and a 450ms transform/opacity transition. Set the footer to z-index `60`. Add centered article z-index `100` and centered external scale `1`; lengthen cropped-preview opacity transition to 450ms. Remove the project article shadow without changing placeholder shadows.

- [ ] **Step 4: Run focused and full verification**

Run: `PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH pnpm test -- --run src/styles.test.js`

Run: `PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH pnpm test -- --run`

Run: `PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH pnpm run build`

Expected: all tests and build PASS.
