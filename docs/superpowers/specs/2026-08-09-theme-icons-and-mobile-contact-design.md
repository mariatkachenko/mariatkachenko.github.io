# Theme Icons and Mobile Contact Design

## Scope

Change only the shared `FixedChrome` theme controls and the mobile presentation of the Contact arrow. Apply the result consistently on every route, responsive breakpoint, language, and theme.

## Theme controls

- Use the supplied standalone sun and crescent PNG references as the visible button artwork.
- Preserve the current vertical separator and existing button semantics, labels, pressed states, and click behavior.
- Show the selected theme icon at full opacity and the unselected theme icon at `0.34` opacity.
- Render the black source artwork unchanged in the light theme and invert it to light artwork in the dark theme.
- Give both icons a consistent visual height while preserving their different source aspect ratios.
- Keep the existing responsive control footprint so the artwork cannot introduce horizontal or vertical page scrolling.

## Mobile Contact arrow

- Restore the northeast arrow on screens up to `600px`.
- Keep the restored compact mobile typography, avatar size, margins, and Contact padding.
- Render the arrow at a reduced mobile size with no wrapping or additional grid width beyond the Contact column.
- Retain the existing slight upward optical alignment.

## Verification

- Add a failing component test for the two image assets and a failing CSS contract for opacity, theme inversion, dimensions, and the visible compact mobile arrow.
- Implement only the markup, assets, and shared styles required by those tests.
- Run targeted tests, all tests, TypeScript, and the production build.
