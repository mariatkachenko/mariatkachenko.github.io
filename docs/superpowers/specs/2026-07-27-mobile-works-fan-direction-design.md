# Mobile Works Loop and Fan Direction

## Goal

Turn the mobile Works carousel into a continuous vertical oval loop and reverse the fan so card edges point outward from the carousel center.

## Geometry

- Map each card’s continuous wrapped offset to an angle around a vertical oval.
- Use the angle sine for vertical position and cosine for front/back depth.
- Cards on the front half are larger, fully visible, and layered above rear cards.
- Cards on the rear half are smaller and progressively more transparent.
- Negate the mobile `rotateX` angle derived from the existing Works row pose so the fan opens outward.
- Keep the desktop `rotateY` angle unchanged.
- Keep the initial carousel position unchanged so no card starts completely edge-on.
- Keep vertical drag and wheel behavior unchanged.
- Remove hard top/bottom clipping from the mobile carousel.

## Expected Result

- Cards above center tilt their upper edges outward.
- Cards below center tilt their lower edges outward.
- The mobile stack visually opens away from the center.
- Cards leaving the bottom continue from the top through the existing wrapped position model.
- The loop fits inside the free page area and does not create page scroll.

## Mobile Loop Parameters

- Vertical oval radius: approximately `22vh`.
- Scale range: `0.72` on the rear to `1` on the front.
- Opacity range: `0.18` on the rear to `1` on the front.
- Z-layer is derived from frontness, with the front half above the rear half.
- Desktop position, opacity, scale, and layering variables remain unchanged.

## Verification

- Add a pure mobile-loop pose helper and test its wrapping, front/back scale, opacity, and layer values.
- Component tests assert that mobile rotation is the inverse of desktop pose rotation.
- Existing desktop pose tests remain unchanged.
- CSS tests assert that mobile cards consume loop position, scale, opacity, and layer variables without hard carousel clipping.
- Run the full test suite and production build.
