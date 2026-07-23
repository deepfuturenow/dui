/**
 * Curated component config for the DUI → Claude Design generator.
 *
 * First wave = top 15 most-used components, hand-authored demo cards for quality.
 * To add more: append entries here (group + keywords + a `card` body, or rely on
 * the generator's themeAttributes autoCard fallback) and re-run gen.ts. The
 * incremental upload adds the new component dirs without touching existing ones.
 */

export interface Entry {
  tag: string;
  group: string;
  keywords?: string[];
  label?: string;
  /** "WxH" preview-card viewport. */
  viewport?: string;
  /** prompt.md usage example (JSX). Falls back to a generated one. */
  example?: string;
  /** Card demo body HTML. Overrides the generator's autoCard. */
  card?: string;
  cardCss?: string;
}

export const GROUP_ORDER = [
  "Actions", "Forms", "Data Display", "Navigation", "Overlays", "Feedback", "Layout",
];

export const COMPONENTS: Entry[] = [
  {
    tag: "dui-button", group: "Actions", keywords: ["cta", "submit", "action"],
    viewport: "1000x360",
    example: `<dui-button variant="primary">Save changes</dui-button>`,
    card: `<div class="dsc-demo">
    <dui-button variant="primary">Save changes</dui-button>
    <dui-button appearance="outline">Cancel</dui-button>
    <dui-button variant="danger" appearance="soft">Delete</dui-button>
    <dui-button appearance="ghost">Skip</dui-button>
    <dui-button appearance="link" variant="primary">Read the docs</dui-button>
  </div>
  <div class="dsc-demo" style="margin-top:var(--space-3)">
    <dui-button variant="primary" size="sm">sm</dui-button>
    <dui-button variant="primary" size="md">md</dui-button>
    <dui-button variant="primary" size="lg">lg</dui-button>
    <dui-button variant="primary" disabled>disabled</dui-button>
  </div>`,
  },
  {
    tag: "dui-badge", group: "Data Display", keywords: ["status", "pill", "tag", "label"],
    viewport: "900x260",
    example: `<dui-badge variant="primary">Active</dui-badge>`,
    card: `<div class="dsc-demo">
    <dui-badge>Neutral</dui-badge>
    <dui-badge variant="primary">Active</dui-badge>
    <dui-badge variant="danger">Failed</dui-badge>
    <dui-badge variant="primary" appearance="outline">Outline</dui-badge>
    <dui-badge variant="primary" appearance="soft">Soft</dui-badge>
    <dui-badge variant="primary" size="sm">sm</dui-badge>
  </div>`,
  },
  {
    tag: "dui-input", group: "Forms", keywords: ["text", "field", "form"],
    viewport: "720x360",
    example: `<dui-input placeholder="Email"></dui-input>`,
    card: `<div class="dsc-demo col" style="gap:var(--space-3);max-width:360px">
    <dui-input placeholder="Email"></dui-input>
    <dui-input type="password" placeholder="Password"></dui-input>
    <dui-input value="Prefilled value"></dui-input>
    <dui-input disabled placeholder="Disabled"></dui-input>
  </div>`,
  },
  {
    tag: "dui-textarea", group: "Forms", keywords: ["multiline", "text", "form"],
    viewport: "720x340",
    example: `<dui-textarea placeholder="Write a message..."></dui-textarea>`,
    card: `<div class="dsc-demo col" style="gap:var(--space-3);max-width:420px">
    <dui-textarea placeholder="Write a message..."></dui-textarea>
    <dui-textarea variant="ghost" placeholder="Ghost variant"></dui-textarea>
  </div>`,
  },
  {
    tag: "dui-select", group: "Forms", keywords: ["dropdown", "picker", "combobox"],
    viewport: "820x440",
    example: `const ref = React.useRef(null);
React.useEffect(() => { ref.current.options = [
  { label: 'Apple', value: 'apple' }, { label: 'Banana', value: 'banana' },
]; }, []);
return <dui-select ref={ref} placeholder="Pick a fruit..." />;`,
    card: `<div class="dsc-demo">
    <dui-select id="sel1" placeholder="Pick a fruit..."></dui-select>
    <dui-select id="sel2" value="cherry" placeholder="Pick a fruit..."></dui-select>
    <dui-select disabled placeholder="Disabled"></dui-select>
  </div>
  <script type="module">
    const fruit = [
      { label: "Apple", value: "apple" }, { label: "Banana", value: "banana" },
      { label: "Cherry", value: "cherry" }, { label: "Dragonfruit", value: "dragonfruit" },
      { label: "Elderberry", value: "elderberry" },
    ];
    customElements.whenDefined("dui-select").then(() => {
      for (const id of ["sel1", "sel2"]) { const el = document.getElementById(id); if (el) el.options = fruit; }
      const s3 = document.querySelector("dui-select[disabled]"); if (s3) s3.options = fruit;
    });
  </script>`,
  },
  {
    tag: "dui-checkbox", group: "Forms", keywords: ["check", "toggle", "form"],
    viewport: "720x320",
    example: `<dui-checkbox>Accept terms</dui-checkbox>`,
    card: `<div class="dsc-demo col" style="gap:var(--space-2)">
    <dui-checkbox>Accept terms</dui-checkbox>
    <dui-checkbox default-checked>Subscribed</dui-checkbox>
    <dui-checkbox indeterminate>Partially selected</dui-checkbox>
    <dui-checkbox disabled>Disabled</dui-checkbox>
  </div>`,
  },
  {
    tag: "dui-switch", group: "Forms", keywords: ["toggle", "on off", "form"],
    viewport: "700x300",
    example: `<dui-switch default-checked>Notifications</dui-switch>`,
    card: `<div class="dsc-demo col" style="gap:var(--space-3)">
    <dui-switch>Wi-Fi</dui-switch>
    <dui-switch default-checked>Notifications</dui-switch>
    <dui-switch disabled>Disabled</dui-switch>
  </div>`,
  },
  {
    tag: "dui-radio-group", group: "Forms", keywords: ["radio", "choice", "form"],
    viewport: "700x320",
    example: `<dui-radio-group default-value="apple">
  <dui-radio value="apple">Apple</dui-radio>
  <dui-radio value="banana">Banana</dui-radio>
</dui-radio-group>`,
    card: `<dui-radio-group default-value="apple" class="dsc-demo col" style="gap:var(--space-2)">
    <dui-radio value="apple">Apple</dui-radio>
    <dui-radio value="banana">Banana</dui-radio>
    <dui-radio value="cherry">Cherry</dui-radio>
  </dui-radio-group>`,
  },
  {
    tag: "dui-avatar", group: "Data Display", keywords: ["user", "profile", "image"],
    viewport: "600x260",
    example: `<dui-avatar>JC</dui-avatar>`,
    card: `<div class="dsc-demo">
    <dui-avatar>JC</dui-avatar>
    <dui-avatar size="var(--space-10)">AB</dui-avatar>
    <dui-avatar size="var(--space-12)">DF</dui-avatar>
  </div>`,
  },
  {
    tag: "dui-card", group: "Layout", keywords: ["surface", "container", "panel"],
    viewport: "720x340",
    example: `<dui-card><h3>Title</h3><p>Content</p></dui-card>`,
    card: `<dui-card style="max-width:360px;padding:var(--space-4)">
    <h3 style="margin:0 0 var(--space-1);font-size:var(--text-lg);font-weight:600">Project Atlas</h3>
    <p style="margin:0;color:var(--text-2);font-size:var(--text-sm)">A surface container with border and radius — composes freely with any content.</p>
  </dui-card>`,
  },
  {
    tag: "dui-tabs", group: "Navigation", keywords: ["tab", "segment", "panel"],
    viewport: "820x380",
    example: `<dui-tabs default-value="account">
  <dui-tabs-list>
    <dui-tab value="account">Account</dui-tab>
    <dui-tab value="password">Password</dui-tab>
    <dui-tabs-indicator></dui-tabs-indicator>
  </dui-tabs-list>
  <dui-tabs-panel value="account">Account settings</dui-tabs-panel>
  <dui-tabs-panel value="password">Password settings</dui-tabs-panel>
</dui-tabs>`,
    card: `<dui-tabs default-value="account" style="width:100%;max-width:480px">
    <dui-tabs-list>
      <dui-tab value="account">Account</dui-tab>
      <dui-tab value="password">Password</dui-tab>
      <dui-tab value="settings">Settings</dui-tab>
      <dui-tabs-indicator></dui-tabs-indicator>
    </dui-tabs-list>
    <dui-tabs-panel value="account"><p style="color:var(--text-2)">Manage your account.</p></dui-tabs-panel>
    <dui-tabs-panel value="password"><p style="color:var(--text-2)">Change your password.</p></dui-tabs-panel>
    <dui-tabs-panel value="settings"><p style="color:var(--text-2)">Other settings.</p></dui-tabs-panel>
  </dui-tabs>`,
  },
  {
    tag: "dui-dialog", group: "Overlays", keywords: ["modal", "popup", "overlay"],
    viewport: "700x360",
    example: `<dui-dialog>
  <dui-dialog-trigger><dui-button variant="primary">Open</dui-button></dui-dialog-trigger>
  <dui-dialog-popup width="28rem">
    <h2 slot="title">Confirm</h2>
    <p slot="description">Are you sure?</p>
    <dui-dialog-close><dui-button variant="primary">OK</dui-button></dui-dialog-close>
  </dui-dialog-popup>
</dui-dialog>`,
    card: `<dui-dialog>
    <dui-dialog-trigger><dui-button variant="primary">Open dialog</dui-button></dui-dialog-trigger>
    <dui-dialog-popup width="28rem">
      <h2 slot="title" style="margin:0 0 var(--space-2);font-size:var(--text-lg);font-weight:600">Confirm changes</h2>
      <p slot="description" style="margin:0;color:var(--text-2);font-size:var(--text-sm)">A real DUI dialog rendered through a portal, with backdrop and focus trap.</p>
      <div style="display:flex;gap:var(--space-2);justify-content:flex-end;margin-top:var(--space-5)">
        <dui-dialog-close><dui-button appearance="outline">Cancel</dui-button></dui-dialog-close>
        <dui-dialog-close><dui-button variant="primary">Confirm</dui-button></dui-dialog-close>
      </div>
    </dui-dialog-popup>
  </dui-dialog>`,
  },
  {
    tag: "dui-tooltip", group: "Overlays", keywords: ["hint", "hover", "popup"],
    viewport: "600x300",
    example: `<dui-tooltip>
  <dui-tooltip-trigger><dui-button appearance="outline">Hover</dui-button></dui-tooltip-trigger>
  <dui-tooltip-popup>Helpful hint</dui-tooltip-popup>
</dui-tooltip>`,
    card: `<dui-tooltip>
    <dui-tooltip-trigger><dui-button appearance="outline">Hover me</dui-button></dui-tooltip-trigger>
    <dui-tooltip-popup>A real DUI tooltip</dui-tooltip-popup>
  </dui-tooltip>`,
  },
  {
    tag: "dui-progress", group: "Feedback", keywords: ["bar", "loading", "meter"],
    viewport: "720x300",
    example: `<dui-progress value="66"></dui-progress>`,
    card: `<div class="dsc-demo col" style="gap:var(--space-4);max-width:360px;width:100%">
    <dui-progress value="33" style="width:100%"></dui-progress>
    <dui-progress value="66" style="width:100%"></dui-progress>
    <dui-progress value="100" style="width:100%"></dui-progress>
    <dui-progress style="width:100%"></dui-progress>
  </div>`,
  },
  {
    tag: "dui-spinner", group: "Feedback", keywords: ["loading", "busy", "loader"],
    viewport: "500x240",
    example: `<dui-spinner size="md"></dui-spinner>`,
    card: `<div class="dsc-demo" style="gap:var(--space-5)">
    <dui-spinner size="sm"></dui-spinner>
    <dui-spinner size="md"></dui-spinner>
    <dui-spinner size="lg"></dui-spinner>
  </div>`,
  },
];
