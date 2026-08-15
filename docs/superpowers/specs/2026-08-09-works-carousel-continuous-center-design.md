# Works carousel continuous center

## Goal

Restore smooth continuous Works carousel movement while reliably restoring the MTS Pay expanded artwork whenever that card becomes visually central again.

## Root cause

The previous fix rounded every wheel event and every desktop pointer release to an integer. Trackpads emit streams of small wheel deltas, so rounding each event discarded movement and caused sticking and jumps. Desktop drag release also jumped without a settling animation.

## Continuous movement

- Desktop drag follows the pointer continuously and preserves its fractional position on release.
- Mobile drag keeps its existing nearest-card release behavior.
- Wheel and trackpad input accumulate every delta continuously without per-event rounding.
- Circular wrapping remains unchanged.
- No new magnetic settling animation or timer is added.

## Visual center

- The nearest card to the visual center receives `.is-centered` from the rounded normalized carousel position.
- At the exact half-card boundary, the centered state predictably advances to the next card, so exactly one card is always centered.
- Every deck article participates in the same centered-state rule.
- The MTS Pay CSS continues to use `.has-project.is-centered` to reveal the 150% external artwork and hide the cropped preview.
- When MTS Pay leaves the central half-card zone, the normal cropped artwork returns. When it re-enters that zone from either direction or after looping, the expanded artwork returns automatically.
- Placeholder cards receive the centered class but no additional visual treatment.

## Scope

Keep card compositions, artwork, modal behavior, gesture directions, mobile layout, light/dark themes, and entry animation unchanged. Do not change the home or About pages.

## Verification

- Desktop drag release preserves a fractional position.
- A sequence of small horizontal wheel deltas accumulates instead of being discarded.
- Plain vertical desktop wheel input remains ignored.
- Mobile vertical wheel direction remains unchanged.
- Exactly one card is centered on either side of a half-card boundary and at the exact tie.
- MTS Pay loses and regains `.is-centered` when leaving and returning to its central zone.
- Full tests, TypeScript, and production build pass.
