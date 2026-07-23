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
  /** Extra prose appended to the component's .prompt.md (## Notes). */
  notes?: string;
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
  {
    tag: "dui-slider", group: "Forms", keywords: ["range", "value", "track"],
    viewport: "760x360",
    example: `<dui-slider value="50"></dui-slider>`,
    card: `<div class="dsc-demo col" style="gap:var(--space-6);max-width:22rem;width:100%">
    <dui-slider value="50" style="width:100%"></dui-slider>
    <dui-slider value="30" variant="field" style="width:100%"></dui-slider>
    <dui-slider value="70" disabled style="width:100%"></dui-slider>
  </div>`,
  },
  {
    tag: "dui-number-field", group: "Forms", keywords: ["number", "numeric", "input", "stepper"],
    viewport: "700x320",
    example: `<dui-number-field default-value="100" min="0" max="1000"></dui-number-field>`,
    card: `<div class="dsc-demo col" style="gap:var(--space-3)">
    <dui-number-field default-value="100"></dui-number-field>
    <dui-number-field default-value="5" min="0" max="10"></dui-number-field>
  </div>`,
  },
  {
    tag: "dui-toggle", group: "Actions", keywords: ["toggle", "pressed", "icon button"],
    viewport: "760x280",
    example: `<dui-toggle default-pressed>Bold</dui-toggle>`,
    card: `<div class="dsc-demo">
    <dui-toggle>Bold</dui-toggle>
    <dui-toggle default-pressed>Italic</dui-toggle>
    <dui-toggle size="sm">sm</dui-toggle>
    <dui-toggle size="lg">lg</dui-toggle>
    <dui-toggle disabled>Disabled</dui-toggle>
  </div>`,
  },
  {
    tag: "dui-toggle-group", group: "Actions", keywords: ["toggle", "segmented", "group"],
    viewport: "760x300",
    example: `<dui-toggle-group type="single"><dui-toggle value="a">A</dui-toggle><dui-toggle value="b">B</dui-toggle></dui-toggle-group>`,
    card: `<div class="dsc-demo col" style="gap:var(--space-4)">
    <dui-toggle-group type="single" default-value='["center"]'>
      <dui-toggle value="left">Left</dui-toggle>
      <dui-toggle value="center">Center</dui-toggle>
      <dui-toggle value="right">Right</dui-toggle>
    </dui-toggle-group>
    <dui-toggle-group type="multiple" default-value='["bold","italic"]'>
      <dui-toggle value="bold">Bold</dui-toggle>
      <dui-toggle value="italic">Italic</dui-toggle>
      <dui-toggle value="underline">Underline</dui-toggle>
    </dui-toggle-group>
  </div>`,
  },
  {
    tag: "dui-separator", group: "Layout", keywords: ["divider", "rule", "hr"],
    viewport: "700x300",
    example: `<dui-separator></dui-separator>`,
    card: `<div class="dsc-demo col" style="gap:var(--space-4);width:100%;max-width:24rem">
    <div style="color:var(--text-2)">Section one</div>
    <dui-separator style="width:100%"></dui-separator>
    <div style="color:var(--text-2)">Section two</div>
    <div class="dsc-demo" style="align-items:center;height:2rem">
      <span>Left</span>
      <dui-separator orientation="vertical" style="height:1.5rem"></dui-separator>
      <span>Right</span>
    </div>
  </div>`,
  },
  {
    tag: "dui-split-button", group: "Actions", keywords: ["button", "menu", "dropdown", "action"],
    viewport: "760x320",
    example: `<dui-split-button variant="primary">Save<dui-menu-item slot="menu">Save As…</dui-menu-item></dui-split-button>`,
    card: `<div class="dsc-demo">
    <dui-split-button variant="primary">Save
      <dui-menu-item slot="menu">Save As…</dui-menu-item>
      <dui-menu-item slot="menu">Save Draft</dui-menu-item>
      <dui-menu-item slot="menu">Save as Template</dui-menu-item>
    </dui-split-button>
    <dui-split-button appearance="outline">Export
      <dui-menu-item slot="menu">Export PDF</dui-menu-item>
      <dui-menu-item slot="menu">Export CSV</dui-menu-item>
    </dui-split-button>
  </div>`,
  },
  {
    tag: "dui-field", group: "Forms", keywords: ["form field", "label", "validation"],
    viewport: "720x360",
    example: `<dui-field><span slot="label">Email</span><dui-input type="email"></dui-input></dui-field>`,
    card: `<div class="dsc-demo col" style="gap:var(--space-4);max-width:22rem;width:100%">
    <dui-field>
      <span slot="label">Email</span>
      <dui-input type="email" placeholder="you@example.com"></dui-input>
      <span slot="description">We will never share your email.</span>
    </dui-field>
    <dui-field orientation="horizontal">
      <span slot="label">Enabled</span>
      <dui-switch default-checked></dui-switch>
    </dui-field>
  </div>`,
  },
  {
    tag: "dui-fieldset", group: "Forms", keywords: ["form", "group", "legend"],
    viewport: "720x380",
    example: `<dui-fieldset><span slot="legend">Info</span><dui-field><span slot="label">Name</span><dui-input></dui-input></dui-field></dui-fieldset>`,
    card: `<dui-fieldset style="max-width:24rem">
    <span slot="legend">Personal information</span>
    <div style="display:flex;flex-direction:column;gap:var(--space-4)">
      <dui-field><span slot="label">First name</span><dui-input placeholder="Jane"></dui-input></dui-field>
      <dui-field><span slot="label">Last name</span><dui-input placeholder="Doe"></dui-input></dui-field>
    </div>
  </dui-fieldset>`,
  },
{ tag: "dui-accordion", group: "Layout", keywords: ["disclosure", "expandable", "faq", "collapse"], viewport: "1000x460",
  example: '<dui-accordion default-value=\'["item-1"]\'><dui-accordion-item value="item-1"><span slot="trigger">Is it accessible?</span>Yes. It adheres to the WAI-ARIA design pattern.</dui-accordion-item></dui-accordion>',
  card: '<div class="dsc-demo col" style="max-width:26rem"><dui-accordion multiple default-value=\'["item-1"]\'><dui-accordion-item value="item-1"><span slot="trigger">Is it accessible?</span>Yes. It adheres to the WAI-ARIA design pattern.</dui-accordion-item><dui-accordion-item value="item-2"><span slot="trigger">Is it styled?</span>Yes. It comes with default styles via the theme system.</dui-accordion-item><dui-accordion-item value="item-3"><span slot="trigger">Is it animated?</span>Yes. It uses height transitions with reduced-motion support.</dui-accordion-item></dui-accordion></div>' },

