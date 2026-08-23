# MTS Flyout Screen Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перенести логотип Figma и бабочку из трансформируемой карточки в независимый fixed overlay без изменения визуальной анимации.

**Architecture:** Новый `MtsFlyoutOverlay` получает `activation` и рендерит два исходных PNG в фиксированном viewport-слое. `WorksPage` управляет активацией через существующий callback центрального индекса; `ConceptProject` остаётся только карточкой. Существующие keyframes сохраняются, меняются лишь базовый fixed-контекст и trigger selector.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library.

## Global Constraints

- Не менять главную и страницу «Обо мне».
- Не менять математику, размеры и жесты карусели.
- Не менять PNG, длительности, easing, blur, opacity, повороты и финальные масштабы.
- Overlay ниже modal/fixed chrome и не принимает pointer events.
- Изменение должно иметь простой точный обратный путь.

---

### Task 1: Создать независимый flyout-компонент

**Files:**
- Create: `src/maria/MtsFlyoutOverlay.tsx`
- Create: `src/maria/MtsFlyoutOverlay.test.tsx`

**Interfaces:**
- Consumes: `activation: number`.
- Produces: `.mts-flyout-overlay` с двумя исходными PNG или `null` при `activation === 0`.

- [ ] Написать failing tests на отсутствие overlay при 0, два изображения при 1 и новый `data-activation` после rerender.
- [ ] Запустить `pnpm exec vitest run src/maria/MtsFlyoutOverlay.test.tsx` и подтвердить RED.
- [ ] Реализовать минимальный компонент с `key={activation}`, `aria-hidden="true"` и `draggable="false"`.
- [ ] Повторить targeted test и подтвердить GREEN.

### Task 2: Подключить активацию на уровне WorksPage

**Files:**
- Modify: `src/maria/WorksPage.tsx`
- Modify: `src/maria/ConceptProject.tsx`
- Modify: `src/maria/WorksCardCarousel.test.tsx`

**Interfaces:**
- Consumes: `WORKS_PROJECT_INDEX`, `onCenteredIndexChange`.
- Produces: увеличение activation при новом входе MTS в центр и удаление overlay при уходе.

- [ ] Сначала изменить компонентный тест: внутри MTS-карточки не должно быть flyout PNG.
- [ ] Запустить тест и подтвердить RED.
- [ ] Удалить два flyout `<img>` из `ConceptProject`.
- [ ] В `WorksPage` добавить `flyoutActivation`, `flyoutVisible` и previous index; при переходе на MTS увеличить activation и показать overlay, при уходе скрыть.
- [ ] Сохранить paint splash callback в том же обработчике без изменения его поведения.
- [ ] Запустить целевые тесты и подтвердить GREEN.

### Task 3: Перенести визуальную систему в fixed overlay

**Files:**
- Modify: `src/styles.test.js`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `.mts-flyout-overlay`, `.mts-flyout-overlay__logo`, `.mts-flyout-overlay__butterfly`.
- Produces: fixed viewport-layer с прежними keyframes.

- [ ] Сначала изменить CSS-контракты: overlay `position:fixed; inset:0`, отдельные fixed-positioned изображения, отсутствие старого `.is-centered` trigger.
- [ ] Запустить style test и подтвердить RED.
- [ ] Перенести базовые правила на новые классы и применять animation непосредственно к overlay-изображениям.
- [ ] Перевести стартовые координаты в viewport units с отдельной mobile-коррекцией; keyframe percentages, easing, blur, opacity, rotate и scale сохранить.
- [ ] Обновить reduced-motion selector.
- [ ] Запустить style test и подтвердить GREEN.

### Task 4: Проверка и точка отката

**Files:**
- Verify all changed files.

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces: проверенная обратимая реализация.

- [ ] Запустить `pnpm test -- --run`.
- [ ] Запустить `pnpm build`.
- [ ] Проверить, что flyout PNG встречаются только в `MtsFlyoutOverlay`.
- [ ] Проверить, что исходные `@keyframes mts-logo-flyout-to-viewer` и `mts-butterfly-flyout-to-viewer` сохранили все фазы.
- [ ] Зафиксировать обратный путь: удалить два новых файла, вернуть два `<img>` в `ConceptProject`, вернуть старые CSS-классы и удалить state из `WorksPage`.

Git commit не включён: текущая исходная папка не является Git-репозиторием.
