# Home Cards Flying Toward the Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the two home navigation cards a mirrored 3D perspective with inner edges receding toward the center.

**Architecture:** Use local CSS `perspective()` transforms so no surrounding layout or portrait layer is affected. Each card receives a mirrored Y rotation, an inner-edge transform origin, directional depth shadow, and outer-edge highlight; mobile overrides use smaller angles.

**Tech Stack:** React, CSS, Vitest, Vite

## Global Constraints

- Change only the home navigation cards.
- Preserve links, content, mobile stacking, hover accessibility, and all subpage components.
- Use reduced mirrored angles on screens up to 600px.

---

### Task 1: Add mirrored flying-card perspective

**Files:**
- Modify: `src/styles.css:43-49,135-139`
- Test: `src/styles.test.js`

**Interfaces:**
- Consumes: `.maria-card--works` and `.maria-card--hackathons`
- Produces: mirrored 3D transforms and decorative outer-edge highlights

- [ ] **Step 1: Write the failing style test**

Add a test asserting:

```js
expect(styles).toContain('transform-origin:right center')
expect(styles).toContain('transform-origin:left center')
expect(styles).toContain('perspective(1100px) rotateY(14deg) rotateZ(-5deg)')
expect(styles).toContain('perspective(1100px) rotateY(-14deg) rotateZ(4deg)')
expect(styles).toContain('.maria-card--works::after')
expect(styles).toContain('.maria-card--hackathons::after')
expect(styles).toContain('translateZ(42px)')
expect(styles).toContain('perspective(900px) rotateY(7deg) rotateZ(-3deg)')
expect(styles).toContain('perspective(900px) rotateY(-7deg) rotateZ(2deg)')
```

- [ ] **Step 2: Verify the test fails**

Run `pnpm vitest run src/styles.test.js`.

Expected: FAIL because the cards currently have only Z-axis rotation.

- [ ] **Step 3: Implement desktop perspective**

Set the left card to:

```css
transform-origin:right center;
transform:perspective(1100px) rotateY(14deg) rotateZ(-5deg);
```

Set the right card to the mirrored transform and `transform-origin:left center`. Add directional shadows and outer-edge `::after` highlights. Preserve perspective on hover/focus while adding `translateZ(42px)` and slightly reducing the Y angle to `12deg`.

- [ ] **Step 4: Implement reduced mobile perspective**

Keep the current positions and sizes, but use `±7deg` Y rotation with `perspective(900px)` and the existing `-3deg`/`2deg` Z rotations. Use a smaller hover/focus Z movement.

- [ ] **Step 5: Run focused tests**

Run:

```bash
pnpm vitest run src/styles.test.js src/App.test.tsx
```

Expected: all focused tests PASS.

- [ ] **Step 6: Run full verification**

Run:

```bash
pnpm vitest run
pnpm build
```

Expected: all tests PASS and Vite builds successfully.

- [ ] **Step 7: Commit**

This workspace is not a Git repository. If Git is initialized later:

```bash
git add src/styles.css src/styles.test.js
git commit -m "feat: add flying perspective to home cards"
```