{ tag: "dui-collapsible", group: "Layout", keywords: ["disclosure", "expand", "toggle", "show more"], viewport: "1000x360",
  example: '<dui-collapsible><span slot="trigger">Click to expand</span><div style="padding-top:var(--space-2)">Hidden content revealed on toggle.</div></dui-collapsible>',
  card: '<div class="dsc-demo col" style="max-width:26rem"><dui-collapsible default-open><span slot="trigger">Started open</span><div style="padding-top:var(--space-2);color:var(--text-2)">This panel animates its height when toggled, with reduced-motion support.</div></dui-collapsible><dui-collapsible><span slot="trigger">Click to expand</span><div style="padding-top:var(--space-2);color:var(--text-2)">Standalone disclosure widget with a chevron indicator.</div></dui-collapsible></div>' },

{ tag: "dui-scroll-area", group: "Layout", keywords: ["scrollbar", "overflow", "viewport", "fade"], viewport: "1000x360",
  example: '<dui-scroll-area max-height="150px" style="border:var(--border-width-thin) solid var(--border);border-radius:var(--radius-md)"><div style="padding:var(--space-3)">Long scrollable content...</div></dui-scroll-area>',
  card: '<div class="dsc-demo"><dui-scroll-area max-height="180px" fade style="width:20rem;border:var(--border-width-thin) solid var(--border);border-radius:var(--radius-md)"><div style="padding:var(--space-3);display:flex;flex-direction:column;gap:var(--space-2)"><div>Row 1 — Aurora</div><div>Row 2 — Basalt</div><div>Row 3 — Cinder</div><div>Row 4 — Delta</div><div>Row 5 — Ember</div><div>Row 6 — Flint</div><div>Row 7 — Granite</div><div>Row 8 — Harbor</div><div>Row 9 — Indigo</div><div>Row 10 — Juniper</div><div>Row 11 — Kestrel</div><div>Row 12 — Lumen</div><div>Row 13 — Marble</div><div>Row 14 — Nimbus</div></div></dui-scroll-area></div>' },

