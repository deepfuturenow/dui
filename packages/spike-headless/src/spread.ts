/**
 * Minimal attribute-spread directive for Lit.
 *
 * Lit has no first-class spread, and this spike needs one: the whole point of a
 * headless controller is handing the consumer a bag of props to apply in one
 * binding.
 *
 * `@open-wc/lit-helpers` ships a `spread` (v0.7.0, reachable from this sandbox)
 * and was the alternative. This version is here instead because of `ref`: a Lit
 * directive like `ref()` cannot be a value inside a spread object — directives
 * are only valid in binding positions — so with an off-the-shelf spread every
 * element needs two bindings, `${ref(...)} ${spread(...)}`. A directive we own
 * already holds the element, so it can honour a `ref` key in the bag and keep
 * the template to one binding per element. See FINDINGS question 1.
 *
 * Key syntax, matching Lit's own template syntax so it reads familiarly:
 *
 *   name       →  attribute            name="value"
 *   .name      →  property             el.name = value
 *   ?name      →  boolean attribute    present when truthy
 *   @name      →  event listener       addEventListener(name, value)
 *   ref        →  callback invoked with the element (or null on detach)
 */
import { nothing } from "lit";
import {
  Directive,
  directive,
  type ElementPart,
  type PartInfo,
  PartType,
} from "lit/directive.js";

export type SpreadProps = Record<string, unknown>;

class SpreadDirective extends Directive {
  #applied: SpreadProps = {};
  #element: Element | null = null;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error(
        "spread() can only be used in an element binding position",
      );
    }
  }

  override render(_props: SpreadProps): typeof nothing {
    return nothing;
  }

  override update(part: ElementPart, [props]: [SpreadProps]): typeof nothing {
    const element = part.element;

    if (this.#element !== element) {
      this.#element = element;
      this.#applied = {};
    }

    // Remove anything that was set last render and is gone now.
    for (const key of Object.keys(this.#applied)) {
      if (key in props) continue;
      this.#unset(element, key, this.#applied[key]);
    }

    for (const [key, value] of Object.entries(props)) {
      const previous = this.#applied[key];
      if (previous === value && key !== "ref") continue;
      this.#unset(element, key, previous);
      this.#set(element, key, value);
    }

    this.#applied = { ...props };
    return nothing;
  }

  #set(element: Element, key: string, value: unknown): void {
    if (value === undefined || value === null || value === nothing) return;

    switch (key[0]) {
      case ".":
        // deno-lint-ignore no-explicit-any
        (element as any)[key.slice(1)] = value;
        return;
      case "?":
        if (value) element.setAttribute(key.slice(1), "");
        return;
      case "@":
        element.addEventListener(key.slice(1), value as EventListener);
        return;
      default:
        if (key === "ref") {
          (value as (el: Element | null) => void)(element);
          return;
        }
        if (value === false) return;
        element.setAttribute(key, value === true ? "" : String(value));
    }
  }

  #unset(element: Element, key: string, value: unknown): void {
    if (value === undefined || value === null) return;

    switch (key[0]) {
      case ".":
        return;
      case "?":
        element.removeAttribute(key.slice(1));
        return;
      case "@":
        element.removeEventListener(key.slice(1), value as EventListener);
        return;
      default:
        if (key === "ref") return;
        element.removeAttribute(key);
    }
  }
}

export const spread = directive(SpreadDirective);
