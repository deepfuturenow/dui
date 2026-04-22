import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-number-field")
export class DocsPageNumberField extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-page-layout tag="dui-number-field">

        <!-- ── Basic ────────────────────────────────────────── -->

        <dui-docs-demo label="Default">
          <dui-number-field default-value="100"></dui-number-field>
        </dui-docs-demo>

        <!-- ── Label positions ──────────────────────────────── -->

        <dui-docs-demo label="Label inside-left">
          <div style="display: flex; gap: var(--space-1); align-items: center;">
            <dui-number-field label="X" label-position="inside-left" default-value="100"></dui-number-field>
            <dui-number-field label="Y" label-position="inside-left" default-value="200"></dui-number-field>
            <dui-number-field label="Z" label-position="inside-left" default-value="300"></dui-number-field>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Label above">
          <dui-number-field label="Width" label-position="above" default-value="1024"></dui-number-field>
        </dui-docs-demo>

        <dui-docs-demo label="Label outside-left">
          <dui-number-field label="Squish" label-position="outside-left" default-value="166"></dui-number-field>
        </dui-docs-demo>

        <!-- ── Unit suffix ──────────────────────────────────── -->

        <dui-docs-demo label="Unit suffix">
          <div style="display: flex; gap: var(--space-2); align-items: center;">
            <dui-number-field default-value="45.0" step="0.1" unit="°"></dui-number-field>
            <dui-number-field default-value="100" unit="%"></dui-number-field>
            <dui-number-field default-value="16" unit="px"></dui-number-field>
          </div>
        </dui-docs-demo>

        <!-- ── Precision formatting ─────────────────────────── -->

        <dui-docs-demo label="Precision (auto from step)">
          <div style="display: flex; gap: var(--space-2); align-items: center;">
            <dui-number-field default-value="0.120" step="0.001" unit="m"></dui-number-field>
            <dui-number-field default-value="1.5" step="0.1"></dui-number-field>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Explicit precision (3 decimals)">
          <dui-number-field default-value="3.14159" .precision="${3}"></dui-number-field>
        </dui-docs-demo>

        <!-- ── Drag-to-scrub ────────────────────────────────── -->

        <dui-docs-demo label="Scrub on label, click on value">
          <dui-number-field
            label="X"
            label-position="inside-left"
            default-value="100"
            scrub-label
            click-value
          ></dui-number-field>
        </dui-docs-demo>

        <dui-docs-demo label="Scrub on field (drag anywhere)">
          <dui-number-field
            default-value="50"
            scrub-field
            click-value
          ></dui-number-field>
        </dui-docs-demo>

        <!-- ── Disabled ─────────────────────────────────────── -->

        <dui-docs-demo label="Disabled">
          <dui-number-field default-value="42" disabled></dui-number-field>
        </dui-docs-demo>

        <!-- ── With Field Label ─────────────────────────────── -->

        <dui-docs-demo label="With dui-field label">
          <dui-field>
            <span slot="label">Opacity</span>
            <dui-number-field default-value="100" min="0" max="100" unit="%"></dui-number-field>
          </dui-field>
        </dui-docs-demo>

      </docs-page-layout>
    `;
  }
}
