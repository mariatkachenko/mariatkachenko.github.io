# Grain Archive Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct all four Grain Archive routes to match their Figma desktop, tablet, and mobile frames and restore the homepage hero video.

**Architecture:** Preserve the Vite/React application, dependency-free History API router, and shared layout components. Add a focused hero-media component, local media/font assets, and breakpoint-specific CSS derived from Figma rather than introducing a new UI framework.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, plain CSS, native HTML video.

## Global Constraints

- Routes remain `/`, `/archive`, `/article`, and `/about`.
- Reference widths are exactly 1280, 768, and 375 px.
- Production code must not contain expiring `figma.com/api/mcp/asset` URLs.
- Hero video must be muted, looped, autoplaying, and `playsInline`, with a poster and reduced-motion fallback.
- Fonts must be local `@font-face` resources.
- No new routing, styling, or animation dependency.

---

### Task 1: Capture exact Figma references and durable assets

**Files:**
- Modify: `public/assets/grain/*`
- Create: `public/assets/grain/fonts/*`
- Create: `public/assets/grain/hero.mp4`
- Create: `public/assets/grain/hero-poster.jpg`

**Interfaces:**
- Produces stable `/assets/grain/...` URLs consumed by React and CSS.

- [ ] **Step 1: Retrieve design context** for Home, Archive, Article, and About desktop frames and available tablet/mobile variants with `get_design_context`.
- [ ] **Step 2: Inspect the published Figma Site** and identify the original hero media URL and playback behavior.
- [ ] **Step 3: Download the exact media, image, SVG, and font bytes** to `public/assets/grain/`, preserving their source formats.
- [ ] **Step 4: Validate assets** with `file public/assets/grain/* public/assets/grain/fonts/*` and verify the video with `ffprobe` when available.
- [ ] **Step 5: Scan for expiring links** with `rg "figma\\.com/api/mcp/asset" src public`; expected result: no matches.

### Task 2: Add the hero-video regression test and component

**Files:**
- Modify: `src/App.test.tsx`
- Create: `src/grain/HeroMedia.tsx`
- Modify: `src/pages/HomePage.tsx`

**Interfaces:**
- Produces `HeroMedia(): JSX.Element`, rendering a decorative background video and wordmark.

- [ ] **Step 1: Write the failing test** asserting the Home route contains a video with `autoplay`, `muted`, `loop`, `playsinline`, a local MP4 source, and a local poster.
- [ ] **Step 2: Run `pnpm test -- --run`** and confirm the new test fails because no video exists.
- [ ] **Step 3: Implement `HeroMedia`** using `<video autoPlay muted loop playsInline poster="/assets/grain/hero-poster.jpg">`, an MP4 `<source>`, fallback image, and the exported wordmark.
- [ ] **Step 4: Replace the static homepage hero** with `HeroMedia` while preserving the accessible page heading.
- [ ] **Step 5: Run `pnpm test -- --run`** and confirm the hero test and existing route tests pass.

### Task 3: Correct shared typography and shell geometry

**Files:**
- Modify: `src/styles.css`
- Modify: `src/grain/Navigation.tsx`
- Modify: `src/grain/Subscribe.tsx`
- Modify: `src/grain/Footer.tsx`

**Interfaces:**
- Shared shell remains consumed by every page through `Layout`.

- [ ] **Step 1: Add a structural test** asserting one primary navigation, one subscription region, and one footer per route.
- [ ] **Step 2: Run the test** and confirm it fails for any missing landmark or accessible name.
- [ ] **Step 3: Replace the remote font import** with local Geist, Instrument Serif, and Tilt Warp `@font-face` declarations.
- [ ] **Step 4: Match shared Figma measurements** for the 60 px desktop marquee/navigation region, colored chips, ticket proportions, footer columns, type metrics, and responsive variants.
- [ ] **Step 5: Run all tests** and confirm the shared-shell assertions pass.

### Task 4: Correct Home and Archive layouts

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/ArchivePage.tsx`
- Modify: `src/grain/ArticleCard.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- `ArticleCard` continues accepting the existing article data shape.

- [ ] **Step 1: Add route-content tests** for the Home section sequence and Archive card count.
- [ ] **Step 2: Run tests** and verify the new assertions fail on the current approximated structure or counts.
- [ ] **Step 3: Match Home desktop geometry**: 800 px hero, 10 px page/card gaps, 700 px article cards, 136 px View all, exact album/cinema padding and typography.
- [ ] **Step 4: Match Archive geometry and content** from its Figma frame, including card crops, heading spacing, and end marker.
- [ ] **Step 5: Add tablet/mobile overrides** matching the corresponding Figma frames, using 768 and 375 px reference behavior.
- [ ] **Step 6: Run all tests** and confirm the Home and Archive tests pass.

### Task 5: Correct Article and About layouts

**Files:**
- Modify: `src/pages/ArticlePage.tsx`
- Modify: `src/pages/AboutPage.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Both pages continue using `Layout`, `ArticleCard`, and local grain assets.

- [ ] **Step 1: Add content-order tests** for Article editorial sections and About contact/objects sections.
- [ ] **Step 2: Run tests** and confirm failures identify missing or incorrectly ordered content.
- [ ] **Step 3: Match Article typography, column widths, image sizes, paper background, and related-card section** to the desktop frame.
- [ ] **Step 4: Match About heading, copy grid, archival object strip, portrait crop, and contact block** to the desktop frame.
- [ ] **Step 5: Add tablet/mobile overrides** from the responsive Figma references without horizontal overflow.
- [ ] **Step 6: Run all tests** and confirm the route-content tests pass.

### Task 6: Visual and production verification

**Files:**
- Modify as needed: `src/styles.css`, relevant page/component files.

**Interfaces:**
- Produces a verified localhost site with all four routes.

- [ ] **Step 1: Run `pnpm test -- --run`**; expected: all tests pass with no warnings.
- [ ] **Step 2: Run `pnpm build`**; expected: TypeScript and Vite build exit successfully.
- [ ] **Step 3: Start Vite on an available localhost port** and verify `/`, `/archive`, `/article`, and `/about` return HTTP 200.
- [ ] **Step 4: Capture each route at 1280 px** and compare section positions, typography, crops, and spacing against Figma.
- [ ] **Step 5: Capture representative pages at 768 and 375 px**, verify no horizontal overflow, and correct only observed mismatches.
- [ ] **Step 6: Verify media behavior**: video plays muted and looped normally; reduced-motion displays the poster.
- [ ] **Step 7: Re-run tests, build, asset-link scan, and route HTTP checks** after the final visual adjustment.

