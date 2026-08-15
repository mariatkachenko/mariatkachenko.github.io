# Selective System Swipe

## Goal

Restore browser/system back and forward swipe gestures across the site while preventing accidental history navigation when users interact with the Works and About carousel areas.

## Behavior

- Remove global horizontal overscroll containment from the document root and application container.
- Remove the global `touch-action: pan-y pinch-zoom` restriction from the application container.
- Preserve `touch-action: none` on `.maria-works-carousel` and `.maria-orbit-carousel`.
- Preserve the carousels’ existing drag and horizontal-wheel `preventDefault()` behavior.
- Outside either carousel, the browser may handle horizontal gestures normally.
- Do not change carousel movement, route transitions, page layout, or vertical scrolling behavior.

## Browser Constraint

Native history-swipe behavior is browser- and operating-system-controlled. CSS and event cancellation can isolate carousel interaction zones, but cannot force unsupported browsers to provide history navigation.

## Verification

- Update the style test to assert that global swipe containment is absent.
- Assert that exactly two carousel containers retain `touch-action: none`.
- Run the carousel tests, full test suite, and production build.

