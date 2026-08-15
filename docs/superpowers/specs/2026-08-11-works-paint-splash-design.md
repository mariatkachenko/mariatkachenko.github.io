# Works Paint Splash Effect — Design

## Scope

Add a full-screen vector paint-splash effect to `/works`. The effect is tied only to placeholder card index `8`, which already carries the MTS flag. Do not change the home page, `/hackathons`, carousel geometry, card count, presentation modal, or fixed chrome.

## Trigger

- Trigger when card index `8` becomes the centered card.
- Trigger once per new center entry, not on every fractional carousel update.
- Allow the effect to trigger again only after another card has become centered and index `8` later returns.
- Support autoplay, wheel, pointer drag, and the cyclic carousel boundary.
- Do not trigger during the initial compact entrance unless index `8` actually becomes centered afterward.

## Visual sequence

The effect behaves like paint hitting the physical glass in front of the interface:

1. A fast impact begins slightly above the centered card.
2. Several large organic splashes expand across the viewport.
3. Smaller droplets travel outward with varied scale, rotation, and delay.
4. Three or four elongated drips extend downward at different speeds.
5. The paint remains briefly, then fades and retracts over a total duration of approximately `2.8s`.

The layer must cover the cards and fixed interface visually while remaining completely non-interactive (`pointer-events: none`). It must not alter carousel layout or clipping.

## Rendering

Use a dedicated React component containing an inline, viewport-responsive SVG. Build the composition from paths, ellipses, circles, gradients, masks, and restrained SVG blur. Avoid raster or video assets.

The component receives a monotonically changing activation key so each valid center entry restarts its animation cleanly. It removes or hides its expensive animated layer after the sequence completes.

## Palette

- Primary pink: `#ff3f9f`.
- Deep raspberry/burgundy derived from the `/works` dark theme.
- Muted violet derived from the MTS artwork.
- A small amount of cold cyan as an accent.

The palette should remain saturated and celebratory without becoming neon-heavy. Light and dark themes use the same family with adjusted highlight opacity where needed.

## Motion

- Impact: quick overshoot, roughly `300–450ms`.
- Droplet scatter: staggered, roughly `500–900ms`.
- Drips: downward stretch and translation, roughly `1.4–2.2s`.
- Dissolve: begins after the readable paint moment and completes by roughly `2.8s`.
- Motion uses organic easing and varied delays; elements must not move in lockstep.

## Reduced motion

With `prefers-reduced-motion: reduce`, skip scatter and dripping. Show a brief static splash flash, then fade it out. The autoplay behavior remains governed by the existing carousel accessibility logic.

## Testing

- Unit-test the centered-card trigger so fractional updates do not retrigger it.
- Test that leaving and later returning to index `8` creates a new activation.
- Test that the overlay is decorative and does not intercept pointer input.
- Extend CSS string contracts for the full-screen layer, paint animations, and reduced-motion fallback.
- Run all tests, TypeScript, and the production build.

## Acceptance criteria

- The effect occurs only for card index `8` entering the center.
- It appears above the whole interface like paint on glass.
- The splash is vector, colorful, responsive, and visually consistent with the project.
- Drips move downward and the full effect disappears automatically.
- Carousel dragging, wheel handling, autoplay, modal behavior, fixed chrome, light/dark themes, and mobile layout remain functional.
