# Mobile Hackathon Carousel

## Goal

Improve the Hackathons page on screens up to 600 px wide: make the astronaut composition more immersive and let visitors manually swipe the orbital project carousel without removing its automatic playback.

## Visual layout

- Increase the mobile astronaut presentation scale by approximately 18% relative to desktop.
- Increase the mobile porthole sphere diameter by approximately 25%.
- Keep both elements centered and contained by the viewport.
- Raise the carousel so its active card overlaps the astronaut around knee level.
- Preserve three visible cards on mobile: one central card and its two neighbours.

## Interaction

- Keep the existing 3.2-second automatic advance.
- Horizontal pointer or touch movement of at least 42 px advances one card.
- A left swipe selects the next project; a right swipe selects the previous project.
- The carousel pauses while a gesture is active and resumes after it ends.
- A movement below the threshold remains a normal tap, so clicking a card still centres it.
- Pointer capture keeps the gesture reliable if a finger leaves the card bounds.
- Vertical page scrolling remains disabled.

## Implementation

- Add a small exported swipe-direction helper so wraparound behaviour can be tested without DOM mocks.
- Track the pointer start position and active gesture in `HackathonOrbitCarousel`.
- Apply the mobile-only scale and vertical positioning in CSS. Desktop presentation remains unchanged.
- Use the existing orbit-offset calculation, animations, translations, and accessibility labels.

## Verification

- Unit-test both swipe directions and seven-card wraparound.
- Interaction-test that a swipe changes the active card.
- Run the complete test suite and production build.
- Verify the mobile media-query styles for model scale, sphere size, and raised cards.
