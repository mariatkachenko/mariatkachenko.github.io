# Mobile Works Carousel Design

## Goal

Make the mobile Works carousel immediately understandable and responsive: the card follows the finger directly, and release settles on the nearest project.

## Interaction

- The active card is centered and fully visible.
- The previous and next cards remain partially visible above and below as clear navigation affordances.
- Vertical drag maps continuously to carousel position with no animation lag while the pointer is down.
- Releasing the pointer snaps to the nearest whole card.
- A tap or tiny accidental movement does not change the active card and does not suppress a valid card click.
- Wheel and trackpad input on mobile-sized layouts move through the same vertical axis.

## Visual model

- Mobile cards use a simple vertical rail rather than a circular or perspective stack.
- Distance from center controls only vertical offset, modest scale, gradient shading, and layer order.
- No `rotateX`, `rotateY`, or `rotateZ` is applied to mobile cards.
- Exactly five cards remain rendered around the active position; the other cards are hidden.
- The desktop carousel and all card content remain unchanged.

## Motion

- While dragging, transitions are disabled so movement is 1:1 with the finger.
- On release, a short ease-out transition settles the nearest card into the center.
- Entry motion uses the same vertical geometry, avoiding a separate visual model.
- Reduced-motion behavior continues to use the project's existing accessibility rules.

## Verification

- Unit tests cover mobile drag sensitivity, nearest-card release, pose geometry, pointer axis, and wheel direction.
- Style/component tests confirm the mobile branch has no card rotation.
- Full tests, TypeScript build, and production build must pass.

