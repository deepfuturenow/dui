/**
 * Lit adapter: implements ControllerHost over ReactiveElement's controller
 * lifecycle. This is the spec's `@bui/controllers/lit`; the controllers
 * themselves never import lit.
 */
import type { ReactiveElement } from "@lit/reactive-element";
import { Controller, type LifecycleHooks } from "./controller-host.ts";

export function attach<C extends Controller>(el: ReactiveElement, controller: C): C {
  const hooks: LifecycleHooks[] = [];
  el.addController({
    hostConnected: () => hooks.forEach((h) => h.connected?.()),
    hostDisconnected: () => hooks.forEach((h) => h.disconnected?.()),
    hostUpdated: () => hooks.forEach((h) => h.updated?.()),
  });
  controller.attachTo({
    requestUpdate: () => el.requestUpdate(),
    addLifecycle: (h) => hooks.push(h),
  });
  return controller;
}
