# Carousel Interactions Expansion Design

## Goal

Expand the “Рабочие задачи” Cover Flow into a symmetric 14-card composition with two inward-facing center cards, and upgrade the “Хакатоны и хобби” orbit to continuous distance-based drag and native horizontal wheel/trackpad scrolling.

## Works Cover Flow

### Composition

- Increase the works deck from 5 to 14 cards.
- Keep one MTS Pay project card and add nine more empty decorative cards to the existing four.
- The carousel has no single flat center card.
- Two cards form the visual center:
  - the left-center card faces inward toward the right;
  - the right-center card faces inward toward the left.
- MTS Pay is one member of the initial center pair.
- The center pair is symmetric around the viewport’s horizontal midpoint.
- Remaining cards continue outward on both sides with progressively stronger edge-on rotation, lower opacity, and lower stacking depth.
- Increase all works-card dimensions:
  - desktop width becomes `clamp(310px,35vw,650px)`;
  - mobile width becomes `80vw`.
- The deck remains above and may overlap the hand-and-phone image.
- The page remains locked to one viewport with no page scrollbar.

### Interaction

- Navigation remains manual only.
- Drag, swipe, and side-card click shift the deck by card positions.
- Because the deck has an even number of cards, state represents the left member of the center pair rather than a single active center.
- A long drag may advance multiple cards according to drag distance.
- MTS Pay opens its presentation whenever it belongs to the current center pair.
- When MTS Pay is outside the center pair, clicking it first shifts the deck to place it in the nearest center position.
- Empty cards never open a project or modal.
- Side-card hover still unfolds a card toward the viewer.
- The two center cards retain an inward-facing angle rather than becoming flat.
- No automatic timer is added.

## Hackathon Orbit

### Continuous Position Model

- Replace integer-only active-index movement during gestures with a continuous floating-point orbit position.
- Card offset is calculated relative to this fractional position.
- Pose values are interpolated continuously between existing orbit poses.
- During drag, cards follow pointer movement immediately rather than waiting for pointer release.
- Use a card-step distance of 180 CSS pixels on desktop and 130 CSS pixels on mobile.
- Drag distance divided by card-step distance determines how many cards the orbit travels.
- A long drag may move across multiple cards in one gesture.
- On pointer release, the orbit snaps smoothly to the nearest integer card position.
- Circular wrapping remains seamless across the first and last project.

### Native Horizontal Scrolling

- Handle horizontal `wheel` input from trackpads and mouse wheels:
  - prefer `deltaX` when present;
  - when `Shift` is held, use `deltaY` as horizontal input;
  - ignore ordinary vertical `deltaY` so page-oriented mouse-wheel intent is not hijacked.
- Wheel distance updates the same floating-point orbit position used by drag.
- After wheel input stops, debounce briefly and snap to the nearest card.
- Wheel interaction prevents browser horizontal overscroll only while the pointer is over the carousel.
- Existing click-to-center behavior remains.
- Existing automatic rotation is removed so it does not fight manual scrolling.

### Accessibility and Motion

- Keyboard navigation remains available through focused project buttons and click-to-center.
- `prefers-reduced-motion` disables animated snapping but retains direct drag and wheel positioning.
- Pointer capture is used during drag and released on completion or cancellation.
- Cursor changes to `grab` and `grabbing` for the draggable orbit surface.

## Component Boundaries

- `WorksCardCarousel` owns:
  - 14-card data generation;
  - center-pair state;
  - pair-relative offsets;
  - multi-card drag distance;
  - existing MTS Pay modal-selection rules.
- `HackathonOrbitCarousel` owns:
  - floating-point orbit position;
  - pointer drag lifecycle;
  - wheel handling and snap debounce;
  - continuous pose interpolation;
  - circular normalization.
- `WorksPage`, `ConceptProject`, `PresentationModal`, project titles, links, and the astronaut model remain unchanged.
- CSS owns visual transforms, size changes, cursor states, and theme/mobile styling.

## Testing

### Works

- Render 14 cards.
- Render exactly one MTS Pay project and 13 empty cards.
- Verify initial center pair uses offsets `-0.5` and `0.5`.
- Verify MTS Pay is in the initial center pair.
- Verify center-pair poses rotate inward in opposite directions.
- Verify a long drag advances more than one position.
- Verify MTS Pay opens only when in the center pair.
- Verify no timer is present.

### Hackathons

- Verify fractional offsets and interpolation.
- Verify an 180px desktop drag moves one card and a longer drag moves multiple cards.
- Verify pointer movement updates cards before pointer release.
- Verify release snaps to the nearest card.
- Verify `deltaX` wheel movement changes orbit position.
- Verify Shift+vertical wheel acts as horizontal input.
- Verify ordinary vertical wheel is ignored.
- Verify circular wrapping remains correct.
- Verify automatic rotation is removed.
- Verify click-to-center, project content, themes, and mobile styling remain intact.

### Global

- Run the complete test suite.
- Run the TypeScript and Vite production build.
- Confirm neither page gains a scrollbar.
- Confirm the existing presentation modal remains unchanged.

## Out of Scope

- Adding project content to empty works cards.
- Changing hackathon project titles or links.
- Adding carousel libraries.
- Momentum or physics simulation beyond direct drag and short snap-to-card easing.
- Changing the hand image, astronaut model, modal iframe, fixed navigation, or global controls.
