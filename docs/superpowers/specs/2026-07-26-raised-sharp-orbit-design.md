# Raised Sharp Orbit

## Goal

Raise all project cards by an additional 6 vh and remove the motion-blur treatment completely.

## Changes

- Move the shared desktop card baseline from `8.5vh` to `14.5vh`.
- Move the mobile card baseline from `22vh` to `28vh`.
- Preserve the existing flattened ellipse geometry and depth layering.
- Remove the moving-state timer and class from the carousel.
- Remove the blur-direction helper and per-card blur variables.
- Remove all moving-state filter/drop-shadow CSS.
- Preserve the subtle resting blur on rear cards, which communicates depth rather than motion.
- Preserve autoplay, swipe, click, scaling, opacity, and perspective tilts.

## Verification

- Update the mobile-position assertion.
- Assert that the carousel no longer receives `is-moving`.
- Assert that the motion-blur helper is no longer part of the public component API.
- Run the complete test suite and production build.
