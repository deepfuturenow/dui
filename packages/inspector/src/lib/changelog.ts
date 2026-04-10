/**
 * Changelog — ordered log of all mutations performed in the session.
 * Both agent API and human UI funnel mutations through here.
 */

import type { ChangelogEntry } from "./types.ts";

export type ChangelogSubscriber = (entry: ChangelogEntry) => void;

export class Changelog {
  #entries: ChangelogEntry[] = [];
  #nextId = 1;
  #subscribers = new Set<ChangelogSubscriber>();

  /** Add a new entry to the changelog. Returns the entry with its assigned id. */
  add(
    action: string,
    target: string,
    params: Record<string, unknown>,
    undoFn?: () => void,
  ): ChangelogEntry {
    const entry: ChangelogEntry = {
      id: this.#nextId++,
      timestamp: new Date().toISOString(),
      action,
      target,
      params,
      undoable: !!undoFn,
      _undo: undoFn,
    };
    this.#entries.push(entry);
    this.#notify(entry);
    return entry;
  }

  /** Get all entries (serializable — strips _undo). */
  entries(): Omit<ChangelogEntry, "_undo">[] {
    return this.#entries.map(({ _undo: _, ...rest }) => rest);
  }

  /** Undo the last undoable mutation. Returns true if something was undone. */
  undo(): boolean {
    for (let i = this.#entries.length - 1; i >= 0; i--) {
      const entry = this.#entries[i];
      if (entry.undoable && entry._undo) {
        entry._undo();
        this.#entries.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /** Get the count of entries. */
  get count(): number {
    return this.#entries.length;
  }

  /** Clear all entries. */
  clear(): void {
    this.#entries = [];
  }

  /** Subscribe to new changelog entries. */
  subscribe(callback: ChangelogSubscriber): void {
    this.#subscribers.add(callback);
  }

  /** Unsubscribe from changelog entries. */
  unsubscribe(callback: ChangelogSubscriber): void {
    this.#subscribers.delete(callback);
  }

  #notify(entry: ChangelogEntry): void {
    const serializable = { ...entry };
    delete serializable._undo;
    for (const sub of this.#subscribers) {
      try {
        sub(serializable);
      } catch {
        // Don't let subscriber errors break the changelog
      }
    }
  }
}

/** Singleton changelog instance. */
export const changelog = new Changelog();
