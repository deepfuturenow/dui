import { css } from "lit";

export const calendarStyles = css`
  [part="root"] {
    padding: var(--space-3);
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
  }

  [part="header"] {
    padding-bottom: var(--space-2);
  }

  [part="heading"] {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--foreground);
  }

  [part="prev"],
  [part="next"] {
    width: var(--space-7);
    height: var(--space-7);
    border-radius: var(--radius-md);
    color: var(--muted-foreground);
    font-size: var(--font-size-lg);
    transition-property: background-color, color;
    transition-duration: var(--duration-fast);
  }

  @media (hover: hover) {
    [part="prev"]:hover,
    [part="next"]:hover {
      background-color: var(--muted);
      color: var(--foreground);
    }
  }

  [part="weekday"] {
    width: var(--space-8);
    height: var(--space-8);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-normal);
    color: var(--muted-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  [part="day"] {
    width: var(--space-8);
    height: var(--space-8);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    color: var(--foreground);
    transition-property: background-color, color;
    transition-duration: var(--duration-fast);
  }

  @media (hover: hover) {
    [part="day"]:hover:not(:disabled):not([data-selected]) {
      background-color: var(--muted);
    }
  }

  [part="day"][data-today]:not([data-selected]) {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  [part="day"][data-selected] {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }

  [part="day"][data-outside-month] {
    color: var(--muted-foreground);
    opacity: 0.5;
  }

  [part="day"]:disabled {
    opacity: 0.3;
  }

  [part="day"]:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
`;
