# Works Vector Pattern Design

## Goal

Replace the Works page raster background with the supplied full-screen vector pattern while preserving all foreground content and interaction.

## Appearance

- Light theme page base: `#F9F7F7`.
- Light pattern opacity: `0.5`.
- Dark theme page base: `#030811`, matching the existing Works palette.
- Dark theme uses the same SVG with muted brightness, saturation, and a slight cool hue adjustment; opacity remains lower than light mode.
- Pattern fills the viewport once with `cover`, centered, without tiling.

## Scope

Only the Works page background asset and theme styles change. The carousel, hand, cards, transitions, and other routes remain unchanged.

