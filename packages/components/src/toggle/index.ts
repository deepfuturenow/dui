// `toggle-group` provides the context `toggle` consumes, and a Lit context
// consumer requests its value exactly once, on connect. Defining the consumer
// first upgrades every <dui-toggle> before a provider exists, so the request
// goes unanswered and is never retried. Provider first.
import "./toggle-group.ts";
import "./toggle.ts";

export { DuiToggle } from "./toggle.ts";
export { DuiToggleGroup } from "./toggle-group.ts";

export type { ToggleGroupContext } from "@dui/primitives/toggle";
export { pressedChangeEvent, valueChangeEvent } from "@dui/primitives/toggle";
