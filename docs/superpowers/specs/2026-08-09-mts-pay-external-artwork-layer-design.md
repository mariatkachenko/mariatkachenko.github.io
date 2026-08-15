# MTS Pay external artwork layer

## Root cause

The previous centered overlay remained inside `WorksProjectCard` and scaled the PNG canvas to `118%`. The PNG has transparent outer margins, so the visible butterfly and Figma logo crossed the card boundary by only about one or two percent. The result did not read as a larger image outside the card.

## Scope

Change only the MTS Pay project card on `/works`. Keep the carousel geometry, copy, presentation modal, home page, `/hackathons`, and placeholder artwork unchanged.

## Structure

Keep the existing cropped preview image inside `WorksProjectCard` for off-center states.

Move the centered breakout artwork out of the preview/card internals. Render it as a dedicated sibling layer inside the MTS project button, at the level of the whole project card. The layer must not be a descendant of `.works-project-card__preview` or `.works-project-card`.

The footer remains inside `WorksProjectCard` and is rendered above the external artwork layer.

## Centered composition

When the MTS Pay card is strictly centered, hide the cropped preview image and reveal the external artwork layer.

The external layer is `140%` of the original preview width and `140%` of the original preview height. It is centered over the preview area and uses the supplied PNG unchanged with `object-fit: contain`.

The butterfly and Figma logo must visibly extend beyond the preview, project card, and project button boundaries. The project button, deck article, and carousel allow visible overflow.

When the MTS card leaves the center, hide the external layer and show the normal cropped preview again.

## Background and interaction

The MTS preview has a transparent background; no dark rectangle appears behind the PNG.

Hover and focus do not resize the artwork or the MTS project card. MTS flags remain hidden during hover, focus, and active states.

## Responsive behavior

Desktop and mobile use the same centered/off-center state rule. The external artwork remains aligned to the preview area at both sizes and does not move neighboring cards.

With `prefers-reduced-motion`, disable the crossfade between cropped and external layers.

## Verification

- External artwork is a sibling of `WorksProjectCard`, not its descendant.
- Centered MTS: external art is visible at `140% × 140%`; cropped preview is hidden.
- Butterfly and Figma logo visibly cross all project-component boundaries.
- Off-center MTS: external art is hidden; cropped preview is visible.
- Footer remains above the external layer.
- No dark MTS preview background, hover enlargement, or flag reveal.
- Modal opening and carousel drag/wheel continue to work.
- Targeted tests, full tests, TypeScript, and production build pass.
