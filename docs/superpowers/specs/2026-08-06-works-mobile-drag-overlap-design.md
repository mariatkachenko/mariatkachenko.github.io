# Works mobile drag and phone overlap

## Scope

Change only the Works carousel at widths up to 600 px. Preserve the five-card mobile stack, desktop carousel, card content, hand artwork, themes, and page transitions.

## Layout

- Move the mobile carousel from `top: 27vh` to `top: 32vh` so its front card overlaps the phone slightly.

## Interaction

- Keep vertical pointer movement as the mobile drag axis.
- Update carousel position continuously during pointer movement, matching wheel-scroll behavior.
- On pointer release, retain the fractional carousel position instead of rounding to the nearest card.
- Keep drag and wheel directions consistent.
- Preserve click suppression after a real drag.

## Verification

- Add a pure final-position helper test proving mobile drag does not round while desktop behavior is unchanged.
- Assert the mobile `32vh` layout value.
- Run the full test suite, TypeScript compiler, and production build.
