# Grain Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Portier with a responsive four-route Grain Archive editorial website.

**Architecture:** A dependency-free History API router selects four React page components. Shared navigation, article cards, subscription ticket, footer, typed content, and CSS tokens keep the implementation consistent across routes.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, plain CSS

## Global Constraints

- Routes are `/`, `/archive`, `/article`, and `/about`.
- Do not add Tailwind, a UI library, or a routing dependency.
- Use Tilt Warp, Instrument Serif Italic, and Geist.
- Preserve Figma colours `#0f0e0e`, `#f5f5f5`, `#f6f8fb`, `#d1d2d8`, `#8c8d92`, `#ff5700`, `#32ce57`, and `#a3caff`.
- Store all Figma assets below `public/assets/grain/`.
- Match 1280 px, 800 px, and 375 px reference layouts without horizontal page overflow.

---

### Task 1: Router and route tests

**Files:**
- Create: `src/router.ts`, `src/pages/HomePage.tsx`, `src/pages/ArchivePage.tsx`, `src/pages/ArticlePage.tsx`, `src/pages/AboutPage.tsx`
- Modify: `src/App.tsx`, `src/App.test.tsx`

**Interfaces:**
- Produces: `RoutePath`, `normalizePath(pathname)`, `navigate(path)`, and page components.

- [ ] Write tests that set `window.history` to each supported path and assert the route-specific heading.
- [ ] Run `pnpm test -- --run` and verify the old Portier implementation fails these tests.
- [ ] Implement pathname normalization, popstate subscription, link interception, and four minimal semantic page components.
- [ ] Re-run tests and verify all route tests pass.

### Task 2: Local assets and typed content

**Files:**
- Create: `public/assets/grain/*`, `src/grainContent.ts`

**Interfaces:**
- Produces: `Article`, `CinemaPick`, `VintageObject`, `articles`, `cinemaPicks`, and asset URL constants.

- [ ] Map unique Figma URLs from Home, Archive, Article, and About contexts to descriptive local filenames.
- [ ] Download them with `curl -L` and validate with `file public/assets/grain/*`.
- [ ] Add typed article, cinema, article-body, navigation, and vintage-object content.
- [ ] Run `rg 'figma.com/api/mcp/asset' src public` and require zero matches.

### Task 3: Shared shell

**Files:**
- Create: `src/grain/Navigation.tsx`, `src/grain/ArticleCard.tsx`, `src/grain/Subscribe.tsx`, `src/grain/Footer.tsx`, `src/grain/SiteLink.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Produces reusable shared components and accessible internal navigation.

- [ ] Add failing tests for Home, Archive, About links, subscribe copy, footer title, and article-card navigation.
- [ ] Implement the shared components using local exported assets.
- [ ] Verify link clicks change route content without reloading and browser back emits the prior page.

### Task 4: Four complete pages

**Files:**
- Modify: all files under `src/pages/`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes shared components and content arrays; produces final route UI.

- [ ] Add failing tests for Home sections, eight Archive cards, Article title/body, and About contact content.
- [ ] Implement Home hero/articles/album/cinema, Archive grid/marquee, Article long-form/related cards, and About marquee/contact.
- [ ] Run all tests and verify page content and semantic landmarks.

### Task 5: Responsive styling and delivery

**Files:**
- Replace: `src/styles.css`
- Modify: `index.html`

**Interfaces:**
- Produces the full Grain Archive visual system at desktop, tablet, and mobile breakpoints.

- [ ] Define tokens, font imports, global grain texture, focus states, and shared layout rules.
- [ ] Implement desktop dimensions and typography from the 1280 px frames.
- [ ] Add tablet rules at 900 px and mobile rules at 600 px matching 800 px and 375 px frames.
- [ ] Run `pnpm test -- --run` and `pnpm build`.
- [ ] Start Vite on `127.0.0.1:5173`, confirm HTTP 200 for all four routes, and leave the server running.
