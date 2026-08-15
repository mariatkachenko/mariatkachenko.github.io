# Portier Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a faithful, responsive React implementation of Figma node `4129:1934` and serve it on localhost.

**Architecture:** A Vite React application renders the page from small section components and typed content arrays. Plain CSS custom properties, grid/flex layouts, and media queries reproduce the 1440 px, 1024 px, and 414 px Figma variants without Tailwind or absolute-positioned page composition.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, plain CSS

## Global Constraints

- Use plain CSS; do not add Tailwind or a component library.
- Preserve Figma colours: `#12121c`, `#222233`, `#006ada`, `#57efb4`, `#ffffff`, and `#88888d`.
- Use Sora for page content and DM Sans for branding/buttons.
- Download every Figma image/icon into `public/assets`; do not ship temporary Figma URLs.
- Match desktop 1440 px, tablet 1024 px, and mobile 414 px layouts and prevent horizontal overflow.
- Navigation and mobile menu must be keyboard accessible and expose visible focus states.
- Respect `prefers-reduced-motion`.

## File Map

- `package.json` — scripts and dependencies.
- `index.html` — Vite entry document and font preconnects.
- `src/main.tsx` — React bootstrap.
- `src/App.tsx` — page composition and mobile-menu state.
- `src/content.ts` — typed services, projects, testimonials, facts, and navigation data.
- `src/components/Header.tsx` — responsive site navigation.
- `src/components/SectionHeading.tsx` — shared heading/copy block.
- `src/components/Hero.tsx` — introduction and service cards.
- `src/components/Works.tsx` — project cards.
- `src/components/Information.tsx` — alternating image/text sections.
- `src/components/Testimonials.tsx` — testimonial list.
- `src/components/Facts.tsx` — statistics section.
- `src/components/Cta.tsx` — contact call-to-action.
- `src/components/Footer.tsx` — footer navigation and social links.
- `src/styles.css` — tokens, layout, responsive rules, and interaction states.
- `src/App.test.tsx` — semantic rendering and interaction tests.
- `public/assets/*` — exact exported Figma assets.

---

### Task 1: Application shell and test harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.app.json`, `vite.config.ts`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/test/setup.ts`, `src/App.test.tsx`

**Interfaces:**
- Produces: Vite scripts `dev`, `build`, `test`; React component `App(): JSX.Element`.

- [ ] **Step 1: Write the failing smoke test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the portfolio landmark and title', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /digital product designer/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm test -- --run`
Expected: FAIL because the app and dependencies are not configured.

- [ ] **Step 3: Add Vite/TypeScript configuration and minimal semantic app**

Configure React, Vitest with `jsdom`, Testing Library setup, `src/main.tsx`, and an `App` returning `<main><h1>Digital Product Designer.</h1></main>`.

- [ ] **Step 4: Install dependencies and verify the smoke test**

Run: `npm install && npm test -- --run`
Expected: one passing test.

### Task 2: Local Figma asset set

**Files:**
- Create: `public/assets/logo.svg`, service icons, arrow icons, three project images, two information images, three avatar images, and four social icons.

**Interfaces:**
- Produces: stable `/assets/<name>.<ext>` URLs consumed by section components.

- [ ] **Step 1: Enumerate exact temporary URLs and destination names**

Use the URLs returned by `get_design_context` for nodes `8:633` and `10:1105`; map each unique glyph/image to one descriptive filename.

- [ ] **Step 2: Download and validate assets**

Run `curl -L <figma-url> -o public/assets/<name>.<ext>` for each asset, then run `file public/assets/*`.
Expected: every file is a non-empty SVG, PNG, JPEG, GIF, or WebP matching its extension.

- [ ] **Step 3: Verify no temporary URL will ship**

Run: `rg 'figma.com/api/mcp/asset' src public || true`
Expected: no matches.

### Task 3: Typed content and responsive header

**Files:**
- Create: `src/content.ts`, `src/components/Header.tsx`
- Modify: `src/App.tsx`, `src/App.test.tsx`

**Interfaces:**
- Produces: `NavItem`, `Service`, `Project`, `Testimonial`, and `Fact` types and exported data arrays; `Header({open,onToggle,onNavigate})`.

- [ ] **Step 1: Add failing navigation tests**

Test that the navigation contains Portfolio, About Me, and Blog; the mobile button has `aria-expanded`; clicking toggles it and selecting a link closes it.

- [ ] **Step 2: Run targeted tests**

Run: `npm test -- --run src/App.test.tsx`
Expected: FAIL because Header and its interaction do not exist.

- [ ] **Step 3: Implement typed content and Header**

Add the exact Figma copy to typed arrays. Implement logo, desktop navigation, CTA, hamburger button, and collapsible mobile navigation with anchors targeting section IDs.

