# About Page Space Pattern Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the supplied repeated space pattern to the “Обо мне” page and remove its larger outer circle.

**Architecture:** Add one decorative page pseudo-element below the existing model and carousel. Convert the porthole root into a transparent positioning shell and retain the current inner sphere through its pseudo-element.

**Tech Stack:** React, CSS, Vitest, Vite

## Global Constraints

- Do not change the astronaut, carousel, fixed controls, or navigation.
- Do not add dark overlays over the supplied pattern.

---

### Task 1: About background and sphere

**Files:**
- Create: `public/assets/maria/about-space-pattern.png`
- Modify: `src/styles.css`
- Test: `src/styles.test.js`

**Interfaces:**
- Consumes: `.maria-hackathons-page` and `.maria-hackathons-porthole`
- Produces: repeated page pattern and one inner sphere

- [ ] **Step 1: Write the failing CSS contract test**

Assert that the page pseudo-element references `/assets/maria/about-space-pattern.png`, repeats it, and that the porthole shell is transparent without a filter.

- [ ] **Step 2: Run the targeted test and verify it fails**

Run `pnpm test -- --run src/styles.test.js`.

- [ ] **Step 3: Add the asset and minimal CSS**

Copy the supplied image into the Maria asset directory, add the background pseudo-element, and move the sphere fill to the inner porthole pseudo-element.

- [ ] **Step 4: Run all tests and build**

Run `pnpm test -- --run` and `pnpm build`.
