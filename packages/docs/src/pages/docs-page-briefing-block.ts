import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-briefing-block")
export class DocsPageBriefingBlock extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-briefing-block">

        <dui-docs-demo label="Basic">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-briefing-block
              title="Escalating Geopolitical Tension in Eastern Mediterranean"
              source="AI Analysis Engine"
              timestamp="3 min ago"
              category="Geopolitics"
              confidence="High"
              body="Multiple OSINT sources confirm a significant naval buildup near Cyprus, with at least 12 vessels identified via satellite imagery in the last 48 hours. This represents a 3x increase from the monthly baseline and correlates with recent diplomatic tensions between regional actors."
            >
              <dui-button slot="actions" variant="neutral" appearance="ghost" size="sm">View Sources</dui-button>
              <dui-button slot="actions" variant="neutral" appearance="ghost" size="sm">Dismiss</dui-button>
            </dui-briefing-block>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Minimal (no badges, no actions)">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-briefing-block
              title="Market Sentiment Shift Detected"
              source="GPT-4o"
              timestamp="12 min ago"
              body="Bearish sentiment has increased 15% across major financial news outlets over the past 6 hours, driven primarily by unexpected employment data from the Bureau of Labor Statistics."
            ></dui-briefing-block>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With category only">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-briefing-block
              title="Cybersecurity Advisory: Critical Vulnerability in OpenSSL"
              source="Threat Intelligence"
              timestamp="1 hour ago"
              category="Cyber"
              body="A new zero-day vulnerability (CVE-2025-1234) has been disclosed affecting OpenSSL versions 3.0 through 3.2. Exploitation in the wild has been confirmed by multiple CERTs. Patch immediately or apply the recommended mitigations."
            ></dui-briefing-block>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Stacked in a feed">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-briefing-block
              title="Morning Intelligence Summary"
              source="Daily Briefing Agent"
              timestamp="06:00 UTC"
              category="Summary"
              confidence="High"
              body="Three key developments overnight: (1) Naval exercises expanded in the South China Sea, (2) EU energy ministers reached preliminary agreement on gas price cap, (3) Central bank signals potential rate pause at next meeting."
            ></dui-briefing-block>
            <dui-briefing-block
              title="Anomalous Trading Pattern Detected"
              source="Market Monitor"
              timestamp="06:14 UTC"
              category="Markets"
              confidence="Medium"
              body="Unusual options activity detected in semiconductor ETFs, with put volume 4x the 20-day average. This may indicate institutional hedging ahead of upcoming earnings reports."
            ></dui-briefing-block>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
