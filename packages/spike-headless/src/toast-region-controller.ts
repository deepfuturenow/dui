/**
 * `ToastRegionController` — everything `<dui-toast-region>` and `<dui-toast>`
 * do between them, minus the templates.
 *
 * The library splits this across two elements coordinated by context, because
 * each toast is a separate custom element that owns its own timer. Here the
 * toasts are rows in the app's own `repeat()`, so one controller on the region
 * owns every timer and hands out a prop bag per row.
 *
 * That collapses a coordination problem into a loop. Three things the library
 * needs and this does not:
 *
 *   - `registerToast` / `unregisterToast` — the region's `Map<string, HTMLElement>`
 *     existed so it could find children it did not render. Refs from `toastProps`
 *     replace it, and the ref is only still needed for height measurement.
 *   - `toastItemContext` — a second context, provided per toast, so a close
 *     button could find its own toast's id. `closeProps(id)` closes over the id.
 *   - `#applyMirroredState` and `#updateIndices` — imperative writes of
 *     `--toast-index`, `--toasts-total`, `data-front`, `data-overflow` onto
 *     children, done outside the render cycle because the children were slotted.
 *     They are return values now.
 *
 * NOT converted, and honestly out of scope for a spike: swipe-to-dismiss
 * (`toast-swipe-controller.ts`, 263 lines), the region hotkey and focus-restore
 * machinery, and `toast.promise()`. See FINDINGS.
 */
import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { SpreadProps } from "./spread.ts";
import {
  type ToastDismissReason,
  type ToastRecord,
  toastStore,
} from "./toast-store.ts";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastRegionOptions = {
  getPosition: () => ToastPosition;
  getMaxVisible: () => number;
  getExpandOnHover: () => boolean;
  getLabel: () => string;
};

type Host = ReactiveControllerHost & HTMLElement;

type TimerState = {
  handle: number | undefined;
  remaining: number;
  startedAt: number;
};

export class ToastRegionController implements ReactiveController {
  #host: Host;
  #opts: ToastRegionOptions;
  #unsubscribe: (() => void) | undefined;

  #timers = new Map<string, TimerState>();
  #elements = new Map<string, HTMLElement>();
  #heights = new Map<string, number>();
  #resizeObserver: ResizeObserver | undefined;

  #pointerInside = false;
  #focusInside = false;
  #documentHidden = false;

  constructor(host: Host, options: ToastRegionOptions) {
    this.#host = host;
    this.#opts = options;
    host.addController(this);
  }

