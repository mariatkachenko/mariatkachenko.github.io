# Works Scene Transition Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Start the hand, carousel entrance, and MTS flyout as soon as the route View Transition is ready to animate.

**Architecture:** The router emits one readiness event after `transition.ready`. WorksPage converts that event into a scene-ready state, while the carousel gates its existing entrance, the flyout keeps inactive images mounted for advance loading, and the works-only static new snapshots stay hidden so the old home snapshot dissolves over the live scene.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library, View Transitions API.

## Global Constraints

- Preserve all existing visual keyframes, geometry, gestures, autoplay, and durations.
- Do not modify home/About content or fixed chrome.
- Keep this command fully reversible according to the approved design spec.

---

### Task 1: Route completion signal

**Files:** `src/router.ts`, `src/router.test.ts`

- [x] Add a failing test that the readiness event fires after `transition.ready` and before `transition.finished`.
- [x] Implement the exported event name and dispatch in `finally`.
- [x] Run the router test green.

### Task 2: Scene-ready entrance gate

**Files:** `src/maria/WorksPage.tsx`, `src/maria/WorksCardCarousel.tsx`, `src/maria/WorksCardCarousel.test.tsx`, `src/App.test.tsx`, `src/styles.css`, `src/styles.test.js`

- [x] Add failing tests for awaiting/ready states and gated carousel completion.
- [x] Replace the old mount-based callback with `entryReady`.
- [x] Gate hand/card entry CSS with the scene-ready classes.
- [x] Verify focused tests green.

### Task 3: Preloaded flyout and regression verification

**Files:** `src/maria/MtsFlyoutOverlay.tsx`, `src/maria/MtsFlyoutOverlay.test.tsx`, `PROJECT_HANDOFF.md`

- [x] Add a failing test that inactive flyout images stay mounted without the active class.
- [x] Implement inactive preload markup and active class selectors without changing keyframes.
- [x] Update handoff and exact rollback notes.
- [x] Run the full test suite and production build.
