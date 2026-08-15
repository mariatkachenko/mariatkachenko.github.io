# Hackathons Hand Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert and display the provided hand model at the center of the Hackathons page.

**Architecture:** Convert OBJ/MTL textures to one GLB build asset with Blender. Render it through a dedicated model-viewer component that combines slow auto orbit with bounded pointer input.

**Tech Stack:** Blender CLI, React, TypeScript, CSS, model-viewer, Vitest, Vite

## Global Constraints

- Keep fixed navigation, controls, and Back action.
- Remove the placeholder paragraph.
- Add no runtime dependency.
- Respect reduced-motion.

---

### Task 1: Convert the model

**Files:**
- Create: `scripts/convert_hand_to_glb.py`
- Create: `public/assets/maria/rigged-hand.glb`

- [ ] Import the OBJ in Blender.
- [ ] Attach HAND_C as base color, HAND_N as normal map, and HAND_S as specular input.
- [ ] Center, normalize, and export one GLB.
- [ ] Inspect the generated GLB metadata and file size.

### Task 2: Build the Hackathons scene

**Files:**
- Create: `src/maria/HackathonsHandModel.tsx`
- Modify: `src/maria/HackathonsPage.tsx`
- Modify: `src/styles.css`
- Modify: `src/App.test.tsx`

- [ ] Write a failing route test for the hand model and removed placeholder.
- [ ] Add the model component with bounded pointer orbit and slow idle movement.
- [ ] Add centered responsive page styling.
- [ ] Run `pnpm test -- --run` and `pnpm build`.
