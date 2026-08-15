# Home Card Scale Dissolve

## Goal

Add a subtle size change to the selected home card while preserving the clean dissolve transition between the home page and its destination pages.

## Opening behavior

- The selected card is isolated from the route snapshot as its own transition layer.
- It scales from `1` to `1.25` while fading out.
- The home scene and destination page crossfade underneath it.
- The unselected card does not receive the scale animation.

## Closing behavior

- Returning from `/works` or `/hackathons` uses dissolve instead of card-to-page rectangle stretching.
- The matching home card appears at scale `1.25` and settles to `1` while fading in.
- The other home card appears only as part of the home scene dissolve and does not scale.

## Timing and motion

- Opening and closing last 400 ms.
- Motion uses a smooth ease-out curve.
- There is no blur, directional movement, or page-scale animation.
- Desktop and mobile use the same scale ratio and timing.
- With `prefers-reduced-motion: reduce`, scale and dissolve become effectively instant.

## Layering

- Fixed header and bottom controls remain on their existing stable transition layers.
- The animated home card stays above the dissolving route snapshots.
- Destination-specific entrance animations remain independent and unchanged.

## Scope

- Modify only route transition markers, transition CSS, and their tests.
- Do not change home card layout, hover geometry, destination page layout, carousel behavior, content, or assets.

## Verification

- Test that opening and closing expose the correct route and direction markers for selecting the matching card.
- Test the exact CSS contracts for card isolation, `1 ↔ 1.25` scale keyframes, dissolve timing, layering, and reduced motion.
- Run all tests, TypeScript compilation, and the production build.
- Check both routes at desktop and mobile sizes in light and dark themes.
