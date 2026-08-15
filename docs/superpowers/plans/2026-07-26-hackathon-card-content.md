# Hackathon Card Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fill the seven orbital cards with localized portfolio project titles and restrained white interface details.

**Architecture:** Define a localized project-data function next to the carousel, render semantic text from that data, and keep all decorative geometry as aria-hidden HTML/CSS without adding image assets.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Keep exactly seven cards.
- Preserve carousel interaction and ellipse transforms.
- Use no new raster assets.
- Decorative elements must have `aria-hidden="true"`.
- Card accessible names use full localized titles.

---

### Task 1: Localized project data

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`

- [ ] **Step 1: Write failing content tests**

Navigate to Hackathons and assert all seven Russian titles and `Мария Ткаченко`. Switch to English and assert `Avito Card Redesign`, `Tele2 New Year Gifts`, `Deal Done To Do App`, and `Maria Tkachenko`.

- [ ] **Step 2: Verify RED**

```bash
pnpm test -- --run
```

- [ ] **Step 3: Add localized data**

Create `projectsFor(language)` returning seven objects with `title`, `author`, and `symbol`, and render each card from this data.

- [ ] **Step 4: Verify GREEN**

```bash
pnpm test -- --run
```

### Task 2: Minimal white card interface

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/HackathonOrbitCarousel.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add failing decoration assertions**

Assert seven settings pills and seven decorative line-art containers, all with `aria-hidden="true"`.

- [ ] **Step 2: Render decoration**

Add settings pill, corner brackets, line symbol, grid, and highlight elements while preserving the button structure.

- [ ] **Step 3: Style cards**

Use white typography, borders, fine lines, low-opacity grid backgrounds, and responsive type sizes. Keep content legible on the 150 px mobile cards.

- [ ] **Step 4: Verify**

```bash
pnpm test -- --run
pnpm build
```

Expected: all 14 tests pass and Vite build exits successfully.
