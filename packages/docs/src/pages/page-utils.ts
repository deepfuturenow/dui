import { html, type TemplateResult } from "lit";
import type { ComponentMeta } from "../component-registry.ts";

export const pageStyles = `
  h1 {
    font-size: var(--font-size-fluid-3xl, 2.5rem);
    font-weight: 700;
    letter-spacing: var(--letter-spacing-tighter, -0.03em);
    margin: 0 0 var(--space-2);
  }

  .description {
    font-family: var(--font-mono);
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--muted-foreground);
    margin: 0 0 var(--space-8, 2rem);
  }

  h2 {
    font-family: var(--font-mono);
    font-size: var(--font-size-lg, 1.125rem);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wider, 0.05em);
    color: var(--primary);
    margin: var(--space-8, 2rem) 0 var(--space-4);
  }

  .row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
  }

  .api-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm, 0.875rem);
    margin-bottom: var(--space-6, 1.5rem);
  }

  .api-table th {
    text-align: left;
    font-family: var(--font-mono);
    font-size: var(--font-size-xs, 0.75rem);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wider, 0.05em);
    color: var(--muted-foreground);
    padding: var(--space-2) var(--space-3);
    border-bottom: var(--border-width-thin, 1px) solid var(--border);
  }

  .api-table td {
    padding: var(--space-2) var(--space-3);
    border-bottom: var(--border-width-thin, 1px) solid var(--border);
    vertical-align: top;
  }

  .api-table code {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs, 0.75rem);
    background: var(--muted);
    padding: 0.1em 0.4em;
    border-radius: var(--radius-sm, 0.25rem);
  }

  .api-section-label {
    font-family: var(--font-mono);
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: 600;
    color: var(--muted-foreground);
    margin: var(--space-4) 0 var(--space-2);
  }
`;

export function renderApiTable(meta: ComponentMeta): TemplateResult {
  return html`
    ${meta.properties.length > 0 ? html`
      <div class="api-section-label">Properties</div>
      <table class="api-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${meta.properties.map((p) => html`
            <tr>
              <td><code>${p.name}</code></td>
              <td><code>${p.type}</code></td>
              <td>${p.default ? html`<code>${p.default}</code>` : "—"}</td>
              <td>${p.description}</td>
            </tr>
          `)}
        </tbody>
      </table>
    ` : ""}

    ${meta.events.length > 0 ? html`
      <div class="api-section-label">Events</div>
      <table class="api-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Detail</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${meta.events.map((e) => html`
            <tr>
              <td><code>${e.name}</code></td>
              <td>${e.detail ? html`<code>${e.detail}</code>` : "—"}</td>
              <td>${e.description}</td>
            </tr>
          `)}
        </tbody>
      </table>
    ` : ""}

    ${meta.slots.length > 0 ? html`
      <div class="api-section-label">Slots</div>
      <table class="api-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${meta.slots.map((s) => html`
            <tr>
              <td><code>${s.name}</code></td>
              <td>${s.description}</td>
            </tr>
          `)}
        </tbody>
      </table>
    ` : ""}

    ${meta.cssProperties.length > 0 ? html`
      <div class="api-section-label">CSS Custom Properties</div>
      <table class="api-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${meta.cssProperties.map((c) => html`
            <tr>
              <td><code>${c.name}</code></td>
              <td>${c.description}</td>
            </tr>
          `)}
        </tbody>
      </table>
    ` : ""}
  `;
}
