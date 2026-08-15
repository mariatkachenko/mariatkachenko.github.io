# Works Page Graffiti Pattern

## Goal

Replace the generated graffiti texture on the “Работы” page with the supplied raster image repeated as an opaque tiled pattern.

## Scope

- Apply the supplied image only to the Works page.
- Copy the source image into the project’s Maria asset directory.
- Remove the current procedural CSS graffiti lines from `.maria-works-page::before`.
- Do not change carousel layout, card transforms, phone positioning, modal behavior, or other pages.

## Visual Treatment

- Render only the raster image, with no gradient or gray overlay above it.
- Use full opacity.
- Repeat the image on both axes.
- Size each tile to approximately `840px × 471px`, preserving the source aspect ratio.
- Do not apply dark-theme opacity, brightness, saturation, or hue filters.
- Keep the layer non-interactive and behind all Works-page content.

## Responsive Behavior

The same source asset and tile size are used on desktop and mobile. The pattern repeats from the center of the page. No additional mobile-only asset is required.

## Verification

- Add a style test asserting that the Works-page pseudo-element uses the asset at full opacity, repeats it, uses the specified tile size, and contains no overlay or theme filter.
- Verify that the source asset is present in the public Maria assets directory.
- Run the complete test suite and production build.
