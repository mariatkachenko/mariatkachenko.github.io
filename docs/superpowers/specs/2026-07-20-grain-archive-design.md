# Grain Archive — Multi-page Design Specification

## Goal

Replace the existing Portier landing page with the Grain Archive editorial website from Figma section `4131:4866`. Implement all four routes and reproduce the supplied desktop (1280 px), tablet (800 px), and mobile (375 px) compositions.

## Technology and Routing

Retain the current Vite, React, TypeScript, Vitest, and plain CSS stack. Do not add Tailwind, a UI library, or a routing dependency.

The application uses a small client-side router driven by `window.location.pathname` and the History API. Supported routes are:

- `/` — Home
- `/archive` — article archive
- `/article` — featured article
- `/about` — publication information and contact

Internal links update browser history without a full reload, restore focus to main content, and support browser back/forward navigation. Unknown paths resolve to Home.

## Shared Architecture

The four pages reuse Navigation, ArticleCard, Subscribe, and Footer components. Content data and asset paths live in a typed data module. Each page component owns only its unique structure:

- Home: hero, featured article grid, album feature, cinema table.
- Archive: archive heading, eight-card article grid, end-of-reel marquee.
- Article: title/meta header, hero, introduction, long-form article, related articles.
- About: vintage-object marquee, publication statement, portrait/contact block.

## Visual System

- Base background: `#0f0e0e`
- Light surface: `#f5f5f5`
- Primary light text: `#f6f8fb`
- Secondary light text: `#d1d2d8`
- Muted text: `#8c8d92`
- Navigation accents: orange `#ff5700`, green `#32ce57`, blue `#a3caff`
- Typography: Tilt Warp for display headings, Instrument Serif Italic for editorial accents, Geist for navigation and body text.
- Main content uses 10 px inter-section gaps and 8 px radii. Article cards use image fills, bottom gradients, and translucent blurred captions.

Every image, texture, logo, icon, and vintage-object cutout returned by Figma is downloaded into `public/assets/grain/`; no temporary Figma asset URL is shipped.

## Responsive Behaviour

- Desktop: two-column article grids, 700 px feature cards, oversized 160–200 px display type, split content sections, and large footer lockup.
- Tablet: reduced display type and spacing, compact article cards, and rebalanced split layouts matching the 800 px frames.
- Mobile: single-column 375 px flow, compact sticky navigation, 320 px cards, vertically stacked content, horizontally clipped vintage-object marquee, transformed cinema rows, ticket-style subscribe section, and stacked footer.
- The implementation remains fluid between reference breakpoints and does not create horizontal page overflow.

## Interactions and Accessibility

- Navigation and article cards are actual links with keyboard focus styles.
- Article cards link to `/article`; View all links to `/archive`.
- Subscribe and external/social actions remain links.
- Decorative textures and cutouts use empty alternative text; editorial imagery uses meaningful alt text.
- Heading hierarchy and landmarks are semantic on every route.
- Motion is restrained and disabled by `prefers-reduced-motion`.

## Verification

- Test route rendering, link navigation, browser history handling, main headings, and shared components.
- Run TypeScript and Vite production builds.
- Verify all Figma assets are local and valid files.
- Run the site on localhost and confirm each route returns/render correctly.
- Inspect 1280 px and 375 px views when browser sandboxing permits; otherwise report the visual-capture limitation separately from passing automated checks.
