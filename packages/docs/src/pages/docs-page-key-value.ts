import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-key-value")
export class DocsPageKeyValue extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-key-value">

        <dui-docs-demo label="Stacked layout (default)">
          <div style="display: flex; gap: var(--space-6); max-width: 560px;">
            <dui-key-value label="Status" value="Active"></dui-key-value>
            <dui-key-value label="Region" value="North America"></dui-key-value>
            <dui-key-value label="Created" value="Jan 15, 2025"></dui-key-value>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With description">
          <div style="display: flex; gap: var(--space-6); max-width: 560px;">
            <dui-key-value label="Response Time" value="142ms" description="P95 over last 24h"></dui-key-value>
            <dui-key-value label="Error Rate" value="0.03%" description="30-day rolling average"></dui-key-value>
            <dui-key-value label="Throughput" value="2.4K rps" description="Peak last hour"></dui-key-value>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Inline layout">
          <div style="display: flex; flex-direction: column; gap: var(--space-0); max-width: 360px;">
            <dui-key-value layout="inline" label="Protocol" value="HTTPS/2"></dui-key-value>
            <dui-key-value layout="inline" label="Port" value="443"></dui-key-value>
            <dui-key-value layout="inline" label="Certificate" value="Let's Encrypt"></dui-key-value>
            <dui-key-value layout="inline" label="Expires" value="Mar 22, 2026"></dui-key-value>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="In a metadata grid">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4) var(--space-6); max-width: 560px;">
            <dui-key-value label="Total Events" value="1,284"></dui-key-value>
            <dui-key-value label="Active Sources" value="47"></dui-key-value>
            <dui-key-value label="Last Updated" value="2 min ago"></dui-key-value>
            <dui-key-value label="Region" value="MENA"></dui-key-value>
            <dui-key-value label="Classification" value="Confidential"></dui-key-value>
            <dui-key-value label="Analyst" value="J. Smith"></dui-key-value>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Custom value content (slot)">
          <div style="display: flex; gap: var(--space-6); max-width: 560px;">
            <dui-key-value label="Severity">
              <dui-badge variant="danger" appearance="filled">Critical</dui-badge>
            </dui-key-value>
            <dui-key-value label="Status">
              <dui-badge variant="primary">Active</dui-badge>
            </dui-key-value>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
