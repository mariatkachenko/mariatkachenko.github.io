# Works Card Hover

## Goal

Replace the layered Works-card hover effect with a simple enlargement.

## Motion

- On fine-pointer hover, scale the card to `1.035`.
- Use a 220 ms smooth scale transition.
- Do not translate the project cover upward.
- Do not add or strengthen shadows.
- Do not add an outline or ring.
- Use the same scale treatment for keyboard focus.
- Disable hover enlargement while the carousel is being dragged.

## Implementation Boundary

- Apply the effect only to cards inside `.maria-works-carousel`.
- Override the generic `.concept-cover:hover` transform and shadow inside Works cards.
- Use the independent CSS `scale` property so carousel `transform` geometry remains unchanged and drag movement does not gain transform interpolation.

## Verification

- CSS tests assert the scale-only hover/focus behavior.
- Tests assert the absence of hover translate, enhanced shadow, and focus ring in the Works override.
- Existing carousel interaction tests remain green.
- Run the full test suite and production build.
