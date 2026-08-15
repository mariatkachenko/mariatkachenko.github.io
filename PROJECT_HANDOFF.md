# Maria Tkachenko Portfolio — полный handoff текущей реализации

> Актуально на 9 августа 2026 года. Документ описывает **фактически работающий код**, а не всю историю экспериментов из чата. Источник истины — `src/`, `public/`, `package.json` и актуальные тесты.

## 1. Назначение документа

Этот файл нужен для безопасного разделения дальнейшей разработки между разными чатами, агентами и субагентами. Он фиксирует:

- текущую архитектуру и маршруты;
- визуальную и интерактивную логику каждой страницы;
- адаптивное поведение;
- темы и локализацию;
- используемые ассеты и внешние зависимости;
- тесты, сборку и публикацию;
- legacy-код и технические риски;
- рекомендуемые зоны владения для параллельной работы.

## 2. Краткое состояние проекта

Проект — одностраничное React-портфолио UI/UX-дизайнера Марии Ткаченко с тремя состояниями-маршрутами:

| URL | Внутреннее имя | Видимый смысл |
| --- | --- | --- |
| `/` | `PortfolioPage` | Главная с двумя карточками: «Работы» и «Обо мне» |
| `/works` | `WorksPage` | Рабочие задачи: карусель карточек, рука с телефоном, просмотр презентации |
| `/hackathons` | `HackathonsPage` | «Хакатоны и хобби»: 3D-космонавт в сфере и орбитальная карусель |

Основные свойства:

- полноэкранный интерфейс без обычного вертикального скролла страниц;
- собственный лёгкий роутер поверх History API;
- светлая и тёмная темы;
- русский и английский языки;
- фиксированные верхняя навигация и нижние контролы на всех страницах;
- анимации переходов через View Transitions API с fallback;
- разные композиции каруселей для desktop и mobile;
- глобальные звуки hover/click через Web Audio API;
- поддержка `prefers-reduced-motion`;
- GitHub Pages-совместимая production-сборка.

## 3. Технологический стек

- React + React DOM;
- TypeScript;
- Vite;
- Vitest;
- Testing Library + jsdom;
- CSS без CSS Modules и без CSS-in-JS;
- `<model-viewer>` версии `4.3.1`, загружаемый CDN-скриптом из `index.html`;
- Figma prototype внутри `iframe`;
- Web Audio API для звуков;
- Canvas 2D для следа курсора;
- View Transitions API там, где браузер поддерживает его.

В проекте нет Redux, React Router, серверной части, базы данных или CMS. Состояние локальное и хранится в React-компонентах.

## 4. Запуск, проверка и сборка

### Команды

```bash
pnpm install
pnpm dev
pnpm test -- --run
pnpm build
```

Если используется bundled Node среды Codex:

```bash
export PATH="/Users/mary/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
./node_modules/.bin/vitest run
./node_modules/.bin/tsc -b
./node_modules/.bin/vite build
```

Последняя зафиксированная проверка:

- 5 test files passed;
- 61 tests passed;
- `tsc -b` прошёл;
- production build Vite прошёл.

### Production output

`pnpm build` выполняет:

1. TypeScript build;
2. Vite build в `dist/`;
3. копирование `dist/index.html` в `dist/404.html`;
4. создание `dist/.nojekyll`.

`404.html` нужен, чтобы прямые ссылки `/works` и `/hackathons` корректно открывались на GitHub Pages и затем нормализовались клиентским кодом.

## 5. Структура репозитория

```text
.
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig*.json
├── public/
│   ├── favicon.svg
│   └── assets/maria/           # основные runtime-ассеты портфолио
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # глобальное состояние и выбор страницы
│   ├── router.ts               # History API + View Transitions
│   ├── styles.css              # вся активная визуальная система
│   ├── maria/                  # активная реализация портфолио
│   ├── components/             # legacy Portier-компоненты
│   ├── grain/                  # legacy Grain-компоненты
│   └── pages/                  # legacy страницы прошлых итераций
├── docs/superpowers/
│   ├── specs/                  # исторические дизайн-спеки итераций
│   └── plans/                  # исторические планы итераций
├── dist/                       # текущий локальный build
├── work/mariatkachenko.github.io/
│                               # отдельная копия ранее подготовленного deploy
└── outputs/maria-tkachenko-portfolio.zip
```

Важно: `dist/`, `work/` и `outputs/` не являются исходным кодом. Любые правки надо делать в `src/` и `public/`, затем пересобирать.

## 6. Глобальная архитектура приложения

### Entry point

`src/main.tsx`:

- импортирует `src/styles.css`;
- монтирует `<App />` в `#root`;
- использует `StrictMode`.

`index.html`:

