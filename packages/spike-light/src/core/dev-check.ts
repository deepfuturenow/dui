/**
 * Development-mode bag check (spec: controller conventions).
 *
 * A controller declares the bags it expects to be applied. spread() and
 * applyProps() report each application through the bag's dev mark, so the
 * check needs no DOM queries. After the host's first update, any expected
 * bag that was never applied — or whose ref never received an element — is
 * warned about, naming the bag and the host.
 *
 * What this cannot catch, by design: a bag applied to the WRONG element.
 * The sentinel lands, the ref resolves, and the check passes. That case is
 * covered at compile time by the brand annotation convention (P5), and at
 * runtime by nothing.
 */
import type { ControllerHost } from "./controller-host.ts";

export type BagExpectation = {
  name: string;
  /** Whether the bag carries a ref that must have attached. */
  ref?: boolean;
};

export class DevCheck {
  #expected: BagExpectation[];
  #applied = new Set<string>();
  #refsAttached = new Set<string>();
  #done = false;
  #hostLabel: () => string;

  constructor(
    host: ControllerHost,
    hostLabel: () => string,
    expected: BagExpectation[],
  ) {
    this.#expected = expected;
    this.#hostLabel = hostLabel;
    host.addLifecycle({
      updated: () => {
        if (this.#done) return;
        this.#done = true;
        // Wait one microtask: parts of a compound family apply their bags in
        // their own update passes, which follow the root's.
        queueMicrotask(() => queueMicrotask(() => this.#report()));
      },
    });
  }

  bagApplied(name: string): void {
    this.#applied.add(name);
  }

  refAttached(name: string): void {
    this.#refsAttached.add(name);
  }

  #report(): void {
    for (const bag of this.#expected) {
      if (!this.#applied.has(bag.name)) {
        console.warn(
          `[bui] <${this.#hostLabel()}>: bag "${bag.name}" was never applied. ` +
            `Spread it onto its element or the component will be missing ` +
            `behavior and ARIA.`,
        );
      } else if (bag.ref && !this.#refsAttached.has(bag.name)) {
        console.warn(
          `[bui] <${this.#hostLabel()}>: bag "${bag.name}" was applied but its ` +
            `ref never attached to an element.`,
        );
      }
    }
  }
}