- [ ] **Step 4: Verify tests**

Run: `npm test -- --run src/App.test.tsx`
Expected: PASS.

### Task 4: Hero, services, and projects

**Files:**
- Create: `src/components/Hero.tsx`, `src/components/Works.tsx`
- Modify: `src/App.tsx`, `src/App.test.tsx`

**Interfaces:**
- Consumes: `services` and `projects` from `src/content.ts`.
- Produces: `Hero()` and `Works()` section components.

- [ ] **Step 1: Add failing content tests**

Assert the three service headings, three project titles, Hire Me link, and `portfolio` section landmark render; project images must have non-empty accessible names.

- [ ] **Step 2: Run targeted tests**

Run: `npm test -- --run src/App.test.tsx`
Expected: FAIL for missing content.

- [ ] **Step 3: Implement Hero and Works**

Render the exact headline/copy, CTA, service cards, project imagery, title overlays, and exported arrow assets using semantic lists and links.

- [ ] **Step 4: Verify tests**

Run: `npm test -- --run src/App.test.tsx`
Expected: PASS.

### Task 5: Information, testimonials, facts, CTA, and footer

**Files:**
- Create: `src/components/SectionHeading.tsx`, `src/components/Information.tsx`, `src/components/Testimonials.tsx`, `src/components/Facts.tsx`, `src/components/Cta.tsx`, `src/components/Footer.tsx`
- Modify: `src/App.tsx`, `src/App.test.tsx`

**Interfaces:**
- Produces: `SectionHeading`, `Information`, `Testimonials`, `Facts`, `Cta`, and `Footer` components.

- [ ] **Step 1: Add failing section tests**

Assert both information headings, three testimonial names, 50% and 90% facts, Get In Touch link, copyright, and social links.

- [ ] **Step 2: Run targeted tests**

Run: `npm test -- --run src/App.test.tsx`
Expected: FAIL for missing sections.

- [ ] **Step 3: Implement remaining sections**

Use the exact Figma copy and local assets. Alternate information layout direction on desktop, emphasize the middle testimonial, and render footer links in responsive columns.

- [ ] **Step 4: Verify tests**

Run: `npm test -- --run src/App.test.tsx`
Expected: PASS.

### Task 6: Pixel-faithful responsive styling

**Files:**
- Create: `src/styles.css`
- Modify: `src/main.tsx`

**Interfaces:**
- Produces: CSS classes consumed by all components; custom properties for palette, type, spacing, content width, and radius.

- [ ] **Step 1: Add global tokens and base rules**

Define the exact colour variables, Sora/DM Sans stacks, border-box sizing, dark background, smooth scrolling, focus rings, image sizing, and reduced-motion override.

- [ ] **Step 2: Implement 1440 px layout**

Use a maximum 1260 px content container with 90 px side padding, 120 px vertical section rhythm, 72/86 px hero type, 48/56 px section headings, three-column service layout, 750 px project cards, and desktop split grids matching the reference.

- [ ] **Step 3: Implement tablet layout**

At `max-width: 1100px`, reduce page gutters and typography, preserve useful two-column splits, and match the 1024 px composition.

- [ ] **Step 4: Implement mobile layout**

At `max-width: 640px`, use 32 px gutters, 40/48 px hero type, 32/40 px headings, stacked cards, 260 px project images, 400 px information images, and the mobile footer/menu arrangement.

- [ ] **Step 5: Run unit and build verification**

Run: `npm test -- --run && npm run build`
Expected: all tests pass and Vite completes without TypeScript or build errors.

### Task 7: Visual verification and localhost delivery

**Files:**
- Modify as required: `src/styles.css` and affected component files.

**Interfaces:**
- Produces: verified responsive site available from a persistent local Vite server.

- [ ] **Step 1: Start preview server**

Run: `npm run dev -- --host 127.0.0.1`
Expected: Vite reports a local URL, normally `http://127.0.0.1:5173/`.

- [ ] **Step 2: Capture desktop and mobile screenshots**

Use a browser at 1440 px and 414 px viewport widths and save screenshots under `work/visual-checks/`.

- [ ] **Step 3: Compare against Figma and refine**

Check section order, heights, gutters, typography, card dimensions, images, colours, and mobile stacking against the supplied Figma screenshots. Correct every material mismatch, then repeat captures.

- [ ] **Step 4: Run final verification**

Run: `npm test -- --run && npm run build`
Expected: all tests pass and production build succeeds.

- [ ] **Step 5: Confirm localhost response**

Run: `curl -I http://127.0.0.1:5173/`
Expected: HTTP `200 OK`; leave the server running and report its URL.
