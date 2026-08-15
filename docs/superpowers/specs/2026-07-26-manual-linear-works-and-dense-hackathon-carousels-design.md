# Manual Linear Works and Dense Hackathon Carousels

## Goal

Refine both project carousels while preserving the existing page composition:

- turn the Works carousel into a manually controlled, level horizontal 3D row inspired by the supplied Pinterest reference;
- make the Hackathons orbit visually denser by reducing the gaps and adding temporary empty cards.

Neither carousel may advance automatically.

## Works page

### Content

- Keep 14 cards.
- Keep the MTS Pay project card and its existing modal behavior.
- The other 13 cards remain decorative placeholders.
- Add a title area above every card:
  - `MTS Pay` above the project card;
  - `Coming soon` above every placeholder.

### Geometry

- All cards have the same dimensions, scale, opacity, and vertical position.
- Cards form one straight horizontal row.
- No card becomes larger or moves forward merely because it is centered.
- Cards to the left turn slightly toward the center; cards to the right turn slightly toward the center.
- The two cards nearest the center follow the same geometry as their respective halves and do not create a separate featured pair.
- Card spacing remains tight enough for a deck-like composition while keeping titles legible.

### Interaction

- Continuous pointer drag: movement distance controls the number and fractional position of cards moved.
- Horizontal wheel or trackpad gesture moves the carousel continuously.
- Shift + vertical wheel may act as horizontal movement.
- Plain vertical wheel movement is not captured.
- After interaction ends, the row may settle softly to the nearest card stop.
- Clicking the visible MTS Pay card still opens its existing modal.
- No timer, autoplay, or automatic progression.

## Hackathons and Hobbies page

### Content

- Keep the seven existing project cards.
- Add five empty, non-clickable placeholder cards for a total of twelve orbit positions.
- Empty cards use the same translucent visual material but contain no project title or controls.

### Geometry

- Preserve the existing elliptical orbit, depth ordering, opacity changes, and card tilt.
- Reduce horizontal and vertical orbit amplitude so adjacent cards sit closer together.
- Preserve the astronaut, sphere, and page controls.

### Interaction

- Preserve continuous drag across multiple cards.
- Preserve horizontal wheel/trackpad control.
- Empty cards participate in movement but do not trigger actions.
- No autoplay.

## Responsive behavior

- Desktop and mobile use the same interaction model.
- Mobile uses swipe dragging.
- Card sizes may be reduced on narrow screens, but Works cards remain equal to each other and aligned in one row.
- Vertical page scrolling remains unaffected by ordinary vertical gestures.

## Accessibility

- Works carousel retains its labelled region.
- Project titles are visible text.
- Empty Hackathons cards are hidden from the accessibility tree and are not buttons.
- Interactive project cards preserve descriptive labels and pressed/active state where applicable.

## Verification

- Unit-test continuous position and wheel normalization.
- Component-test the Works card/title count, equal geometry variables, drag, wheel, and modal opening.
- Component-test twelve Hackathons orbit positions and non-interactive placeholders.
- Run the full Vitest suite and the production build.
