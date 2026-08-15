# MTS game layered project card

## Goal

Replace the existing analogous MTS game cover on the specially marked placeholder card with a layered composition based on the supplied reference.

## Target

- Change only the card at `WORKS_MTS_PLACEHOLDER_INDEX`.
- Other cards that reuse `mts-pay-game-card.png` remain unchanged.
- Keep the existing carousel position, footer content, card dimensions, and interaction behavior.

## Assets

Use the supplied transparent PNGs as separate runtime assets:

1. two-phone artwork;
2. girl artwork;
3. statue artwork.

The supplied full composition is a visual reference only and is not rendered as the final card.

## Off-center state

- Only the two-phone artwork is visible inside the normal card preview.
- The phones use the same clipped preview geometry as other cards.
- The girl and statue are hidden.
- The card remains visually consistent with the other off-center project cards.

## Centered state

- The phone artwork enlarges smoothly and becomes the central foreground layer.
- The girl appears as an independent left-side layer, crossing the card boundary.
- The statue appears as an independent right/back layer, crossing the card boundary behind the phones.
- The composition follows the supplied reference: girl left, phones centered/front, statue right/back.
- The centered article is raised above neighboring cards so none of the three layers are covered by adjacent card content.
- The existing footer stays above the composition and remains readable.

## Motion

- Entering the centered state smoothly scales and reveals the three layers.
- Leaving the center reverses the transition.
- Hover and focus do not trigger the composition.
- Reduced-motion mode switches directly between final states.

## Responsive behavior

- Desktop and mobile use the same layer order.
- Mobile sizes may be reduced to keep the girl, phones, and statue within the viewport while still crossing the card boundary.
- No layer may cover the fixed back button or lower controls.

## Scope

Do not change the main MTS Pay card, other placeholder cards, carousel motion, hand, background, modal, home page, or About page.

## Verification

- Only the targeted MTS game card uses the new assets.
- Off-center rendering contains only the two phones.
- Centered rendering reveals separate girl and statue layers and enlarges the phones.
- Layer order matches the reference.
- Neighboring cards cannot cover the centered composition.
- Footer remains readable.
- Full tests, TypeScript, and production build pass.
