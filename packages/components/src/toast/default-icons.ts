/**
 * Default icon templates for `<dui-toast>`, keyed by `data-type`.
 *
 * SVGs are sized to 14×16 with `currentColor` so they inherit the toast's
 * `--toast-icon-color` (which resolves per-type via `--toast-type-color`).
 *
 * The `loading` type uses `<dui-spinner>` instead of an inline SVG for
 * consistency with the rest of `@dui/components` (and free reduced-motion
 * handling).
 */

import { html, type TemplateResult } from "lit";
import type { ToastType } from "@dui/primitives/toast";

const success = html`
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path
      d="M3 8.5l3 3 6.5-7"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;

const error = html`
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path
      d="M4 4l8 8M12 4l-8 8"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
`;

const warning = html`
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path
      d="M8 1.5L14.5 13.5h-13z"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <path
      d="M8 6v3.5"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <circle cx="8" cy="11.5" r="0.9" fill="currentColor" />
  </svg>
`;

const info = html`
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <circle
      cx="8"
      cy="8"
      r="6.5"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    />
    <path
      d="M8 7.5v4"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <circle cx="8" cy="4.7" r="0.9" fill="currentColor" />
  </svg>
`;

const loading = html`
  <dui-spinner part="spinner" aria-hidden="true"></dui-spinner>
`;

/**
 * Returns the default icon template for a given toast type, or `null` if the
 * type doesn't ship with a built-in icon (`default`, or any unknown value).
 */
export function defaultIconFor(type: ToastType): TemplateResult | null {
  switch (type) {
    case "success":
      return success;
    case "error":
      return error;
    case "warning":
      return warning;
    case "info":
      return info;
    case "loading":
      return loading;
    default:
      return null;
  }
}
