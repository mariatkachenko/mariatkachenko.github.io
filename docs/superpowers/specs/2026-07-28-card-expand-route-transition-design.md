# Card Expand Route Transition

## Goal

Replace the current directional slide between the home page and its two subpages with a restrained shared-element transition: the selected card expands into its page, and the page collapses back into the same card.

## Interaction

- Clicking “Работы” expands that card into the Works page.
- Clicking “Обо мне” expands that card into the About/Hackathons page.
- Clicking the visible Back button collapses the current subpage into its corresponding home card.
- Returning from either subpage to the home page is immediate and has no route animation.
- Fixed header and bottom controls remain visually stable.
- Native browser history navigation remains functional.

## Motion

- Use the View Transitions API when available.
- Pair each home card with its matching subpage through a unique `view-transition-name`.
- Animate size, position, border radius, and opacity through the browser’s shared-element interpolation.
- Duration: `520ms`, synchronized with the Works hand rotation.
- Easing: a quick, restrained ease-out curve.
- Do not add rotation, flashes, motion blur, or exaggerated scaling.
- Remove the existing directional slide animation.
- Hide the outgoing light card snapshot while opening a subpage so it cannot stretch into a bright full-screen flash in dark mode.
- On mobile, reveal the destination through a rounded mask near the source card instead of geometrically copying the tilted card.
- When returning on mobile, keep full opacity and collapse into the card's actual bounds so the card remains visually continuous.
- Keep the fixed header and bottom controls as static transition snapshots above the route animation; their groups must not interpolate.

## Fallback and Accessibility

- Provide a short opacity fade when View Transitions are unavailable.
- Disable route motion under `prefers-reduced-motion: reduce`.
- Keep all existing links, history state, focus behavior, and localized labels.

## Architecture

- Add a navigation helper that wraps the existing SPA navigation in `document.startViewTransition()` when supported.
- Commit the React route update synchronously inside the View Transition callback.
- Do not await `requestAnimationFrame` inside the update callback: rendering is paused while the browser captures transition states, so waiting for a frame can stall the transition and cause it to finish without visible motion.
- Use this helper for card clicks and explicit Back buttons.
- Keep native `popstate` handling for browser back/forward and system swipes.
- Assign stable transition names in CSS to each card/page pair on desktop; use route-only mask animations on mobile.

## Verification

- Test the helper with and without `startViewTransition`.
- Test that the update callback completes synchronously without scheduling `requestAnimationFrame`.
- Update the App transition test to expect shared-element/fade behavior and no slide classes.
- Test that each card and matching page receives the correct transition name through CSS.
- Run the complete test suite and production build.
