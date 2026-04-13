import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("block-payment")
export class BlockPayment extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      background: var(--surface-2);
      color: var(--text-1);
    }

    .section {
      padding: var(--space-5, 1.25rem) var(--space-6, 1.5rem);
    }

    .section + .section {
      border-top: var(--border-width-thin, 1px) solid var(--border);
    }

    /* ── Header ── */

    .header {
      display: flex;
      align-items: center;
      gap: var(--space-3, 0.75rem);
      margin-bottom: var(--space-4, 1rem);
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full, 9999px);
      background: var(--surface-1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .header-text {
      flex: 1;
      min-width: 0;
    }

    .shop-name {
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 600;
      margin: 0;
    }

    .shop-address {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--text-2);
      margin: 0;
    }

    /* ── Cart summary row ── */

    .summary-row {
      display: flex;
      align-items: center;
      gap: var(--space-3, 0.75rem);
    }

    .summary-row span {
      flex: 1;
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: 500;
    }

    /* ── Order total ── */

    .section-title {
      font-size: var(--font-size-base, 1rem);
      font-weight: 600;
      margin: 0 0 var(--space-3, 0.75rem);
    }

    .line-item {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--text-2);
      margin-bottom: var(--space-1, 0.25rem);
    }

    .total-line {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-base, 1rem);
      font-weight: 600;
      padding-top: var(--space-3, 0.75rem);
      border-top: var(--border-width-thin, 1px) solid var(--border);
      margin-top: var(--space-2, 0.5rem);
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: var(--space-1, 0.25rem);
      padding-top: var(--space-3, 0.75rem);
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-sm, 0.875rem);
      color: var(--text-2);
    }

    .disclaimer {
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--text-2);
      margin: var(--space-3, 0.75rem) 0 0;
    }
  `;

  override render() {
    return html`
      <div class="section">
        <div class="header">
          <div class="avatar">
            <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg></dui-icon>
          </div>
          <div class="header-text">
            <p class="shop-name">Riverstone Kitchen</p>
            <p class="shop-address">482 Main Street</p>
          </div>
        </div>
        <dui-button style="width: 100%">Continue to payment</dui-button>
      </div>

      <div class="section">
        <dui-collapsible default-open>
          <div slot="trigger" class="summary-row">
            <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg></dui-icon>
            <span>Cart summary (5 items)</span>
          </div>
          <div class="cart-items">
            <div class="cart-item">
              <span>Grilled Salmon Bowl</span>
              <span>$24.00</span>
            </div>
            <div class="cart-item">
              <span>Caesar Salad</span>
              <span>$14.50</span>
            </div>
            <div class="cart-item">
              <span>Mushroom Risotto</span>
              <span>$22.00</span>
            </div>
            <div class="cart-item">
              <span>Sparkling Water × 2</span>
              <span>$12.00</span>
            </div>
            <div class="cart-item">
              <span>Tiramisu</span>
              <span>$16.00</span>
            </div>
          </div>
        </dui-collapsible>
      </div>

      <div class="section">
        <p class="section-title">Order total</p>
        <div class="line-item">
          <span>Subtotal</span>
          <span>$88.50</span>
        </div>
        <div class="line-item">
          <span>Taxes</span>
          <span>$7.85</span>
        </div>
        <div class="total-line">
          <span>Total</span>
          <span>$96.35</span>
        </div>
        <p class="disclaimer">Prices may be lower in store.</p>
      </div>
    `;
  }
}