- задаёт title и meta description;
- подключает favicon;
- загружает `<model-viewer>` с CDN;
- подключает `src/main.tsx`.

### App shell

`src/App.tsx` владеет глобальным состоянием:

```ts
theme: 'light' | 'dark'
language: 'ru' | 'en'
path: '/' | '/works' | '/hackathons'
transitionDirection: 'forward' | 'back' | null
```

На верхнем уровне всегда смонтированы:

- `InteractionSounds`;
- `FixedChrome`;
- контейнер текущего route content.

Это принципиально: верхние и нижние кнопки не находятся внутри анимируемой страницы, поэтому не должны исчезать, мигать или менять слой при переходах.

### Выбор страницы

```text
App
├── /             → PortfolioPage
├── /works        → WorksPage
└── /hackathons   → HackathonsPage
```

Любой неизвестный путь нормализуется в `/`.

## 7. Роутинг и переходы

Файл: `src/router.ts`.

### Навигация

`navigate(path)`:

- вызывает `history.pushState`;
- вручную диспатчит `popstate`;
- сбрасывает scroll position.

`navigateWithTransition(path)`:

- учитывает `prefers-reduced-motion`;
- если View Transitions API недоступен — вызывает обычный `navigate`;
- если доступен — оборачивает навигацию в `document.startViewTransition`;
- выставляет `data-transition-route` для корректного управления слоями.

### Направление

- переход с главной на подстраницу — `forward`;
- возврат на `/` — `back`;
- переход на ту же страницу — без анимации направления.

### View transition names

Основные имена в CSS:

- `works-route` — карточка «Работы» и страница `/works`;
- `about-route` — карточка «Обо мне» и страница `/hackathons`;
- `works-hand` — рука на странице работ;
- `works-carousel` — карусель работ;
- `fixed-header` — верхний chrome;
- `fixed-controls` — нижний chrome;
- `back-control` — кнопка возврата.

### Нативный системный swipe/back и карусели

Файл: `src/maria/useCarouselNavigationGuard.ts`.

Логика:

- когда указатель находится над областью карусели, на `<html>` ставится `data-carousel-navigation-guard="true"`;
- CSS включает `overscroll-behavior-x: none` только в этой зоне;
- горизонтальный wheel блокируется, если событие произошло над каруселью;
- вне карусели системная навигация браузера не блокируется.

Это используется обеими каруселями. Любые изменения жестов надо проверять отдельно на Safari/macOS и Safari/iOS, потому что системный history swipe платформозависим.

## 8. Фиксированный интерфейс

Файл: `src/maria/FixedChrome.tsx`.

### Верхняя панель

Содержит:

- avatar + имя;
- email;
- Telegram username;
- Moscow;
- ссылку «Связаться» / `Contact`.

### Нижняя панель

Содержит:

- RU / EN;
- переключение светлой и тёмной темы.

### Важное ограничение

`FixedChrome` должен оставаться единственным экземпляром вне `.maria-route-content`. Нельзя дублировать header/footer внутри страниц: это возвращает ранее исправленный баг с миганием и изменением веса текста во время transition.

## 9. Главная страница

Файлы:

- `src/maria/PortfolioPage.tsx`;
- `src/maria/PortfolioCard.tsx`;
- `src/maria/InteractiveBackground.tsx`;
- `src/maria/ShimmerTrail.tsx`.

### Фон

В DOM одновременно находятся две версии портрета:

- `/assets/maria/home-portrait-light.png`;
- `/assets/maria/home-portrait-dark.png`.

CSS показывает нужную картинку в зависимости от темы. Такой подход обеспечивает мгновенное переключение темы, но браузер может загрузить оба изображения.

`InteractiveBackground` на главной вызывается с `showModel={false}`, поэтому 3D-модель на главной не рендерится. Shimmer trail остаётся включённым.

### Карточки

Две карточки:

- `works` → `/works`;
- `hackathons` → `/hackathons`.

Используемые картинки:

- `/assets/maria/home-card-works.png`;
- `/assets/maria/home-card-about.png`.

Поверх изображений выводится текст шрифтом Comforter:

- «Работы» / `Works`;
- «Обо мне» / `About Me`.

Карточки имеют перспективный ракурс «летят к зрителю», hover через transform/drop-shadow и служат источником route transition.

### Mobile

В `@media (max-width: 600px)` карточки перестраиваются в мобильную парную композицию. Изменения размеров/положений надо синхронизировать с transition, иначе раскрытие карточки может выглядеть как скачок.

## 10. Страница «Работы»

Файлы:

- `src/maria/WorksPage.tsx`;
- `src/maria/WorksCardCarousel.tsx`;
- `src/maria/WorksProjectCard.tsx`;
- `src/maria/ConceptProject.tsx`;
- `src/maria/PresentationModal.tsx`;
- `src/maria/HomeBackButton.tsx`.

