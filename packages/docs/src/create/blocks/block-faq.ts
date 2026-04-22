import { LitElement, html, css } from "lit";
import { blockBase, gridOverlay } from "./block-base.ts";
import { customElement } from "lit/decorators.js";

@customElement("block-faq")
export class BlockFaq extends LitElement {
  static override styles = [gridOverlay, blockBase, css`
    :host {
      padding: var(--space-6) var(--space-5) var(--space-5);
    }

    .header {
      position: relative;
      margin-bottom: var(--space-5);
    }

    .header h3 {
      font-size: var(--text-base);
      font-weight: var(--font-weight-semibold);
      margin: 0;
    }

    .subtitle {
      font-size: var(--text-sm);
      color: var(--text-2);
      margin: var(--space-3) 0 0;
    }

    .answer {
      font-size: var(--text-sm);
      color: var(--text-2);
      line-height: var(--line-height-normal);
    }
  `];

  override render() {
    return html`
      <div class="header">
        <h3>Montréal FAQ</h3>
        <p class="subtitle">Common questions about the city</p>
      </div>

      <dui-accordion default-value='["q3"]'>
        <dui-accordion-item value="q1">
          <span slot="trigger">What languages are spoken?</span>
          <span class="answer">French is the official language and spoken by the majority of residents. English is widely understood, and you'll hear dozens of other languages — Montréal is one of the most multilingual cities in North America.</span>
        </dui-accordion-item>
        <dui-accordion-item value="q2">
          <span slot="trigger">What's the best time to visit?</span>
          <span class="answer">Summer (June–August) brings festivals, outdoor terraces, and warm weather. Fall is stunning for foliage. Winter is cold but magical — think ice skating, underground city, and holiday markets.</span>
        </dui-accordion-item>
        <dui-accordion-item value="q3">
          <span slot="trigger">How do I get around the city?</span>
          <span class="answer">The STM metro and bus system covers most of the island. BIXI bike-sharing is popular from April to November. The city is very walkable, especially downtown and the Plateau.</span>
        </dui-accordion-item>
        <dui-accordion-item value="q4">
          <span slot="trigger">What food is Montréal known for?</span>
          <span class="answer">Poutine, smoked meat sandwiches, bagels (from St-Viateur or Fairmount), and a thriving restaurant scene that rivals any major city. The Jean-Talon and Atwater markets are must-visits.</span>
        </dui-accordion-item>
      </dui-accordion>
    `;
  }
}
