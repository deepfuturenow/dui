/**
 * Ejected from `@dui/components/icon`. Verbatim — the library's styled icon
 * adds no aesthetic CSS of its own; it exists only to register the tag and to
 * pull the token sheet in. Kept as a file anyway so the ejected set is
 * self-contained and the pattern is visible.
 */
import { DuiIconPrimitive } from "@dui/primitives/icon";
import "./_install.ts";

export class DuiIcon extends DuiIconPrimitive {}

customElements.define(DuiIcon.tagName, DuiIcon);
