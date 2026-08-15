# About Page Space Pattern Design

## Goal

Replace the plain background of the “Обо мне” page with the supplied space-themed pattern, repeated at a medium scale, while removing the larger outer circle around the astronaut.

## Design

- Render the supplied image as a repeated background layer behind every page element.
- Keep the existing inner translucent pink sphere around the astronaut.
- Remove the larger-radius outer sphere surface and its shadow.
- Preserve the astronaut, carousel, controls, routes, motion, and dark theme behavior.

## Verification

- CSS tests assert that the page uses the new repeated asset.
- CSS tests assert that the outer porthole shell is transparent and shadowless.
- Existing application tests and the production build must pass.
