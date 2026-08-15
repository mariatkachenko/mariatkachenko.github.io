# Production Asset Allowlist Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Exclude confirmed legacy public assets from generated production output without changing or moving any source asset.

**Architecture:** A shared ESM manifest defines the active public-asset contract. A dependency-free Node module exposes safe pruning and verification functions; a small CLI wrapper runs those functions after Vite copies `public/` to `dist/`. Vitest tests the manifest against active runtime source files and exercises pruning in temporary fixture directories.

**Tech Stack:** Node.js ESM, TypeScript/React source scanning, Vite, Vitest.

## Global Constraints

- Keep every file under `public/` unchanged.
- Do not convert, resize, rename, move, or delete source assets.
- Do not change React rendering, CSS rendering, network dependencies, or media loading behavior.
- Only generated files below the exact project `dist/assets/` path may be pruned.
- Preserve `dist/index.html`, `dist/404.html`, `dist/.nojekyll`, and Vite-generated hashed JS/CSS files.
- A missing allowlisted asset or unsafe target path must fail the build.

---

### Task 1: Define and test the active public-asset contract

**Files:**
- Create: `scripts/active-public-assets.mjs`
- Create: `scripts/active-public-assets.test.ts`

**Interfaces:**
- Produces: `ACTIVE_PUBLIC_ASSETS: readonly string[]` containing root-relative URL paths beginning with `/`.
- Consumes: active references from `index.html`, `src/styles.css`, `src/App.tsx`, and `src/maria/**/*.tsx` except explicitly legacy Maria components.

- [ ] **Step 1: Write the failing manifest contract test**

Create a Vitest test that imports `ACTIVE_PUBLIC_ASSETS`, extracts literal local URLs matching `/assets/...` or `/favicon.svg` from the active files, and asserts that every extracted URL exists in the manifest. Use this exact active Maria exclusion set: `BackgroundVideo.tsx`, `PointerVideo.tsx`, `ScrollPortrait.tsx`, and `scrollFrames.ts`.

Also assert that these known legacy paths are absent:

```ts
const knownLegacy = [
  '/assets/info-customer.png',
  '/assets/maria/background-video.mp4',
  '/assets/maria/skater.mp4',
  '/assets/maria/hover-portrait-dark.png',
  '/assets/maria/scroll/frame-001.webp',
]
```

- [ ] **Step 2: Run the targeted test and verify RED**

Run:

```bash
./node_modules/.bin/vitest run scripts/active-public-assets.test.ts
```

Expected: FAIL because `scripts/active-public-assets.mjs` does not exist.

- [ ] **Step 3: Implement the exact manifest**

Export a frozen, sorted list containing:

```js
'/favicon.svg'
'/assets/grain/fonts/instrument-serif-italic.ttf'
'/assets/grain/grain-texture.png'
'/assets/maria/about-space-pattern.svg'
'/assets/maria/astronaut-optimized.glb'
'/assets/maria/home-card-about.png'
'/assets/maria/home-card-works.png'
'/assets/maria/home-portrait-dark.png'
'/assets/maria/home-portrait-light.png'
'/assets/maria/mts-hanging-flag.png'
'/assets/maria/mts-pay-cover.png'
'/assets/maria/portrait.png'
'/assets/maria/works-cover-01.jpg'
'/assets/maria/works-cover-02.jpg'
'/assets/maria/works-cover-03.jpg'
'/assets/maria/works-cover-04.jpg'
'/assets/maria/works-cover-05.jpg'
'/assets/maria/works-phone-hand-lock.png'
'/assets/maria/works-phone-hand.png'
'/assets/maria/works-vector-pattern.svg'
```

- [ ] **Step 4: Run the targeted test and verify GREEN**

Run the same Vitest command. Expected: all manifest contract tests pass.

- [ ] **Step 5: Record the task state**

Git is unavailable in this workspace. Record completion in the final handoff instead of committing.

---

### Task 2: Implement safe build-output pruning with TDD

**Files:**
- Create: `scripts/prune-production-assets.mjs`
- Create: `scripts/prune-production-assets.test.ts`

**Interfaces:**
- Consumes: `ACTIVE_PUBLIC_ASSETS` from `scripts/active-public-assets.mjs`.
- Produces: `pruneProductionAssets({ projectRoot, distDir? }): Promise<{ removedFiles: string[]; keptFiles: string[] }>`.
- Produces: CLI behavior when invoked directly: prune the project `dist/` and print byte/file totals.

- [ ] **Step 1: Write failing pruning behavior tests**

Use a temporary directory created through Node's `mkdtemp`. Give it a marker `index.html`, an `assets/` directory, one allowlisted fixture copied under its allowlisted relative path, and one legacy fixture. Assert that pruning preserves the allowlisted fixture, deletes the legacy fixture, and reports both actions correctly.

- [ ] **Step 2: Run the pruning test and verify RED**

Run:

```bash
./node_modules/.bin/vitest run scripts/prune-production-assets.test.ts
```

Expected: FAIL because the pruning module does not exist.

- [ ] **Step 3: Implement minimal pruning behavior**

