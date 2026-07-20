# Product Designer Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a bilingual, accessible one-page product designer portfolio in a warm Swiss-modernist visual style.

**Architecture:** A dependency-free static site uses semantic HTML for Russian fallback content, a focused CSS system for responsive layout and motion, and a JavaScript module for localization and progressive enhancement. Node's built-in test runner verifies translations and document structure without adding packages.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in test runner, static hosting.

## Global Constraints

- The site is a single page with no case-study subpages or backend.
- Russian is the initial language; RU/EN selection persists in `localStorage` and updates the document `lang` attribute.
- The page contains three cases, working principles, an about section, and a contact CTA.
- Content remains readable when JavaScript is unavailable.
- Motion respects `prefers-reduced-motion`; keyboard focus is always visible.
- No paid or runtime dependencies are required.

---

### Task 1: Localization behavior and semantic page

**Files:**
- Create: `tests/site.test.mjs`
- Create: `index.html`
- Create: `script.js`

**Interfaces:**
- Produces: `translations: Record<'ru' | 'en', Record<string, string>>`, `setLanguage(language: 'ru' | 'en'): void`, and DOM nodes with `data-i18n` keys.

- [ ] **Step 1: Write failing tests**

Create tests that import `translations` from `script.js`, assert equal RU/EN key sets, verify required case and navigation keys, and inspect `index.html` for semantic landmarks, three `<article>` elements, a skip link, and language controls.

- [ ] **Step 2: Verify the tests fail**

Run: `node --test tests/site.test.mjs`
Expected: FAIL because `script.js` and `index.html` do not exist.

- [ ] **Step 3: Implement the page and localization**

Create semantic Russian fallback markup with header, main, work, approach, about and contact sections. Add a complete RU/EN dictionary, safe `localStorage` access, language button state updates, document `lang` updates, navigation behavior and progressive scroll reveal.

- [ ] **Step 4: Verify the tests pass**

Run: `node --test tests/site.test.mjs`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

Run: `git add tests/site.test.mjs index.html script.js && git commit -m "feat: add bilingual portfolio content"` when repository metadata is writable; otherwise record the environment limitation.

### Task 2: Responsive Swiss-modernist presentation

**Files:**
- Modify: `tests/site.test.mjs`
- Create: `styles.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: semantic classes and sections from `index.html`.
- Produces: CSS custom properties, responsive grids, case artwork, visible focus states, and reduced-motion overrides.

- [ ] **Step 1: Write a failing presentation test**

Extend the test to require a stylesheet link, the accent color token, responsive media rules, `:focus-visible`, and `prefers-reduced-motion`.

- [ ] **Step 2: Verify the new test fails**

Run: `node --test tests/site.test.mjs`
Expected: FAIL because `styles.css` does not exist.

- [ ] **Step 3: Implement the visual system**

Add the cream/ink/vermilion palette, fluid typography, 12-column desktop grids, stacked mobile layout, editorial rules, CSS-generated case miniatures, hover states, navigation treatment and accessible motion fallbacks.

- [ ] **Step 4: Verify automated checks pass**

Run: `node --test tests/site.test.mjs`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

Run: `git add tests/site.test.mjs index.html styles.css && git commit -m "feat: style responsive portfolio"` when repository metadata is writable; otherwise record the environment limitation.

### Task 3: Browser QA, metadata, and deployment

**Files:**
- Modify: `tests/site.test.mjs`
- Modify: `index.html`
- Create: `README.md`

**Interfaces:**
- Consumes: the complete static site.
- Produces: verified metadata, local usage instructions, and a public deployment URL when hosting authorization is available.

- [ ] **Step 1: Add failing release checks**

Require title, description, viewport, theme color, canonical heading structure, email link and script loading in `index.html`.

- [ ] **Step 2: Run the release tests and confirm failure**

Run: `node --test tests/site.test.mjs`
Expected: FAIL for any missing release metadata.

- [ ] **Step 3: Complete metadata and documentation**

Add missing metadata and write exact local preview and deployment instructions in `README.md`.

- [ ] **Step 4: Run full verification**

Run: `node --test tests/site.test.mjs` and serve with `python3 -m http.server 4173`; inspect desktop and mobile screenshots and ensure the browser console is clean.
Expected: tests PASS, page returns HTTP 200, layouts are legible at both sizes, and no console errors occur.

- [ ] **Step 5: Publish**

Detect an authenticated static-hosting CLI. Deploy the current directory with a production flag and verify the returned HTTPS URL with `curl -I`. If no provider is authenticated, report the exact authorization needed without claiming publication.

- [ ] **Step 6: Commit**

Run: `git add index.html README.md tests/site.test.mjs && git commit -m "docs: add portfolio release instructions"` when repository metadata is writable; otherwise record the environment limitation.
