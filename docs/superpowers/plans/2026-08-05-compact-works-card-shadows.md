# Compact Works Card Shadows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сузить направленное градиентное затемнение карточек с 72% до 48% на десктопе и мобильных устройствах.

**Architecture:** Существующие псевдоэлементы карточек и CSS-переменные сохраняются. Меняется только конечная точка растворения четырёх градиентов.

**Tech Stack:** React, TypeScript, CSS, Vitest, Vite.

## Global Constraints

- Не менять интенсивность, цвет и направление затемнения.
- Светлая и тёмная темы используют одинаковую геометрию градиента.
- Мобильная и десктопная версии используют конечную точку `48%`.

---

### Task 1: Compact gradient shadows

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

- [ ] **Step 1: Write the failing test**

Заменить ожидаемую конечную точку desktop-градиентов с `72%` на `48%`.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- --run src/styles.test.js`
Expected: FAIL, потому что production CSS ещё содержит `72%`.

- [ ] **Step 3: Write minimal implementation**

Заменить `transparent 72%` на `transparent 48%` в светлых и тёмных desktop/mobile правилах карточек.

- [ ] **Step 4: Run verification**

Run: `pnpm test -- --run && pnpm build`
Expected: все тесты и production-сборка проходят.
