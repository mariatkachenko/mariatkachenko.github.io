# Front-facing Works carousel

## Goal

Restyle the Works carousel so the card at the visual center faces the viewer, while neighboring cards fan symmetrically into depth like the supplied reference.

## Geometry

- A card at offset `0` has `rotateY(0deg)` on desktop.
- Rotation increases continuously with distance from center: approximately `30deg` near offset `1`, with a maximum of `72deg` for distant cards.
- Cards left of center rotate toward the center from the left; cards right of center mirror that pose.
- The center card receives the highest stacking layer; layers decrease with distance.
- Card size stays uniform and the existing horizontal positions remain unchanged.
- Every card uses the same `16:9` proportions and base dimensions as the MTS Pay card.

## Interaction

- The carousel remains manual: drag and horizontal wheel only.
- There is no snapping or autoplay.
- As position changes continuously, the front-facing pose transfers continuously to the card passing through the center.
- Initial position is the MTS Pay project index so that project opens in the front-facing center pose.

## Mobile

- Keep the existing vertical loop and vertical drag behavior.
- Apply the same center-facing geometry around the horizontal axis: the central card has `rotateX(0deg)` and neighbors progressively tilt away.
- Remove position-based mobile scaling so all cards retain the same physical size while opacity and stacking continue to communicate depth.

## Constraints

- Do not change card content, dimensions, depth surfaces, glow, hand artwork, page background, modal, or navigation.

## Temporary card material

- Use one nearly black wine-pink gradient (`#090407`, `#1d0713`, `#310b20`) for every card in both themes.
- Keep a subtle internal pink highlight without adding a visible border.
- Preserve the MTS Pay artwork while matching its physical spine to the same dark palette.

## Verification

- Update geometry unit tests first and confirm they fail with the current edge-facing center formula.
- Verify initial carousel position and project card placement.
- Run all tests and the production build after implementation.
