import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-social-post")
export class DocsPageSocialPost extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-social-post">

        <dui-docs-demo label="With avatar and source">
          <div style="display: flex; flex-direction: column; gap: var(--space-3); max-width: 560px;">
            <dui-social-post
              author="Jane Nakamura"
              handle="@sigint_jane"
              timestamp="3 min ago"
              source="X"
              body="Significant uptick in maritime traffic through the Taiwan Strait overnight. AIS data shows 14 unidentified vessels. Thread 🧵"
            >
              <dui-avatar slot="avatar" style="--avatar-size: 2.25rem;">JN</dui-avatar>
            </dui-social-post>

            <dui-social-post
              author="OSINT Aggregator"
              handle="@osint_agg"
              timestamp="12 min ago"
              source="Telegram"
              body="New satellite imagery confirms construction activity at coordinates 34.2°N, 108.9°E. Resolution enhanced with Sentinel-2 overlay."
            >
              <dui-avatar slot="avatar" style="--avatar-size: 2.25rem;">OA</dui-avatar>
            </dui-social-post>

            <dui-social-post
              author="Reuters Alert"
              handle="@reuters_alert"
              timestamp="28 min ago"
              source="Bluesky"
              body="BREAKING: EU announces new sanctions package targeting energy sector. Full briefing expected at 14:00 CET."
            >
              <dui-avatar slot="avatar" style="--avatar-size: 2.25rem;">RA</dui-avatar>
            </dui-social-post>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Without avatar">
          <div style="display: flex; flex-direction: column; gap: var(--space-3); max-width: 560px;">
            <dui-social-post
              author="Anonymous Source"
              handle="@anon_42"
              timestamp="1 hr ago"
              source="X"
              body="Unconfirmed reports of increased troop movements near the northern border region."
            ></dui-social-post>

            <dui-social-post
              author="MarketWatch"
              timestamp="2 hr ago"
              body="Oil futures up 3.2% on supply concerns."
            ></dui-social-post>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With actions slot">
          <div style="display: flex; flex-direction: column; gap: var(--space-3); max-width: 560px;">
            <dui-social-post
              author="OSINT Aggregator"
              handle="@osint_agg"
              timestamp="12 min ago"
              source="Telegram"
              body="New satellite imagery confirms construction activity at coordinates 34.2°N, 108.9°E."
            >
              <dui-avatar slot="avatar" style="--avatar-size: 2.25rem;">OA</dui-avatar>
              <div slot="actions" style="display: flex; gap: var(--space-2);">
                <dui-button size="sm" variant="outline">View Source</dui-button>
                <dui-button size="sm" variant="outline">Flag</dui-button>
              </div>
            </dui-social-post>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
