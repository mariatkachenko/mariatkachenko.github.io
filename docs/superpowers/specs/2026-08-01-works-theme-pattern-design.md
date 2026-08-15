# Theme-aware pattern on the Works page

## Goal

Make the background-pattern theme change on the Works page as visually distinct as the existing change on the About page.

## Design

- Keep the existing seamless Works SVG, tiling, positioning, scale, and `opacity: .6` unchanged.
- Render the SVG as a CSS mask so its color can be controlled by the page theme.
- In the light theme, fill the pattern with a restrained white, pale-pink, and silver gradient.
- In the dark theme, fill it with a clearly different pink, violet, and subtle cool-cyan gradient.
- Do not change the Works page base background, hand artwork, carousel, controls, motion, layout, or responsive behavior.

## Verification

- Add a CSS regression test that requires the same SVG mask in both themes and separate light/dark gradient fills.
- Confirm the test fails before the production CSS is changed.
- Run the complete test suite and production build after implementation.
