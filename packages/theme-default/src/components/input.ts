import { css } from "lit";
import { type } from "../typography.ts";

export const inputStyles = css`
  [part="input"] {
    padding: var(--space-2);
    font-family: var(--font-sans);
    ${type("sm")}
    height: var(--component-height-md);
    color: var(--text-1);
    border: var(--border-width-thin) solid var(--border);
    background: var(--sunken);
    border-radius: var(--radius-md);
    transition-property: border-color, box-shadow, background, filter, transform;
    transition-duration: var(--duration-fast);
  }

  [part="input"]::placeholder {
    color: var(--text-3);
  }

  [part="input"]:focus-visible {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  [part="input"]:disabled {
    opacity: 0.4;
  }

  [part="input"][data-invalid] {
    border-color: var(--destructive);
  }

  [part="input"][data-invalid]:focus-visible {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  /* Password bullets are tiny at small font sizes — bump them up */
  [part="input"][type="password"]:not(:placeholder-shown) {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
  }

  /* Autofill overrides */
  [part="input"]:-webkit-autofill,
  [part="input"]:-webkit-autofill:hover,
  [part="input"]:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--text-1);
    transition: background-color 5000s ease-in-out 0s;
  }
`;
