# Mixed Orbit Card Sizes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать карточки проектов на странице «Хакатоны и хобби» разного постоянного размера и дополнительно увеличивать активную карточку.

**Architecture:** Категория размера хранится рядом с данными проекта и преобразуется в числовой множитель отдельной чистой функцией. Компонент объединяет этот множитель с существующим масштабом орбитальной позиции через CSS-переменные, а мобильные стили смягчают разницу размеров.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Семь проектов и их текущий порядок не меняются.
- Базовые множители: `large = 1.14`, `medium = 1`, `compact = 0.88`.
- Активная карточка получает дополнительный множитель `1.12`.
- Итоговый масштаб равен `масштаб позиции × базовый размер проекта × увеличение активной карточки`.
- Клик, автоперелистывание, свайп, локализация и маршруты сохраняют текущее поведение.
- На экранах до `600px` визуальная разница размеров должна быть смягчена CSS-переменными.
- Новые зависимости не добавляются.
- Текущая рабочая папка не является Git-репозиторием, поэтому шаги коммита не выполняются.

---

### Task 1: Модель размеров и итоговый масштаб

**Files:**
- Modify: `src/maria/HackathonOrbitCarousel.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `export type OrbitCardSize = 'large' | 'medium' | 'compact'`
- Produces: `export function cardSizeScale(size: OrbitCardSize): number`
- Produces: `export function composedOrbitScale(positionScale: number, sizeScale: number, active: boolean): number`
- Consumes: существующие `projectsFor`, `orbitPose` и данные `projectTitles`.

- [ ] **Step 1: Написать падающие тесты чистых функций**

В импорт из `./maria/HackathonOrbitCarousel` добавить `cardSizeScale` и `composedOrbitScale`, затем добавить проверки:

```ts
expect(cardSizeScale('large')).toBe(1.14)
expect(cardSizeScale('medium')).toBe(1)
expect(cardSizeScale('compact')).toBe(0.88)
expect(composedOrbitScale(0.86, 1.14, false)).toBeCloseTo(0.9804)
expect(composedOrbitScale(1, 1.14, true)).toBeCloseTo(1.2768)
```

- [ ] **Step 2: Запустить тест и подтвердить RED**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm test -- --run
```

Expected: FAIL, потому что `cardSizeScale` и `composedOrbitScale` ещё не экспортируются.

- [ ] **Step 3: Добавить минимальную модель размеров**

В `HackathonOrbitCarousel.tsx` определить:

```ts
export type OrbitCardSize = 'large' | 'medium' | 'compact'

const CARD_SIZE_SCALE: Record<OrbitCardSize, number> = {
  large: 1.14,
  medium: 1,
  compact: 0.88,
}

export function cardSizeScale(size: OrbitCardSize) {
  return CARD_SIZE_SCALE[size]
}

export function composedOrbitScale(positionScale: number, sizeScale: number, active: boolean) {
  return positionScale * sizeScale * (active ? 1.12 : 1)
}
```

Добавить полю каждого элемента `projectTitles` категорию `size` с чередованием:

```ts
['large', 'compact', 'medium', 'large', 'medium', 'compact', 'large']
```

Функция `projectsFor` должна возвращать поле `size`.

- [ ] **Step 4: Запустить тест и подтвердить GREEN**

Run: команда из шага 2.

Expected: новые проверки проходят, все существующие тесты остаются зелёными.

---

### Task 2: Подключение индивидуального размера к карточкам

