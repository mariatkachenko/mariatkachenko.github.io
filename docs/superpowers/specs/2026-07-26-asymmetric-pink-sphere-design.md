# Asymmetric Pink Sphere

## Goal

Give the Hackathons porthole sphere a transparent radial-gradient body with asymmetric pale-pink edge density and restrained inset depth.

## Appearance

- Keep the central 58–64% of the sphere nearly transparent.
- Add a broad translucent pale-pink edge gradient.
- Concentrate the strongest pink light around the upper-right edge.
- Add a weaker cool-white highlight near the upper-left edge.
- Keep the lower-left edge more transparent to avoid a uniform ring.
- Use one subtle inner shadow for spherical depth rather than a heavy symmetric outline.

## Themes

- Light theme: milky translucent pink glass with a soft neutral shadow.
- Dark theme: slightly brighter pink edge glow with the centre still transparent.

## Layering

- Preserve the current sphere size, astronaut position, and front/rear carousel layering.
- The rear cards remain behind the sphere.
- The gradient must not reduce astronaut visibility through the centre.

## Implementation

- Replace the current ring-like radial background with multiple offset `radial-gradient` layers.
- Refine the existing `::before` inset highlight instead of adding extra DOM.
- Avoid filters that create a new stacking context or break the card depth ordering.

## Verification

- Assert a stable `data-sphere-style="asymmetric-radial"` marker.
- Confirm the porthole and interactive-background z-index order remains unchanged.
- Run the complete test suite and production build.
