# Orbit Motion Blur

## Goal

Raise the project-card orbit slightly on every viewport and add brief directional motion blur during carousel movement without reducing resting legibility.

## Layout

- Raise the complete card orbit by 4 vh on desktop, tablet, and mobile.
- Preserve the current flattened ellipse geometry, front/rear layering, and mobile width.

## Motion treatment

- Mark the carousel as moving whenever the active index changes through autoplay, click, or swipe.
- Keep the moving state for the 720 ms card transition duration.
- Add a short translucent directional trail behind each moving card.
- Mirror the trail direction based on the card’s signed orbit offset.
- Make the trail weaker for the active card and stronger for distant cards.
- Remove the trail completely when movement ends.
- Disable the effect under `prefers-reduced-motion: reduce`.

## Interaction

- Preserve autoplay, click-to-centre, swipe navigation, and pointer pausing.
- Repeated navigation restarts the 720 ms moving-state timer cleanly.

## Verification

- Test that changing the active card applies the moving class.
- Test the pure signed blur-direction helper.
- Run the complete Vitest suite and production build.