Implement path normalization, recursive enumeration under `dist/assets/`, exact allowlist comparison using POSIX-style URL paths, file removal, and empty-directory removal. Do not traverse symlinks. Keep non-public Vite output such as `assets/index-*.js` and `assets/index-*.css`; classify a file as prunable only when its relative path corresponds to a source path present under project `public/assets/`.

- [ ] **Step 4: Verify GREEN for pruning behavior**

Run the targeted pruning test. Expected: PASS.

- [ ] **Step 5: Write failing missing-asset and unsafe-path tests**

Add tests asserting:

```ts
await expect(pruneProductionAssets({ projectRoot, distDir: missingAssetDist }))
  .rejects.toThrow(/Missing active production asset/)

await expect(pruneProductionAssets({ projectRoot, distDir: projectRoot }))
  .rejects.toThrow(/Unsafe production output directory/)
```

The fixture must contain a copied `public/` tree or accept an injectable manifest so the success test can satisfy every required asset without weakening production validation.

- [ ] **Step 6: Run tests and verify RED**

Expected: the new safety/validation assertions fail for the missing behavior.

- [ ] **Step 7: Implement safety and completeness validation**

Resolve real absolute paths and require the target to equal `<projectRoot>/dist`. Require `dist/index.html` before pruning. Reject the project root, `public`, filesystem root, home directory, and any arbitrary directory. After pruning, verify every allowlisted path exists below `dist`.

- [ ] **Step 8: Run both targeted test files and verify GREEN**

Run:

```bash
./node_modules/.bin/vitest run scripts/active-public-assets.test.ts scripts/prune-production-assets.test.ts
```

Expected: all tests pass without warnings.

- [ ] **Step 9: Record the task state**

Git is unavailable in this workspace. Record completion in the final handoff instead of committing.

---

### Task 3: Integrate pruning into the production build

**Files:**
- Modify: `package.json`
- Modify: `PROJECT_HANDOFF.md`
- Test: `scripts/active-public-assets.test.ts`

**Interfaces:**
- Consumes: CLI entry in `scripts/prune-production-assets.mjs`.
- Produces: `pnpm build` output containing active public assets and Vite bundles only.

- [ ] **Step 1: Add a failing package-script contract assertion**

Extend the manifest test to read `package.json` and assert that `postbuild` runs pruning before copying `index.html` to `404.html` and creating `.nojekyll`.

- [ ] **Step 2: Run the targeted test and verify RED**

Expected: FAIL because the current `postbuild` does not call the pruning script.

- [ ] **Step 3: Update the postbuild command**

Set:

```json
"postbuild": "node scripts/prune-production-assets.mjs && cp dist/index.html dist/404.html && touch dist/.nojekyll"
```

- [ ] **Step 4: Update the handoff build contract**

Document that production builds prune non-active copied public assets from `dist` using an allowlist, while `public/` remains unchanged. Add the manifest and pruning script to the performance ownership section.

- [ ] **Step 5: Run the targeted tests and verify GREEN**

Run both script test files. Expected: all pass.

- [ ] **Step 6: Record the task state**

Git is unavailable in this workspace. Record completion in the final handoff instead of committing.

---

### Task 4: Full verification and measured handoff

**Files:**
- Verify: `dist/**`
- Verify: all modified and created files

**Interfaces:**
- Consumes: completed implementation.
- Produces: fresh test/build evidence and exact artifact savings.

- [ ] **Step 1: Measure the unpruned baseline**

Before the first integrated build, record current `dist` total bytes and current `dist/assets` public-file count using `find`, `stat`, and `awk`. The audited baseline is approximately 49 MiB but report exact bytes.

- [ ] **Step 2: Run the complete test suite**

Run:

```bash
./node_modules/.bin/vitest run
```

Expected: zero failed test files and zero failed tests.

- [ ] **Step 3: Run TypeScript compilation**

Run:

```bash
./node_modules/.bin/tsc -b
```

Expected: exit code 0.

- [ ] **Step 4: Run the production build**

Run:

```bash
./node_modules/.bin/vite build
npm run postbuild
```

Expected: both commands exit 0; pruning reports removed files and all required assets remain.

- [ ] **Step 5: Verify production contents**

Assert with shell checks that:

- every `ACTIVE_PUBLIC_ASSETS` entry exists in `dist`;
- `dist/assets/index-*.js` and `dist/assets/index-*.css` exist;
- `dist/404.html` and `dist/.nojekyll` exist;
- representative legacy files such as `dist/assets/info-customer.png` and `dist/assets/maria/background-video.mp4` do not exist;
- every URL referenced by built HTML/CSS/JS resolves to a local file or is an intentional external URL.

- [ ] **Step 6: Measure exact savings**

Report baseline bytes, final bytes, removed bytes, percentage reduction, and removed file count. Separately confirm that the byte total and file hashes under `public/` did not change by comparing a before/after checksum inventory.

- [ ] **Step 7: Perform visual smoke verification if a browser harness is available**

Render `/`, `/works`, and `/hackathons` at desktop and mobile sizes in light/dark. Confirm no missing network resources and no visual differences. If no browser harness is available, state that automated asset-resolution checks passed but visual screenshots remain a manual follow-up.

- [ ] **Step 8: Final requirements review**

Re-read the design spec and confirm every scope constraint, safety contract, test, build artifact, and measurement is represented in the evidence. Report any unavailable verification explicitly.

