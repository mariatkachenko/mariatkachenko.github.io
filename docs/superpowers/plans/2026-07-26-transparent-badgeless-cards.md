# Transparent Badgeless Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all hanging-badge code and restore light translucent project cards without a grid.

**Architecture:** Remove the badge branch from card markup and CSS, delete its single raster asset, then adjust only the card glass tokens while preserving content and transforms.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Vite.

## Global Constraints

- No badge markup, CSS, or asset.
- No grid background.
- Light translucent glass in both themes.
- Preserve all carousel behaviour and project content.

---

### Task 1: Remove badges and restore glass

**Files:**
- Delete: `public/assets/maria/hackathon-badges.png`
- Modify: `src/App.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing expectations**

Replace badge-presence assertions with badge-absence and asset-reference-absence assertions.

- [ ] **Step 2: Verify RED**

```bash
pnpm test -- --run
```

- [ ] **Step 3: Remove badge implementation**

Delete badge markup, all `.maria-orbit-card__badge` selectors, responsive badge rules, and the PNG file.

- [ ] **Step 4: Restore transparent glass**

Use translucent white/pink fills, retain a single highlight, keep the grid absent, and add a subtle white-text shadow. Replace the dark-theme opaque fill with transparent pale glass.

- [ ] **Step 5: Verify**

```bash
pnpm test -- --run
pnpm build
```

Confirm `public/assets/maria/hackathon-badges.png` and `dist/assets/maria/hackathon-badges.png` are absent.
