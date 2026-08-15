# Hanging Project Badges

## Goal

Remove the card grid pattern and add a different hanging event badge to each of the seven orbital project cards using the supplied transparent PNG.

## Source asset

- Source: `codex-clipboard-bba60886-6424-4c10-bb31-7cb08d1841ef.png`
- Dimensions: 5401 × 3495 px.
- The image has an alpha channel.
- Copy it once into the project and reuse it as a sprite; do not create seven duplicate raster files.

## Badge mapping

- Select seven visually distinct badges from left to right along the source arc.
- Each card uses a clipped viewport into the shared sprite.
- Vary badge rotation between approximately −7° and +7°.
- The lanyard extends beyond the top edge while the plastic pass overlaps the card face.
- The active card shows the badge most clearly; distant badges inherit the card’s existing scale and opacity.

## Card changes

- Remove both horizontal and vertical grid layers from the card background.
- Keep a single restrained glass highlight.
- Preserve white text, settings pill, line icon, corner marks, and orbit detail.
- Allow the badge viewport to extend outside the card without leaking other internal decoration.
- Keep project titles unobstructed.

## Responsive behaviour

- Desktop badge height: approximately 54–68% of the card.
- Mobile badge height: approximately 45–52% of the card.
- Move badges slightly toward the upper-right so long titles retain space on the lower-left.

## Accessibility and performance

- Badges are decorative and use `aria-hidden="true"` with an empty image alt.
- The browser downloads one transparent PNG and reuses it from cache.
- Existing carousel autoplay, swipe, click, depth, and ellipse transforms remain unchanged.

## Verification

- Test seven badge viewports and one shared source URL.
- Confirm every badge is aria-hidden.
- Confirm the card grid background declarations are absent.
- Run the complete test suite and production build.
