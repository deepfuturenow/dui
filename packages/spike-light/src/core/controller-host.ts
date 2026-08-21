/**
 * The interface controllers are written against (spec D6). Controllers in
 * this package import types from here and from bags.ts — never from lit —
 * so they can be unit-tested without a DOM and adapted to other frameworks.
 */
export interface LifecycleHooks {
  connected?(): void;
  disconnected?(): void;
  updated?(): void;
}

export interface ControllerHost {
  requestUpdate(): void;
  addLifecycle(hooks: LifecycleHooks): void;
}

/** Base class: holds the host once attached. Attachment is done by an adapter. */
export abstract class Controller {
  #host: ControllerHost | null = null;

  get host(): ControllerHost {
    if (!this.#host) {
      throw new Error(
        `[bui] ${this.constructor.name} used before attach(). ` +
          `Construct it, then pass it to attach(element, controller).`,
      );
    }
    return this.#host;
  }

  get attached(): boolean {
    return this.#host !== null;
  }

  /** Called by an adapter exactly once. */
  attachTo(host: ControllerHost): void {
    if (this.#host) {
      throw new Error(`[bui] ${this.constructor.name} attached twice`);
    }
    this.#host = host;
    this.onAttach?.();
  }

  protected onAttach?(): void;
}
