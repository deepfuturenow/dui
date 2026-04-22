import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-fieldset")
export class DocsPageFieldset extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-page-layout tag="dui-fieldset">
        <dui-docs-demo demo-width="var(--space-96)" label="Basic Fieldset">
          <dui-fieldset>
            <span slot="legend">Personal Information</span>
            <div style="display: flex; flex-direction: column; gap: var(--space-4);">
              <dui-field>
                <span slot="label">First Name</span>
                <dui-input placeholder="Jane"></dui-input>
              </dui-field>
              <dui-field>
                <span slot="label">Last Name</span>
                <dui-input placeholder="Doe"></dui-input>
              </dui-field>
            </div>
          </dui-fieldset>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="With Radio Group">
          <dui-fieldset>
            <span slot="legend">Notification Preference</span>
            <dui-radio-group value="email">
              <dui-radio value="email">Email</dui-radio>
              <dui-radio value="sms">SMS</dui-radio>
              <dui-radio value="push">Push notification</dui-radio>
            </dui-radio-group>
          </dui-fieldset>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="With Checkbox Group">
          <dui-fieldset>
            <span slot="legend">Interests</span>
            <dui-checkbox-group>
              <dui-checkbox value="tech">Technology</dui-checkbox>
              <dui-checkbox value="design">Design</dui-checkbox>
              <dui-checkbox value="science">Science</dui-checkbox>
            </dui-checkbox-group>
          </dui-fieldset>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="Disabled Fieldset">
          <dui-fieldset disabled>
            <span slot="legend">Disabled Group</span>
            <div style="display: flex; flex-direction: column; gap: var(--space-4);">
              <dui-field>
                <span slot="label">Name</span>
                <dui-input placeholder="Can't edit"></dui-input>
              </dui-field>
              <dui-field>
                <span slot="label">Email</span>
                <dui-input type="email" placeholder="Can't edit"></dui-input>
              </dui-field>
            </div>
          </dui-fieldset>
        </dui-docs-demo>

        <dui-docs-demo demo-width="var(--space-96)" label="Multiple Fieldsets">
          <div style="display: flex; flex-direction: column; gap: var(--space-6);">
            <dui-fieldset>
              <span slot="legend">Account</span>
              <div style="display: flex; flex-direction: column; gap: var(--space-4);">
                <dui-field>
                  <span slot="label">Username</span>
                  <dui-input placeholder="username"></dui-input>
                </dui-field>
                <dui-field>
                  <span slot="label">Password</span>
                  <dui-input type="password" placeholder="password"></dui-input>
                </dui-field>
              </div>
            </dui-fieldset>
            <dui-fieldset>
              <span slot="legend">Profile</span>
              <div style="display: flex; flex-direction: column; gap: var(--space-4);">
                <dui-field>
                  <span slot="label">Display Name</span>
                  <dui-input placeholder="Your public name"></dui-input>
                </dui-field>
                <dui-field>
                  <span slot="label">Bio</span>
                  <dui-textarea placeholder="Tell us about yourself..." resize="auto"></dui-textarea>
                </dui-field>
              </div>
            </dui-fieldset>
          </div>
        </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
