# Home Cards Flying Toward the Viewer

## Goal

Give the two main-page navigation cards a mirrored 3D perspective that makes them appear to fly outward toward the viewer while their inner edges recede toward the page center.

## Desktop Treatment

- Add perspective to the card stage.
- Rotate the left card around the Y axis so its right, inner edge recedes.
- Rotate the right card in the opposite direction so its left, inner edge recedes.
- Keep each card’s existing small Z-axis paper rotation.
- Set transform origins toward the inner edges to make the outer edges feel approximately 12–16% closer and larger.
- Add a soft directional shadow cast behind and inward.
- Add a subtle highlight along each outer edge.
- On hover and keyboard focus, move the card slightly toward the viewer without removing its perspective.

## Mobile Treatment

- Preserve the mirrored direction.
- Reduce Y-axis rotation and Z translation so titles and descriptions remain readable.
- Keep the existing stacked mobile placement and card sizes.

## Scope

- Change only the two navigation cards on the home page.
- Preserve links, content, tape, stickers, sounds, and accessibility behavior.
- Do not alter subpage carousels or route transitions.

## Verification

- Update style tests to assert mirrored `rotateY`, perspective, inner-edge transform origins, outer-edge highlight, and perspective-preserving hover transforms.
- Verify mobile styles include reduced rotation.
- Run the complete test suite and production build.

