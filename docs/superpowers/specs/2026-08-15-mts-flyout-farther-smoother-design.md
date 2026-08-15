# MTS Pay flyout: farther without slowing

## Goal

Make the Figma logo and butterfly travel farther toward and past the viewer without slowing the motion or creating a pause near the end. Preserve the approved centered composition and dramatic `13x` final scale.

## Motion

- Keep both objects anchored to the shared `left: 50%` coordinate system.
- Move both layers `8vh` lower, placing their starting centers closer to the screen's horizontal axis.
- Increase the total starting gap by `10vh`: offset the Figma logo `5vh` left and the butterfly `5vh` right while retaining the shared center anchor.
- Carry those symmetric horizontal offsets through every keyframe so the trajectories remain balanced.
- Extend the current horizontal, vertical, and depth travel by another 15% at the 92% and 100% keyframes.
- Keep the final scale at `13x`; added distance, not added size, supplies the stronger exit.
- Set the logo duration to `1.58s` and the butterfly duration to `1.68s`, retaining a subtle `0.06s` stagger.
- Use the energetic `cubic-bezier(.18,.72,.16,1)` curve.
- Increase the distance travelled from 92% to 100% so neither object appears to freeze before disappearing.
- Structure the motion as three continuously interpolated phases rather than a sequence of poses: launch from 0–18%, a long scale-led flight from 18–82%, and a close pass from 82–100%.
- Scale grows monotonically from `.28/.3` to `1.4`, then `7`, then `13`; it never holds or decreases.
- Horizontal, vertical, depth, and rotation values also move monotonically in their established direction.
- Use per-segment easing curves with non-zero velocity through the 18% and 82% boundaries so the phase changes do not look like pauses.
- Preserve full opacity until 94%, then fade only at the end.
- Keep blur at zero through 82%, increase it to `12px` at 94%, and reach `42px` only at the fully faded final frame.
- Render both layers from their full-resolution PNG sources throughout the animation. The available 1600×1389 and 1800×1718 assets are sufficient for the effective final display size.
- Use 2D `translate(...)`, rotation, and scale rather than `translate3d(...)` depth promotion. Scale remains the sole visual depth cue.
- Do not permanently include `transform` in `will-change`; this avoids caching the tiny initial state as a low-resolution compositor texture.
- Retain `will-change: opacity, filter`, `image-rendering: auto`, and a centered transform origin.
- Do not render any halo or shadow behind the Figma logo.
- Render one compact cool-toned shadow only beneath the butterfly using `drop-shadow(0 8px 14px rgba(155,175,255,.28))`.
- Keep the butterfly shadow present through all visible phases and combine it with the late blur; do not introduce gray, black, or pink shadow colors.
- Keep the close-pass/fade portion short so the faster motion does not appear to pause at the end.
- Preserve the existing reduced-motion behavior.

## Scope

Only the two MTS Pay decorative flyout rendering properties and transform syntax change. Card layout, artwork, carousel behavior, other effects, the home page, and the about page remain untouched.

## Verification

- CSS regression tests must assert the butterfly-only cool shadow, shadow-free logo, full-resolution-friendly rendering properties, 2D scale-led phases, monotonic mirrored trajectory, late blur, timing, and stagger.
- The full Vitest suite and production build must pass.
