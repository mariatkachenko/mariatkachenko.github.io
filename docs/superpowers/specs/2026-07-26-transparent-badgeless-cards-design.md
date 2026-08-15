# Transparent Badgeless Cards

## Goal

Remove all hanging badges and restore the orbital cards to a light translucent glass treatment without reintroducing the grid.

## Removal

- Remove badge markup from every project card.
- Remove all badge sprite positioning and responsive CSS.
- Delete `public/assets/maria/hackathon-badges.png`.
- Remove badge-specific test assertions.

## Card appearance

- Restore a light translucent white/pink glass background.
- Do not restore horizontal or vertical grid patterns.
- Keep backdrop blur, fine white border, soft highlight, and subtle shadow.
- Keep the active card slightly brighter than the others.
- Keep white typography and minimal line art; add a restrained text shadow for contrast.
- In dark theme, use transparent pale glass rather than an opaque dark fill.

## Behaviour

- Preserve all project copy, localization, autoplay, swipe, click, ellipse transforms, depth layering, scale, opacity, and tilt.

## Verification

- Assert that badge markup and asset references are absent.
- Confirm the PNG is removed from both source and fresh build output.
- Run the complete test suite and production build.
