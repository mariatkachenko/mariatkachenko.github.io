# Works Page Composition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Уменьшить обложку МТС Pay на 50%, прижать изображение руки к правому краю и добавить едва заметный граффити-паттерн, не меняя модальный просмотрщик.

**Architecture:** Все изменения выполняются в стилях страницы «Рабочие задачи». Интеграционный тест читает CSS через Vite `?raw`, а существующий DOM-тест продолжает проверять iframe презентации.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Десктопная обложка: `width:min(660px,50%)`.
- Мобильная обложка: `width:72%`.
- Изображение руки: `right:0`, без `translateX`.
- Граффити-паттерн: `.maria-works-page::before`, opacity `0.035`; в тёмной теме `0.05`.
- Паттерн создаётся CSS-градиентами без нового ассета.
- `.presentation-modal` и iframe не изменяются.
- Вертикальный и горизонтальный скролл не добавляются.
- Текущая папка не является Git-репозиторием, поэтому шаг коммита отсутствует.

---

### Task 1: Проверка и стили композиции

**Files:**
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `.maria-works-page`, `.maria-works-hand`, `.concept-cover`.
- Produces: `.maria-works-page::before` и новые правила размеров/позиционирования.

- [ ] **Step 1: Написать падающий CSS-тест**

Добавить:

```ts
import styles from './styles.css?raw'
```

И новый тест:

```ts
it('uses the compact works composition without resizing the presentation viewer', () => {
  expect(styles).toContain('.maria-works-page::before')
  expect(styles).toContain('opacity:.035')
  expect(styles).toContain('.maria-works-hand{position:absolute;z-index:0;right:0;')
  expect(styles).toContain('.maria-works-page .concept-cover{width:min(660px,50%)}')
  expect(styles).toContain('.maria-works-page .concept-cover{width:72%}')
  expect(styles).toContain('.presentation-modal>iframe{width:min(92vw,calc(92vh * 1.7777778),1920px)')
})
```

- [ ] **Step 2: Запустить тест и подтвердить RED**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm test -- --run
```

Expected: FAIL из-за отсутствия `::before`, `right:0` и новых размеров обложки.

- [ ] **Step 3: Добавить граффити-паттерн**

В `src/styles.css` добавить:

```css
.maria-works-page::before{
  content:"";
  position:absolute;
  z-index:-1;
  inset:0;
  background:
    linear-gradient(35deg,transparent 48%,currentColor 49% 50%,transparent 51%) 8% 18%/90px 70px,
    linear-gradient(-35deg,transparent 48%,currentColor 49% 50%,transparent 51%) 8% 18%/90px 70px,
    repeating-linear-gradient(112deg,transparent 0 76px,currentColor 77px 78px,transparent 79px 154px);
  opacity:.035;
  pointer-events:none;
}
.theme-dark .maria-works-page::before{opacity:.05}
```

- [ ] **Step 4: Изменить композицию**

Заменить стили руки на:

```css
.maria-works-hand{position:absolute;z-index:0;right:0;bottom:-4vh;width:min(72vw,1380px);pointer-events:none}
```

Добавить:

```css
.maria-works-page .concept-cover{width:min(660px,50%)}
```

В `@media(max-width:600px)` добавить после базового правила:

```css
.maria-works-page .concept-cover{width:72%}
```

- [ ] **Step 5: Запустить тесты и подтвердить GREEN**

Run: команда из Step 2.

Expected: все тесты PASS, включая существующий тест модального iframe.

- [ ] **Step 6: Запустить production-сборку**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm build
```

Expected: TypeScript и Vite завершаются с exit code `0`; `dist` создаётся без ошибок.

## Self-review

- Обложка уменьшается только на странице `maria-works-page`.
- Мобильное переопределение следует после десктопного.
- Размеры и стили модального окна не редактируются.
- Рука остаётся под обложкой и не перехватывает события.
- Граффити находится ниже руки и не влияет на доступность.