{ tag: "dui-card-grid", group: "Layout", keywords: ["grid", "responsive", "columns", "cards"], viewport: "1000x420",
  example: '<dui-card-grid columns="3"><div>Card 1</div><div>Card 2</div><div>Card 3</div></dui-card-grid>',
  card: '<div class="dsc-demo col" style="width:100%"><dui-card-grid columns="3" style="width:100%"><div style="padding:var(--space-4);border:var(--border-width-thin) solid var(--border);border-radius:var(--radius-md);background:var(--surface-1)">Card 1</div><div style="padding:var(--space-4);border:var(--border-width-thin) solid var(--border);border-radius:var(--radius-md);background:var(--surface-1)">Card 2</div><div style="padding:var(--space-4);border:var(--border-width-thin) solid var(--border);border-radius:var(--radius-md);background:var(--surface-1)">Card 3</div><div style="padding:var(--space-4);border:var(--border-width-thin) solid var(--border);border-radius:var(--radius-md);background:var(--surface-1)">Card 4</div><div style="padding:var(--space-4);border:var(--border-width-thin) solid var(--border);border-radius:var(--radius-md);background:var(--surface-1)">Card 5</div><div style="padding:var(--space-4);border:var(--border-width-thin) solid var(--border);border-radius:var(--radius-md);background:var(--surface-1)">Card 6</div></dui-card-grid></div>' },

{ tag: "dui-splitter", group: "Layout", keywords: ["resizable", "panes", "panels", "drag", "split view"], viewport: "1000x360",
  example: '<dui-splitter><dui-splitter-panel panel-id="a">Panel A</dui-splitter-panel><dui-splitter-handle></dui-splitter-handle><dui-splitter-panel panel-id="b">Panel B</dui-splitter-panel></dui-splitter>',
  card: '<div class="dsc-demo col" style="width:100%"><style>.sp-frame{width:100%;height:200px;border:var(--border-width-thin) solid var(--border);border-radius:var(--radius-md);overflow:hidden;background:var(--surface-1)}.sp-frame dui-splitter-panel::part(root){padding:var(--space-3);font-size:var(--text-sm);color:var(--text-2);height:100%;overflow:auto}.sp-frame dui-splitter-panel:nth-of-type(even)::part(root){background:var(--surface-2)}</style><div class="sp-frame"><dui-splitter><dui-splitter-panel panel-id="a" default-size="25" min-size="15" max-size="40">Sidebar (drag the seam)</dui-splitter-panel><dui-splitter-handle></dui-splitter-handle><dui-splitter-panel panel-id="b">Main content</dui-splitter-panel><dui-splitter-handle></dui-splitter-handle><dui-splitter-panel panel-id="c" min-size="15">Aside</dui-splitter-panel></dui-splitter></div></div>' },

{ tag: "dui-trunc", group: "Layout", keywords: ["truncate", "ellipsis", "clamp", "overflow"], viewport: "1000x360",
  example: '<dui-trunc max-width="20rem">This is a long piece of text that will be truncated with an ellipsis.</dui-trunc>',
  card: '<div class="dsc-demo col" style="align-items:flex-start"><dui-trunc max-width="16rem">This single line of text is truncated with an ellipsis when it exceeds the max-width.</dui-trunc><dui-trunc max-lines="2" max-width="18rem">Multi-line clamping keeps up to two lines of this longer passage visible before adding a trailing ellipsis to indicate that the content continues beyond what is shown here.</dui-trunc></div>' },

