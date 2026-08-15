# Works mobile carousel layout

## Scope

Change only the Works page layout. Keep carousel navigation, desktop card visibility, hand artwork, themes, and transitions unchanged.

## Layout

- Move the desktop “На Главную” control from `top: 76px` to `top: 86px`.
- On screens up to 600 px wide, place the same control at `top: 94px`.
- On screens up to 600 px wide, move the Works carousel from `top: 20vh` to `top: 27vh`.
- On screens up to 600 px wide, show the centered card and the two cards above it. Hide the two cards below it visually and from accessibility navigation.
- Preserve the current five-card desktop carousel and all drag/wheel behavior.

## Verification

- Unit-test the mobile lower-card classification.
- Assert the desktop and mobile offsets in the stylesheet test.
- Run the full test suite and production build.
