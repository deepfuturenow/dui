import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-forms")
export class DocsPageForms extends LitElement {
  protected override createRenderRoot() { return this; }

  #countryOptions = [
    { label: "United States", value: "us" },
    { label: "United Kingdom", value: "uk" },
    { label: "Germany", value: "de" },
  ];

  #topicOptions = [
    { label: "General inquiry", value: "general" },
    { label: "Technical support", value: "support" },
    { label: "Feedback", value: "feedback" },
  ];

  override connectedCallback(): void {
    super.connectedCallback();
    requestAnimationFrame(() => {
      const selects = this.querySelectorAll("dui-select");
      selects.forEach((sel: any) => {
        if (sel.placeholder === "Choose...") sel.options = this.#countryOptions;
        if (sel.placeholder === "Select a topic") sel.options = this.#topicOptions;
      });
    });
  }

  override render() {
    return html`
      <style>
        .forms-page h1 {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-1);
          margin: 0 0 var(--space-2);
        }
        .forms-page .lead {
          font-size: var(--font-size-base);
          color: var(--text-2);
          margin: 0 0 var(--space-8);
          line-height: var(--line-height-relaxed);
        }
        .forms-page h2 {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--text-1);
          margin: var(--space-8) 0 var(--space-3);
          padding-top: var(--space-4);
          border-top: var(--border-width-thin) solid var(--border);
        }
        .forms-page h2:first-of-type {
          margin-top: 0;
          border-top: none;
          padding-top: 0;
        }
        .forms-page p {
          font-size: var(--font-size-sm);
          color: var(--text-2);
          margin: 0 0 var(--space-4);
          line-height: var(--line-height-relaxed);
        }
      </style>

      <div class="forms-page">
        <h1>Forms</h1>
        <p class="lead">
          Compose accessible, validated forms using DUI field components. Fields provide
          automatic ARIA wiring and state tracking via named slots.
        </p>

        <h2>Basic Field Composition</h2>
        <p>
          Wrap a control with <code>&lt;dui-field&gt;</code> and use named slots for
          <code>label</code>, <code>description</code>, and <code>error</code>.
          ARIA attributes are wired automatically.
        </p>
        <dui-docs-demo demo-width="var(--space-96)" label="Label + Input + Description">
          <dui-field>
            <span slot="label">Email address</span>
            <dui-input type="email" placeholder="you@example.com"></dui-input>
            <span slot="description">We'll never share your email with anyone.</span>
          </dui-field>
        </dui-docs-demo>

        <h2>All Control Types</h2>
        <p>Every form control works inside a field.</p>
        <dui-docs-demo demo-width="var(--space-96)" label="Input">
          <dui-field>
            <span slot="label">Full name</span>
            <dui-input placeholder="Jane Doe"></dui-input>
          </dui-field>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="Textarea">
          <dui-field>
            <span slot="label">Message</span>
            <dui-textarea placeholder="Type your message..." resize="auto"></dui-textarea>
          </dui-field>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="Select">
          <dui-field>
            <span slot="label">Country</span>
            <dui-select placeholder="Choose..."></dui-select>
          </dui-field>
        </dui-docs-demo>

        <dui-docs-demo label="Checkbox">
          <dui-field>
            <dui-checkbox>I agree to the terms of service</dui-checkbox>
          </dui-field>
        </dui-docs-demo>

        <dui-docs-demo label="Switch (Horizontal)">
          <dui-field orientation="horizontal">
            <span slot="label">Dark mode</span>
            <dui-switch></dui-switch>
          </dui-field>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="Slider">
          <dui-field>
            <span slot="label">Volume</span>
            <dui-slider value="50" min="0" max="100"></dui-slider>
          </dui-field>
        </dui-docs-demo>

        <h2>Fieldsets</h2>
        <p>
          Use <code>&lt;dui-fieldset&gt;</code> with a <code>slot="legend"</code>
          to semantically group related fields.
        </p>
        <dui-docs-demo demo-width="var(--space-96)" label="Fieldset with Multiple Fields">
          <dui-fieldset>
            <span slot="legend">Shipping Address</span>
            <div style="display: flex; flex-direction: column; gap: var(--space-4);">
              <dui-field>
                <span slot="label">Street</span>
                <dui-input placeholder="123 Main St"></dui-input>
              </dui-field>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                <dui-field>
                  <span slot="label">City</span>
                  <dui-input placeholder="City"></dui-input>
                </dui-field>
                <dui-field>
                  <span slot="label">ZIP Code</span>
                  <dui-input placeholder="12345"></dui-input>
                </dui-field>
              </div>
            </div>
          </dui-fieldset>
        </dui-docs-demo>

        <h2>Validation States</h2>
        <p>
          Set <code>invalid</code> on the field to show errors. The error message is only
          visible when the field is invalid.
        </p>
        <dui-docs-demo demo-width="var(--space-96)" label="Valid vs Invalid">
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            <dui-field>
              <span slot="label">Email (valid)</span>
              <dui-input type="email" value="jane@example.com"></dui-input>
              <span slot="error">This won't show.</span>
            </dui-field>
            <dui-field invalid>
              <span slot="label">Email (invalid)</span>
              <dui-input type="email" value="not-an-email"></dui-input>
              <span slot="error">Please enter a valid email address.</span>
            </dui-field>
          </div>
        </dui-docs-demo>

        <h2>Full Form Example</h2>
        <p>A realistic form combining multiple field types and fieldsets.</p>
        <dui-docs-demo demo-width="var(--space-96)" label="Contact Form">
          <div style="display: flex; flex-direction: column; gap: var(--space-6);">
            <dui-fieldset>
              <span slot="legend">Your Details</span>
              <div style="display: flex; flex-direction: column; gap: var(--space-4);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                  <dui-field>
                    <span slot="label">First name</span>
                    <dui-input placeholder="Jane"></dui-input>
                  </dui-field>
                  <dui-field>
                    <span slot="label">Last name</span>
                    <dui-input placeholder="Doe"></dui-input>
                  </dui-field>
                </div>
                <dui-field>
                  <span slot="label">Email</span>
                  <dui-input type="email" placeholder="jane@example.com"></dui-input>
                  <span slot="description">We'll respond to this address.</span>
                </dui-field>
              </div>
            </dui-fieldset>

            <dui-fieldset>
              <span slot="legend">Message</span>
              <div style="display: flex; flex-direction: column; gap: var(--space-4);">
                <dui-field>
                  <span slot="label">Subject</span>
                  <dui-select placeholder="Select a topic"></dui-select>
                </dui-field>
                <dui-field>
                  <span slot="label">Your message</span>
                  <dui-textarea placeholder="How can we help?" resize="auto" max-height="200px"></dui-textarea>
                </dui-field>
              </div>
            </dui-fieldset>

            <dui-field>
              <dui-checkbox>Subscribe to our newsletter</dui-checkbox>
            </dui-field>

            <dui-button>Send Message</dui-button>
          </div>
        </dui-docs-demo>
      </div>
    `;
  }
}
