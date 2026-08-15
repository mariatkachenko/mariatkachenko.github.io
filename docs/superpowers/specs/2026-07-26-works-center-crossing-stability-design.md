# Works Center Crossing Stability Design

## Goal

Remove the visible card flip while a magazine crosses the viewport center and start the Works carousel with a tight, balanced central pair.

## Initial position

- Initialize the carousel at fractional position `6.5`.
- MTS Pay at index `6` and the adjacent placeholder at index `7` begin at offsets `-0.5` and `0.5`.
- Both cards therefore start close to the center and nearly edge-on, without a large empty gap.

## Stable center crossing

- Add a center edge zone covering absolute offsets from `0` through `0.18`.
- Inside this zone the card remains edge-on at `90deg`.
- Preserve the card's last established rotation side while it travels through the edge zone.
- Change to the opposite fan direction only after the card exits the zone on the other side.
- The card must not animate through a frontal `0deg` pose while crossing the center.
- Outside the edge zone, preserve the existing gradual opening curve toward `0deg`.

## Interaction

- Keep fractional drag and wheel positions without snapping.
- Preserve horizontal wheel, Shift+wheel, click suppression after drag, and direct MTS Pay modal opening.
- No autoplay.

## Verification

- Test initial position `6.5` and initial offsets `-0.5` / `0.5`.
- Test that offsets `-0.1`, `0`, and `0.1` remain at `90deg` when supplied the same retained side.
- Test that the side changes only after absolute offset exceeds `0.18`.
- Run the full Vitest suite and production build.