### Композиция

Слои снизу вверх:

1. базовый фон страницы;
2. полноэкранный SVG pattern;
3. рука с телефоном;
4. карусель карточек;
5. фиксированный глобальный chrome;
6. modal при открытии презентации.

### Фон страницы

Светлая тема:

- base `#F9F7F7`;
- `/assets/maria/works-vector-pattern.svg`;
- `background-size: cover`;
- opacity `0.5`.

Тёмная тема:

- база `#030811`;
- два мягких radial gradient с тёмно-малиновыми оттенками;
- тот же SVG pattern;
- opacity `0.24`;
- `brightness(.32) saturate(.58) hue-rotate(-6deg)`.

Цель тёмной темы — благородная приглушённая гамма, а не яркий неон.

### Рука и телефон

Используются две идеально совмещённые PNG-картинки:

- primary: `/assets/maria/works-phone-hand.png`;
- alternate lock screen: `/assets/maria/works-phone-hand-lock.png`.

Обе картинки находятся в одном контейнере и переключаются только opacity, чтобы рука не дёргалась. Альтернативная версия выбирается по позиции карусели:

```ts
Math.floor(centeredIndex / 3) % 2
```

То есть изображение меняется группами примерно по три карточки.

На desktop изображение повернуто на `-90deg` и позиционируется снизу. На mobile применяются отдельные размеры и offsets.

### Карусель работ: модель данных

Основные константы:

```ts
WORKS_CARD_COUNT = 14
WORKS_PROJECT_INDEX = 6
WORKS_MTS_PLACEHOLDER_INDEX = 8
WORKS_INITIAL_POSITION = 6
WORKS_DRAG_STEP_PX = 150
WORKS_MOBILE_DRAG_STEP_PX = 140
WORKS_ENTRY_DURATION_MS = 600
```

Из 14 позиций:

- одна — настоящий проект MTS Pay;
- остальные — placeholders;
- на экране одновременно отображаются максимум 5 ближайших карточек;
- placeholder covers циклически берутся из 5 файлов.

### Desktop-карусель

- горизонтальное управление;
- drag мышью/указателем;
- боковой wheel;
- без автопрокрутки;
- центральная карточка фронтальна;
- боковые карточки постепенно поворачиваются по `rotateY`;
- позиции циклические;
- нет автоматической snap-привязки после desktop drag;
- центральный фокус создаётся мягким gradient shading, saturation и glow, а не общей opacity.

### Mobile-карусель

- вертикальная стопка;
- drag определяется по `clientY`;
- wheel/scroll определяется по `deltaY`;
- после drag позиция округляется;
- видны 5 карточек;
- карточки меняют вертикальный offset и scale;
- opacity карточек не используется как основной способ глубины;
- передняя карточка остаётся понятной и кликабельной.

### Входная анимация

При открытии `/works`:

- `isEntering` активен 600 ms;
- карточки сначала собраны плотнее в центре;
- крайние карточки имеют небольшой отрицательный Y offset;
- затем расходятся в текущее состояние;
- drag/wheel во время входа заблокирован;
- рука входит синхронно отдельной transition-анимацией.

### Структура карточки

`WorksProjectCard` состоит из:

1. preview image 16:9;
2. footer;
3. синей иконки Figma-like file;
4. title;
5. meta.

Карточки:

- непрозрачные;
- без серой рамки;
- со скруглением и clip-path;
- имеют тонкий внутренний padding вокруг preview;
- используют градиентное оттенение по расстоянию до центра;
- в dark theme получают тёмную розово-чёрную поверхность и мягкий glow.

### Обложки placeholder-карточек

```text
works-cover-01.jpg
works-cover-02.jpg
works-cover-03.jpg
works-cover-04.jpg
works-cover-05.jpg
```

Они циклически повторяются. Текущие названия placeholder-карточек — «Новый проект / Скоро» и `New project / Coming soon`.

### MTS-флажок

Файл: `/assets/maria/mts-hanging-flag.png`.

Он доступен только:

- на карточке MTS Pay;
- на одном специально помеченном placeholder (`WORKS_MTS_PLACEHOLDER_INDEX = 8`).

CSS скрывает его по умолчанию и показывает при hover/focus только на fine pointer устройствах. Последний эксперимент со сложной перекидной анимацией был отменён; не следует возвращать его без отдельного запроса.

### Настоящая карточка проекта

`ConceptProject`:

- title: `Концепт v3 — Преза`;
- meta: `Проект · МТС Финтех`;
- cover: `/assets/maria/mts-pay-cover.png`;
- по клику открывает presentation modal.

### Presentation modal