{ tag: "dui-icon", group: "Data Display", keywords: ["icon", "svg", "symbol", "glyph", "lucide"],
  example: `<dui-icon style="--icon-size: var(--space-5)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></dui-icon>`,
  notes: `Source icons from **Lucide** (https://lucide.dev) — the full ~1,600-icon set. Names are kebab-case (\`arrow-right\`, \`chevron-down\`, \`circle-check\`); browse them at lucide.dev/icons and use exact names. Fetch any icon's exact SVG from its stable URL \`https://unpkg.com/lucide-static/icons/<name>.svg\`, or emit the equivalent inline SVG. Inline it into the default slot with \`fill="none"\`, \`stroke="currentColor"\`, \`stroke-width="2"\`, round caps/joins. Size via \`--icon-size\`, color via \`--icon-color\` (defaults to \`currentColor\`, so an icon inherits the surrounding text or intent color). Composes inside other components too — a leading icon in \`<dui-button>\`, \`<dui-toggle slot="icon">\`, menu items, etc.`,
  card: `<div class="dsc-demo col" style="gap:var(--space-3);align-items:flex-start">
    <div class="dsc-demo" style="gap:var(--space-4);align-items:center">
      <dui-icon style="--icon-size:var(--space-6)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></dui-icon>
      <dui-icon style="--icon-size:var(--space-6)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></dui-icon>
      <dui-icon style="--icon-size:var(--space-6)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></dui-icon>
      <dui-icon style="--icon-size:var(--space-6);--icon-color:var(--accent)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></dui-icon>
      <dui-icon style="--icon-size:var(--space-6);--icon-color:var(--destructive)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></dui-icon>
    </div>
    <div style="font-family:var(--font-mono);font-size:var(--text-2xs);color:var(--text-3)">Lucide icons (24×24, stroke=currentColor) slotted into &lt;dui-icon&gt;</div>
  </div>`,
  viewport: "760x300",
},
{ tag: "dui-popover", group: "Overlays", keywords: ["popover", "popup", "overlay", "flyout"], viewport: "600x420",
  example: '<dui-popover><dui-popover-trigger><dui-button appearance="outline">Open</dui-button></dui-popover-trigger><dui-popover-popup>Popover content</dui-popover-popup></dui-popover>',
  card: '<div class="dsc-demo"><dui-popover><dui-popover-trigger><dui-button appearance="outline">Open popover</dui-button></dui-popover-trigger><dui-popover-popup><span style="display:flex;flex-direction:column;gap:var(--space-4);max-width:var(--space-72);"><strong style="font-size:var(--text-xs);font-weight:var(--font-weight-semibold);">Popover title</strong><span style="color:var(--text-2);font-size:var(--text-xs);line-height:var(--text-xs--line-height);">A real DUI popover. Click outside to close, or use the button below.</span><dui-popover-close><dui-button appearance="soft" size="sm">Close</dui-button></dui-popover-close></span></dui-popover-popup></dui-popover></div>' },
{ tag: "dui-preview-card", group: "Overlays", keywords: ["preview", "hovercard", "link preview", "popup"], viewport: "640x400",
  example: '<dui-preview-card><dui-preview-card-trigger><a href="#">Strait of Georgia</a></dui-preview-card-trigger><dui-preview-card-popup>Preview content</dui-preview-card-popup></dui-preview-card>',
  card: '<div class="dsc-demo"><span style="color:var(--text-2);font-size:var(--text-sm);line-height:var(--text-sm--line-height);max-width:var(--space-96);">Hover the <dui-preview-card><dui-preview-card-trigger><a href="#" style="color:var(--text-1);text-decoration:underline;text-underline-offset:1px;">Strait of Georgia</a></dui-preview-card-trigger><dui-preview-card-popup><span style="display:flex;flex-direction:column;gap:var(--space-4);max-width:var(--space-72);"><strong style="font-size:var(--text-xs);font-weight:var(--font-weight-semibold);">Strait of Georgia</strong><span style="color:var(--text-2);font-size:var(--text-xs);line-height:var(--text-xs--line-height);">An arm of the Salish Sea between Vancouver Island and the mainland coast of British Columbia, Canada.</span></span></dui-preview-card-popup></dui-preview-card> link to preview it.</span></div>' },
{ tag: "dui-alert-dialog", group: "Overlays", keywords: ["alert", "dialog", "confirm", "modal", "destructive"], viewport: "640x460",
  example: '<dui-alert-dialog><dui-alert-dialog-trigger><dui-button variant="danger">Delete</dui-button></dui-alert-dialog-trigger><dui-alert-dialog-popup><span slot="title">Are you sure?</span><span slot="description">This cannot be undone.</span><dui-alert-dialog-close><dui-button appearance="outline">Cancel</dui-button></dui-alert-dialog-close></dui-alert-dialog-popup></dui-alert-dialog>',
  card: '<div class="dsc-demo"><dui-alert-dialog><dui-alert-dialog-trigger><dui-button variant="danger">Delete account</dui-button></dui-alert-dialog-trigger><dui-alert-dialog-popup><span slot="title">Are you absolutely sure?</span><span slot="description">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</span><div style="display:flex;gap:var(--space-2);justify-content:flex-end;"><dui-alert-dialog-close><dui-button appearance="outline">Cancel</dui-button></dui-alert-dialog-close><dui-alert-dialog-close><dui-button variant="danger">Yes, delete account</dui-button></dui-alert-dialog-close></div></dui-alert-dialog-popup></dui-alert-dialog></div>' },
{ tag: "dui-menu", group: "Overlays", keywords: ["menu", "dropdown", "context menu", "actions"], viewport: "520x440",
  example: '<dui-menu><dui-button slot="trigger" appearance="outline">Open Menu</dui-button><dui-menu-item>Edit</dui-menu-item><dui-menu-item>Duplicate</dui-menu-item><dui-menu-item variant="danger">Delete</dui-menu-item></dui-menu>',
  card: '<div class="dsc-demo"><dui-menu><dui-button slot="trigger" appearance="outline">Open menu</dui-button><dui-menu-item>Edit</dui-menu-item><dui-menu-item>Duplicate</dui-menu-item><dui-menu-item>Archive</dui-menu-item><dui-separator></dui-separator><dui-menu-item disabled>Move</dui-menu-item><dui-menu-item variant="danger">Delete</dui-menu-item></dui-menu></div>' },
{ tag: "dui-toast", group: "Feedback", keywords: ["toast", "notification", "snackbar", "sonner"], viewport: "480x380",
  example: '<dui-toast-region hotkey="none" style="position:relative;inset:auto;width:100%;"><dui-toast type="success" duration="0"><span slot="title">Profile updated</span><span slot="description">Display name set to Alex Carter.</span></dui-toast></dui-toast-region>',
  card: "<div class='dsc-demo col' style='gap:var(--space-4);'><dui-button id='dui-toast-demo-btn' appearance='outline'>Show toast</dui-button><dui-toast-region id='dui-toast-demo-region' label='Demo notifications' hotkey='none' style='position:relative;inset:auto;width:100%;min-height:var(--space-24);'></dui-toast-region><script type='module'>const b=document.getElementById('dui-toast-demo-btn');const r=document.getElementById('dui-toast-demo-region');b&&b.addEventListener('click',function(){const t=document.createElement('dui-toast');t.setAttribute('type','success');t.setAttribute('duration','4000');const ti=document.createElement('span');ti.setAttribute('slot','title');ti.textContent='Profile updated';const de=document.createElement('span');de.setAttribute('slot','description');de.textContent='Display name set to Alex Carter.';t.appendChild(ti);t.appendChild(de);r.appendChild(t);});<\/script></div>" },
{ tag: "dui-toast-region", group: "Feedback", keywords: ["toast", "region", "notifications", "stack", "provider"], viewport: "520x440",
  example: '<dui-toast-region hotkey="none" style="position:relative;inset:auto;width:100%;"><dui-toast type="success" duration="0"><span slot="title">Saved</span></dui-toast><dui-toast type="info" duration="0"><span slot="title">Synced</span></dui-toast></dui-toast-region>',
  card: "<div class='dsc-demo col' style='gap:var(--space-4);'><dui-button id='dui-region-demo-btn' appearance='outline'>Add notification</dui-button><dui-toast-region id='dui-region-demo' label='Demo notifications' hotkey='none' style='position:relative;inset:auto;width:100%;min-height:var(--space-32);'><dui-toast type='success' duration='0'><span slot='title'>Profile updated</span><span slot='description'>Display name set to Alex Carter.</span></dui-toast><dui-toast type='info' duration='0'><span slot='title'>New release available</span><span slot='description'>v2.4.0 is ready to install.</span></dui-toast></dui-toast-region><script type='module'>const b=document.getElementById('dui-region-demo-btn');const r=document.getElementById('dui-region-demo');b&&b.addEventListener('click',function(){const t=document.createElement('dui-toast');t.setAttribute('type','warning');t.setAttribute('duration','0');const ti=document.createElement('span');ti.setAttribute('slot','title');ti.textContent='Heads up';const de=document.createElement('span');de.setAttribute('slot','description');de.textContent='This action is irreversible.';t.appendChild(ti);t.appendChild(de);r.appendChild(t);});<\/script></div>" },
{ tag: "dui-breadcrumb", group: "Navigation", keywords: ["breadcrumb", "trail", "navigation", "path"], viewport: "820x300",
  example: '<dui-breadcrumb><dui-breadcrumb-item><dui-breadcrumb-link><a href="#">Home</a></dui-breadcrumb-link></dui-breadcrumb-item><dui-breadcrumb-separator></dui-breadcrumb-separator><dui-breadcrumb-item><dui-breadcrumb-page>Current</dui-breadcrumb-page></dui-breadcrumb-item></dui-breadcrumb>',
  card: '<div class="dsc-demo"><dui-breadcrumb><dui-breadcrumb-item><dui-breadcrumb-link><a href="#/home">Home</a></dui-breadcrumb-link></dui-breadcrumb-item><dui-breadcrumb-separator></dui-breadcrumb-separator><dui-breadcrumb-item><dui-breadcrumb-link><a href="#/components">Components</a></dui-breadcrumb-link></dui-breadcrumb-item><dui-breadcrumb-separator></dui-breadcrumb-separator><dui-breadcrumb-item><dui-breadcrumb-page>Breadcrumb</dui-breadcrumb-page></dui-breadcrumb-item></dui-breadcrumb></div>' },

