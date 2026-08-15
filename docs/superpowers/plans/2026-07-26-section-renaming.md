# Section Renaming Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename both portfolio sections in Russian and English while preserving their routes.

**Architecture:** Update the central i18n copy so navigation, home cards, and accessible labels change together. Add only the CSS adjustment needed for longer card titles.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Vite.

## Global Constraints

- `/works` and `/hackathons` remain unchanged.
- Russian names are `Рабочие задачи` and `Хакатоны и хобби`.
- English names are `Work Projects` and `Hackathons & Hobbies`.

---

### Task 1: Rename sections

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/i18n.ts`
- Modify: `src/styles.css`

- [ ] **Step 1: Update tests and verify RED**

Replace old Russian and English role-name assertions with the new names and keep route assertions unchanged.

```bash
pnpm test -- --run
```

- [ ] **Step 2: Update localized copy**

Change `works` and `hackathons` in both locale objects.

- [ ] **Step 3: Fit longer titles**

Use a smaller responsive font size and tighter leading specifically for the two home-card titles.

- [ ] **Step 4: Verify**

```bash
pnpm test -- --run
pnpm build
```

Expected: all 14 tests pass and Vite build exits successfully.
