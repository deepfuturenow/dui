import { css } from "lit";
import { DuiProgressPrimitive } from "@dui/primitives/progress";
import "../_install.ts";

const styles = css`
  :host {
    --progress-height: var(--space-2);
  }

  [part="track"] {
    height: var(--progress-height);
    background: color-mix(in oklch, var(--foreground) 08%, transparent);
    border-radius: var(--radius-full);
  }

  [part="indicator"] {
    background: var(--accent);
    border-radius: var(--radius-full);
    transition: width var(--duration-normal) var(--ease-out-3);
  }

  [part="root"][data-indeterminate] [part="indicator"] {
    width: 40% !important;
    animation: progress-indeterminate 1.5s ease-in-out infinite;
  }

  @keyframes progress-indeterminate {
    0% {
      left: -40%;
    }
    100% {
      left: 100%;
    }
  }
`;

export class DuiProgress extends DuiProgressPrimitive {
  static override styles = [...DuiProgressPrimitive.styles, styles];
}

customElements.define(DuiProgress.tagName, DuiProgress);
