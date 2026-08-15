# Fixed Chrome Visual Balance

## Scope

Change only the shared fixed interface rendered by `FixedChrome`: the top identity/contact row and the bottom language/theme controls. Do not change page content, route behavior, carousel geometry, assets, or transitions.

## Intended behavior

- Increase the shared chrome typography and controls moderately so they read more clearly without competing with page content.
- Use balanced, matching horizontal offsets for the top and bottom chrome at desktop, tablet, and mobile breakpoints.
- Preserve the existing desktop arrangement and the compact multi-row mobile arrangement.
- Remove the visible border and hover fill from the Contact link while retaining comfortable clickable padding.
- Keep the northeast arrow visible next to Contact on desktop and mobile, and lift it slightly relative to the text baseline.
- Keep geometry identical in light and dark themes; foreground color continues to come from the existing theme variable.
- Preserve the single shared `FixedChrome` instance outside route content and all existing view-transition names.

## Responsive details

Desktop uses a moderate fluid type increase, a slightly larger avatar, and coordinated 24px outer offsets. Tablet retains its three-column layout with adjusted spacing. Mobile increases the current very small labels and controls while keeping enough separation to prevent overlap; the Contact arrow remains visible.

## Accessibility and interaction

Existing semantic links, buttons, labels, pressed states, keyboard focus treatment, and click targets remain intact. Removing the Contact border must not remove focus visibility. Theme and language behavior do not change.

## Verification

- Update the shared-chrome CSS contract test first and confirm it fails for the old sizing and hidden mobile arrow.
- Implement the minimum CSS changes needed for the new contract.
- Run the targeted style test, then the complete test suite, TypeScript build, and production build.
- Check that desktop/mobile rules apply identically in light and dark themes and that fixed chrome remains persistent across routes.