- fixed dark blurred overlay;
- iframe без отдельной чёрной оболочки;
- aspect ratio 1920×1080;
- адаптивно помещается в viewport;
- закрывается по `Escape`;
- закрывается кликом по overlay;
- отдельная кнопка `×`;
- блокирует body scroll;
- восстанавливает фокус после закрытия;
- iframe загружается lazy.

Внутри открыт Figma prototype `Концепт v3` с `hide-ui=1` и отключёнными controls/device frame. Чёрные поля, которые рисует сам Figma embed, нельзя гарантированно удалить CSS родительской страницы из-за cross-origin iframe.

## 11. Страница «Обо мне» / «Хакатоны и хобби»

URL остаётся `/hackathons`, хотя карточка на главной называется «Обо мне».

Файлы:

- `src/maria/HackathonsPage.tsx`;
- `src/maria/HackathonOrbitCarousel.tsx`;
- `src/maria/InteractiveBackground.tsx`;
- `src/maria/ModelBackground.tsx`;
- `src/maria/HomeBackButton.tsx`.

### Фоновый pattern

Используется `/assets/maria/about-space-pattern.svg` как CSS mask, а не как обычный background image.

Светлая тема:

- серо-розово-голубая база;
- светлый составной gradient через mask;
- opacity pattern `0.56`.

Тёмная тема:

- почти чёрно-синяя база;
- приглушённые малиновые и фиолетово-синие gradient accents;
- pattern opacity `0.47`.

### Сфера / иллюминатор

`.maria-hackathons-porthole` — большая окружность вокруг модели. Она реализована CSS, без отдельной растровой картинки.

Эффекты:

- conic gradients;
- radial gradients;
- асимметричные cyan/pink highlights;
- inner shadows;
- мягкое внешнее свечение;
- `backdrop-filter` для лёгкого преломления;
- отдельная настройка dark theme.

На mobile размер задаётся CSS custom property из `HackathonsPage`:

```ts
--mobile-porthole-size: min(188vw, 148vh)
```

### 3D-модель

Ассет: `/assets/maria/astronaut-optimized.glb` (~1.1 MB).

`ModelBackground` создаёт custom element `<model-viewer>`.

Текущая камера:

- field of view: `28deg`;
- neutral environment;
- neutral tone mapping;
- shadow intensity `0.45`;
- eager loading.

Модель реагирует на движение указателя по всему экрану:

- X управляет горизонтальным orbit angle;
- Y управляет vertical angle и radius;
- обновление throttled через `requestAnimationFrame`.

Дополнительно контейнер модели плавно балансирует вверх-вниз:

- duration `4.2s`;
- amplitude `11px`;
- scale `1.06`;
- базовый tilt `0deg`.

На `/hackathons` shimmer отключён, чтобы не загрязнять сцену.

### Орбитальная карусель

Основные константы:

```ts
PROJECT_COUNT = 7
HACKATHON_ORBIT_COUNT = 12
HACKATHON_DRAG_STEP_DESKTOP = 180
HACKATHON_DRAG_STEP_MOBILE = 130
HACKATHON_AUTOPLAY_MS = 3200
HACKATHON_AUTOPLAY_RESUME_MS = 1800
```

Состав:

- 7 реальных подписанных карточек;
- 5 пустых placeholder-карточек для плотности орбиты;
- карточки трёх размеров: `large`, `medium`, `compact`;
- front/rear layering;
- задние карточки уходят за сферу и получают blur/saturation reduction;
- масштаб, opacity и наклон интерполируются непрерывно.

Текущие проекты:

1. Raible Charity Program — Phystech Business Solutions;
2. Weather Wizard Mobile App — Career Factory Contest;
3. Collections Prototype — AliExpress DAU Hackathon;
4. Web AR Platform — Indoor Navigation;
5. Редизайн карточки Avito;
6. Новогодние подарки Tele2;
7. Deal Done To Do App.

Карточки пока не содержат внешних ссылок и не открывают детальные страницы. Клик по карточке только центрирует её.

### Управление каруселью

- autoplay каждые 3200 ms;
- autoplay отключается при `prefers-reduced-motion`;
- pointer drag двигает позицию непрерывно;
- при отпускании позиция округляется;
- горизонтальный wheel поддерживается;
- Shift + vertical wheel трактуется как горизонтальный;
- после ручного взаимодействия autoplay возобновляется через 1800 ms;
- клик после drag подавляется;
- navigation guard работает в gesture zone карусели.

### Mobile

На mobile:

- сфера и модель увеличены;
- карточки остаются вокруг космонавта, а не превращаются в маленький ряд перед ним;
- X-амплитуда орбиты увеличена;
- карточки подняты через `--mobile-card-bottom: 28vh`;
- ручной drag остаётся горизонтальным.

