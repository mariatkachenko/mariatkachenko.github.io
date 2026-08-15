# Concept Presentation Modal Design

## Goal

Add a large “МТС Финтех. Концепт” project cover to the Works screen and open the complete Figma presentation in an in-page modal while preserving its native prototype animations.

## Placement and cover

- The cover occupies the main visual area of the second scroll screen at `#works`.
- It uses a 16:9 composition inspired by the first Figma frame: dark editorial background, “МТС Финтех. Концепт” label, oversized “МТС PAY” title, project metadata, and an open indicator.
- The cover is a semantic button with a visible keyboard focus state.
- Existing sticky navigation, video background, hero cards, and third-screen `#hackathons` target remain unchanged.

## Modal viewer

- Clicking the cover opens a fixed modal above the portfolio.
- The overlay is near-black, translucent, and backdrop-blurred.
- The dialog is large but not fullscreen: up to 88vw × 86vh on desktop, with a compact margin on mobile.
- The dialog contains a live Figma prototype embed starting at frame `40007012:21703` from file `X679nLVF8CfbUmiLVRreSP`.
- The embed provides the authoritative slide navigation, transitions, and animations. Figma’s official documentation states that prototype embeds behave like Presentation view and support arrow-key navigation.
- A local close button remains above the iframe. Escape and clicking the dark backdrop also close the dialog.
- Opening locks document scroll, moves focus to the close button, and records the previously focused control; closing restores scroll and focus.

## Progress treatment

- A decorative 48-segment stories rail sits above the viewer.
- Because the Figma iframe is cross-origin, the host page cannot read its current slide. The rail communicates deck length but is not synchronized with the internal Figma slide index.
- Previous/next controls remain Figma-native inside the embed; the host does not duplicate non-functional controls.

## Responsive behavior

- Desktop keeps the 16:9 viewer centered with generous overlay margins.
- Mobile uses nearly the full viewport width, preserves the iframe aspect ratio, and keeps the close control reachable.
- The modal remains above the fixed portfolio navigation.

## Error and access behavior

- The iframe is lazy-created only while the modal is open.
- A small external “Открыть в Figma” link is available if the embed cannot load or requires authentication.
- The Figma file must allow link viewing; private access continues to follow the viewer’s Figma permissions.

## Verification

- Tests cover opening, closing, Escape handling, dialog semantics, embed URL, stories rail length, and body scroll locking.
- Existing portfolio and scroll behavior tests remain green.
- The production build succeeds without adding a modal or animation dependency.

