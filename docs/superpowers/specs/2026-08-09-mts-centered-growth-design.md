# MTS centered growth and layering

## Goal

Make the MTS Pay artwork visibly and progressively grow when the project becomes the nearest central carousel card, while keeping that artwork above every neighboring card layer.

## Growth transition

- The external artwork keeps its final width of `150%`.
- Outside the centered state, the external artwork is scaled to approximately the normal preview size and is transparent.
- On `.has-project.is-centered`, it transitions to full scale and full opacity over `450ms` with a smooth ease-out curve.
- The cropped preview fades out during the same transition.
- Leaving the center plays both transitions in reverse.
- Hover and focus do not change the artwork size.
- Reduced-motion mode removes the transition while preserving the correct final state.

## Layer hierarchy

- The centered MTS deck article receives a dedicated z-index above all other carousel articles.
- The external artwork is above the surface and neighboring cards.
- The MTS footer remains above its own artwork for readability.
- The card and artwork remain shadow-free.

## Scope

Keep continuous drag and wheel behavior, centered-card selection, artwork file, card dimensions, modal behavior, mobile composition, themes, and all non-MTS card visuals unchanged. Do not change the home or About pages.

## Verification

- The external artwork transitions both `transform` and `opacity` over `450ms`.
- The resting scale is visibly smaller than the centered scale.
- Centered MTS article z-index exceeds the maximum normal carousel layer.
- External artwork stays below the MTS footer but above neighboring cards.
- No hover growth or shadow is introduced.
- Full tests, TypeScript, and production build pass.