**Files:**
- Modify: `src/maria/HackathonOrbitCarousel.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `cardSizeScale(size)` и `composedOrbitScale(positionScale, sizeScale, active)`.
- Produces: атрибут `data-card-size` и CSS-переменные `--orbit-position-scale`, `--orbit-card-size-scale`, `--orbit-active-scale`.

- [ ] **Step 1: Написать падающий DOM-тест**

После получения `projectCards` добавить:

```ts
expect(projectCards.map((card) => card.getAttribute('data-card-size'))).toEqual([
  'large',
  'compact',
  'medium',
  'large',
  'medium',
  'compact',
  'large',
])
expect(projectCards[0]).toHaveStyle({
  '--orbit-position-scale': '1',
  '--orbit-card-size-scale': '1.14',
  '--orbit-active-scale': '1.12',
})
expect(projectCards[1]).toHaveStyle({
  '--orbit-card-size-scale': '0.88',
  '--orbit-active-scale': '1',
})
```

После `fireEvent.click(projectCards[2])` добавить:

```ts
expect(projectCards[0]).toHaveAttribute('data-card-size', 'large')
expect(projectCards[2]).toHaveAttribute('data-card-size', 'medium')
expect(projectCards[2]).toHaveStyle({ '--orbit-active-scale': '1.12' })
```

- [ ] **Step 2: Запустить тест и подтвердить RED**

Run: команда из Task 1, Step 2.

Expected: FAIL из-за отсутствующих `data-card-size` и CSS-переменных.

- [ ] **Step 3: Передать размеры в DOM**

В цикле рендера вычислить:

```ts
const isActive = offset === 0
const sizeScale = cardSizeScale(project.size)
```

На кнопку добавить:

```tsx
data-card-size={project.size}
```

Текущую переменную `--orbit-scale` заменить на:

```ts
'--orbit-position-scale': pose.scale,
'--orbit-card-size-scale': sizeScale,
'--orbit-active-scale': isActive ? 1.12 : 1,
'--orbit-scale': composedOrbitScale(pose.scale, sizeScale, isActive),
```

Условие класса `is-active` и `aria-pressed` должно использовать `isActive`.

- [ ] **Step 4: Запустить тест и подтвердить GREEN**

Run: команда из Task 1, Step 2.

Expected: 14 тестов и новые проверки проходят.

---

### Task 3: Смягчение размеров на мобильных и полная проверка

**Files:**
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `data-card-size` и CSS-переменные карточки.
- Produces: мобильные значения `--orbit-card-size-scale` для трёх категорий.

- [ ] **Step 1: Написать падающую проверку адаптивных селекторов**

Добавить чтение `src/styles.css` через существующий тестовый способ, если он уже используется в файле. Если CSS импортируется как строка не поддерживается текущим раннером, проверить наличие атрибутов категорий в DOM и оставить правила под контролем production-сборки. Требуемые селекторы:

```css
@media(max-width:600px) {
  .maria-orbit-card[data-card-size="large"] { --orbit-card-size-scale:1.08!important }
  .maria-orbit-card[data-card-size="medium"] { --orbit-card-size-scale:1!important }
  .maria-orbit-card[data-card-size="compact"] { --orbit-card-size-scale:.94!important }
}
```

- [ ] **Step 2: Добавить мобильные правила**

В существующий блок `@media(max-width:600px)` добавить ровно три селектора из Step 1. Формула трансформации карточек остаётся текущей и продолжает использовать `scale(var(--orbit-scale))`; JavaScript передаёт полный масштаб для десктопа, а мобильные правила переопределяют только базовую размерную переменную в случае перехода CSS-трансформаций на составной `calc()`.

Чтобы мобильное переопределение реально влияло на результат без JavaScript-пересчёта, изменить все трансформации карточек с:

```css
scale(var(--orbit-scale))
```

на:

```css
scale(calc(var(--orbit-position-scale) * var(--orbit-card-size-scale) * var(--orbit-active-scale)))
```

как в базовых, так и в мобильных селекторах позиций.

- [ ] **Step 3: Запустить полный набор тестов**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm test -- --run
```

Expected: все тесты PASS без предупреждений.

- [ ] **Step 4: Запустить production-сборку**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm build
```

Expected: TypeScript и Vite завершаются с exit code `0`, создаются `dist/index.html`, `dist/404.html` и `dist/.nojekyll`.

## Self-review

- Покрыты постоянные категории размеров, увеличение активной карточки и мобильное смягчение.
- Сигнатуры `cardSizeScale` и `composedOrbitScale` совпадают во всех задачах.
- Существующие орбитальные слои, opacity, rotateY и rotateZ не изменяются.
- Клики и свайпы проверяются существующим интеграционным тестом.
- План не добавляет зависимости, маршруты или новый контент.
