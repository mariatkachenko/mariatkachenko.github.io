# Maria Y2K Kawaii Accent Design

## Goal

Add a restrained PYE Hello Kitty-inspired Y2K-kawaii layer to the existing futuristic editorial portfolio without changing its one-screen layout or identity.

## Approved changes

- Add a small decorative symbol rail using `✿`, `♡`, and `⋆` around the hero composition.
- Add fine hot-pink dashed borders and tiny ornamental labels to the two portfolio cards.
- Add one compact dreamy diary-style status line with a kaomoji.
- Soften selected glows toward strawberry pink while preserving the silver/charcoal palette.
- Keep all decoration non-semantic and hidden from assistive technology.

## Constraints

- Do not use Hello Kitty artwork, logos, or copied brand assets.
- Keep the current React component architecture and all contact/link behavior.
- Keep the page within one viewport and prevent horizontal overflow.
- Decorative motion is subtle and disabled by `prefers-reduced-motion`.

## Verification

- Existing portfolio tests remain green.
- Tests assert the new decorative rail and diary line exist but are `aria-hidden`.
- Production build succeeds.

