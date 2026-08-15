# MTS Pay Perspective Flyout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the centered MTS Pay single-image zoom with a three-layer perspective flyout.

**Architecture:** Keep carousel state unchanged and let the existing `is-centered` class drive the choreography. Render three transparent images in `ConceptProject`, then animate each layer independently in CSS with desktop, mobile, and reduced-motion variants.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library.

## Global Constraints

- Change only `/works` MTS Pay card visuals.
- Keep the home page, About page, autoplay, pattern parallax, and graffiti transition unchanged.
- Use smaller flyout amplitude on mobile and no transitions under `prefers-reduced-motion`.

---

### Task 1: Define the three-layer contract

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/WorksCardCarousel.test.tsx`
- Modify: `src/styles.test.js`

- [x] **Step 1: Write failing assertions** for `mts-pay-stage.png`, `mts-pay-logo-flyout.png`, `mts-pay-butterfly-flyout.png`, and their centered transforms.
- [x] **Step 2: Run targeted tests** and confirm they fail because the new layers do not exist.

### Task 2: Add assets and production markup

**Files:**
- Create: `public/assets/maria/mts-pay-stage.png`
- Create: `public/assets/maria/mts-pay-logo-flyout.png`
- Create: `public/assets/maria/mts-pay-butterfly-flyout.png`
- Modify: `src/maria/ConceptProject.tsx`

- [x] **Step 1: Copy the three approved transparent assets** into the runtime asset directory.
- [x] **Step 2: Replace the cropped/external duplicate images** with stage, logo, and butterfly layers.

### Task 3: Implement and verify perspective choreography

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles.test.js`

- [x] **Step 1: Add compact and centered transforms** with distinct depth, rotation, timing, and shadows for each layer.
- [x] **Step 2: Add smaller mobile transforms** and include all layers in reduced-motion handling.
- [x] **Step 3: Run targeted tests** until the new contract passes.
- [x] **Step 4: Run the full test suite, TypeScript build, and Vite production build.**
