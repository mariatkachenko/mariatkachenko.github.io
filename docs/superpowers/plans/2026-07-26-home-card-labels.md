# Home Card Labels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show “Работы” and “Обо мне” on the home cards while preserving the internal page names and routes.

**Architecture:** Add dedicated localized home-card title fields instead of reusing internal page titles. `PortfolioPage` consumes the new fields; existing `works` and `hackathons` copy remains unchanged for page semantics.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, Vite

## Global Constraints

- Russian home labels are `Работы` and `Обо мне`.
- English home labels are `Works` and `About Me`.
- Routes remain `/works` and `/hackathons`.
- Internal page names remain unchanged.

---

### Task 1: Separate home labels from internal page names

**Files:**
- Modify: `src/maria/i18n.ts`
- Modify: `src/maria/PortfolioPage.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `copyFor(language).homeWorks`
- Produces: `copyFor(language).homeAbout`
- Consumes: existing `PortfolioCard` title and href properties

- [ ] **Step 1: Write failing home-label tests**

```ts
expect(screen.getByRole('link', { name: 'Работы' })).toHaveAttribute('href', '/works')
expect(screen.getByRole('link', { name: 'Обо мне' })).toHaveAttribute('href', '/hackathons')
expect(screen.queryByRole('link', { name: 'Рабочие задачи' })).not.toBeInTheDocument()
```

Also switch to English and assert:

```ts
expect(screen.getByRole('link', { name: 'Works' })).toBeInTheDocument()
expect(screen.getByRole('link', { name: 'About Me' })).toBeInTheDocument()
```

- [ ] **Step 2: Verify RED**

Run:

```bash
pnpm vitest run src/App.test.tsx
```

Expected: the new localized link names are absent.

- [ ] **Step 3: Add dedicated localized copy**

Add to `copy.ru`:

```ts
homeWorks: 'Работы',
homeAbout: 'Обо мне',
```

Add to `copy.en`:

```ts
homeWorks: 'Works',
homeAbout: 'About Me',
```

Pass `copy.homeWorks` and `copy.homeAbout` as the two `PortfolioCard` titles without changing their `href` values.

- [ ] **Step 4: Verify focused and full behavior**

```bash
pnpm vitest run src/App.test.tsx
pnpm vitest run
pnpm build
```

Expected: all tests pass and the production build succeeds.