{ tag: "dui-menubar", group: "Navigation", keywords: ["menubar", "menu", "app menu", "toolbar"], viewport: "820x360",
  example: '<dui-menubar><dui-menu><dui-button slot="trigger" appearance="ghost" size="sm">File</dui-button><dui-menu-item>New File</dui-menu-item><dui-menu-item>Open</dui-menu-item></dui-menu></dui-menubar>',
  card: '<div class="dsc-demo"><dui-menubar><dui-menu><dui-button slot="trigger" appearance="ghost" size="sm">File</dui-button><dui-menu-item>New File</dui-menu-item><dui-menu-item>Open</dui-menu-item><dui-menu-item>Save</dui-menu-item></dui-menu><dui-menu><dui-button slot="trigger" appearance="ghost" size="sm">Edit</dui-button><dui-menu-item>Undo</dui-menu-item><dui-menu-item>Redo</dui-menu-item><dui-menu-item>Cut</dui-menu-item><dui-menu-item>Copy</dui-menu-item></dui-menu><dui-menu><dui-button slot="trigger" appearance="ghost" size="sm">View</dui-button><dui-menu-item>Zoom In</dui-menu-item><dui-menu-item>Zoom Out</dui-menu-item><dui-menu-item>Reset Zoom</dui-menu-item></dui-menu></dui-menubar></div>' },

