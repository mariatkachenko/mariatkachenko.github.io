# Grain Archive Fidelity Correction

## Goal

Bring all four Grain Archive routes (`/`, `/archive`, `/article`, `/about`) into close visual agreement with the supplied Figma designs at desktop, tablet, and mobile widths, including the missing hero video.

## Approved approach

Keep the existing React/Vite application and History API router. Re-extract the four page frames and their responsive variants from Figma, then correct the existing components and CSS instead of replacing the application architecture.

## Media and typography

- The homepage hero uses the original moving media when it can be extracted from the Figma Site. It renders as an autoplaying, muted, looping, `playsInline` background video.
- The video has a local poster image and a static fallback for reduced-motion or playback failure.
- Figma image assets are downloaded into `public/assets/grain/`; expiring MCP URLs are not left in production code.
- Geist, Instrument Serif Italic, and Tilt Warp are stored locally and declared with `@font-face`, eliminating layout shifts caused by delayed remote font loading.

## Layout fidelity

- Desktop reference width: 1280 px.
- Tablet reference width: 768 px.
- Mobile reference width: 375 px.
- Section height, padding, gaps, grid columns, type size, line height, letter spacing, radii, and image crop match the corresponding Figma frame.
- The shared navigation, subscription ticket, and footer remain reusable components, with route-specific content preserved.
- Existing semantic landmarks, accessible names, keyboard focus, and route navigation remain intact.

## Route scope

- Home: video hero, article grid, View all banner, Featured Album, Cinema Selects, subscription, footer.
- Archive: page heading, complete archive card grid, end marker, subscription, footer.
- Article: title/meta, hero image, intro, long-form editorial sections, related cards, end marker, subscription, footer.
- About: heading/copy, archival object strip, portrait/contact section, subscription, footer.

## Failure and accessibility behavior

- If the video cannot load, the poster remains visible and the page layout does not collapse.
- `prefers-reduced-motion: reduce` disables autoplay presentation and displays the poster.
- Images retain meaningful alternative text where informative; decorative graphics use empty alternative text.
- Responsive layouts must not introduce horizontal document scrolling at 375, 768, or 1280 px.

## Verification

- Component tests assert that the homepage contains a correctly configured video and that all four routes retain their required content.
- Production build must succeed.
- Every route must return HTTP 200 from localhost.
- Visual checks are performed at 375, 768, and 1280 px against the Figma screenshots, with adjustments made before completion.

