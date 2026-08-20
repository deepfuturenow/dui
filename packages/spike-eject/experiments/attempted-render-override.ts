/**
 * STEP 4, CHANGE 2 — FAILED ATTEMPT. This file does not compile and is not
 * part of the build (it is outside `src/`). It is kept verbatim as the
 * evidence behind the FINDINGS: this is the code a consumer writes first, and
 * this is exactly how far they get.
 *
 * The goal: move the chevron to the *leading* edge of the trigger and swap it
 * for a stacked up/down glyph — a change to the render tree, not to CSS.
 *
 * To emit the trigger at all, the override has to reproduce the primitive's
 * `.Trigger` markup. Every value that markup binds is `#private` on
 * `DuiSelectPrimitive`, so none of it is reachable from a subclass. The
 * compiler errors this produces are pasted at the bottom of the file.
 */
import { html, nothing, type TemplateResult } from "lit";
import { DuiSelectPrimitive } from "@dui/primitives/select";

export class DuiSelectLeadingChevron extends DuiSelectPrimitive {
  override render(): TemplateResult {
    const hasValue = this.value !== "" && this.#selectedOption != null;

    return html`
      <div
        class="Trigger"
        part="trigger"
        id="${this.#triggerId}"
        role="combobox"
        tabindex="${this.disabled ? -1 : 0}"
        aria-haspopup="listbox"
        aria-expanded="${this.#popup.isOpen}"
        aria-controls="${this.#listboxId}"
        aria-activedescendant="${this.#highlightedIndex >= 0
          ? `${this.#listboxId}-option-${this.#highlightedIndex}`
          : nothing}"
        ?data-disabled="${this.disabled}"
        ?data-open="${this.#popup.isOpen}"
        @click="${this.#onTriggerClick}"
        @keydown="${this.#onTriggerKeyDown}"
      >
        <!-- the whole point of the change: icon first, new glyph -->
        <span class="Icon">
          <dui-icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" />
            </svg>
          </dui-icon>
        </span>
        <span class="Value" part="value" ?data-placeholder="${!hasValue}">
          ${hasValue ? this.#displayValue : this.placeholder}
        </span>
      </div>

      <!-- ...and then the entire popup / scroll-area / listbox / repeat()
           block would have to be reproduced too, because render() is
           all-or-nothing. #renderItem, #itemPart, #onListMouseDown and
           #popup.handleToggle are all private as well. -->
    `;
  }
}

/* ---------------------------------------------------------------------------
 * `deno check packages/spike-eject/experiments/attempted-render-override.ts`
 * output is captured in FINDINGS.md §3. Every single binding in the template
 * above is a compile error; none of them has a public or protected equivalent.
 * ------------------------------------------------------------------------- */
