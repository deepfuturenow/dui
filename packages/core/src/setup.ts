/**
 * Convenience setup function — registers all components with the default theme
 * in a single call. For quick starts and CDN usage.
 *
 * @example
 * ```ts
 * import { setup } from "@dui/core/setup";
 * import { defaultTheme } from "@dui/theme-default";
 * import { allComponents } from "@dui/components/all";
 *
 * setup({ theme: defaultTheme, components: allComponents });
 * ```
 */

import { applyTheme, type ApplyThemeOptions } from "./apply-theme.ts";

export function setup(options: ApplyThemeOptions): void {
  applyTheme(options);
}
