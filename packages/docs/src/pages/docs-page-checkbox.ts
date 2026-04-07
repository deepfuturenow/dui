import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-checkbox")
export class DocsPageCheckbox extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-checkbox" .additionalTags=${["dui-checkbox-group"]}>
        <dui-docs-demo label="States">
        <docs-row>
          <dui-checkbox>Unchecked</dui-checkbox>
        </docs-row>
        <docs-row>
          <dui-checkbox default-checked>Checked</dui-checkbox>
        </docs-row>
        <docs-row>
          <dui-checkbox indeterminate>Indeterminate</dui-checkbox>
        </docs-row>
        <docs-row>
          <dui-checkbox disabled>Disabled</dui-checkbox>
        </docs-row>
        <docs-row>
          <dui-checkbox disabled default-checked>Disabled checked</dui-checkbox>
        </docs-row>
        <docs-row>
          <dui-checkbox read-only default-checked>Read only</dui-checkbox>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Group">
        <dui-checkbox-group>
          <dui-checkbox value="apple">Apple</dui-checkbox>
          <dui-checkbox value="banana">Banana</dui-checkbox>
          <dui-checkbox value="cherry">Cherry</dui-checkbox>
        </dui-checkbox-group>
      </dui-docs-demo>

      <dui-docs-demo label="Group with select all">
        <dui-checkbox-group .allValues=${["red", "green", "blue"]}>
          <dui-checkbox parent value="all">Select all</dui-checkbox>
          <dui-checkbox value="red">Red</dui-checkbox>
          <dui-checkbox value="green">Green</dui-checkbox>
          <dui-checkbox value="blue">Blue</dui-checkbox>
        </dui-checkbox-group>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled group">
        <dui-checkbox-group disabled>
          <dui-checkbox value="a">Option A</dui-checkbox>
          <dui-checkbox value="b">Option B</dui-checkbox>
        </dui-checkbox-group>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
