# Works Card Hover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Works-card hover and focus decoration with scale-only feedback.

**Architecture:** Keep carousel 3D positioning in the existing `transform`. Use the independent CSS `scale` property for hover/focus and override the nested generic project-cover hover effect.

**Tech Stack:** CSS, Vitest, Vite

## Global Constraints

- Hover/focus scale is `1.035`.
- Transition duration is 220 ms.
- No hover translation, enhanced shadow, or focus ring.
- Dragging disables enlargement.

---

### Task 1: Implement scale-only Works-card feedback

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

**Interfaces:**
- Produces: Works-only scale hover/focus behavior
- Preserves: carousel transform variables and drag interaction

- [ ] **Step 1: Add failing CSS assertions**

Assert:

```js
expect(styles).toContain('scale:1;')
expect(styles).toContain('transition:scale .22s ease')
expect(styles).toContain('.maria-works-deck-card:hover{scale:1.035}')
expect(styles).toContain('.maria-works-deck-card:focus-within{scale:1.035}')
expect(styles).toContain('.maria-works-carousel.is-dragging .maria-works-deck-card{scale:1}')
expect(styles).toContain('.maria-works-deck-card .concept-cover:hover{transform:none;box-shadow:none}')
```

Remove assertions expecting a Works focus ring or hover shadow.

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/styles.test.js
```

Expected: scale-only declarations are absent.

- [ ] **Step 3: Implement the CSS override**

Add base `scale:1` and `transition:scale .22s ease`. In the fine-pointer media query, scale cards on hover and neutralize the nested cover transform/shadow. Scale on `:focus-within`, remove the previous ring/shadow override, and force scale `1` while `.maria-works-carousel.is-dragging`.

- [ ] **Step 4: Verify**

```bash
pnpm vitest run src/styles.test.js src/maria/WorksCardCarousel.test.tsx
pnpm vitest run
pnpm build
```

Expected: all tests and the production build pass.
