# Card Progressive Edge Blur Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add static progressive blur to the edges of both portfolio cards while keeping their content sharp.

**Architecture:** Add one decorative backdrop-filter layer inside each card. Use multi-axis gradient masks to keep the center transparent and progressively reveal blur toward the edges.

**Tech Stack:** React, TypeScript, CSS, Vitest, Vite

## Global Constraints

- No motion trail or duplicated cards.
- Center content remains sharp.
- Blur weakens on hover/focus.
- Existing card motion remains unchanged.

---

### Task 1: Add and style edge blur

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/PortfolioCard.tsx`
- Modify: `src/styles.css`

- [ ] Test one edge-blur layer in each card and no motion-blur elements.
- [ ] Run tests and confirm failure.
- [ ] Add the decorative layer.
- [ ] Add progressive masks, backdrop blur, fallback gradient, and focus transition.
- [ ] Run `pnpm test -- --run` and `pnpm build`.
