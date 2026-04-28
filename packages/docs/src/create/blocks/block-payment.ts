import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { Store, ShoppingCart } from "lucide-static";
import { customElement } from "lit/decorators.js";
import { gridOverlay } from "./block-base.ts";

@customElement("block-payment")
export class BlockPayment extends LitElement {
  static override styles = [gridOverlay, css`
    :host {
      display: block;
      position: relative;
    }

    /* ── Card gap ── */

    dui-card::part(root) {
      gap: var(--space-4);
    }

    /* ── Header ── */
    
    dui-card::part(header) {
      padding: var(--space-4) var(--space-3) var(--space-3);
      border-bottom: var(--border-width-thin) solid var(--border);
    }

    .header-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .avatar {
      width: var(--space-10);
      height: var(--space-10);
      border-radius: var(--radius-full);
      background: var(--accent-subtle);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .header-text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .shop-name {
      font-size: var(--text-sm);
      font-weight: var(--font-weight-semibold);
      margin: 0;
      text-box: trim-both cap alphabetic;
    }

    .shop-address {
      font-size: var(--text-xs);
      color: var(--text-2);
      margin: var(--space-1) 0 0;
      font-weight: var(--font-weight-regular);
      text-box: trim-both cap alphabetic;
    }

    /* ── Cart summary row ── */

    .summary-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .summary-row span {
      flex: 1;
      font-size: var(--text-sm);
      font-weight: var(--font-weight-medium);
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      padding-top: var(--space-2);
    }

    .cart-item {
      display: flex;
      justify-content: space-between;
      font-size: var(--text-sm);
      color: var(--text-2);
    }

    dui-collapsible::part(trigger) {
      padding-inline: 0;
    }

    dui-collapsible::part(content) {
      padding-inline: 0;
      padding-bottom: 0;
    }

    /* ── Order total (footer) ── */

    dui-card::part(footer) {
      border-top: var(--border-width-thin) solid var(--border);
      padding-top: var(--space-5);
    }

    .order-total {
      width: 100%;
    }

    .order-total h3 {
      font-size: var(--text-sm);
      font-weight: var(--font-weight-semibold);
      margin: 0 0 var(--space-2);
      text-box: trim-both cap alphabetic;
    }

    .line-item {
      display: flex;
      justify-content: space-between;
      font-size: var(--text-sm);
      color: var(--text-2);
      margin-bottom: var(--space-1);
    }

    .total-line {
      display: flex;
      justify-content: space-between;
      font-size: var(--text-sm);
      font-weight: var(--font-weight-semibold);
      padding-top: var(--space-2);
      border-top: var(--border-width-thin) solid var(--border);
      margin-top: var(--space-2);
    }
  `];

  override render() {
    return html`
      <dui-card>
        <div slot="title" class="header-row">
          <div class="avatar">
            <dui-icon>${unsafeHTML(Store)}</dui-icon>
          </div>
          <div class="header-text">
            <p class="shop-name">Riverstone Kitchen</p>
            <p class="shop-address">482 Main Street</p>
          </div>
        </div>

        <dui-collapsible default-open>
          <div slot="trigger" class="summary-row">
            <dui-icon>${unsafeHTML(ShoppingCart)}</dui-icon>
            <span>Cart summary (4 items)</span>
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
              <span>Tiramisu</span>
              <span>$16.00</span>
            </div>
          </div>
        </dui-collapsible>

        <div slot="footer" class="order-total">
          <h3>Order total</h3>
          <div class="line-item">
            <span>Subtotal</span>
            <span>$76.50</span>
          </div>
          <div class="line-item">
            <span>Taxes</span>
            <span>$6.79</span>
          </div>
          <div class="total-line">
            <span>Total</span>
            <span>$83.29</span>
          </div>
        </div>
      </dui-card>
    `;
  }
}
