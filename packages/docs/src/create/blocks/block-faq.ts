import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("block-faq")
export class BlockFaq extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-6);
      background: var(--surface-2);
      color: var(--text-1);
    }

    .title {
      font-size: var(--font-size-base);
      font-weight: 600;
      margin: 0 0 var(--space-1);
    }

    .subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-2);
      margin: 0 0 var(--space-4);
    }

    .answer {
      font-size: var(--font-size-sm);
      color: var(--text-2);
      line-height: 1.5;
    }
  `;

  override render() {
    return html`
      <p class="title">Montréal FAQ</p>
      <p class="subtitle">Common questions about the city</p>

      <dui-accordion default-value='["q1"]'>
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
