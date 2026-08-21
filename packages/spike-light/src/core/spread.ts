/**
 * Attribute spread for Lit templates, branded, plus `applyProps()` for
 * applying a bag to an element imperatively (container parts apply their bag
 * to themselves and render nothing).
 *
 * Key syntax matches Lit's own: `name`, `.name`, `?name`, `@name`, `ref`,
 * and `style` (an object applied with setProperty — custom properties can't
 * ride on an attribute, and `el.style = {...}` stringifies).
 */
import { nothing } from "lit";
import {
  Directive,
  directive,
  type ElementPart,
  type PartInfo,
  PartType,
} from "lit/directive.js";
import { type Bag, type BagValues, devMarkOf } from "./bags.ts";

function setEntry(el: Element, key: string, value: unknown): void {
  if (value === undefined || value === null || value === nothing) return;
  switch (key[0]) {
    case ".":
      // deno-lint-ignore no-explicit-any
      (el as any)[key.slice(1)] = value;
      return;
    case "?":
      if (value) el.setAttribute(key.slice(1), "");
      return;
    case "@":
      el.addEventListener(key.slice(1), value as EventListener);
      return;
    default:
      if (key === "ref") {
        (value as (e: Element | null) => void)(el);
        return;
      }
      if (key === "style" && typeof value === "object") {
        const style = (el as HTMLElement).style;
        for (
          const [prop, v] of Object.entries(value as Record<string, string>)
        ) {
          style.setProperty(prop, v);
        }
        return;
      }
      if (value === false) return;
      el.setAttribute(key, value === true ? "" : String(value));
  }
}

function unsetEntry(el: Element, key: string, value: unknown): void {
  if (value === undefined || value === null) return;
  switch (key[0]) {
    case ".":
      return;
    case "?":
      el.removeAttribute(key.slice(1));
      return;
    case "@":
      el.removeEventListener(key.slice(1), value as EventListener);
      return;
    default:
      if (key === "ref") return;
      if (key === "style" && typeof value === "object") {
        const style = (el as HTMLElement).style;
        for (const prop of Object.keys(value as Record<string, string>)) {
          style.removeProperty(prop);
        }
        return;
      }
      el.removeAttribute(key);
  }
}

function shallowEqual(a: unknown, b: unknown): boolean {
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  const A = a as Record<string, string>, B = b as Record<string, string>;
  const ak = Object.keys(A), bk = Object.keys(B);
  return ak.length === bk.length && ak.every((k) => A[k] === B[k]);
}

function applyDiff(el: Element, prev: BagValues, next: BagValues): void {
  for (const key of Object.keys(prev)) {
    if (!(key in next)) unsetEntry(el, key, prev[key]);
  }
  for (const [key, value] of Object.entries(next)) {
    const previous = prev[key];
    if (previous === value && key !== "ref") continue;
    if (key === "style" && shallowEqual(previous, value)) continue;
    unsetEntry(el, key, previous);
    setEntry(el, key, value);
  }
  devMarkOf(next)?.onApplied(el);
}

class SpreadDirective extends Directive {
  #applied: BagValues = {};
  #el: Element | null = null;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error("spread() must be used in an element binding position");
    }
  }

  override render(_bag: Bag<string>): typeof nothing {
    return nothing;
  }

  override update(part: ElementPart, [bag]: [Bag<string>]): typeof nothing {
    if (this.#el !== part.element) {
      this.#el = part.element;
      this.#applied = {};
    }
    applyDiff(part.element, this.#applied, bag);
    this.#applied = { ...bag };
    return nothing;
  }
}

const spreadDirective = directive(SpreadDirective);

/**
 * Branded spread. The reference-file convention annotates the expected brand:
 *
 *   ${spread<SelectTriggerBag>(select.triggerProps)}
 *
 * which makes spreading the wrong bag a compile error at this line. Without
 * the annotation the spread still works; it just isn't position-checked.
 */
export function spread<B extends Bag<string>>(bag: B): unknown {
  return spreadDirective(bag);
}

const appliedByElement = new WeakMap<Element, BagValues>();

/** Applies a bag to an element outside a template (container parts, hosts). */
export function applyProps<B extends Bag<string>>(el: Element, bag: B): void {
  const prev = appliedByElement.get(el) ?? {};
  applyDiff(el, prev, bag);
  appliedByElement.set(el, { ...bag });
}
