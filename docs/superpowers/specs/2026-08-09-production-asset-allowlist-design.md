# Production Asset Allowlist Design

**Date:** 2026-08-09

## Goal

Reduce the production artifact by excluding confirmed legacy public assets while preserving every source asset, active route, visual composition, and runtime behavior.

## Scope

This change only affects generated production output under `dist/`.

- Keep every file under `public/` unchanged and available to legacy source code during development.
- Do not convert, resize, rename, move, or delete source assets.
- Do not change React components, CSS rendering, external dependencies, or loading behavior.
- Do not manually edit deploy copies under `work/` or archives under `outputs/`.
- Continue generating `dist/404.html` and `dist/.nojekyll` for GitHub Pages.

## Architecture

Add a single declarative manifest containing the public paths required by the active Maria portfolio. A dependency-free Node postbuild script will run after Vite copies `public/` into `dist/`. It will remove non-allowlisted files only from the generated `dist/assets/` tree, remove empty generated directories, and then verify that every allowlisted asset exists in the build.

The allowlist is intentionally fail-closed: a newly introduced public runtime asset must be added explicitly. Automated tests will scan active application entry points, active Maria components, `src/styles.css`, and `index.html` for local public URLs and compare them with the manifest. Legacy component trees and legacy data files are deliberately excluded from that scan because they are not reachable from the active `App` route tree.

## Active Asset Contract

The manifest must include:

- `/favicon.svg`;
- `/assets/grain/fonts/instrument-serif-italic.ttf`;
- `/assets/grain/grain-texture.png`;
- active Maria avatar, home, works, and hackathons assets identified by the read-only audit;
- all five works placeholder covers;
- the GLB model and both active SVG patterns.

The manifest must not include Portier assets, inactive Grain media, inactive Maria videos, hover portraits, raster replacement patterns, scroll frames, or prior works backgrounds.

## Build Flow

1. TypeScript compiles.
2. Vite builds the application and copies `public/` into `dist/`.
3. The pruning script operates only inside the resolved project `dist/assets/` directory.
4. The script keeps exact allowlisted paths and removes other generated asset files.
5. The script verifies all required public assets are present.
6. The existing postbuild behavior creates `dist/404.html` and `dist/.nojekyll`.

The pruning script must reject an unsafe output path and must never operate on `public/`, the repository root, the home directory, or another unresolved directory.

## Tests

Automated tests must establish the following contracts before implementation:

1. Every local `/assets/...` and `/favicon.svg` reference in the active App graph, active CSS, and `index.html` is present in the allowlist.
2. Known legacy paths are absent from the allowlist.
3. Given a temporary build-like directory, pruning keeps allowlisted files and removes a legacy fixture.
4. Pruning fails if an allowlisted file is missing.
5. Pruning refuses a directory that is not explicitly identified as a safe build output.

After the targeted tests pass, run the complete Vitest suite, `tsc -b`, and the production build. Compare pre-change and post-change `dist` byte totals and enumerate the final production asset set.

## Visual Verification

No active bytes or CSS references change, so expected pixel output is identical. Verify screenshots or manual render states for:

- `/`, `/works`, and `/hackathons`;
- desktop light and dark;
- mobile light and dark;
- both works hand variants and the presentation modal where practical.

Any missing-resource response, console loading error, or visual difference blocks completion.

## Expected Result

The production artifact excludes approximately 15 MB of confirmed legacy public files while `public/` remains fully intact. The exact saving is reported from the verified build rather than treated as a fixed requirement.

