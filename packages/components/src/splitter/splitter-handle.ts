import { css } from "lit";
import { DuiSplitterHandlePrimitive } from "@dui/primitives/splitter";
import "../_install.ts";

/**
 * Two-layer handle styling:
 *
 *   • The host element is the **interaction target**. Its cross-axis size
 *     (--splitter-handle-size) defines how easy the handle is to grab.
 *   • A ::before pseudo on [part="root"] draws the **visible line**, centered
 *     in the target, with its own thickness (--splitter-handle-visible-size).
 *
 * This decouples hit area from drawn width — set the visible line to 1px
 * (or 0 for an invisible-but-grabbable handle) while keeping a fat 8px+
 * target.
 *
 * Defaults are applied via `var(name, fallback)` at every consumption site
 * rather than via a `:host { --x: default }` declarations block. The latter
 * sets the value *directly* on the host element, which silently overrides
 * any value the consumer inherits down from an ancestor (e.g. a wrapper
 * with `.fat-handles { --splitter-handle-size: 16px }`). The fallback
 * pattern keeps every var overridable from anywhere in the cascade.
 */
const styles = css`
  /* Host = interaction target. Cross-axis size depends on orientation. */
  :host([data-orientation="horizontal"]) {
    width: var(--splitter-handle-size, var(--space-2));
  }
  :host([data-orientation="vertical"]) {
    height: var(--splitter-handle-size, var(--space-2));
  }

  [part="root"] {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Visible line — centered in the interaction target. */
  [part="root"]::before {
    content: "";
    display: block;
    background: var(--splitter-handle-color, var(--border));
    border-radius: var(--splitter-handle-radius, var(--radius-full));
    transition:
      background-color var(--splitter-handle-transition-duration, var(--duration-fast)) ease,
      width var(--splitter-handle-transition-duration, var(--duration-fast)) ease,
      height var(--splitter-handle-transition-duration, var(--duration-fast)) ease;
  }

  :host([data-orientation="horizontal"]) [part="root"]::before {
    width: var(--splitter-handle-visible-size, var(--border-width-thin));
    height: 100%;
  }
  :host([data-orientation="vertical"]) [part="root"]::before {
    width: 100%;
    height: var(--splitter-handle-visible-size, var(--border-width-thin));
  }

  /* Hover — brighten the line. :where(:hover) keeps the specificity at
     (0,1,0) so the dragging rule below can win the tie via source order;
     otherwise hovering during a drag would override the active color. */
  :host(:where(:hover):not([data-disabled])) [part="root"]::before {
    background: var(--splitter-handle-hover-color, var(--border-strong));
  }

  /* Active states. The primitive defaultPrevents focus-on-mousedown so
     pointer clicks no longer steal focus — [data-focused] reflects keyboard
     focus only, matching :focus-visible semantics. */
  :host([data-dragging]) [part="root"]::before,
  :host([data-focused]) [part="root"]::before {
    background: var(--splitter-handle-active-color, var(--accent));
  }

  /* Keyboard focus also fattens the line so the active state is unambiguous
     even when --splitter-handle-visible-size is 0. The combined attribute
     selector beats the orientation-specific size rule above on specificity. */
  :host([data-orientation="horizontal"][data-focused]) [part="root"]::before {
    width: var(--space-1);
  }
  :host([data-orientation="vertical"][data-focused]) [part="root"]::before {
    height: var(--space-1);
  }

  /* Disabled — mute the bar. */
  :host([data-disabled]) [part="root"]::before {
    background: var(--border);
    opacity: 0.5;
  }
`;

/**
 * `<dui-splitter-handle>` — Styled draggable separator.
 *
 * Default appearance: 8px interaction target with a centered 1px line that
 * brightens on hover and turns accent-colored when dragged or keyboard-focused.
 *
 * Customize via CSS vars on the handle, the splitter, or any ancestor:
 *
 * ```css
 * .my-splitter {
 *   --splitter-handle-size: 12px;          // interaction target thickness
 *   --splitter-handle-visible-size: 0;     // invisible bar with a fat target
 *   --splitter-handle-color: var(--border);
 *   --splitter-handle-hover-color: var(--border-strong);
 *   --splitter-handle-active-color: var(--accent);
 *   --splitter-handle-radius: var(--radius-full);
 * }
 * ```
 */
export class DuiSplitterHandle extends DuiSplitterHandlePrimitive {
  static override styles = [...DuiSplitterHandlePrimitive.styles, styles];
}

customElements.define(DuiSplitterHandle.tagName, DuiSplitterHandle);
