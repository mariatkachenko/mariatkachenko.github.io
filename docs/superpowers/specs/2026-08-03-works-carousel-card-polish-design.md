# Works Carousel Card Polish — Design

## Goal

Polish the Works carousel cards so they read as solid Figma-file components, never show more than five cards at once, and remain clean in both themes and on mobile.

## Visibility and carousel behavior

- Keep all 14 items and the existing infinite drag/wheel behavior.
- Render exactly five cards around the nearest integer carousel position. Recalculate the five-card window continuously so fractional drag positions never show fewer or more than five cards.
- Preserve the current spacing and pose math for the five visible cards.
- Hidden cards must not receive pointer interaction and must not leave fragments at either viewport edge.
- The central MTS Pay item remains the only clickable card and continues to open the existing presentation modal.

## Card surface and geometry

- Card surfaces are fully opaque in both themes.
- Light theme uses a solid near-white shell; dark theme uses a solid deep graphite/wine shell.
- Do not draw a gray outline around the card shell; separation comes from the solid surface and restrained shadow.
- Reduce the shell padding around the 16:9 cover to roughly half its previous value.
- Approximate Figma corner smoothing 60% using continuous-looking large radii and clipped overflow; no CSS feature may depend on unsupported native corner smoothing.
- Remove the visible right-side stripe defects. Magazine depth elements remain available only where the perspective makes them useful and must not bleed through the front face.

## Footer

- Footer uses a two-column layout: a blue Figma-file icon on the left and text on the right.
- Title weight is regular/medium rather than bold.
- MTS Pay copy remains localized:
  - RU: `Концепт v3 — Преза`, `Проект · МТС Финтех`
  - EN: `Concept v3 — Presentation`, `Project · MTS Fintech`
- Placeholder copy remains localized and uses the same footer structure.
- The icon is decorative and is hidden from the accessibility tree.

## Responsive behavior

- Desktop and tablet display at most five cards.
- Mobile keeps the vertical carousel and compact footer, while applying the same opacity, border, corner, icon, and visibility rules.
- Existing carousel gesture guards, drag direction, modal size, hand artwork, and route transitions are unchanged.

## Temporary project covers

- Keep the existing MTS Pay cover and click behavior.
- Add the five supplied images as local project assets and cycle them across the other 13 cards.
- Render all covers with `object-fit: cover`; use per-cover positioning so tall phone/UI compositions retain their focal content in the 16:9 preview.
- Decorative placeholder art is only a fallback when an image is unavailable.

## Card projection glow

- Replace the triangular white projection beneath each card with a wide, soft elliptical glow originating evenly from the full lower edge.
- Light theme uses a restrained white/pale-pink glow; dark theme uses a slightly clearer pink/violet glow.
- The glow has no polygonal clipping, sharp corners, or visible hard boundary.
- Mobile uses a shorter, less intense glow to prevent overlap within the vertical carousel.

## Distance focus

- Keep the centered card at full brightness and saturation.
- Dim cards continuously by their absolute fractional distance from center: about 8% per position in light theme and 5% per position in dark theme, capped at the two visible edge positions.
- Apply a small saturation reduction to the outer cards without changing their scale or opacity.
- Use the same continuous distance behavior on mobile.

## Verification

- Unit tests assert the five-card visibility window and localized structured footer.
- Style tests assert opaque theme surfaces, thin borders, clipped rounded geometry, compact mobile footer, and removal of the old translucent shell.
- Run the full Vitest suite and production build.
