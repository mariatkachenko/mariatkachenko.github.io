# Asymmetric Pink Sphere Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the symmetric porthole ring with a transparent sphere whose pale-pink edge density is asymmetrical.

**Architecture:** Keep the existing porthole element and stacking order. Change only its layered gradients and inset highlight, with a stable DOM marker for regression coverage.

**Tech Stack:** React 19, TypeScript, CSS radial gradients, Vitest, Vite.

## Global Constraints

- Centre remains nearly transparent.
- Upper-right edge is the strongest pink region.
- Lower-left edge remains weakest.
- Preserve sphere size and all z-index relationships.
- No extra DOM layers.

---

### Task 1: Asymmetric radial sphere

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/maria/HackathonsPage.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing marker test**

Assert `data-sphere-style="asymmetric-radial"` on `.maria-hackathons-porthole`.

- [ ] **Step 2: Verify RED**

```bash
pnpm test -- --run
```

- [ ] **Step 3: Add marker and light-theme gradients**

Add the marker and replace the ring background with offset upper-right pink, upper-left white, broad transparent-centre, and faint lower edge radial layers. Refine `::before` to one soft inset highlight and inner shadow.

- [ ] **Step 4: Add dark-theme variant**

Increase pink edge luminance without filling the transparent centre or changing stacking.

- [ ] **Step 5: Verify**

```bash
pnpm test -- --run
pnpm build
```

Expected: all 14 tests pass and Vite build exits successfully.