{ tag: "dui-command", group: "Overlays", keywords: ["command", "command palette", "search", "cmdk", "spotlight"], viewport: "640x520",
  example: '<dui-command style="border:1px solid var(--border);border-radius:var(--radius-lg);max-width:450px"><dui-command-input placeholder="Type a command..."></dui-command-input><dui-command-list><dui-command-empty>No results found.</dui-command-empty><dui-command-group heading="Suggestions"><dui-command-item value="calendar">Calendar</dui-command-item></dui-command-group></dui-command-list></dui-command>',
  card: '<div class="dsc-demo"><dui-command style="border:1px solid var(--border);border-radius:var(--radius-lg);width:100%;max-width:450px"><dui-command-input placeholder="Type a command or search..."></dui-command-input><dui-command-list><dui-command-empty>No results found.</dui-command-empty><dui-command-group heading="Suggestions"><dui-command-item value="calendar">Calendar</dui-command-item><dui-command-item value="search">Search Emoji</dui-command-item><dui-command-item value="calculator">Calculator</dui-command-item></dui-command-group><dui-command-separator></dui-command-separator><dui-command-group heading="Settings"><dui-command-item value="profile">Profile<dui-command-shortcut>⌘P</dui-command-shortcut></dui-command-item><dui-command-item value="billing">Billing<dui-command-shortcut>⌘B</dui-command-shortcut></dui-command-item><dui-command-item value="settings">Settings<dui-command-shortcut>⌘,</dui-command-shortcut></dui-command-item></dui-command-group></dui-command-list></dui-command></div>' },

{ tag: "dui-stepper", group: "Navigation", keywords: ["stepper", "number", "increment", "decrement", "counter", "quantity"], viewport: "640x360",
  example: '<dui-stepper default-value="5" min="0" max="10"></dui-stepper>',
  card: '<div class="dsc-demo col" style="gap:var(--space-4)"><dui-stepper default-value="5" min="0" max="10"></dui-stepper><dui-field><span slot="label">Quantity</span><dui-stepper default-value="1" min="1" max="99"></dui-stepper></dui-field><dui-stepper default-value="42" size="sm"></dui-stepper></div>' },

