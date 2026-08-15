# Dedicated MTS Pay project card

## Decision

Replace the current MTS implementation entirely. `ConceptProject` must no longer render `WorksProjectCard` and must not use `.concept-cover` or any previous breakout classes.

## Structure

`ConceptProject` renders one dedicated button `.mts-project-card` with `overflow: visible` and no clipping or isolation.

Its children are independent siblings:

1. `.mts-project-card__surface` — clipped rounded card background;
2. `.mts-project-card__cropped-artwork` — normal preview clipped by the surface;
3. `.mts-project-card__external-artwork` — large transparent PNG layer outside the surface;
4. `.mts-project-card__footer` — title/meta layer above both artworks.

No parent between the external artwork and `.mts-project-card` may use `overflow: hidden`, `clip-path`, `mask`, or `contain: paint`.

## States

Off-center:

- surface and cropped artwork are visible;
- external artwork is hidden;
- the result fits the normal card geometry.

Centered:

- cropped artwork is hidden;
- external artwork is visible;
- external artwork is `150%` of the normal preview width, with proportional height;
- it is centered over the former preview area;
- its visible content crosses the card on left, right, top, and lower-left areas;
- footer remains above the artwork.

Use `150%` instead of the previous `140%` because the PNG has transparent margins and the user requested an unmistakable breakout.

## Interaction

The whole dedicated card remains a button and opens the existing presentation modal. Hover and focus do not resize the MTS card or either artwork. No MTS flag is rendered in the dedicated component.

## Carousel integration

Keep the existing `.has-project.is-centered` state on the deck article. CSS uses that external state to switch between cropped and external artwork. Do not change carousel position math, drag, wheel, mobile stacking, or entry timing.

## Responsive and themes

Use the same structure on desktop and mobile. Card dimensions continue to inherit from the existing deck article. The surface adapts to light/dark themes, while the artwork remains unchanged and has no added dark preview rectangle.

## Removal

Remove all obsolete MTS-only breakout rules and markup:

- `.concept-cover__external-artwork`;
- centered `.concept-cover` overflow override;
- MTS use of `WorksProjectCard`;
- MTS flag prop on the real project card.

Keep `WorksProjectCard` unchanged for placeholder cards, including the separately marked placeholder flag asset unless a later request removes that content.

## Verification

- MTS button contains no `WorksProjectCard`.
- Dedicated component has surface, cropped artwork, external artwork, and footer as siblings.
- External artwork's direct parent is the unclipped MTS button.
- Centered state uses `150%` external artwork and hides cropped artwork.
- Off-center state reverses visibility.
- Footer stays above the external artwork.
- Modal, carousel interaction, desktop/mobile, and light/dark states remain functional.
- Full tests, TypeScript, and production build pass.
