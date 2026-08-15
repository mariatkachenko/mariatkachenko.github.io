# Mobile Vertical Works and Orbit Autoplay Design

## Goal

Convert the mobile Works magazine shelf into a vertical carousel and restore a large, astronaut-wrapping Hackathons orbit with respectful autoplay.

## Mobile Works carousel

- Applies at viewport widths up to `600px`.
- Desktop remains horizontal and unchanged.
- Cards remain landscape-oriented but form a vertical stack.
- Position cards with vertical translation using a `28vh` step per wrapped offset.
- Rotate around the horizontal X axis:
  - center edge zone: `90deg`;
  - neighboring cards: `68deg`, `46deg`, `24deg`;
  - far cards: `0deg`.
- Upper and lower cards mirror toward the viewport center.
- Pointer/touch drag reads `clientY`; vertical movement changes fractional carousel position.
- Wheel input uses vertical `deltaY` on mobile.
- Native image/card dragging remains disabled.
- Preserve initial position `6.5`, center-crossing stability, magazine thickness, and MTS Pay click behavior.

## Hackathons autoplay

- Advance one orbit position every `3200ms`.
- Disable autoplay when `prefers-reduced-motion: reduce` matches.
- Pause immediately on pointer interaction.
- Resume `1800ms` after pointer release/cancel or the latest manual wheel gesture.
- Preserve fractional drag and wheel control.
- Autoplay advances to the next whole orbit position with the existing orbit animation.

## Mobile Hackathons orbit

- Increase card width from `150px` to `clamp(178px, 48vw, 195px)`.
- Use a wider mobile ellipse around the astronaut:
  - horizontal amplitude up to `44vw`;
  - vertical lift up to approximately `28vh`.
- Raise the orbit so cards wrap around the astronaut's torso/legs rather than forming a small foreground strip.
- Preserve layer split:
  - front cards remain above the astronaut;
  - rear cards remain behind the astronaut/sphere.
- Keep the existing 12 orbit positions, including five decorative placeholders.
- Preserve mobile swipe and desktop behavior.

## Verification

- Test mobile Works axis selection, `clientY` drag, vertical wheel, and X-axis pose variables.
- CSS-test mobile vertical transform and `rotateX`.
- Use fake timers to test Hackathons autoplay, interaction pause, delayed resume, and reduced-motion disablement.
- Test mobile orbit sizing and expanded mobile geometry variables.
- Run the complete Vitest suite and production build.
