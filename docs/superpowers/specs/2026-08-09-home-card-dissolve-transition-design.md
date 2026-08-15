# Home Card Dissolve Transition

## Goal

Replace the geometric card-to-page stretch used when navigating from `/` to `/works` or `/hackathons` with a clean dissolve transition.

## Visual behavior

- The selected home card fades out in its original geometry without stretching into the destination viewport.
- The destination page fades in at the same time.
- The crossfade lasts 400 ms and uses a smooth ease-out curve.
- Desktop and mobile use the same transition character and timing.
- Fixed header and bottom controls remain visually stable and do not participate in the dissolve.
- Destination-specific entrance motion, such as the works hand and carousel, remains independent from the route dissolve.

## Navigation behavior

- The dissolve applies when navigating forward from the home page to either destination.
- Back navigation to the home page is outside this iteration and keeps its current behavior.
- Browsers without View Transitions continue to use the existing route fallback.
- With `prefers-reduced-motion: reduce`, the dissolve duration is reduced to an effectively instant transition.

## Implementation boundary

- Change only the shared route-transition CSS and its exact CSS contract tests.
- Preserve route names, destination layouts, home card composition, fixed chrome, carousel geometry, and page content.
- Do not add blur, scale, or directional movement in this iteration.

## Verification

- Confirm the CSS contract rejects the previous geometry interpolation and requires explicit old/new opacity animations.
- Run the focused style test, then all tests, TypeScript build, and production build.
- Visually check `/` to `/works` and `/` to `/hackathons` at desktop and mobile widths in light and dark themes.