## 12. Темизация

Тема хранится только в React state `App` и не сохраняется в `localStorage`.

Корневой класс:

```text
.maria-app.theme-light
.maria-app.theme-dark
```

Основные CSS variables:

```css
--maria-bg
--maria-fg
--pink
--paper
```

Особые темы страниц реализованы отдельными `.theme-dark .maria-works-page...` и `.theme-dark .maria-hackathons-page...` правилами.

Ограничение: темы не являются полноценной token system. Многие цвета зашиты прямо в `src/styles.css`. Если отдельный агент будет перерабатывать дизайн-токены, это должен быть изолированный рефакторинг с визуальной регрессией обеих страниц и modal.

## 13. Локализация

Файл: `src/maria/i18n.ts`.

Поддерживаются `ru` и `en`. Локализованы:

- имя;
- контакт;
- названия карточек главной;
- подписи/aria labels;
- back button;
- modal;
- theme controls;
- названия части проектов;
- placeholder text.

При смене языка обновляется `document.documentElement.lang`.

Ограничения:

- язык не сохраняется между reload;
- некоторые названия проектов одинаковы в RU/EN;
- город `Moscow` остаётся на английском в обеих версиях;
- URL маршрутов не локализуются.

## 14. Глобальные интеракции

### InteractionSounds

Файл: `src/maria/InteractionSounds.tsx`.

Делегированно слушает интерактивные элементы:

```css
a[href], button:not([disabled]), [role="button"], [tabindex]:not([tabindex="-1"])
```

Звук:

- стиль `8-bit-terminal`;
- square oscillator;
- короткий hover beep;
- более длинный ascending click beep;
- low-pass filter;
- очень низкая громкость;
- AudioContext создаётся лениво после взаимодействия.

### ShimmerTrail

Canvas overlay создаёт пиксельную розовую пыль по всему экрану:

- максимальный размер частицы 3 px;
- hue примерно 318–342;
- максимум 280 частиц;
- след постепенно исчезает;
- на странице «Обо мне» выключен;
- на главной включён.

## 15. Accessibility и reduced motion

Реализовано:

- `aria-label` на каруселях, кнопках, modal и контролах;
- `aria-pressed` для темы, языка и active hackathon card;
- `role="dialog"` + `aria-modal`;
- focus restoration после modal;
- `Escape` закрывает modal;
- invisible descriptive text на карточках главной;
- `prefers-reduced-motion` отключает/минимизирует анимации;
- iframe имеет title;
- decorative images имеют пустой alt.

Что ещё можно улучшить отдельной задачей:

- полноценный focus trap modal;
- keyboard navigation каруселей стрелками;
- live announcement смены активной карточки;
- проверка контраста в обеих темах;
- отключение/настройка звука пользователем;
- сохранение theme/language preferences.

## 16. CSS-архитектура

Вся активная стилизация находится в одном файле `src/styles.css` (~225 физических строк, но многие правила сильно сжаты в одну строку).

Основные блоки:

1. fonts/root/reset;
2. app shell и transitions;
3. fixed chrome;
4. home background/cards;
5. back button;
6. works background/hand/carousel/cards;
7. hackathons background/sphere/model/orbit cards;
8. presentation modal;
9. `max-width: 900px`;
10. `max-width: 600px`;
11. short desktop viewport;
12. reduced motion.

Риск: параллельная правка `styles.css` несколькими агентами почти гарантирует конфликты. Перед параллельной работой рекомендуется либо назначить одного CSS-integrator, либо сначала разбить файл на:

```text
styles/base.css
styles/transitions.css
styles/chrome.css
styles/home.css
styles/works.css
styles/hackathons.css
styles/modal.css
styles/responsive.css
```

Такой split сейчас не выполнен и должен идти отдельной задачей без визуальных изменений.

## 17. Активные ассеты

### Главная

```text
portrait.png
home-portrait-light.png
home-portrait-dark.png
home-card-works.png
home-card-about.png
```

### Работы

```text
works-vector-pattern.svg
works-phone-hand.png
works-phone-hand-lock.png
mts-pay-cover.png
mts-hanging-flag.png
works-cover-01.jpg ... works-cover-05.jpg
```

### Обо мне / хакатоны

```text
about-space-pattern.svg
astronaut-optimized.glb
```

### Глобально

```text
favicon.svg
```

### Размеры, важные для загрузки

Примерные крупные активные файлы:

| Ассет | Размер |
| --- | ---: |
| `home-portrait-light.png` | ~6.0 MB |
| `home-portrait-dark.png` | ~1.7 MB |
| `mts-pay-cover.png` | ~1.6 MB |
| `home-card-about.png` | ~1.3 MB |
| `works-phone-hand-lock.png` | ~1.3 MB |
| `works-phone-hand.png` | ~1.2 MB |
| `astronaut-optimized.glb` | ~1.1 MB |
| `home-card-works.png` | ~1.0 MB |

