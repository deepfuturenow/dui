/**
 * Branded property bags.
 *
 * A bag is a plain object of attributes (`name`), properties (`.name`),
 * boolean attributes (`?name`), events (`@name`), plus `ref` and `style`.
 * The brand is a phantom type parameter: `Bag<"select:trigger">` is not
 * assignable to `Bag<"select:listbox">`, so a reference file that annotates
 * its spread sites — the convention every BUI component file follows — turns
 * a wrong-position spread into a compile error at that line (probe P5).
 *
 * Every bag also carries a real sentinel attribute, `data-bui-bag`, so the
 * applied bag is visible in devtools and the dev-mode check can account for
 * bags without querying the DOM.
 */
declare const BRAND: unique symbol;

export type Ref = (el: Element | null) => void;

export type BagValues = {
  [key: string]: unknown;
  ref?: Ref;
  style?: Record<string, string>;
};

export type Bag<Name extends string> = BagValues & { readonly [BRAND]?: Name };

const DEV_MARK = Symbol("bui-bag-mark");

type DevMark = { name: string; onApplied: (el: Element) => void };

/** Wraps a bag with its sentinel + a dev callback fired when it is applied. */
export function markBag<N extends string>(
  name: N,
  bag: BagValues,
  onApplied: (el: Element) => void,
): Bag<N> {
  const marked = { ...bag, "data-bui-bag": name } as Bag<N>;
  Object.defineProperty(marked, DEV_MARK, {
    value: { name, onApplied } satisfies DevMark,
    enumerable: false,
  });
  return marked;
}

export function devMarkOf(bag: object): DevMark | undefined {
  return (bag as Record<symbol, DevMark>)[DEV_MARK];
}