  hostConnected(): void {
    this.#unsubscribe = toastStore.subscribe(() => this.#onStoreChange());
    document.addEventListener("visibilitychange", this.#onVisibility);
    this.#resizeObserver = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.toastId;
        if (!id) continue;
        const h = Math.round(entry.contentRect.height);
        if (this.#heights.get(id) !== h) {
          this.#heights.set(id, h);
          changed = true;
        }
      }
      if (changed) this.#host.requestUpdate();
    });
    this.#syncTimers();
  }

  hostDisconnected(): void {
    this.#unsubscribe?.();
    document.removeEventListener("visibilitychange", this.#onVisibility);
    this.#resizeObserver?.disconnect();
    for (const t of this.#timers.values()) {
      if (t.handle !== undefined) clearTimeout(t.handle);
    }
    this.#timers.clear();
    this.#elements.clear();
    this.#heights.clear();
  }

  // ---- State ---------------------------------------------------------------

  get toasts(): readonly ToastRecord[] {
    return toastStore.records;
  }

  /** True while auto-dismiss timers should be held. */
  get paused(): boolean {
    return this.#pointerInside || this.#focusInside || this.#documentHidden;
  }

  get expanded(): boolean {
    return this.#opts.getExpandOnHover() &&
      (this.#pointerInside || this.#focusInside);
  }

  get overflowCount(): number {
    return Math.max(0, this.toasts.length - this.#opts.getMaxVisible());
  }

  dismiss(id: string, reason: ToastDismissReason = "programmatic"): void {
    toastStore.dismiss(id, reason);
  }

  // ---- Prop bags -----------------------------------------------------------

  get regionProps(): SpreadProps {
    const total = this.toasts.length;
    return {
      role: "region",
      "aria-label": this.#opts.getLabel(),
      tabindex: -1,
      "data-position": this.#opts.getPosition(),
      "?data-expanded": this.expanded,
      "?data-paused": this.paused,
      "data-overflow-count": this.overflowCount || undefined,
      "style": {
        "--toasts-total": String(total),
        "--toasts-overflow-count": String(this.overflowCount),
        "--toasts-stack-height": `${this.#stackHeight()}px`,
      },
      "@pointerenter": () => {
        this.#pointerInside = true;
        this.#applyPause();
      },
      "@pointerleave": () => {
        this.#pointerInside = false;
        this.#applyPause();
      },
      "@focusin": () => {
        this.#focusInside = true;
        this.#applyPause();
      },
      "@focusout": (event: FocusEvent) => {
        const next = event.relatedTarget as Node | null;
        if (next && this.#host.contains(next)) return;
        this.#focusInside = false;
        this.#applyPause();
      },
    };
  }

  /**
   * `index` is position in the store, oldest first. The stack counts from the
   * front, so the newest toast is index 0 — same convention the library uses.
   */
  toastProps(record: ToastRecord, index: number): SpreadProps {
    const total = this.toasts.length;
    const fromFront = total - 1 - index;
    return {
      ref: (el: Element | null) => this.#trackElement(record.id, el),
      "data-toast-id": record.id,
      role: "status",
      "aria-live": record.priority,
      "aria-atomic": "true",
      "data-type": record.type,
      "?data-front": fromFront === 0,
      "?data-overflow": fromFront >= this.#opts.getMaxVisible(),
      "style": {
        "--toast-index": String(fromFront),
        "--toasts-total": String(total),
        "--toast-height": `${this.#heights.get(record.id) ?? 0}px`,
        "--toasts-before-height": `${this.#beforeHeight(index)}px`,
      },
    };
  }

  closeProps(id: string): SpreadProps {
    return {
      type: "button",
      "aria-label": "Dismiss",
      "@click": () => this.dismiss(id, "close"),
    };
  }

  actionProps(record: ToastRecord): SpreadProps {
    return {
      type: "button",
      "@click": (event: MouseEvent) => {
        record.action?.onClick?.(event);
        this.dismiss(record.id, "action");
      },
    };
  }

  // ---- Internals -----------------------------------------------------------

  #onStoreChange(): void {
    this.#syncTimers();
    this.#host.requestUpdate();
  }

  #onVisibility = (): void => {
    this.#documentHidden = document.hidden;
    this.#applyPause();
  };

  #applyPause(): void {
    const paused = this.paused;
    for (const [id, timer] of this.#timers) {
      if (paused) this.#pause(timer);
      else this.#resume(id, timer);
    }
    this.#host.requestUpdate();
  }

  /** Start timers for new records, drop timers for records that are gone. */
  #syncTimers(): void {
    const live = new Set(this.toasts.map((r) => r.id));
    for (const [id, timer] of this.#timers) {
      if (live.has(id)) continue;
      if (timer.handle !== undefined) clearTimeout(timer.handle);
      this.#timers.delete(id);
      this.#elements.delete(id);
      this.#heights.delete(id);
    }
    for (const record of this.toasts) {
      if (this.#timers.has(record.id) || record.duration <= 0) continue;
      const timer: TimerState = {
        handle: undefined,
        remaining: record.duration,
        startedAt: 0,
      };
      this.#timers.set(record.id, timer);
      if (!this.paused) this.#resume(record.id, timer);
    }
  }

  #resume(id: string, timer: TimerState): void {
    if (timer.handle !== undefined || timer.remaining <= 0) return;
    timer.startedAt = performance.now();
    timer.handle = setTimeout(
      () => this.dismiss(id, "auto"),
      timer.remaining,
    ) as unknown as number;
  }

  #pause(timer: TimerState): void {
    if (timer.handle === undefined) return;
    clearTimeout(timer.handle);
    timer.handle = undefined;
    timer.remaining -= performance.now() - timer.startedAt;
  }

  #trackElement(id: string, el: Element | null): void {
    const previous = this.#elements.get(id);
    if (previous && previous !== el) this.#resizeObserver?.unobserve(previous);
    if (el) {
      this.#elements.set(id, el as HTMLElement);
      this.#resizeObserver?.observe(el);
    } else {
      this.#elements.delete(id);
      this.#heights.delete(id);
    }
  }

  /** Cumulative height of the toasts in front of this one. */
  #beforeHeight(index: number): number {
    let sum = 0;
    for (let i = this.toasts.length - 1; i > index; i--) {
      sum += this.#heights.get(this.toasts[i].id) ?? 0;
    }
    return sum;
  }

  #stackHeight(): number {
    let sum = 0;
    for (const r of this.toasts) sum += this.#heights.get(r.id) ?? 0;
    return sum;
  }
}
