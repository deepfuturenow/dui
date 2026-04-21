import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-score-item")
export class DocsPageScoreItem extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-score-item">

        <dui-docs-demo label="Basic with sub-metrics">
          <div style="display: flex; flex-direction: column; gap: var(--space-3); max-width: 560px;">
            <dui-score-item
              entity="United States"
              subtitle="North America"
              score="87"
              score-label="Risk Score"
            >
              <div slot="sub-metrics" style="display: flex; gap: var(--space-2); font-family: var(--font-sans); font-size: var(--text-sm); color: var(--text-2);">
                <span>Political: <strong style="color: var(--foreground);">72</strong></span>
                <span>Economic: <strong style="color: var(--foreground);">91</strong></span>
                <span>Security: <strong style="color: var(--foreground);">84</strong></span>
              </div>
            </dui-score-item>

            <dui-score-item
              entity="Germany"
              subtitle="Europe"
              score="42"
              score-label="Risk Score"
            >
              <div slot="sub-metrics" style="display: flex; gap: var(--space-2); font-family: var(--font-sans); font-size: var(--text-sm); color: var(--text-2);">
                <span>Political: <strong style="color: var(--foreground);">38</strong></span>
                <span>Economic: <strong style="color: var(--foreground);">45</strong></span>
                <span>Security: <strong style="color: var(--foreground);">41</strong></span>
              </div>
            </dui-score-item>

            <dui-score-item
              entity="Taiwan"
              subtitle="East Asia"
              score="94"
              score-label="Risk Score"
            ></dui-score-item>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Leaderboard style">
          <div style="display: flex; flex-direction: column; gap: var(--space-3); max-width: 560px;">
            <dui-score-item
              entity="Agent Sierra"
              subtitle="Counter-intelligence"
              score="A+"
              score-label="Rating"
            ></dui-score-item>

            <dui-score-item
              entity="Agent Delta"
              subtitle="Field Operations"
              score="B+"
              score-label="Rating"
            ></dui-score-item>

            <dui-score-item
              entity="Agent Foxtrot"
              subtitle="Signals Intelligence"
              score="A"
              score-label="Rating"
            ></dui-score-item>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Minimal (entity + score only)">
          <div style="display: flex; flex-direction: column; gap: var(--space-3); max-width: 560px;">
            <dui-score-item
              entity="Server Cluster Alpha"
              score="9.4"
            ></dui-score-item>

            <dui-score-item
              entity="Server Cluster Bravo"
              score="7.8"
            ></dui-score-item>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With actions slot">
          <div style="display: flex; flex-direction: column; gap: var(--space-3); max-width: 560px;">
            <dui-score-item
              entity="South China Sea"
              subtitle="Maritime Zone"
              score="96"
              score-label="Threat Index"
            >
              <div slot="actions" style="display: flex; gap: var(--space-2);">
                <dui-button size="sm">View Details</dui-button>
                <dui-button size="sm" variant="outline">Export</dui-button>
              </div>
            </dui-score-item>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
