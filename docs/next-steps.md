# Next Steps

Follow-up work after the initial documentation pass.

---

## Porting guide

A short doc covering how to port a component from shadcn/ui or Base UI into dui's unstyled architecture. Would cover:

- How to decompose the source into structural (component) vs aesthetic (theme) CSS
- Mapping React patterns to Lit (props → `@property`, hooks → reactive controllers, context → `@lit/context`)
- Common gotchas (no JSX, no className, shadow DOM encapsulation differences)

## Accessibility guide

Document accessibility patterns used across components:

- ARIA role/attribute conventions per component type (button, switch, dialog, etc.)
- Keyboard interaction expectations
- Focus management patterns (delegatesFocus, focus trapping for modals)
- How `FieldContext` provides accessible labeling (labelId, controlId, descriptionId, errorId)

## Tests

- Add type-checking to CI (`deno check` across all packages)
- Component unit tests — render with/without theme, verify properties reflect, verify events fire
- Theme tests — verify all components in the styles map have matching component classes

## Docs dev server improvements

- Add more components to the docs page as they're created
- Add variant/prop toggles for interactive testing
- Add dark mode toggle (currently exists but could be more prominent)
