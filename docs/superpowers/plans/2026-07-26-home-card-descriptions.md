# Home Card Descriptions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the localized descriptions on the two home cards.

**Architecture:** Keep `PortfolioPage` and `PortfolioCard` unchanged. Update the existing `worksNote` and `hackathonsNote` localization values, which are consumed only by the home page.

**Tech Stack:** TypeScript, React 19, Vitest, Testing Library, Vite

## Global Constraints

- Do not alter titles, routes, layout, or styles.
- Provide exact Russian and English copy from the approved specification.

---

### Task 1: Update localized card descriptions

**Files:**
- Modify: `src/maria/i18n.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: updated `copyFor(language).worksNote`
- Produces: updated `copyFor(language).hackathonsNote`

- [ ] **Step 1: Add failing tests**

Assert the Russian descriptions after rendering:

```ts
expect(screen.getByText('Рабочие задачи, хакатоны и проекты')).toBeInTheDocument()
expect(screen.getByText('Опыт работы, хобби и отзывы коллег')).toBeInTheDocument()
```

After switching to English, assert:

```ts
expect(screen.getByText('Work tasks, hackathons and projects')).toBeInTheDocument()
expect(screen.getByText('Work experience, hobbies and colleague feedback')).toBeInTheDocument()
```

- [ ] **Step 2: Verify RED**

```bash
pnpm vitest run src/App.test.tsx
```

Expected: all four new descriptions are absent.

- [ ] **Step 3: Replace localized values**

Update `worksNote` and `hackathonsNote` in both language objects with the exact approved strings.

- [ ] **Step 4: Verify focused and full behavior**

```bash
pnpm vitest run src/App.test.tsx
pnpm vitest run
pnpm build
```

Expected: all tests and the production build pass.
