# Works Hand Entry and Persistent Fixed Chrome

## Goal

Animate the phone-holding hand into its existing Works-page position as if the arm bends upward from below the viewport, while keeping the same header and bottom controls permanently visible above every page transition.

## Hand Motion

- Animate only `.maria-works-hand`.
- Keep its current resting position and size unchanged.
- Do not translate the complete hand image.
- Use `transform-origin: 100% 54%` so the right-edge elbow point remains stationary.
- Start at approximately `rotate(-48deg)`, placing the wrist and phone below the viewport.
- Animate only rotation to `rotate(0)` over `520ms`, making the wrist follow an arc around the stationary elbow.
- Start with no delay so the hand and page reveal begin and end together.
- Use a restrained ease-out curve with no bounce or overshoot.
- On screens up to `600px`, use a smaller starting rotation and shorter duration.
- Do not animate the hand when leaving the page.
- Disable the hand motion under `prefers-reduced-motion: reduce`.

## Persistent Header and Bottom Controls

- Keep the existing single `FixedChrome` instance outside `.maria-route-content`.
- Assign stable view-transition names to `.maria-header` and `.maria-controls`.
- Assign a stable transition name to the Works carousel.
- Order transition groups as Works page/background, hand, carousel, then fixed chrome.
- Keep the hand group below the carousel group for the complete transition.
- Give both fixed transition groups zero-duration animation and a layer above the route transition groups.
- Keep only the old header and control snapshots visible for the full transition.
- Hide the new fixed-chrome snapshots, preventing mobile relayout differences from flashing or shifting the controls.
- Ensure page expansion, cards, hand motion, modal-free page content, and other route visuals remain below the fixed chrome.
- Do not duplicate, unmount, fade, or re-enter the fixed controls during route navigation.
- Preserve theme switching, language switching, contact link behavior, responsive layout, and existing z-index relationships.

## Verification

- Add CSS tests for rotation-only hand keyframes, duration, delay, fixed elbow origin, mobile override, and reduced-motion rule.
- Add CSS tests asserting the hand transition group is below the carousel transition group.
- Add CSS tests for stable header/control transition names, zero-duration transition groups, and top-layer ordering.
- Keep the App test that verifies header and controls are direct children of `.maria-app`, not route content.
- Run the complete test suite and production build.
