import { css } from "lit";

export const progressStyles = css`
  :host {
    --progress-height: var(--space-2);
  }

  [part="track"] {
    height: var(--progress-height);
    background: var(--muted);
    border-radius: var(--radius-full);
  }

  [part="indicator"] {
    background: var(--primary);
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
