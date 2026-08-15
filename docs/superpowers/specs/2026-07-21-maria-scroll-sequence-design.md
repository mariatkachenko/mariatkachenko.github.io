# Maria Scroll Sequence Design

## Goal

Replace the static Maria portrait with the supplied 16-frame 1920×1080 sequence and map frame progression to vertical page scroll.

## Behavior

- The hero remains sticky while the document provides one additional viewport of scroll distance.
- Scroll progress from the top to the bottom selects frames `001` through `016`.
- The canvas preserves the current cover-style crop and does not alter the Figma collage cards or navigation.
- Frames preload after the first frame is available; the first frame is the fallback while loading.
- Reduced-motion mode renders a static first frame and removes the extra scroll journey.

## Assets and performance

- Extract the supplied PNG sequence into a temporary folder.
- Convert every frame to WebP while preserving 1920×1080 dimensions and sequential filenames.
- Store production frames in `public/assets/maria/scroll/`.
- Do not add animation libraries.

## Verification

- Tests cover frame selection at the beginning, middle, and end of progress.
- Existing portfolio behavior remains covered.
- Production build succeeds and all 16 frame URLs are local.

