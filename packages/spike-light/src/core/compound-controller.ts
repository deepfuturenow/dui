/**
 * Registration and update fan-out for compound families, extracted from the
 * two protocols Experiment 2 had to invent for tabs (spec P7).
 *
 * Parts find their root with closest(), then call register(); the controller
 * never queries the DOM. Because the controller instance is stable, state
 * changes must be pushed: notify() re-renders the root and every registered
 * part. Parts are kept in document order so roving focus and indicator math
 * are order-correct even when elements upgrade out of order.
 */
import { Controller } from "./controller-host.ts";

export interface PartHost {
  readonly element: HTMLElement;
  requestUpdate(): void;
}

export class CompoundController<D = void> extends Controller {
  #parts: Array<{ part: PartHost; data: D }> = [];
  #aux = new Set<PartHost>();

  /**
   * Registers a non-item part (a trigger, a popup) that must re-render on
   * state changes but does not belong in the ordered item list.
   */
  registerAux(part: PartHost): () => void {
    this.#aux.add(part);
    return () => {
      this.#aux.delete(part);
    };
  }

  /** Registers a part. Returns its unregister function. */
  register(part: PartHost, data: D): () => void {
    this.#parts = [
      ...this.#parts.filter((e) => e.part !== part),
      { part, data },
    ].sort((a, b) =>
      a.part.element.compareDocumentPosition(b.part.element) &
        Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1
    );
    this.host.requestUpdate();
    return () => {
      this.#parts = this.#parts.filter((e) => e.part !== part);
    };
  }

  updateData(part: PartHost, data: D): void {
    const entry = this.#parts.find((e) => e.part === part);
    if (!entry) return;
    entry.data = data;
    this.notify();
  }

  get parts(): ReadonlyArray<{ part: PartHost; data: D }> {
    return this.#parts;
  }

  /** Re-renders every registered part, but not the root. For use from the
   * root's own updated hook, where notify() would loop. */
  notifyParts(): void {
    for (const { part } of this.#parts) part.requestUpdate();
    for (const part of this.#aux) part.requestUpdate();
  }

  /** Re-renders the root and every registered part. */
  notify(): void {
    this.host.requestUpdate();
    for (const { part } of this.#parts) part.requestUpdate();
    for (const part of this.#aux) part.requestUpdate();
  }
}