`public/` сейчас занимает примерно 41 MB. Не весь объём нужен текущей странице, но обычные `<img>` двух тем на главной могут загрузить обе версии.

## 18. Legacy и кандидаты на удаление

Следующие области не входят в текущий route tree:

- `src/components/`;
- `src/grain/`;
- `src/pages/`;
- `src/content.ts`;
- `src/grainContent.ts`;
- `BackgroundVideo.tsx`;
- `PointerVideo.tsx`;
- `ScrollPortrait.tsx`.

В `public/assets/maria/` вероятно не используются текущей реализацией:

```text
background-video.mp4
skater.mp4
hover-portrait.png
hover-portrait-dark.png
works-background.webp
works-graffiti-pattern.jpg
about-space-pattern.png
scroll/frame-001.webp ... frame-016.webp
```

Также старые Grain/Portier assets в `public/assets/` не используются активным `App`.

Перед удалением нужен отдельный asset audit через import/URL scan и production build. Не удалять файлы только на основании названия: часть тестов всё ещё импортирует helper-функции из неактивных компонентов, например scroll frame utilities.

## 19. Тестовая архитектура

### `src/App.test.tsx`

Проверяет широкий набор контрактов:

- главную страницу и chrome;
- theme/language;
- ассеты;
- modal;
- helper-функции анимаций;
- model orbit;
- shimmer;
- sounds;
- части hackathon/works поведения.

### `src/router.test.ts`

Проверяет:

- нормализацию маршрутов;
- pushState navigation;
- направления transition.

### `src/styles.test.js`

Проверяет наличие конкретных CSS-фрагментов. Это snapshot-like string contract: даже корректная визуальная перестановка CSS может сломать тест, если изменится точная строка.

### `WorksCardCarousel.test.tsx`

Проверяет:

- циклическую математику;
- drag/wheel;
- mobile/desktop coordinate mapping;
- видимые пять карточек;
- poses/focus/gradients;
- hand variant;
- presentation trigger.

### `HackathonOrbitCarousel.test.tsx`

Проверяет:

- orbit offset/normalization;
- interpolation;
- sizes;
- drag/wheel;
- autoplay-related constants и карточки.

Правило для агентов: любое изменение математики карусели начинать с изменения/добавления unit test, затем менять компонент и CSS.

## 20. Внешние зависимости и сетевые точки

Проект не полностью автономен без сети:

1. Google Fonts импортирует `Comforter` через CSS `@import`;
2. `<model-viewer>` загружается с `ajax.googleapis.com`;
3. Figma presentation iframe требует доступ к `embed.figma.com`.

Если нужны offline-first или строгая приватность:

- self-host Comforter;
- установить/собрать model-viewer локально;
- экспортировать презентацию в локальные изображения/видео/HTML вместо iframe.

## 21. Публикация

Целевой GitHub Pages repository исторически:

```text
mariatkachenko/mariatkachenko.github.io
```

Локально присутствует ранее собранная копия:

```text
work/mariatkachenko.github.io/
```

Но она может отставать от текущего `src/`. Правильная последовательность публикации:

1. проверить `pnpm test -- --run`;
2. выполнить `pnpm build`;
3. проверить `dist/` локально;
4. синхронизировать `dist/` с deploy repository;
5. commit + push;
6. проверить `/`, `/works`, `/hackathons` на GitHub Pages.

Не копировать старый `work/` обратно в исходники.

## 22. Известные ограничения и риски

### Высокий риск

- монолитный `styles.css`;
- View Transitions + fixed layers чувствительны к z-index и browser differences;
- gesture guard зависит от wheel coordinates и системного swipe браузера;
- mobile works carousel имеет отдельную геометрию и легко ломается desktop-правками;
- две версии изображения руки должны иметь идентичные прозрачные bounds;
- external model-viewer CDN — single point of failure;
- Figma iframe cross-origin и не позволяет управлять внутренним UI CSS.

### Средний риск

- глобальные theme/language не сохраняются;
- активный App смешан с большим количеством legacy-кода;
- изображения главной тяжёлые;
- нет image `srcset`, AVIF/WebP variants и строгого responsive loading;
- 3D-модель `loading="eager"` загружается при открытии `/hackathons`, что ожидаемо, но может дать задержку на мобильной сети;
- test contracts для CSS зависят от точных строк.

### Низкий риск

- placeholder project data пока встроены прямо в компоненты;
- card links для hackathons ещё не реализованы;
- title проекта MTS находится в компоненте, а не в общей data model.

