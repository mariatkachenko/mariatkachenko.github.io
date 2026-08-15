# Page pattern contrast adjustment

## Goal

Increase the visual contrast of the Works page background and pattern while slightly reducing the contrast of the About page background and pattern.

## Works page

- Use pattern opacity `0.60`.
- Keep a restrained page-specific background that separates from the pattern without overpowering it.
- Use dark pattern correction `contrast(1.12) saturate(1.42)`.

## About page

- Use light pattern opacity `0.56`.
- Use dark pattern opacity `0.47`.
- Match the perceived intensity of the pink and blue background glows to the Works page without changing their positions.

## Constraints

- Do not change the sphere, astronaut, hand, cards, controls, motion, layout, or responsive behavior.
- Keep existing pattern assets, repetition, scale, and positioning unchanged.

## Verification

- Update CSS regression tests with the exact contrast and opacity values.
- Confirm the tests fail before changing production CSS.
- Run the complete test suite and production build afterward.
