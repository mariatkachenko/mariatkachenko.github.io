# Elliptical Project Orbit

## Goal

Replace the current open card arc on the Hackathons page with a flattened elliptical orbit that visually passes both in front of and behind the astronaut sphere.

## Geometry

- Keep seven project cards and the current circular index wrapping.
- Place the active card at the lower-front centre of the ellipse.
- Move neighbouring cards outward and upward along a flattened horizontal ellipse.
- Place the two farthest orbit positions on the rear half of the ellipse.
- Use a narrower ellipse on screens up to 600 px wide so the visible cards remain legible.

## Depth and layering

- Split the carousel into a rear orbit layer and a front orbit layer.
- Rear cards render below the porthole and astronaut layers.
- Front cards render above the astronaut.
- Preserve card interactivity on both layers.
- Keep the active card visually dominant.

## Card transformation

- Scale cards down progressively as their orbit distance increases.
- Reduce opacity and add subtle blur on the rear half.
- Rotate cards around the Y axis to follow the ellipse perspective.
- Rotate cards around the Z axis so their edges follow the local ellipse tangent.
- Animate position, depth, scale, opacity, blur, and rotation with the existing smooth transition.

## Interaction

- Preserve 3.2-second automatic advance.
- Preserve click-to-centre.
- Preserve the existing 42 px horizontal swipe gesture and circular wrapping.
- A card changes between front and rear layers as its orbit position changes.

## Verification

- Test a pure orbit-pose helper for front/rear depth, scale, opacity, and tilt.
- Verify rear cards receive a rear-layer marker while the active card remains on the front layer.
- Run the full Vitest suite and production build.