## 23. Что считать источником истины

При конфликте истории чата, старых specs и текущей реализации приоритет:

1. текущий пользовательский запрос;
2. текущий рабочий код `src/` + `public/`;
3. проходящие тесты;
4. этот handoff;
5. последние релевантные spec/plan;
6. старые design docs;
7. устаревшие сборки в `work/`, `outputs/`, `dist/`.

Исторические документы полезны для понимания решений, но многие эксперименты были позднее отменены (`undo`). Нельзя автоматически восстанавливать функцию только потому, что для неё существует старый spec.

## 24. Рекомендуемое разделение между чатами и агентами

### Поток A — App shell, routing и transitions

Владение:

```text
src/App.tsx
src/router.ts
src/maria/FixedChrome.tsx
src/maria/HomeBackButton.tsx
CSS: app shell / transitions / fixed chrome / back button
```

Ответственность:

- навигация;
- View Transitions;
- fixed chrome без мигания;
- back behavior;
- route fallback;
- history swipe вне каруселей.

Не менять геометрию каруселей.

### Поток B — Главная страница

Владение:

```text
src/maria/PortfolioPage.tsx
src/maria/PortfolioCard.tsx
src/maria/ShimmerTrail.tsx
home assets
CSS: home only
```

Ответственность:

- portrait themes;
- композиция карточек desktop/mobile;
- hover;
- transition source geometry;
- оптимизация изображений главной.

Не менять target pages.

### Поток C — Works carousel engine

Владение:

```text
src/maria/WorksCardCarousel.tsx
src/maria/WorksCardCarousel.test.tsx
src/maria/useCarouselNavigationGuard.ts (совместное владение с D)
CSS: .maria-works-carousel / .maria-works-deck-card
```

Ответственность:

- drag/wheel;
- desktop coverflow;
- mobile vertical deck;
- visible 5 cards;
- entry animation;
- focus gradient;
- hand position callback.

Не менять card visual component или modal без согласования.

### Поток D — Works card UI и content

Владение:

```text
src/maria/WorksProjectCard.tsx
src/maria/ConceptProject.tsx
works-cover assets
mts-pay-cover.png
mts-hanging-flag.png
CSS: .works-project-card / .concept-cover
```

Ответственность:

- структура карточек;
- titles/meta;
- covers;
- MTS flag;
- light/dark card surfaces;
- hover/focus states.

### Поток E — Works scene и modal

Владение:

```text
src/maria/WorksPage.tsx
src/maria/PresentationModal.tsx
works-phone-hand*.png
works-vector-pattern.svg
CSS: works page / hand / modal
```

Ответственность:

- фон;
- синхронное переключение руки;
- hand positioning desktop/mobile;
- presentation modal;
- Figma embed.

### Поток F — About/Hackathons 3D scene

Владение:

```text
src/maria/HackathonsPage.tsx
src/maria/InteractiveBackground.tsx
src/maria/ModelBackground.tsx
astronaut-optimized.glb
about-space-pattern.svg
CSS: hackathons page / sphere / model
```

Ответственность:

- model loading;
- camera orbit;
- idle float;
- sphere/refraction;
- page theme.

Не менять orbit carousel math.

### Поток G — Hackathon orbit carousel

Владение:

```text
src/maria/HackathonOrbitCarousel.tsx
src/maria/HackathonOrbitCarousel.test.tsx
src/maria/useCarouselNavigationGuard.ts (совместно с C)
CSS: .maria-orbit-*
```

Ответственность:

- orbit geometry;
- autoplay;
- manual drag/wheel;
- mobile orbit;
- project data/links;
- placeholders;
- card sizes/layers.

### Поток H — Design system, i18n, accessibility

Владение:

```text
src/maria/i18n.ts
global CSS tokens
aria contracts
InteractionSounds.tsx
```

Ответственность:

- consistent typography/spacing/colors;
- persistence theme/language;
- keyboard controls;
- screen reader behavior;
- sound preference;
- accessibility audit.

Этому потоку нельзя параллельно переписывать весь CSS без CSS-integrator.

### Поток I — Performance и asset cleanup

Владение:

```text
public/assets/**
index.html external dependencies
Vite build config
legacy directories after audit
```

Ответственность:

- определить реально загружаемые assets;
- конвертировать тяжёлые PNG в WebP/AVIF при сохранении alpha;
- responsive sources;
- lazy loading;
- local model-viewer/font hosting;
- удалить подтверждённо неиспользуемые legacy assets;
- измерить bundle/network waterfall.

## 25. Правила параллельной работы

1. Один файл — один владелец на итерацию.
2. `src/styles.css` не редактируется параллельно несколькими агентами без CSS-integrator.
3. Общие контракты меняются сначала в тестах:
   - route names;
   - number of cards;
   - carousel position math;
   - view transition names;
   - CSS custom property names.
