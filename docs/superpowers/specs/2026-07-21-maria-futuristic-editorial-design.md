# Maria Futuristic Editorial Redesign

## Goal

Refine the current Maria Tkachenko portfolio into a polished, single-screen futuristic editorial composition while keeping the existing portrait and information architecture.

## Visual direction

- Preserve the silver portrait as the dominant full-viewport image.
- Replace scrapbook paper cards with two translucent editorial panels for “Работы” and “Хакатоны”.
- Use hot pink as the primary accent, with soft white glass, charcoal text, thin borders, restrained glow, and subtle grain.
- Keep the asymmetric left/right placement from the Figma composition while improving alignment and readable contrast.
- Use monospaced typography for identity and navigation; use a large elegant display face for card titles.

## Layout

- The page remains one screen without content sections below it.
- Desktop: glass navigation across the top, portrait centered, portfolio panels near the left and right edges, compact controls along the bottom.
- Tablet: navigation wraps into two balanced rows, portrait stays centered, panels move inward.
- Mobile: compact header, portrait in the upper portion, two smaller overlapping panels in the lower portion, and controls pinned inside the viewport.
- No horizontal scrolling at 375, 768, or 1440 px.

## Interaction

- Panels retain their link semantics and gain clear hover/focus elevation.
- Navigation and controls retain existing accessible names and contact targets.
- Motion is limited to short opacity, transform, border, and glow transitions.
- `prefers-reduced-motion` disables transitions.

## Verification

- Existing portfolio tests continue to pass.
- The production build succeeds.
- Identity, contact information, language controls, and both portfolio links remain available.
- The previous scrapbook-only decorative elements are removed from component markup.

