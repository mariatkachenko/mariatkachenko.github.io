# Works Magazine Shelf Depth Design

## Goal

Transform the Works carousel into a continuous magazine-shelf composition where the card passing through the viewport center is shown edge-on and neighboring cards gradually unfold toward a frontal view.

## Content

- Keep all 14 cards and the existing MTS Pay modal behavior.
- Remove every title above the cards, including `MTS Pay` and `Coming soon`.
- Do not add replacement labels.

## Continuous geometry

- Carousel position remains fractional during and after drag or wheel input.
- Remove release snapping and wheel timeout snapping.
- The card whose wrapped offset is `0` rotates `90deg` around the vertical Y axis.
- Rotation magnitude decreases continuously with distance from center:
  - offset `0`: `90deg`;
  - absolute offset `1`: `68deg`;
  - absolute offset `2`: `46deg`;
  - absolute offset `3`: `24deg`;
  - absolute offset `4+`: `0deg`.
- Left and right cards use mirrored rotation signs and face toward the viewport center.
- Crossing the exact center changes rotation direction continuously without changing scale or vertical position.
- All cards retain equal scale and opacity.

## Magazine depth

- Each card gains a visible 3D thickness of approximately `18–24px` on desktop and `12–16px` on mobile.
- Use CSS-generated side surfaces:
  - a darker spine surface;
  - a pale page-block surface;
  - a narrow highlight and a soft contact shadow.
- When the center card reaches `90deg`, its spine/page edge remains visible as a thin but full-height rectangle.
- The MTS Pay spine may use a subtle pink highlight but no text.
- Side surfaces inherit the card radius and theme colors.

## Interaction

- Preserve continuous pointer drag and horizontal trackpad/wheel control.
- Preserve Shift + vertical wheel as horizontal input.
- Plain vertical wheel remains ignored.
- No autoplay.
- A drag suppresses the following click; a direct MTS Pay click opens the existing modal.

## Responsive behavior

- Mobile uses the same continuous rotation formula.
- Thickness decreases on narrow screens.
- Cards stay in a single level horizontal row.

## Verification

- Unit-test the rotation curve at offsets `0`, `1`, `2`, `3`, and `4`.
- Component-test that labels are absent and fractional drag/wheel positions do not snap.
- CSS-test the spine, page-block, thickness variables, and equal card scale.
- Run the complete Vitest suite and production build.
