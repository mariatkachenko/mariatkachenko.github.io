# Works Project Card Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert all Works carousel items into reusable media-and-metadata project cards with light/dark theming and a compact mobile presentation.

**Architecture:** Add a presentational `WorksProjectCard` component shared by the interactive MTS Pay project and the 13 placeholders. Keep carousel geometry and interaction in `WorksCardCarousel`, keep modal opening in `ConceptProject`, and style the structured shell through existing Works CSS.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Preserve carousel wheel, drag, system-navigation guard, layering, modal behavior, and card order.
- Render exactly one interactive project and 13 accessibility-hidden placeholders.
- Support Russian and English copy.
- Support light theme, dark theme, desktop, and the mobile vertical loop.

---

### Task 1: Shared Project Card Structure

**Files:**
- Create: `src/maria/WorksProjectCard.tsx`
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/maria/ConceptProject.tsx`

**Interfaces:**
- Produces: `WorksProjectCard({ title, meta, imageSrc?, placeholder? })`.
- Consumers: `ConceptProject` and placeholder branches in `WorksCardCarousel`.

- [ ] Write failing tests asserting 14 `.works-project-card` shells, 14 previews, 14 footers, one MTS image, one interactive button, and 13 hidden placeholders.
- [ ] Run `pnpm test -- --run src/maria/WorksCardCarousel.test.tsx` and confirm the structural assertions fail.
- [ ] Implement `WorksProjectCard` with media and footer sub-elements.
- [ ] Render it from `ConceptProject` and all placeholder branches.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Localization

**Files:**
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/maria/ConceptProject.tsx`

**Interfaces:**
- Produces Russian and English project/footer copy selected by the existing `language` prop.

- [ ] Add failing tests for `Концепт v3 — Преза`, `Проект · МТС Финтех`, `Новый проект`, and English equivalents.
- [ ] Run the focused test and confirm the localized text is missing.
- [ ] Add the exact localized strings without changing global i18n architecture.
- [ ] Re-run the focused test and confirm it passes.

### Task 3: Responsive Themed Styling

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

**Interfaces:**
- Produces stable class contracts for `.works-project-card`, its preview/footer, dark-theme overrides, and mobile sizing.

- [ ] Add failing stylesheet assertions for the shared shell, 16:9 preview, footer, light shell, dark override, and compact mobile rules.
- [ ] Run `pnpm test -- --run src/styles.test.js` and confirm the new assertions fail.
- [ ] Replace the old pure-rectangle card surface with the taller shell while preserving spine, pages, glow, transform, hover scale, and modal styles.
- [ ] Adjust mobile width, footer padding/type, and vertical loop amplitude only enough to prevent clipping and excessive overlap.
- [ ] Re-run stylesheet and carousel tests.

### Task 4: Verification

**Files:**
- Verify only.

- [ ] Run `pnpm test -- --run` and require zero failures.
- [ ] Run `pnpm build` and require a successful TypeScript/Vite build.
- [ ] Confirm no routing, gesture, modal, hand-image, or About-page files changed except shared build output.

This directory is not a Git repository, so commit steps are intentionally omitted.
