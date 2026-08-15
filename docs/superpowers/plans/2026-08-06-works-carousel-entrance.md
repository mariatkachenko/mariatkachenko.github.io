# Works Carousel Entrance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить при открытии страницы «Работы» короткое раскрытие пяти карточек из компактной центральной стопки в существующую раскладку.

**Architecture:** `WorksCardCarousel` управляет единственным временным состоянием `isEntering`, выставляет класс контейнера и CSS-индекс каждой карточки, а после 600 мс снимает состояние. Конечные позиции продолжат вычисляться существующими pose-функциями; CSS входного состояния лишь временно переопределяет transform. Pointer и wheel игнорируются во время входа.

**Tech Stack:** React 19, TypeScript, CSS animations/transitions, Vitest, Testing Library, Vite.

## Global Constraints

- Входная анимация длится около 600 мс и запускается только при новом монтировании страницы.
- Десктопная стопка раскрывается горизонтально, мобильная — вертикально.
- Конечная раскладка, пять видимых карточек, слои, размеры и ручная навигация не меняются.
- Во время входа drag и wheel заблокированы.
- При `prefers-reduced-motion: reduce` используется сразу конечное положение.

---

### Task 1: Состояние входа и блокировка управления

**Files:**
- Modify: `src/maria/WorksCardCarousel.tsx`
- Test: `src/maria/WorksCardCarousel.test.tsx`

**Interfaces:**
- Consumes: существующие `beginDrag`, `moveDrag`, `handleWheel`, `WORKS_CARD_COUNT`.
- Produces: класс `.is-entering`, CSS-переменная `--works-entry-index`, автоматическое снятие класса через 600 мс.

- [ ] **Step 1: Write the failing tests**

Добавить fake timers и тест, который проверяет начальный класс, CSS-индексы и снятие класса:

```tsx
vi.useFakeTimers()
const { container } = render(<WorksCardCarousel onOpen={vi.fn()} language="ru" />)
const carousel = container.querySelector('.maria-works-carousel')!
expect(carousel).toHaveClass('is-entering')
expect(container.querySelectorAll('.maria-works-deck-card')[6]).toHaveStyle({ '--works-entry-index': '0' })
act(() => vi.advanceTimersByTime(600))
expect(carousel).not.toHaveClass('is-entering')
vi.useRealTimers()
```

Добавить тест, что pointer move и wheel не меняют позицию до окончания таймера, а после 600 мс снова меняют её.

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test -- --run src/maria/WorksCardCarousel.test.tsx
```

Expected: FAIL — класс `is-entering` и `--works-entry-index` отсутствуют.

- [ ] **Step 3: Write minimal implementation**

В `WorksCardCarousel`:

```tsx
const WORKS_ENTRY_DURATION_MS = 600
const [isEntering, setIsEntering] = useState(true)

useEffect(() => {
  const timer = window.setTimeout(() => setIsEntering(false), WORKS_ENTRY_DURATION_MS)
  return () => window.clearTimeout(timer)
}, [])
```

Добавить `is-entering` к контейнеру, ранний `return` в drag/wheel-обработчики и для каждой видимой карточки вычислить индекс задержки от центра `Math.abs(offset)` через `--works-entry-index`.

- [ ] **Step 4: Run focused tests**

Run:

```bash
pnpm test -- --run src/maria/WorksCardCarousel.test.tsx
```

Expected: PASS.

### Task 2: Desktop/mobile визуальное раскрытие

**Files:**
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

**Interfaces:**
- Consumes: `.maria-works-carousel.is-entering`, `--works-entry-index`, текущие desktop/mobile transform карточек.
- Produces: начальная компактная стопка и переход к текущей pose-раскладке.

- [ ] **Step 1: Write the failing CSS test**

Проверить наличие desktop/mobile правил, задержки и reduced-motion:

```js
expect(styles).toContain('.maria-works-carousel.is-entering .maria-works-deck-card{')
expect(styles).toContain('transition-delay:calc(var(--works-entry-index) * 38ms)')
expect(styles).toContain('.maria-works-carousel.is-entering .maria-works-deck-card{transform:translate3d(-50%,calc(-50% + var(--works-entry-stack-y)),0)')
expect(styles).toContain('.maria-works-carousel.is-entering .maria-works-deck-card{transition:none!important;transform:')
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test -- --run src/styles.test.js
```

Expected: FAIL — входные CSS-правила отсутствуют.

- [ ] **Step 3: Implement CSS entrance**

Для обычного состояния добавить transform-transition с пружинным easing и задержкой по `--works-entry-index`. Для `.is-entering` собрать desktop-карточки около `x=0` с небольшим `rotateY`; в мобильном media query собрать их около `y=0` с небольшим `rotateX`. В reduced-motion отключить задержки и сразу оставить конечный transform.

- [ ] **Step 4: Run focused tests**

Run:

```bash
pnpm test -- --run src/styles.test.js src/maria/WorksCardCarousel.test.tsx
```

Expected: PASS.

### Task 3: Полная проверка

**Files:**
- Verify: `src/maria/WorksCardCarousel.tsx`
- Verify: `src/styles.css`

**Interfaces:**
- Consumes: готовую входную анимацию.
- Produces: подтверждённую production-сборку.

- [ ] **Step 1: Run all tests**

```bash
pnpm test -- --run
```

Expected: все тесты PASS.

- [ ] **Step 2: Run production build**

```bash
pnpm build
```

Expected: TypeScript и Vite завершаются с кодом 0.

- [ ] **Step 3: Verify scope**

Проверить, что изменены только входное состояние, CSS входа, тесты и документация; конечные pose-функции и данные карточек не менялись.
