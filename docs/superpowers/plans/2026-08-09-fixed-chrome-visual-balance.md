# Fixed Chrome Visual Balance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the size, alignment, spacing, and Contact treatment of the shared fixed interface on desktop and mobile in both themes.

**Architecture:** Keep the existing `FixedChrome` markup and single shared instance. Express the visual adjustment entirely in the existing shared chrome CSS, with the existing string-based style test acting as a regression contract.

**Tech Stack:** React, TypeScript, CSS, Vitest

## Global Constraints

- Change only shared fixed chrome styling and its CSS contract test.
- Preserve route transitions, page content, carousel geometry, theme behavior, language behavior, semantics, and focus treatment.
- Keep the Contact arrow visible on desktop and mobile.
- Use the existing `--maria-fg` and `--maria-bg` theme variables.

---

### Task 1: Rebalance shared fixed chrome

**Files:**
- Modify: `src/styles.test.js:112-123`
- Modify: `src/styles.css:55-59,108-109,210-214`

**Interfaces:**
- Consumes: existing `.maria-header`, `.maria-contact`, `.maria-controls`, `.maria-languages`, and `.maria-theme` selectors.
- Produces: the same selectors and view-transition names with updated responsive geometry.

- [ ] **Step 1: Write the failing CSS contract test**

Update the shared chrome expectations to require desktop header type `clamp(14px,1vw,18px)`, a `42px` avatar, `16px` bottom controls, borderless Contact styling, a raised arrow, tablet `16px` top/bottom horizontal offsets, mobile `11px` header type, `38px` avatar, `13px` controls, and a visible mobile Contact arrow.

- [ ] **Step 2: Run the targeted test and verify RED**

Run: `./node_modules/.bin/vitest run src/styles.test.js`

Expected: FAIL because the current CSS still uses the smaller sizes, bordered Contact link, unmatched tablet control offsets, and hidden mobile arrow.

- [ ] **Step 3: Implement the minimal shared CSS changes**

Update only the shared chrome rules:

```css
.maria-header { font-size:clamp(14px,1vw,18px); }
.maria-avatar { width:42px; height:42px; }
.maria-contact { gap:6px; padding:10px 8px; border:0; background:transparent; }
.maria-contact span { position:relative; top:-2px; }
.maria-controls { font-size:16px; }
.maria-languages button,.maria-theme button { padding:4px 2px; }
.maria-theme { font-size:20px; }
```

At `max-width:900px`, set both header and controls to `left:16px;right:16px`. At `max-width:600px`, use an `11px` header, `38px` avatar, compact borderless Contact padding, a visible arrow, and `13px` bottom controls with the existing `12px` outer offsets.

- [ ] **Step 4: Run the targeted test and verify GREEN**

Run: `./node_modules/.bin/vitest run src/styles.test.js`

Expected: PASS.

- [ ] **Step 5: Run complete verification**

Run:

```bash
./node_modules/.bin/vitest run
./node_modules/.bin/tsc -b
./node_modules/.bin/vite build
```

Expected: all tests pass, TypeScript succeeds, and the production build completes.

- [ ] **Step 6: Commit when repository metadata is available**

```bash
git add src/styles.css src/styles.test.js docs/superpowers/specs/2026-08-09-fixed-chrome-visual-balance-design.md docs/superpowers/plans/2026-08-09-fixed-chrome-visual-balance.md
git commit -m "style: rebalance shared portfolio chrome"
```

The current workspace has no `.git` directory, so skip this step unless repository metadata becomes available.
