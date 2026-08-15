# Route Slide-In Transition

## Goal

Animate only the changing page content during navigation while keeping the fixed header and bottom controls stationary.

## Motion

- Navigating from the home page to `/works` or `/hackathons`: the incoming page moves from right to left.
- Returning from an internal page to `/`: the incoming home page moves from left to right.
- Duration: 480 ms.
- Easing: a smooth decelerating cubic-bezier curve.
- Include a subtle opacity transition, without scale or blur.
- Animate only the incoming route; the previous route is replaced immediately.
- Do not animate the initial application render.

## Structure

- Wrap the currently selected route component in a keyed route-content container inside `App`.
- Track the previous and next route to select a `forward` or `back` modifier.
- Keep `FixedChrome` and `InteractionSounds` outside the animated wrapper.
- Reuse the same transition for browser history navigation and in-app navigation.

## Accessibility

- Under `prefers-reduced-motion: reduce`, remove route transform and animation.
- The transition must not delay focus, pointer interaction, or route state updates.

## Verification

- Tests assert the forward and backward modifier classes after navigation.
- Tests confirm fixed chrome remains outside the animated wrapper.
- CSS tests assert both directional keyframes, duration, and reduced-motion override.
- Run the full test suite and production build.
