# Works mobile five-card stack

## Scope

Change only the Works carousel at widths up to 600 px. Keep desktop layout, card content, hand artwork, navigation, themes, and vertical drag behavior unchanged.

## Composition

- Display exactly five cards: one front card and four cards behind it.
- Keep the front card at full mobile size, front-facing, and without a Z-axis tilt.
- Move each subsequent card upward, reduce it slightly, and place it on a lower layer.
- Alternate rear-card Z-axis tilts left, right, left, right.
- Recalculate the stack from the continuously changing carousel offset so the card nearest the center becomes the unrotated front card while scrolling.
- Keep the carousel at its current mobile vertical position (`top: 27vh`).

## Implementation boundary

- Replace the temporary mobile-lower-card hiding rule with a pure mobile stack pose helper.
- The helper returns vertical offset, scale, X-axis depth tilt, Z-axis alternating tilt, and layer for each of the five visible offsets.
- Existing desktop pose helpers remain unchanged.

## Verification

- Unit-test the front pose and four alternating rear poses.
- Assert that mobile CSS consumes the new Z-axis rotation and no longer hides lower cards.
- Run the full test suite, TypeScript compiler, and production build.
