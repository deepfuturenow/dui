import { html, type TemplateResult } from "lit";
import type { ComponentMeta } from "../component-registry.ts";

/** Renders the API reference tables for a component's properties, events, slots, and CSS properties. */
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

    ${meta.cssParts && meta.cssParts.length > 0 ? html`
      <div class="api-section-label">CSS Parts</div>
      <table class="api-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${meta.cssParts.map((p) => html`
            <tr>
              <td><code>${p.name}</code></td>
              <td>${p.description}</td>
            </tr>
          `)}
        </tbody>
      </table>
    ` : ""}
  `;
}
