# Maria Y2K Kawaii Accent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add restrained Y2K-kawaii decorative accents to the existing futuristic editorial portfolio.

**Architecture:** Add two aria-hidden decorative elements to `PortfolioPage` and style them alongside dashed card ornaments using existing CSS breakpoints. Preserve all semantic content and component interfaces.

**Tech Stack:** React 19, TypeScript, plain CSS, Vitest.

## Global Constraints

- No branded Hello Kitty artwork or copied assets.
- Keep the page within one viewport without horizontal overflow.
- Decoration is `aria-hidden` and reduced-motion safe.

### Task 1: Add tested decorative markup

- [ ] Add a failing test for `.maria-symbol-rail[aria-hidden="true"]` and `.maria-diary[aria-hidden="true"]`.
- [ ] Run tests and confirm the new test fails.
- [ ] Add the symbol rail and diary line to `PortfolioPage`.
- [ ] Run tests and confirm all pass.

### Task 2: Add the visual accents and verify

- [ ] Style the symbols, diary line, dashed card ornaments, and strawberry-pink glow at desktop/tablet/mobile sizes.
- [ ] Disable decorative animation under reduced motion.
- [ ] Run all tests and the production build.