{ tag: "dui-tree", group: "Data Display", keywords: ["tree", "tree view", "file tree", "hierarchy", "nested"], viewport: "640x460",
  example: '<dui-tree aria-label="Files" default-expanded-values=\'["src"]\'><dui-tree-item value="src"><span slot="label">src</span><dui-tree-item value="index"><span slot="label">index.ts</span></dui-tree-item></dui-tree-item></dui-tree>',
  card: '<div class="dsc-demo"><dui-tree aria-label="Project files" selection-mode="single" default-expanded-values=\'["src","utils"]\' default-selected-values=\'["readme"]\' style="width:100%;max-width:20rem"><dui-tree-item value="src"><span slot="label">src</span><span slot="end">3</span><dui-tree-item value="index"><span slot="label">index.ts</span></dui-tree-item><dui-tree-item value="utils"><span slot="label">utils</span><dui-tree-item value="helpers"><span slot="label">helpers.ts</span></dui-tree-item><dui-tree-item value="types"><span slot="label">types.ts</span></dui-tree-item></dui-tree-item><dui-tree-item value="readme"><span slot="label">README.md</span><span slot="end">✓</span></dui-tree-item></dui-tree-item><dui-tree-item value="package"><span slot="label">package.json</span></dui-tree-item><dui-tree-item value="license"><span slot="label">LICENSE</span></dui-tree-item></dui-tree></div>' },

{ tag: "dui-sidebar-provider", group: "Layout", keywords: ["sidebar", "app shell", "navigation", "layout", "drawer"], viewport: "1100x420",
  example: '<dui-sidebar-provider><dui-sidebar><dui-sidebar-content><dui-sidebar-menu><dui-sidebar-menu-item><dui-sidebar-menu-button active>Dashboard</dui-sidebar-menu-button></dui-sidebar-menu-item></dui-sidebar-menu></dui-sidebar-content></dui-sidebar><dui-sidebar-inset><dui-sidebar-trigger><dui-button appearance="ghost" size="sm">Toggle</dui-button></dui-sidebar-trigger></dui-sidebar-inset></dui-sidebar-provider>',
  card: '<div class="dsc-demo" style="width:100%"><div style="height:320px;width:100%;border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden"><dui-sidebar-provider><dui-sidebar><dui-sidebar-header><div style="padding:var(--space-2);font-weight:600">My App</div></dui-sidebar-header><dui-sidebar-content><dui-sidebar-group><dui-sidebar-group-label slot="label">Navigation</dui-sidebar-group-label><dui-sidebar-menu><dui-sidebar-menu-item><dui-sidebar-menu-button active>Dashboard</dui-sidebar-menu-button></dui-sidebar-menu-item><dui-sidebar-menu-item><dui-sidebar-menu-button>Projects</dui-sidebar-menu-button></dui-sidebar-menu-item><dui-sidebar-menu-item><dui-sidebar-menu-button>Settings</dui-sidebar-menu-button></dui-sidebar-menu-item></dui-sidebar-menu></dui-sidebar-group><dui-sidebar-separator></dui-sidebar-separator><dui-sidebar-group><dui-sidebar-group-label slot="label">Resources</dui-sidebar-group-label><dui-sidebar-menu><dui-sidebar-menu-item><dui-sidebar-menu-button>Documentation</dui-sidebar-menu-button></dui-sidebar-menu-item></dui-sidebar-menu></dui-sidebar-group></dui-sidebar-content><dui-sidebar-footer><div style="padding:var(--space-2);font-size:var(--text-xs);color:var(--text-2)">v1.0.0</div></dui-sidebar-footer></dui-sidebar><dui-sidebar-inset><div style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2) var(--space-3);border-bottom:1px solid var(--border)"><dui-sidebar-trigger><dui-button appearance="ghost" size="sm"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg></dui-icon></dui-button></dui-sidebar-trigger></div><div style="padding:var(--space-4)"><p style="color:var(--text-2)">Main content area. Click the trigger to toggle the sidebar.</p></div></dui-sidebar-inset></dui-sidebar-provider></div></div>' },
{ tag: "dui-combobox", group: "Forms", keywords: ["dropdown", "autocomplete", "search", "select", "multi-select"], viewport: "820x460",
  example: 'const ref = React.useRef(null); React.useEffect(() => { ref.current.options = [{ label: "React", value: "react" }, { label: "Vue", value: "vue" }, { label: "Svelte", value: "svelte" }]; }, []); return <dui-combobox ref={ref} placeholder="Select a framework..." />;',
  card: '<div class="dsc-demo col" style="gap: var(--space-4); align-items: stretch;"><dui-combobox id="combo-single" placeholder="Select a framework..." style="width: var(--space-60);"></dui-combobox><dui-combobox id="combo-multi" multiple placeholder="Select languages..." style="width: var(--space-60);"></dui-combobox></div><script type="module">customElements.whenDefined("dui-combobox").then(() => { const frameworks = [{ label: "React", value: "react" }, { label: "Vue", value: "vue" }, { label: "Angular", value: "angular" }, { label: "Svelte", value: "svelte" }, { label: "Lit", value: "lit" }, { label: "Solid", value: "solid" }]; const langs = [{ label: "TypeScript", value: "ts" }, { label: "JavaScript", value: "js" }, { label: "Python", value: "py" }, { label: "Rust", value: "rs" }, { label: "Go", value: "go" }]; const s = document.getElementById("combo-single"); if (s) s.options = frameworks; const m = document.getElementById("combo-multi"); if (m) m.options = langs; });</script>' },

