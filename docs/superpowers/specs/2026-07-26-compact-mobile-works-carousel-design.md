# Compact Mobile Works Carousel

## Goal

Make the vertical carousel on the mobile “Рабочие задачи” page occupy only the free content area, reduce the spacing between cards, and open in a balanced position where no card is fully edge-on at the exact center.

## Layout

- Apply the change only at viewport widths up to 600 px.
- Keep the carousel below the fixed navigation and above the hand illustration and bottom controls.
- Use a compact carousel viewport instead of spanning most of the screen height.
- Preserve the existing landscape card proportions and vertical magazine-stack interaction.
- Reduce the vertical card step from 28 vh to approximately 19 vh.

## Initial State

- Keep the carousel positioned between two neighboring cards.
- Offset the initial fractional position away from the edge-on center zone.
- On first entry, the two nearest cards should have similar spacing and remain visibly open.
- No card may begin at a 90-degree, completely thin orientation.

## Interaction

- Vertical pointer dragging and vertical wheel/touch scrolling remain unchanged.
- Native card/image dragging stays disabled.
- The carousel remains continuous and does not snap automatically.
- Desktop behavior remains unchanged.

## Verification

- Unit tests cover the compact mobile step and non-edge-on initial position.
- Style tests cover the reduced mobile carousel bounds.
- Run the full test suite and production build.
