/**
 * `toastStore` — the toast queue as plain data, with no DOM.
 *
 * This is the part of the toast conversion that is genuinely different from
 * select and tabs, and it is the answer to "whose host owns state that outlives
 * an element": nobody's. The queue is module state, exactly as it is today. The
 * change is what the queue holds.
 *
 * Today `toast("Saved")` is a markup generator. It calls
 * `document.createElement(DuiToastPrimitive.tagName)`, wraps the description in
 * a `<span slot="description">`, builds a `<dui-toast-action>` containing a
 * `<button>`, and appends the lot to an auto-created `<dui-toast-region>`. Roughly
 * 150 lines of `toast-imperative.ts` are DOM plumbing of this kind.
 *
 * That is unworkable once an app owns its toast markup: the imperative API would
 * keep producing the library's elements and slot names, silently bypassing the
 * owned file. So the API inverts. `toast()` pushes a record; the app's own region
 * component renders the records with `repeat()`. The DOM plumbing does not move
 * to the app — it stops existing.
 */

export type ToastType = "default" | "success" | "error" | "warning" | "info";
export type ToastPriority = "polite" | "assertive";
export type ToastDismissReason =
  | "auto"
  | "action"
  | "close"
  | "programmatic";

export type ToastAction = {
  label: string;
  onClick?: (event: MouseEvent) => void;
};

export type ToastOptions = {
  id?: string;
  description?: string;
  type?: ToastType;
  /** Auto-dismiss timeout in ms. 0 disables. */
  duration?: number;
  priority?: ToastPriority;
  closeButton?: boolean;
  action?: ToastAction;
};

export type ToastRecord =
  & Required<
    Omit<ToastOptions, "action" | "description">
  >
  & {
    title: string;
    description?: string;
    action?: ToastAction;
  };

let nextId = 1;

const DEFAULTS = {
  type: "default" as ToastType,
  duration: 4000,
  priority: "polite" as ToastPriority,
  closeButton: false,
};

class ToastStore {
  #records: ToastRecord[] = [];
  #subscribers = new Set<() => void>();

  /** Newest last, matching DOM insertion order in the current implementation. */
  get records(): readonly ToastRecord[] {
    return this.#records;
  }

  subscribe(fn: () => void): () => void {
    this.#subscribers.add(fn);
    return () => this.#subscribers.delete(fn);
  }

  #emit(): void {
    for (const fn of this.#subscribers) fn();
  }

  /** Add, or update in place when the id already exists. */
  add(title: string, options: ToastOptions = {}): string {
    const id = options.id ?? `toast-${nextId++}`;
    const existing = this.#records.findIndex((r) => r.id === id);
    const record: ToastRecord = {
      ...DEFAULTS,
      ...options,
      id,
      title,
    };
    if (existing >= 0) this.#records[existing] = record;
    else this.#records = [...this.#records, record];
    this.#emit();
    return id;
  }

  update(id: string, patch: Partial<ToastRecord>): void {
    const i = this.#records.findIndex((r) => r.id === id);
    if (i < 0) return;
    this.#records = this.#records.map((r, n) =>
      n === i ? { ...r, ...patch } : r
    );
    this.#emit();
  }

  dismiss(id: string, _reason: ToastDismissReason = "programmatic"): void {
    const before = this.#records.length;
    this.#records = this.#records.filter((r) => r.id !== id);
    if (this.#records.length !== before) this.#emit();
  }

  clear(): void {
    if (!this.#records.length) return;
    this.#records = [];
    this.#emit();
  }
}

export const toastStore: ToastStore = new ToastStore();

type ToastFn = {
  (title: string, options?: ToastOptions): string;
  success: (title: string, options?: ToastOptions) => string;
  error: (title: string, options?: ToastOptions) => string;
  warning: (title: string, options?: ToastOptions) => string;
  info: (title: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const base = (title: string, options: ToastOptions = {}): string =>
  toastStore.add(title, options);

/**
 * The public API, unchanged in shape from the library's — `toast("Saved")`,
 * `toast.success(...)`, `toast.dismiss(id)`. Only what happens underneath is
 * different, so an app's call sites do not move.
 */
export const toast: ToastFn = Object.assign(base, {
  success: (t: string, o: ToastOptions = {}) =>
    base(t, { ...o, type: "success" }),
  error: (t: string, o: ToastOptions = {}) => base(t, { ...o, type: "error" }),
  warning: (t: string, o: ToastOptions = {}) =>
    base(t, { ...o, type: "warning" }),
  info: (t: string, o: ToastOptions = {}) => base(t, { ...o, type: "info" }),
  dismiss: (id: string) => toastStore.dismiss(id),
  clear: () => toastStore.clear(),
});
