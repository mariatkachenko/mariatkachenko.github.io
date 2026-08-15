# Home Back Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current subpage back pill with a themed Comforter “На Главную” link and curved SVG arrow.

**Architecture:** Introduce one shared `HomeBackButton` component used by both subpages. Keep navigation and view-transition behavior unchanged; CSS owns the desktop/mobile presentation.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library

## Global Constraints

- Preserve navigation to `/` through `navigateWithTransition`.
- Preserve `view-transition-name: back-control` and fixed positioning.
- Use an inline SVG arrow with `currentColor` and `aria-hidden="true"`.
- Support Russian, English, light/dark themes, desktop, and mobile.

---

### Task 1: Shared home control

**Files:**
- Create: `src/maria/HomeBackButton.tsx`
- Modify: `src/maria/WorksPage.tsx`
- Modify: `src/maria/HackathonsPage.tsx`
- Modify: `src/maria/i18n.ts`
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `language: Language`, `copyFor(language).back`, `navigateWithTransition('/')`
- Produces: `HomeBackButton({ language }: { language: Language })`

- [ ] **Step 1: Write a failing route test**

Assert that a subpage exposes a button named `На Главную` with a decorative SVG child.

- [ ] **Step 2: Verify the test fails**

Run `pnpm test -- --run src/App.test.tsx`; expect failure because the current label is `Назад` and the control has no SVG.

- [ ] **Step 3: Add the shared component and styles**

Render the translated label and inline curved arrow, replace both duplicated buttons, and style the transparent Comforter control responsively.

- [ ] **Step 4: Verify tests and build**

Run `pnpm test -- --run` and `pnpm build`; expect all checks to pass.

