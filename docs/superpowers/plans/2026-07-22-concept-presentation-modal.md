# Concept Presentation Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a large Works-screen project cover that opens the complete animated Figma prototype in an accessible modal viewer.

**Architecture:** Add a focused `ConceptProject` cover component and a controlled `PresentationModal` component. `PortfolioPage` owns the open state so the cover and modal remain independent of the video background and scroll logic; the modal lazy-renders a Figma prototype iframe and manages focus, Escape, backdrop closing, and body scroll locking.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, plain CSS, Figma prototype embed.

## Global Constraints

- Preserve the existing sticky navigation, hybrid video behavior, hero cards, and `#works` / `#hackathons` scroll destinations.
- Use the complete Figma prototype from file `X679nLVF8CfbUmiLVRreSP`, starting at frame `40007012:21703`.
- Do not add a modal or animation dependency.
- Keep external Figma navigation inside the cross-origin iframe.
- Keep the modal below fullscreen size and above every portfolio layer.

---

### Task 1: Works-screen project cover

**Files:**
- Create: `src/maria/ConceptProject.tsx`
- Modify: `src/maria/PortfolioPage.tsx`
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces `ConceptProject({ onOpen }: { onOpen: () => void }): JSX.Element`.
- `PortfolioPage` supplies an `onOpen` callback and positions the cover in the second viewport.

- [ ] Add a failing test that finds a button named `Открыть презентацию «МТС Финтех. Концепт»` and confirms it is inside `.maria-works-screen`.
- [ ] Run `pnpm test -- --run`; require failure because the cover does not exist.
- [ ] Create a semantic 16:9 button containing the eyebrow `МТС Финтех. Концепт`, title `МТС PAY`, metadata `Product concept · 48 screens`, and an open arrow.
- [ ] Add `.maria-works-screen` at `top: 100svh` with a centered responsive cover; keep it separate from `.maria-scroll-content`, which scrolls the hero cards away.
- [ ] Add hover, focus-visible, tablet, and mobile CSS without changing existing anchor positions.
- [ ] Run `pnpm test -- --run`; require the cover test and existing tests to pass.

### Task 2: Accessible Figma presentation modal

**Files:**
- Create: `src/maria/PresentationModal.tsx`
- Modify: `src/maria/PortfolioPage.tsx`
- Modify: `src/styles.css`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces `PresentationModal({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element | null`.
- Consumes the constant prototype URL `https://embed.figma.com/proto/X679nLVF8CfbUmiLVRreSP/Концепт-v3?node-id=40007012-21703&scaling=contain&content-scaling=fixed&embed-host=share`.

- [ ] Add a failing interaction test: click the cover, assert a dialog named `Презентация «МТС Финтех. Концепт»`, iframe title, Figma prototype URL, close button, external Figma link, and 48 progress segments.
- [ ] Run `pnpm test -- --run`; require failure because no dialog opens.
- [ ] Implement conditional modal rendering with `role="dialog"`, `aria-modal="true"`, the 48-segment decorative progress rail, iframe, external link, and close button.
- [ ] In an effect, save the active element, set `document.body.style.overflow = 'hidden'`, focus close, listen for Escape, and restore overflow/focus on cleanup.
- [ ] Close only when the backdrop itself is clicked; clicks inside the dialog must not close it.
- [ ] Add fixed near-black blurred overlay CSS and an `88vw × 86vh` desktop dialog with compact mobile margins.
- [ ] Run `pnpm test -- --run`; require all interaction tests to pass without warnings.

### Task 3: Close paths and production verification

**Files:**
- Modify: `src/App.test.tsx`
- Verify: `src/maria/ConceptProject.tsx`
- Verify: `src/maria/PresentationModal.tsx`
- Verify: `src/styles.css`

**Interfaces:**
- Confirms all modal controls and existing portfolio behavior remain stable.

- [ ] Add tests that close with the close button and Escape, verify dialog removal, body overflow restoration, and focus return to the project cover.
- [ ] Run `pnpm test -- --run`; require zero failures and no console warnings.
- [ ] Run `pnpm build`; require TypeScript and Vite to exit successfully.
- [ ] Scan `src` for expiring `figma.com/api/mcp/asset` URLs; require no matches.
- [ ] Confirm the iframe is absent while closed and created only after the cover is activated.