4. Ассеты нельзя заменять под тем же именем, если размеры прозрачного canvas меняются и на них завязано позиционирование.
5. После каждого потока запускать targeted tests.
6. Перед интеграцией запускать все 61+ тестов, TypeScript и build.
7. Любое визуальное изменение проверять минимум в четырёх состояниях:
   - desktop light;
   - desktop dark;
   - mobile light;
   - mobile dark.
8. Для каруселей дополнительно проверять:
   - pointer drag;
   - trackpad horizontal wheel;
   - Shift + wheel, если поддерживается;
   - click suppression after drag;
   - history swipe outside carousel;
   - no history swipe inside carousel.

## 26. Рекомендуемый порядок дальнейшей декомпозиции

Если цель — ускорить дальнейшую разработку, оптимальный порядок:

1. создать baseline screenshots и записать размеры viewport;
2. разделить `styles.css` без визуальных изменений;
3. вынести данные проектов из компонентов в `src/maria/data/`;
4. отделить shared carousel gesture utilities;
5. выполнить asset audit;
6. оптимизировать тяжёлые изображения;
7. добавить keyboard/accessibility behavior;
8. только после этого параллельно расширять контент Works и Hackathons.

## 27. Готовые handoff-промпты для отдельных чатов

### Для Works carousel

```text
Работай только с каруселью страницы /works. Прочитай PROJECT_HANDOFF.md, разделы 10, 19, 24C и 25. Не меняй fixed chrome, modal, фон и 3D-страницу. Сохрани циклические 14 позиций, максимум 5 видимых карточек, desktop horizontal coverflow и mobile vertical deck. Любые изменения математики сначала закрепи тестом в WorksCardCarousel.test.tsx.
```

### Для 3D-сцены «Обо мне»

```text
Работай только со сценой /hackathons: HackathonsPage, InteractiveBackground, ModelBackground, сферой и тематическим фоном. Прочитай PROJECT_HANDOFF.md, разделы 11, 17, 22 и 24F. Не меняй HackathonOrbitCarousel и route transitions. Проверь desktop/mobile и light/dark.
```

### Для орбитальной карусели

```text
Работай только с HackathonOrbitCarousel. Прочитай PROJECT_HANDOFF.md, разделы 11, 19, 24G и 25. Сохрани 12 позиций, 7 проектов + 5 placeholders, autoplay 3200 ms с паузой после ручного управления, continuous drag и front/rear layering. Не меняй модель, сферу и fixed chrome.
```

### Для производительности

```text
Проведи read-only audit загрузки проекта по PROJECT_HANDOFF.md, разделы 17, 18, 20, 22 и 24I. Сначала составь таблицу: asset, используется/нет, размер, где загружается, можно ли lazy-load/convert. Ничего не удаляй до отдельного подтверждения. Не меняй визуальные размеры прозрачных PNG без проверки композиции.
```

### Для роутинга и transitions

```text
Работай только с App.tsx, router.ts, FixedChrome, HomeBackButton и соответствующими transition styles. Прочитай PROJECT_HANDOFF.md, разделы 6–8, 22 и 24A. FixedChrome должен оставаться единственным и быть вне route animation. Не меняй карусели и ассеты. Проверь View Transitions fallback и prefers-reduced-motion.
```

## 28. Definition of Done для любой новой задачи

Задача считается завершённой, если:

- изменён только согласованный scope;
- нет возврата отменённых экспериментов;
- targeted tests пройдены;
- все tests пройдены;
- `tsc -b` пройден;
- Vite production build пройден;
- desktop/mobile проверены;
- light/dark проверены;
- RU/EN не сломаны;
- fixed chrome не мигает;
- жесты каруселей не вызывают случайный history navigation;
- новые ассеты перечислены и их размер известен;
- handoff обновлён, если изменился публичный контракт подсистемы.

## 29. Ключевые файлы для быстрого старта

```text
src/App.tsx
src/router.ts
src/styles.css
src/maria/PortfolioPage.tsx
src/maria/WorksPage.tsx
src/maria/WorksCardCarousel.tsx
src/maria/HackathonsPage.tsx
src/maria/HackathonOrbitCarousel.tsx
src/maria/ModelBackground.tsx
src/maria/FixedChrome.tsx
src/maria/i18n.ts
src/styles.test.js
src/maria/WorksCardCarousel.test.tsx
src/maria/HackathonOrbitCarousel.test.tsx
```

---

Этот документ фиксирует текущий baseline. При значимых изменениях маршрутов, количества карточек, структуры ассетов, transition names, mobile layouts или внешних зависимостей его необходимо обновлять вместе с кодом.
