# Disable System Page Swipe

## Goal

Prevent accidental browser back/forward navigation caused by horizontal system swipes while preserving the site’s own carousel gestures.

## Root Cause

The carousel surfaces already use `touch-action: none`, but the document and application roots do not block horizontal overscroll. A gesture started outside a carousel or near the viewport edge can therefore be interpreted by the browser as history navigation.

## Behavior

- Apply `overscroll-behavior-x: none` to `html`, `body`, `#root`, and `.maria-app`.
- Apply `touch-action: pan-y pinch-zoom` to `.maria-app`.
- Preserve `touch-action: none` on the Works and Hackathons carousel interaction surfaces.
- Preserve clicks on in-page navigation and back buttons.
- Do not add global JavaScript touch interception.

## Browser Boundary

This suppresses history swipe in browsers that expose control through CSS overscroll behavior. Browsers or embedded webviews that reserve edge-navigation gestures at the operating-system level may ignore page-level CSS.

## Verification

- CSS tests assert root horizontal overscroll suppression and application touch action.
- Existing carousel gesture tests remain green.
- Run the full test suite and production build.
