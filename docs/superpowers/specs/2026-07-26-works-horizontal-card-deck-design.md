# Works Horizontal Card Deck Design

## Goal

Transform the single MTS Pay project cover on the “Рабочие задачи” page into a horizontal, manually controlled card-deck carousel inspired by the supplied Pinterest references. The carousel must sit above the existing hand-and-phone image, may overlap it slightly, and must preserve the current presentation modal.

## Composition

- The carousel occupies the central horizontal band of the page, visually above the phone and hand.
- Five cards are visible as a layered deck:
  - one active card in the center;
  - two cards to the left;
  - two cards to the right.
- The cards may overlap the upper part of the hand and phone, but the phone must remain recognizable.
- The page remains locked to one viewport with no vertical or horizontal page scrolling.
- Fixed top navigation, back control, language controls, and theme controls remain unchanged.

## Card Content

- The MTS Pay project is the only content-filled and actionable card.
- Its existing image, accessible label, and presentation-opening behavior are preserved.
- Four additional cards are empty decorative placeholders.
- Placeholder cards have no project links or modal-opening action. A side placeholder may still be selected by the carousel’s parent click-navigation handler; when centered, it performs no action.
- Placeholder cards are marked as decorative for assistive technology.
- All cards use a light semi-transparent glass surface with:
  - a thin translucent white border;
  - soft backdrop blur;
  - restrained inner highlight;
  - a subtle shadow separating overlapping layers.
- The active MTS Pay card keeps its project artwork visible through the same card shape rather than becoming an opaque panel.

## Carousel Behavior

- There is no automatic rotation.
- The active position changes only through:
  - horizontal swipe on touch devices;
  - horizontal pointer drag with a mouse or trackpad;
  - click or tap on a visible side card.
- Dragging must pass a movement threshold before changing the active index, preventing accidental navigation.
- Moving past the first or last card wraps around, producing a continuous carousel.
- Each card receives an offset from the active position. The offset controls:
  - horizontal translation;
  - scale;
  - rotation around the Y axis;
  - slight Z-axis tilt;
  - opacity;
  - stacking order.
- The active card faces the viewer and has the largest scale.
- The deck uses a tight Cover Flow composition rather than a wide fan:
  - nearest side cards rotate approximately 68 degrees around the Y axis;
  - far side cards rotate approximately 78 degrees around the Y axis;
  - horizontal gaps stay narrow so side cards read as upright vertical slices;
  - side cards partially overlap one another and remain close to the active card.
- Side cards progressively shrink, fade, and move behind the active card without spreading toward the edges of the viewport.
- Transitions use a smooth, slightly spring-like easing without overshoot that causes clipping.
- `prefers-reduced-motion` removes animated transitions while retaining manual navigation.

## Hover and Focus Treatment

- Hovering or keyboard-focusing a side card unfolds it toward the viewer to approximately 15–20 degrees and brings it forward.
- Neighboring cards visually separate a little through transform-only styling, improving the “opening deck” effect while preserving the tight reference composition.
- Hovering or focusing the active MTS Pay card lifts it slightly without changing its click target.
- Empty centered cards do not gain a project-action cursor and do not respond to click.
- The filled card remains keyboard accessible whenever it is visible; activating it opens the existing presentation modal.
- The MTS Pay button must not show the global pink outline inside the card deck.
- The outer deck card uses one restrained white focus ring through `:focus-within`; nested focus styling must not create a second border.
- Pointer hover effects are disabled on touch-only devices.

## Component Structure

- Add a focused `WorksCardCarousel` component responsible for:
  - the five-card data model;
  - active index state;
  - pointer/swipe handling;
  - offset calculation;
  - rendering the existing `ConceptProject` only for the MTS Pay entry;
  - rendering semantic decorative shells for empty entries.
- `WorksPage` continues to own presentation modal state and passes its existing `onOpen` callback to the carousel.
- `ConceptProject` remains responsible for the MTS Pay cover content and accessibility label.
- Carousel geometry and visual states live in CSS through classes and custom properties rather than inline layout calculations.

## Responsive Behavior

- Desktop and tablet show the five-card deck with pronounced Cover Flow perspective and 68/78-degree side rotation.
- Mobile keeps at least the center card and the nearest side cards visibly discoverable.
- Mobile cards are smaller and positioned slightly higher so the hand and phone remain readable.
- Swipe remains the primary mobile interaction.
- The deck must not expand the page’s scrollable bounds.

## Testing

- Component tests verify:
  - five cards render;
  - exactly one card contains MTS Pay content;
  - four empty cards contain no project link or modal action and are hidden from assistive technology;
  - there is no automatic timer;
  - clicking a side card centers it;
  - pointer drag and swipe change the active card only after the threshold;
  - clicking the MTS Pay card still opens the existing presentation;
  - fixed navigation and controls remain present.
- CSS contract tests verify:
  - horizontal deck positioning;
  - offset-based perspective transforms;
  - side-card hover turn;
  - 68/78-degree Cover Flow side poses;
  - active-card lift;
  - one white focus treatment with no nested pink outline;
  - mobile sizing;
  - reduced-motion behavior;
  - page overflow remains hidden.
- The full test suite and production build must pass.

## Out of Scope

- Adding content or links to the four placeholder cards.
- Automatic carousel playback.
- Changing the presentation iframe or modal dimensions.
- Changing the hand-and-phone asset.
- Adding new dependencies or a third-party carousel library.
