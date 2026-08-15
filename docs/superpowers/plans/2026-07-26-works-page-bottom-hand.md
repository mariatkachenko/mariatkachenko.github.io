# Works Page Bottom Hand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить изображение руки с телефоном по центру нижнего края страницы «Рабочие задачи», за обложкой презентации.

**Architecture:** PNG хранится как локальный публичный ассет. `WorksPage` рендерит отдельный декоративный слой перед сеткой презентации, а CSS управляет его абсолютным позиционированием, порядком слоёв и мобильным масштабом.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Ассет: `public/assets/maria/works-phone-hand.png`.
- Изображение располагается над фоном, но под обложкой презентации и фиксированной навигацией.
- Десктопная ширина: `min(72vw, 1380px)`.
- Мобильная ширина: `118vw`.
- Изображение сохраняет пропорции, имеет пустой `alt`, `aria-hidden="true"` и `pointer-events:none`.
- Вертикальный скролл не добавляется.
- Поведение обложки и модального просмотрщика не меняется.
- Новые зависимости не добавляются.
- Текущая папка не является Git-репозиторием, поэтому шаг коммита отсутствует.

---

### Task 1: Декоративный слой страницы

**Files:**
- Create: `public/assets/maria/works-phone-hand.png`
- Modify: `src/maria/WorksPage.tsx`
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: декоративный элемент `.maria-works-hand` с дочерним изображением.
- Consumes: существующие `.maria-works-page`, `.maria-works-grid` и `ConceptProject`.

- [ ] **Step 1: Написать падающий тест**

В тесте маршрута «Рабочие задачи» после получения `cover` добавить:

```ts
const hand = container.querySelector<HTMLImageElement>('.maria-works-hand img')
expect(hand).toHaveAttribute('src', '/assets/maria/works-phone-hand.png')
expect(hand).toHaveAttribute('alt', '')
expect(hand).toHaveAttribute('aria-hidden', 'true')
expect(container.querySelector('.maria-works-grid')).toContainElement(cover)
```

- [ ] **Step 2: Запустить тест и подтвердить RED**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm test -- --run
```

Expected: FAIL, потому что `.maria-works-hand img` отсутствует.

- [ ] **Step 3: Скопировать ассет**

Скопировать:

```text
/var/folders/ck/cfkrws29783_w4l2m0dqcbs80000gn/T/codex-clipboard-509e6bb7-669f-4fb8-b063-f07598e55cea.png
```

в:

```text
public/assets/maria/works-phone-hand.png
```

Проверить `file public/assets/maria/works-phone-hand.png`: ожидается PNG `2872 x 1344`, RGBA.

- [ ] **Step 4: Добавить минимальную разметку**

Перед `.maria-works-grid` в `WorksPage` добавить:

```tsx
<div className="maria-works-hand" aria-hidden="true">
  <img src="/assets/maria/works-phone-hand.png" alt="" aria-hidden="true" />
</div>
```

- [ ] **Step 5: Добавить слои и адаптивные стили**

В `src/styles.css` добавить:

```css
.maria-works-page{isolation:isolate}
.maria-works-hand{position:absolute;z-index:0;left:50%;bottom:-4vh;width:min(72vw,1380px);transform:translateX(-50%);pointer-events:none}
.maria-works-hand img{display:block;width:100%;height:auto}
.maria-works-grid{position:relative;z-index:1}
```

В `@media(max-width:600px)` добавить:

```css
.maria-works-hand{bottom:3vh;width:118vw}
```

- [ ] **Step 6: Запустить тест и подтвердить GREEN**

Run: команда из Step 2.

Expected: все тесты PASS.

- [ ] **Step 7: Запустить production-сборку**

Run:

```bash
env PATH=/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:/usr/bin:/bin:/usr/sbin:/sbin pnpm build
```

Expected: TypeScript и Vite завершаются с exit code `0`; создаются `dist/index.html`, `dist/404.html` и `dist/.nojekyll`.

## Self-review

- Спецификация покрыта одним изолированным декоративным слоем.
- Порядок слоёв явный: изображение `z-index:0`, контент `z-index:1`, фиксированная навигация сохраняет более высокий текущий индекс.
- Изображение не влияет на клики и доступность.
- Существующая высота `100svh` и `overflow:hidden` предотвращают скролл.
- Маршруты, локализация и модальный просмотрщик не изменяются.
