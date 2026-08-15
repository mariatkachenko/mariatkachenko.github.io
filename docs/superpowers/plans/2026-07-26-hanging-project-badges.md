# Hanging Project Badges Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the card grid and add seven distinct hanging badges from one transparent sprite image.

**Architecture:** Copy the supplied PNG once into `public/assets/maria`, render one decorative clipped badge viewport per card, and select each source region through index-specific CSS variables.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- One shared PNG asset only.
- Seven visually distinct sprite regions.
- Badges are decorative and aria-hidden.
- No card grid.
- Preserve all carousel interactions and ellipse transforms.

---

### Task 1: Badge asset and markup

**Files:**
- Add: `public/assets/maria/hackathon-badges.png`
- Modify: `src/App.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`

- [ ] **Step 1: Write failing tests**

Assert seven `.maria-orbit-card__badge` elements, seven images using `/assets/maria/hackathon-badges.png`, and `aria-hidden="true"` on every viewport.

- [ ] **Step 2: Verify RED**

```bash
pnpm test -- --run
```

- [ ] **Step 3: Add the shared source and markup**

Copy the supplied transparent PNG once. Render a badge viewport with an empty-alt image and an index-specific `data-badge` value from `1` through `7`.

- [ ] **Step 4: Verify GREEN**

```bash
pnpm test -- --run
```

### Task 2: Sprite crops and card cleanup

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Remove grid layers**

Remove the two repeating card background gradients and their `background-size`; retain only the glass highlight.

- [ ] **Step 2: Add hanging badge styles**

Allow the badge viewport to cross the top edge, clip each source region, assign seven source transforms, and vary rotations from −7° to +7°.

- [ ] **Step 3: Protect content and mobile layout**

Keep titles above the badge where necessary, reduce badge scale under 600 px, and prevent badge imagery from intercepting pointer events.

- [ ] **Step 4: Verify**

```bash
pnpm test -- --run
pnpm build
```

Expected: all 14 tests pass and Vite build exits successfully.
