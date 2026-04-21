import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-field")
export class DocsPageField extends LitElement {
  protected override createRenderRoot() { return this; }

  override connectedCallback(): void {
    super.connectedCallback();
    requestAnimationFrame(() => {
      const sel = this.querySelector("dui-select") as any;
      if (sel) {
        sel.options = [
          { label: "United States", value: "us" },
          { label: "United Kingdom", value: "uk" },
          { label: "Germany", value: "de" },
        ];
      }
    });
  }

  override render() {
    return html`
      <docs-page-layout tag="dui-field">
        <dui-docs-demo demo-width="var(--space-96)" label="Basic Field">
          <dui-field>
            <span slot="label">Email</span>
            <dui-input type="email" placeholder="you@example.com"></dui-input>
            <span slot="description">We'll never share your email.</span>
          </dui-field>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="With Error">
          <dui-field invalid>
            <span slot="label">Username</span>
            <dui-input placeholder="Enter username"></dui-input>
            <span slot="error">Username is required.</span>
          </dui-field>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="With Description and Error">
          <dui-field invalid>
            <span slot="label">Password</span>
            <dui-input type="password" placeholder="Enter password"></dui-input>
            <span slot="description">Must be at least 8 characters.</span>
            <span slot="error">Password is too short.</span>
          </dui-field>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="Disabled">
          <dui-field disabled>
            <span slot="label">Disabled Field</span>
            <dui-input placeholder="Can't type here"></dui-input>
            <span slot="description">This field is disabled.</span>
          </dui-field>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="Horizontal Orientation">
          <dui-field orientation="horizontal">
            <span slot="label">Name</span>
            <dui-input placeholder="Jane Doe"></dui-input>
          </dui-field>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="With Textarea">
          <dui-field>
            <span slot="label">Bio</span>
            <dui-textarea placeholder="Tell us about yourself..." resize="auto"></dui-textarea>
            <span slot="description">Max 500 characters.</span>
          </dui-field>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="With Select">
          <dui-field>
            <span slot="label">Country</span>
            <dui-select placeholder="Select a country"></dui-select>
          </dui-field>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="Multiple Fields">
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            <dui-field>
              <span slot="label">First Name</span>
              <dui-input placeholder="Jane"></dui-input>
            </dui-field>
            <dui-field>
              <span slot="label">Last Name</span>
              <dui-input placeholder="Doe"></dui-input>
            </dui-field>
            <dui-field>
              <span slot="label">Email</span>
              <dui-input type="email" placeholder="jane@example.com"></dui-input>
              <span slot="description">Your primary email address.</span>
            </dui-field>
          </div>
        </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
