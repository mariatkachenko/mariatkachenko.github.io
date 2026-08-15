# Maria Tkachenko Portfolio Design

## Goal

Replace the current Grain Archive website with a single-page portfolio based on Figma node `604:485` from the “Мария Ткаченко” file.

## Approved direction

Implement the Figma composition as React and plain CSS inside the existing Vite project. Preserve the scrapbook/editorial character—silver background, oversized central portrait, floating paper cards, handwritten labels, small monospaced navigation, and decorative objects—while creating responsive tablet and mobile compositions instead of proportionally shrinking the desktop canvas.

## Information architecture

- `/` is the complete Maria Tkachenko portfolio.
- Old Grain Archive routes and navigation are removed from the visible interface; unknown paths resolve to `/`.
- The top navigation exposes name, email, social handle, city, contact action, and RU/EN language controls.
- The landing composition includes the central portrait and two primary portfolio entry cards: “Работы” and “Хакатоны”.
- Remaining content represented in the selected Figma node is preserved in its original visual order.

## Assets

- Every visual present in Figma is downloaded to `public/assets/maria/` in its original exported format.
- No expiring `figma.com/api/mcp/asset` URL remains in production code.
- Decorative images use empty alt text; meaningful portfolio links and portrait content use useful accessible names.
- Exact exported artwork is preferred over recreated SVG or CSS illustration.

## Responsive behavior

- Desktop reference follows the supplied wide frame and preserves overlapping layers and rotations.
- Tablet reduces overlap, keeps navigation readable, and maintains the portrait as the visual anchor.
- Mobile becomes a vertical editorial collage: identity/navigation, portrait, works card, hackathons card, contact/language controls.
- No horizontal document scrolling is allowed at 375, 768, or 1440 px.

## Interaction and accessibility

- Portfolio cards and contact items are keyboard-focusable links.
- External links expose descriptive accessible names and use `rel="noreferrer"` when opened in a new tab.
- Focus states remain visible.
- Decorative motion is omitted unless the Figma node supplies authoritative motion data.
- Reduced-motion preferences are respected.

## Verification

- Tests assert the Maria Tkachenko identity, contact information, language controls, and two primary portfolio links.
- Tests assert old Grain Archive content is absent.
- TypeScript and Vite production build must succeed.
- `/` must return HTTP 200 from localhost, with all local image assets available.
- Visual checks target 1440, 768, and 375 px, with no horizontal overflow.
