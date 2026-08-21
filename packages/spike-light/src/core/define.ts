/** Idempotent family registration (spec Phase 1, @bui/components). */
type Definable = CustomElementConstructor & { tagName: string };

export function defineFamily(family: readonly Definable[]): void {
  for (const ctor of family) {
    if (!customElements.get(ctor.tagName)) {
      customElements.define(ctor.tagName, ctor);
    }
  }
}
