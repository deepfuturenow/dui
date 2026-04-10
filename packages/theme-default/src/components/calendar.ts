import { css } from "lit";
import { type } from "../typography.ts";

export const calendarStyles = css`
  [part="root"] {
    padding: var(--space-3);
    font-family: var(--font-sans);
    ${type("sm")}
  }

  [part="header"] {
    padding-bottom: var(--space-2);
  }

  [part="heading"] {
    ${type("sm")}
    font-weight: var(--font-weight-medium);
    color: var(--text-1);
  }

  [part="prev"],
  [part="next"] {
    width: var(--space-7);
    height: var(--space-7);
    border-radius: var(--radius-md);
    color: var(--text-2);
    font-size: var(--font-size-lg);
    transition-property: background, color;
    transition-duration: var(--duration-fast);
  }

  @media (hover: hover) {
    [part="prev"]:hover,
    [part="next"]:hover {
      background: var(--surface-1);
      color: var(--text-1);
    }
  }

  [part="weekday"] {
    width: var(--space-8);
    height: var(--space-8);
    ${type("xs")}
    font-weight: var(--font-weight-regular);
    color: var(--text-2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  [part="day"] {
    width: var(--space-8);
    height: var(--space-8);
    border-radius: var(--radius-md);
    ${type("sm")}
    color: var(--text-1);
    transition-property: background, color;
    transition-duration: var(--duration-fast);
  }

  @media (hover: hover) {
    [part="day"]:hover:not(:disabled):not([data-selected]) {
      background: var(--surface-1);
    }
  }

  [part="day"][data-today]:not([data-selected]) {
    background: var(--accent-subtle);
    color: var(--accent-text);
  }

  [part="day"][data-selected] {
    background: var(--accent);
    color: oklch(from var(--accent) 0.98 0.01 h);
  }

  [part="day"][data-outside-month] {
    color: var(--text-2);
    opacity: 0.4;
  }

  [part="day"]:disabled {
    opacity: 0.4;
  }

  [part="day"]:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }
`;
