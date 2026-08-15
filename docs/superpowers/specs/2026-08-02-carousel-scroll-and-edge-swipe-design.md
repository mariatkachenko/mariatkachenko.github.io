# Carousel Scroll Direction and Edge-Swipe Design

## Goal

On the Works and About pages, make carousel wheel/trackpad scrolling move in the opposite direction from the current behavior while keeping direct drag and touch swipes natural. Prevent native browser back/forward gestures from interrupting carousel interaction, without disabling those gestures elsewhere on the site.

## Interaction Rules

- Horizontal wheel and trackpad deltas are inverted before changing carousel position.
- Shift + vertical wheel, when used as horizontal carousel input, is inverted in the same way.
- Pointer drag and touch swipe continue to follow the pointer/finger direction and are not inverted.
- On the mobile Works page, the vertical carousel keeps following vertical finger movement; wheel input, where available, is inverted.
- Both carousel interaction regions contain horizontal overscroll locally and prevent default browser handling while an active carousel gesture is in progress.
- While the pointer is directly over a carousel, a non-passive window-level wheel guard cancels horizontal browser navigation gestures before the browser handles them. The guard stops immediately on pointer leave.
- Native browser back/forward gestures remain available outside the carousel regions.
- Existing autoplay, click suppression after drag, snapping, card order, and visual poses remain unchanged.

## Implementation

- Add a small exported helper that inverts accepted wheel deltas so the direction rule is explicit and testable.
- Apply the helper in `WorksCardCarousel` and `HackathonOrbitCarousel` only after each component has determined that the wheel event is valid carousel input.
- Strengthen carousel CSS containment with local `overscroll-behavior` rules while preserving existing `touch-action: none`.
- During active pointer movement, prevent default browser gesture handling in the carousel handlers. Pointer capture remains responsible for keeping the drag on the carousel.
- Each carousel tracks pointer enter/leave locally and uses that state in a window capture listener. It does not stop propagation, so the carousel still receives the wheel event and rotates normally.

## Testing

- Unit tests verify opposite wheel direction for both carousels.
- Existing drag tests continue to verify natural direct manipulation.
- Tests verify carousel containers retain gesture containment styles.
- Tests verify a cancelable horizontal window wheel is prevented only while the pointer is over each carousel.
- Run the complete Vitest suite and production build.

## Scope

No changes to routing, page-transition animation, global browser navigation, carousel layout, autoplay timing, card visuals, or modal behavior.
