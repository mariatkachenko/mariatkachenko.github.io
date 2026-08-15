# Works Mobile Spacing and Drag Design

## Goal

Make the Works magazine carousel stable and readable on mobile while ensuring pointer/touch gestures move only the carousel and never trigger native card or image dragging.

## Mobile geometry

- Preserve desktop spacing and behavior.
- At viewport widths up to `600px`, use a horizontal spacing of `28vw` per wrapped offset instead of the desktop `11.5vw`.
- Keep card width at `80vw`, equal scale, magazine thickness, center edge zone, and fan rotation curve.
- Preserve initial position `6.5`.

## Mobile interaction

- Use a mobile drag step of `220px` per carousel position.
- Keep desktop drag step at `150px`.
- Pointer movement updates only carousel position.
- Prevent native `dragstart` on the carousel and all descendants.
- Disable browser image dragging and text selection with CSS.
- Keep `touch-action:none` so horizontal carousel dragging remains controlled by the component.
- Preserve click suppression after a real drag and direct MTS Pay click behavior.

## CSS variables

- Provide both:
  - `--works-row-x` for desktop;
  - `--works-row-x-mobile` for mobile.
- The mobile media query replaces only the transform translation with `--works-row-x-mobile`; rotation, scale, depth, and layer remain unchanged.

## Verification

- Test that cards expose both desktop and mobile X variables.
- Test mobile drag math uses `220px`.
- Test `dragstart` is prevented.
- CSS-test mobile transform and user-drag/user-select blocking.
- Run the full Vitest suite and production build.
