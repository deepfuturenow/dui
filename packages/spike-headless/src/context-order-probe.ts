/**
 * Isolation probe for the `@lit/context` import-order bug found while
 * converting tabs.
 *
 * Imports ONLY the two affected families so the failure cannot be blamed on
 * anything else on the page. Served at `/context-order-probe.html`.
 *
 * A Lit `ContextConsumer` dispatches its `context-request` exactly once, in
 * `hostConnected()`, and never retries. `customElements.define()` upgrades every
 * matching element in the document immediately, so whichever family member is
 * imported first upgrades first. If that is a consumer, it connects and asks for
 * a context whose provider is still an undefined element — and the answer never
 * comes.
 */
import "@dui/components/tabs";
import "@dui/components/toggle";