{ tag: "dui-data-table", group: "Data Display", keywords: ["table", "grid", "sortable", "pagination", "rows", "columns", "selection"], viewport: "1000x560",
  example: 'const ref = React.useRef(null); React.useEffect(() => { ref.current.columns = [{ key: "name", header: "Name", sortable: true }, { key: "email", header: "Email", sortable: true }, { key: "role", header: "Role", sortable: true }, { key: "status", header: "Status" }]; ref.current.data = [{ name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" }, { name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" }]; }, []); return <dui-data-table ref={ref} />;',
  card: '<div class="dsc-demo" style="align-items: stretch;"><dui-data-table id="dt1" style="width: 100%;"></dui-data-table></div><script type="module">customElements.whenDefined("dui-data-table").then(() => { const el = document.getElementById("dt1"); if (!el) return; el.columns = [{ key: "name", header: "Name", sortable: true }, { key: "email", header: "Email", sortable: true }, { key: "role", header: "Role", sortable: true }, { key: "status", header: "Status" }]; el.data = [{ name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" }, { name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" }, { name: "Carol White", email: "carol@example.com", role: "Viewer", status: "Inactive" }, { name: "Dave Brown", email: "dave@example.com", role: "Editor", status: "Active" }, { name: "Eve Davis", email: "eve@example.com", role: "Admin", status: "Active" }, { name: "Frank Miller", email: "frank@example.com", role: "Viewer", status: "Inactive" }, { name: "Grace Lee", email: "grace@example.com", role: "Editor", status: "Active" }]; el.pageSize = 5; }); </script>' },

{ tag: "dui-calendar", group: "Forms", keywords: ["date picker", "date", "datepicker", "month", "grid"], viewport: "600x520",
  example: 'return <dui-calendar default-value="2026-07-15" onValue-change={(e) => console.log(e.detail.value)} />;',
  card: '<div class="dsc-demo"><dui-calendar default-value="2026-07-15"></dui-calendar></div>' },

{ tag: "dui-dropzone", group: "Forms", keywords: ["file upload", "drag and drop", "upload", "files", "drop"], viewport: "720x480",
  example: 'return <dui-dropzone accept="image/*" multiple onDrop={(e) => console.log(e.detail.acceptedFiles)} />;',
  card: '<div class="dsc-demo col" style="gap: var(--space-4); align-items: stretch;"><dui-dropzone accept="image/*" multiple><div style="display: flex; flex-direction: column; gap: var(--space-1); align-items: center;"><dui-icon style="--icon-size: var(--space-6); --icon-color: var(--text-2);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></dui-icon><span>Drop images here or click to browse</span><span style="font-size: var(--text-xs); color: var(--text-2);">PNG, JPG, GIF up to 10MB</span></div></dui-dropzone></div>' },

{ tag: "dui-toolbar", group: "Actions", keywords: ["toolbar", "action bar", "header", "controls", "slots"], viewport: "700x260",
  example: 'return <dui-toolbar size="lg" inset has-button-left has-button-right><div slot="left"><dui-button appearance="outline" size="sm">Code</dui-button></div><div slot="right"><dui-button variant="primary" size="sm">Publish</dui-button></div></dui-toolbar>;',
  card: '<div class="dsc-demo" style="align-items: stretch;"><dui-toolbar size="lg" inset has-button-left has-button-right style="width: 100%;"><div slot="left" style="display:flex;align-items:center;gap:var(--space-1)"><dui-button appearance="outline" size="sm"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></dui-icon>Code</dui-button><dui-button appearance="outline" size="sm" aria-label="Settings"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></dui-icon></dui-button></div><div slot="right" style="display:flex;align-items:center;gap:var(--space-1)"><dui-button appearance="outline" size="sm">Share</dui-button><dui-button variant="primary" size="sm">Publish</dui-button></div></dui-toolbar></div>' },
];
