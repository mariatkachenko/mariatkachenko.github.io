# Smaller Works Cards with Projected Light Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce Works cards, remove their borders, add a converging light cone from each lower edge, and raise the carousel.

**Architecture:** Keep the component and carousel geometry unchanged. Implement the visual treatment entirely in the Works-card CSS, using a negative-layer pseudo-element for the projected light.

**Tech Stack:** CSS, Vitest, Vite

## Global Constraints

- Desktop width is `clamp(280px,30vw,560px)`.
- Mobile width is `70vw`.
- Works card border is zero in both themes.
- Projected light starts full-width at the lower edge and narrows toward the phone.
- Desktop carousel top is `13vh`; mobile carousel top is `15vh`.
- Existing hover and carousel behavior remain unchanged.

---

### Task 1: Card size, border, and projected-light layer

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

**Interfaces:**
- Produces: `.maria-works-deck-card::after` decorative light projection
- Preserves: existing spine/pages and loop variables

- [ ] **Step 1: Add failing CSS assertions**

```js
expect(styles).toContain('width:clamp(280px,30vw,560px)')
expect(styles).toContain('border:0')
expect(styles).toContain('.maria-works-deck-card::after')
expect(styles).toContain('pointer-events:none')
expect(styles).toContain('filter:blur(14px)')
expect(styles).toContain('rgba(255,255,255,.34)')
expect(styles).toContain('left:0;top:100%;width:100%')
expect(styles).toContain('clip-path:polygon(0 0,100% 0,62% 100%,38% 100%)')
expect(styles).toContain('width:70vw')
expect(styles).toContain('top:13vh;height:58vh')
expect(styles).toContain('top:15vh;height:48vh')
```

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/styles.test.js
```

Expected: the new dimensions and projection layer are absent.

- [ ] **Step 3: Implement visual treatment**

Change the desktop width and border in the base Works-card rule. Add a pseudo-element flush with the full lower edge, with a white/pale-pink gradient, 14 px blur, a narrowing polygon, negative z-index, and no pointer interaction. Change the mobile width override to `70vw`. Raise the desktop and mobile carousel top positions by 4 vh.

- [ ] **Step 4: Verify**

```bash
pnpm vitest run src/styles.test.js src/maria/WorksCardCarousel.test.tsx
pnpm vitest run
pnpm build
```

Expected: all tests and the production build pass.
