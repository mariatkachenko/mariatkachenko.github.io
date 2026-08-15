# MTS Hover Flag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить анимированный флажок МТС только карточке «Концепт v3 — Преза» и placeholder-карточке индекса 8 с обложкой `works-cover-03.jpg`.

**Architecture:** `WorksProjectCard` получает явный boolean-проп `mtsFlag` и условно рендерит декоративный элемент. `ConceptProject` и `WorksCardCarousel` передают проп только двум целевым экземплярам. Визуал и интерактивные состояния реализуются CSS без дополнительного растрового ассета.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Рендерить ровно два флажка.
- Не определять принадлежность к МТС по позиции элемента в DOM или тексту.
- Не менять размеры и расположение карточек.
- Поддержать hover, focus-visible, touch active, светлую/тёмную темы и мобильную версию.

---

### Task 1: Flag markup and targeting

**Files:**
- Modify: `src/maria/WorksProjectCard.tsx`
- Modify: `src/maria/ConceptProject.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`
- Test: `src/maria/WorksCardCarousel.test.tsx`

- [ ] **Step 1: Write the failing test**

Проверить наличие двух `.works-project-card__mts-flag`, один внутри project-карточки и один внутри `data-index="8"`; убедиться, что других флажков нет.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`
Expected: FAIL, найдено `0` флажков вместо `2`.

- [ ] **Step 3: Write minimal implementation**

Добавить `mtsFlag?: boolean`, условную декоративную разметку и передать проп у двух целевых карточек.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- --run src/maria/WorksCardCarousel.test.tsx`
Expected: PASS.

### Task 2: Flag visual states

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

- [ ] **Step 1: Write the failing CSS test**

Проверить базовое скрытое состояние и селекторы `:hover`, `:focus-visible`, `:active`.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- --run src/styles.test.js`
Expected: FAIL, CSS флажка отсутствует.

- [ ] **Step 3: Write minimal CSS**

Добавить красный свисающий флажок, загиб, белый логотип, адаптивный размер и анимацию появления без изменения layout.

- [ ] **Step 4: Run full verification**

Run: `pnpm test -- --run && pnpm build`
Expected: все тесты и production-сборка проходят.
