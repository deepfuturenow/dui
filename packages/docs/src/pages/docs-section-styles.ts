import { css } from "lit";

/**
 * Shared styles for top-level section pages (Components, Styling, Theming,
 * Colors, Typography, Prose, etc.).
 *
 * Canonical class names:
 *   .title              — Page h1
 *   .subtitle           — Intro paragraph below h1
 *   .section-heading    — h2 within the page
 *   .section-description — Paragraph below a section heading
 *
 * Import into any section page:
 *   import { sectionStyles } from "./docs-section-styles.ts";
 *   static override styles = [sectionStyles, css`...`];
 */
export const sectionStyles = css`
  :host {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ── Page title ── */
  .title {
    font-size: var(--font-size-2xl, 1.5rem);
    font-weight: 700;
    letter-spacing: var(--letter-spacing-tighter, -0.02em);
    line-height: var(--line-height-tight, 1.25);
    margin: 0 0 var(--space-2);
    color: var(--foreground);
    text-wrap: balance;
  }

  /* ── Subtitle / intro ── */
  .subtitle {
    font-size: var(--font-size-base, 0.9375rem);
    color: var(--text-2);
    line-height: var(--line-height-relaxed, 1.625);
    margin: 0 0 var(--space-8, 2rem);
    max-width: 40rem;
    text-wrap: pretty;
  }

  .subtitle code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    /* background: oklch(from var(--foreground) l c h / 0.1); */
    background: var(--accent-subtle);
    color: var(--accent-text);
    padding: var(--space-0_5) var(--space-1);
    border-radius: var(--radius-sm);
  }

  /* ── Section heading ── */
  .section-heading {
    font-size: var(--font-size-lg, 1.125rem);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-tight, -0.01em);
    color: var(--foreground);
    margin: var(--space-12) 0 var(--space-2);
    text-wrap: balance;
  }

  .section-heading:first-of-type {
    margin-top: 0;
  }

  /* ── Section description ── */
  .section-description {
    font-size: var(--font-size-sm);
    color: var(--text-2);
    line-height: var(--line-height-relaxed, 1.625);
    margin: 0 0 var(--space-5);
    max-width: 40rem;
    text-wrap: pretty;
  }

  .section-description code {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs, 0.75rem);
    background: oklch(from var(--foreground) l c h / 0.1);
    padding: var(--space-0_5) var(--space-1);
    border-radius: var(--radius-sm);
  }
`;
