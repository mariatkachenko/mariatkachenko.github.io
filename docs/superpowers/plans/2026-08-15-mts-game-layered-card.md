# MTS Game Layered Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace only the specially marked MTS game placeholder with a layered phone, girl, and statue composition.

**Architecture:** Add a dedicated presentational `MtsGameProjectCard` with independent image layers and the existing footer language. Render it only at `WORKS_MTS_PLACEHOLDER_INDEX`; leave the repeating cover list and other placeholder cards untouched. CSS derives the reveal entirely from the parent article's existing `.is-centered` state.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite.

## Global Constraints

- Only card index `WORKS_MTS_PLACEHOLDER_INDEX` changes.
- Off-center shows only two phones.
- Centered shows phones in front, girl left, statue right/back.
- Footer remains above all artwork.
- No hover-triggered reveal.
- Main MTS Pay card and carousel mechanics remain unchanged.

---

### Task 1: Add dedicated layered markup and assets

**Files:**
- Create: `src/maria/MtsGameProjectCard.tsx`
- Create: `public/assets/maria/mts-game-phones.png`
- Create: `public/assets/maria/mts-game-girl.png`
- Create: `public/assets/maria/mts-game-statue.png`
- Modify: `src/maria/WorksCardCarousel.tsx`
- Modify: `src/maria/WorksCardCarousel.test.tsx`

**Interfaces:**
- Produces: `MtsGameProjectCard({ language }: { language: Language })` and classes `.mts-game-card`, `.mts-game-card__phones`, `.mts-game-card__girl`, `.mts-game-card__statue`, `.mts-game-card__footer`.

- [ ] Add failing tests that card 8 has one dedicated component, uses all three assets once, has no generic `WorksProjectCard`, while two other repeated MTS game covers remain generic.
- [ ] Run the focused carousel tests and confirm failure.
- [ ] Copy the supplied phone, girl, and statue PNGs byte-for-byte into the runtime assets directory.
- [ ] Implement the dedicated component with separate sibling layers and the existing localized footer.
- [ ] Render it only for `WORKS_MTS_PLACEHOLDER_INDEX` and add `has-mts-game` to that article.
- [ ] Run focused tests and confirm pass.

### Task 2: Compose centered and off-center visual states

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

**Interfaces:**
- Consumes: `.has-mts-game.is-centered` and the dedicated layer classes.
- Produces: clipped resting phones, centered scale/reveal, reference layer order, responsive containment, and reduced-motion fallback.

- [ ] Add failing style assertions for phone-only resting state, statue/girl hidden state, centered transforms/opacities, article z-index, layer order, footer z-index, mobile sizing, and no hover selectors.
- [ ] Run style tests and confirm failure.
- [ ] Add dedicated CSS: statue behind, girl at left middle, phones centered/front, footer topmost; transition all centered layers with the existing calm carousel easing.
- [ ] Add mobile size limits so the composition crosses the card but avoids fixed controls.
- [ ] Run focused tests, full tests, TypeScript, and production build.
