# Smaller Works Cards with Projected Light

## Goal

Reduce Works carousel card size, remove card borders, and add soft light projections beneath the cards toward the phone.

## Card Size

- Desktop width: `clamp(280px, 30vw, 560px)`.
- Mobile width: `70vw`.
- Keep the existing 16:9 aspect ratio and magazine depth surfaces.

## Carousel Position

- Raise the whole desktop carousel by 4 vh: `top: 13vh`.
- Raise the whole mobile carousel by 4 vh: `top: 15vh`.
- Keep carousel height and internal card geometry unchanged.

## Surface

- Remove the outer border from every Works carousel card.
- Keep the translucent glass fill, existing base shadow, and rounded corners.
- Do not restore hover or focus outlines.

## Projected Light Cone

- Add one decorative pseudo-element beneath each Works card.
- Start the light exactly at `top: 100%`, flush with the full lower edge.
- The cone is 100% of the card width at its source.
- Narrow the cone downward toward the card’s horizontal center, visually pointing to the phone center.
- Use a white-to-pale-pink translucent linear gradient.
- Keep maximum brightness at the card edge and fade to transparent toward the phone.
- Use a moderate 14 px blur so the full-width source edge remains readable.
- Keep it behind the card and its magazine spine/pages.
- The light inherits the card’s loop opacity and moves with the card.
- The pseudo-element is non-interactive.

## Existing Behavior

- Preserve the desktop row and mobile oval-loop geometry.
- Preserve scale-only hover/focus feedback.
- Preserve drag behavior and mobile front/rear layering.

## Verification

- CSS tests assert new desktop and mobile widths.
- CSS tests assert the raised desktop and mobile carousel positions.
- CSS tests assert `border:0` for Works cards.
- CSS tests assert the full-width source, narrowing polygon, gradient, 14 px blur, and disabled pointer events.
- Existing carousel tests remain green.
- Run the full test suite and production build.
