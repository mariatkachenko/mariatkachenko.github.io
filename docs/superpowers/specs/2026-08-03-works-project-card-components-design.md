# Works Project Card Components Design

## Goal

Replace the plain rectangular items in the Works carousel with structured project-card components inspired by the supplied reference, while preserving carousel mechanics, presentation behavior, theming, and mobile usability.

## Card Structure

Every one of the 14 carousel items uses the same semantic structure:

1. Outer project-card shell.
2. A rounded 16:9 media preview area.
3. A footer containing a project title and secondary metadata.
4. Existing magazine spine and page-depth surfaces remain outside the shell.

The MTS Pay card remains the only interactive project. It displays the existing `/assets/maria/mts-pay-cover.png`, the title `Концепт v3 — Преза` / `Concept v3 — Presentation`, and metadata `Проект · МТС Финтех` / `Project · MTS Fintech`. Activating it opens the existing presentation modal.

The other 13 cards are non-interactive placeholders. They display restrained dark-pink abstract preview treatments, the title `Новый проект` / `New project`, and metadata `Скоро` / `Coming soon`.

## Visual Treatment

### Light Theme

- Milky translucent shell.
- Fine neutral border.
- Soft neutral shadow.
- Near-black primary text and muted gray metadata.
- Dark wine-pink preview placeholders.

### Dark Theme

- Graphite and deep wine translucent shell.
- Soft semi-transparent light border.
- White primary text and muted pale metadata.
- No white flash or bright solid backing during hover, drag, or route transitions.

## Desktop Layout

- The outer card changes from a pure 16:9 rectangle to a taller media-card proportion containing a 16:9 preview plus footer.
- Existing center-facing fan geometry, wheel direction, drag behavior, card order, depth surfaces, glow projection, and hover scale remain unchanged.
- Carousel vertical placement may be adjusted only enough to keep the taller cards clear of fixed navigation and the hand image.

## Mobile Layout

- The existing vertical loop remains vertical and uses the same order and gesture direction.
- Card width stays responsive, while footer padding and type scale are reduced.
- Vertical loop amplitude/spacing is adjusted so the taller cards do not overlap excessively or clip at the top and bottom.
- The active card remains readable without changing modal dimensions or behavior.

## Components

- Add a reusable `WorksProjectCard` component responsible only for media and footer structure.
- `WorksCardCarousel` remains responsible for geometry, input, layering, project selection, and magazine depth.
- `ConceptProject` remains responsible for opening the presentation and renders its content through the shared card component.

## Accessibility

- MTS Pay remains a native button with the existing localized accessible label.
- Placeholder cards remain non-interactive and are hidden from the accessibility tree.
- Decorative preview treatments have no accessible text.

## Testing

- Verify that all 14 carousel items render the shared structured shell.
- Verify one interactive MTS Pay card and 13 non-interactive placeholders.
- Verify localized title and metadata copy.
- Verify light, dark, and mobile CSS contracts.
- Preserve all existing carousel, gesture, navigation-guard, modal, and build tests.

## Out of Scope

- Adding real projects or links for placeholder cards.
- Changing carousel navigation, route transitions, hand image, presentation modal, autoplay, or system-back gesture behavior.
