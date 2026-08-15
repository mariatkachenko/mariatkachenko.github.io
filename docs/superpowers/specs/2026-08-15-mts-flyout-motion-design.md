# MTS Pay flyout motion design

## Goal

Restore the dramatic Figma-logo and butterfly flyout when the MTS Pay card becomes centered. The objects must feel substantially larger than the current version while the composition remains visually centered instead of drifting right.

## Motion design

- Both flyout layers use `left: 50%` as their positional anchor so their trajectories share the same coordinate system.
- The Figma logo begins at `translateX(-98%)` and the butterfly at `translateX(-2%)`, creating a centered start gap 20% larger than the previous `-90%/-10%` positions.
- Their horizontal travel is mirrored and 30% wider: the 52% keyframe uses `-180%/80%`, the 92% keyframe uses `-310%/210%`, and the final keyframe uses `-453%/353%`.
- The initial acceleration is quick, followed by a long forward surge toward the viewer.
- Mid-flight scale is `4x`; near-final scale is `9x`; final scale reaches `13x`.
- Rotation remains secondary to the forward motion: the logo rotates counter-clockwise and the butterfly clockwise.
- Opacity remains fully visible through 92% of the animation and eases to zero only at the final keyframe. Blur begins late, reinforcing the near-camera exit.
- Desktop and mobile use the same timing and balanced trajectories. Relative positioning and percentage transforms keep the composition responsive.
- `prefers-reduced-motion` continues to hide both decorative flyout layers.

## Scope

Only the MTS Pay Figma-logo and butterfly positioning and keyframes change. Card layout, carousel behavior, project artwork, footer, other animations, the home page, and the about page remain untouched.

## Verification

- CSS regression tests assert the shared centered anchor, mirrored trajectories, final scale, late opacity fade and blur, and reduced-motion rule.
- The full test suite and production build must pass.
