# MTS Pay Perspective Flyout Design

## Scope

Change only the MTS Pay project card on `/works`. Keep the home page, About page, carousel timing, pattern parallax, and the separate graffiti transition unchanged.

## Visual result

The MTS Pay composition is split into three transparent raster layers: the three-phone stage, the multicolor logo, and the glass butterfly. Outside the center position the card remains restrained. When it becomes centered, the stage smoothly enlarges while the logo launches from the lower-left and the butterfly follows from the upper-right with a short delay. Both foreground objects scale beyond the card plane, rotate slightly, gain perspective depth and a stronger shadow, producing a controlled 3D-cinema effect.

On mobile the same choreography uses smaller scale and depth so the objects remain legible without covering the viewport. When the card leaves the center, the layers quickly return to their compact state. Under `prefers-reduced-motion`, transitions are removed while the centered final composition remains available.

## Structure and verification

`ConceptProject` owns the three semantic visual layers. Carousel state continues to be expressed through the existing `is-centered` class; no new React state or timers are added. Component tests verify the three assets and CSS contract tests verify the centered desktop and mobile transforms. The full test, TypeScript, and production build suites must pass.
