import * as esbuild from "esbuild";
import { resolve, join } from "jsr:@std/path@^1";
import { componentRegistry } from "./src/component-registry.ts";

const DEFAULT_PORT = 4040;
const STATIC_DIR = resolve(import.meta.dirname!, "static");
const DOCS_ENTRY = resolve(import.meta.dirname!, "src/index.ts");
const THEME_EDITOR_ENTRY = resolve(import.meta.dirname!, "src/theme-editor.ts");
const INSPECTOR_ENTRY = resolve(import.meta.dirname!, "src/inspector.ts");
const PREVIEW_TEMPLATE_ENTRY = resolve(import.meta.dirname!, "src/preview-template.ts");
const WORKSPACE_ROOT = resolve(import.meta.dirname!, "../..");
const CORE_VERSION: string = JSON.parse(
  Deno.readTextFileSync(join(WORKSPACE_ROOT, "packages/core/deno.json")),
).version;

/**
 * Resolve `@dui/*` workspace package imports using their deno.json exports maps.
 * npm packages (lit, @lit/context, etc.) are resolved natively by esbuild
 * from node_modules, thanks to Deno's `nodeModulesDir: "auto"`.
 */
const workspacePackages: Record<string, { dir: string; exports: Record<string, string> }> = {
  "@dui/core": {
    dir: join(WORKSPACE_ROOT, "packages/core"),
    exports: {
      ".": "./src/index.ts",
      "./event": "./src/event.ts",
      "./base": "./src/base.ts",
      "./apply-theme": "./src/apply-theme.ts",
      "./popup-coordinator": "./src/popup-coordinator.ts",
      "./floating-popup-utils": "./src/floating-popup-utils.ts",
      "./floating-portal-controller": "./src/floating-portal-controller.ts",
      "./layout-types": "./src/layout-types.ts",
      "./dom": "./src/dom.ts",
    },
  },
  "@dui/components": {
    dir: join(WORKSPACE_ROOT, "packages/components"),
    exports: {
      "./all": "./src/all.ts",
      "./accordion": "./src/accordion/index.ts",
      "./button": "./src/button/index.ts",
      "./switch": "./src/switch/index.ts",
      "./badge": "./src/badge/index.ts",
      "./icon": "./src/icon/index.ts",
      "./scroll-area": "./src/scroll-area/index.ts",
      "./combobox": "./src/combobox/index.ts",
      "./menu": "./src/menu/index.ts",
      "./popover": "./src/popover/index.ts",
      "./tooltip": "./src/tooltip/index.ts",
      "./dialog": "./src/dialog/index.ts",
      "./alert-dialog": "./src/alert-dialog/index.ts",
      "./breadcrumb": "./src/breadcrumb/index.ts",
      "./checkbox": "./src/checkbox/index.ts",
      "./collapsible": "./src/collapsible/index.ts",
      "./toolbar": "./src/toolbar/index.ts",
      "./slider": "./src/slider/index.ts",
      "./spinner": "./src/spinner/index.ts",
      "./tabs": "./src/tabs/index.ts",
      "./textarea": "./src/textarea/index.ts",
      "./trunc": "./src/trunc/index.ts",

      "./link": "./src/link/index.ts",
      "./avatar": "./src/avatar/index.ts",
      "./portal": "./src/portal/index.ts",
      "./field": "./src/field/index.ts",
      "./input": "./src/input/index.ts",
      "./radio": "./src/radio/index.ts",
      "./dropzone": "./src/dropzone/index.ts",
      "./select": "./src/select/index.ts",
      "./preview-card": "./src/preview-card/index.ts",
      "./data-table": "./src/data-table/index.ts",
      "./command": "./src/command/index.ts",
      "./sidebar": "./src/sidebar/index.ts",
      "./separator": "./src/separator/index.ts",
      "./progress": "./src/progress/index.ts",
      "./toggle": "./src/toggle/index.ts",
      "./number-field": "./src/number-field/index.ts",
      "./stepper": "./src/stepper/index.ts",
      "./menubar": "./src/menubar/index.ts",
      "./calendar": "./src/calendar/index.ts",
      "./split-button": "./src/split-button/index.ts",
      "./card-grid": "./src/card-grid/index.ts",
    },
  },
  "@dui/inspector": {
    dir: join(WORKSPACE_ROOT, "packages/inspector"),
    exports: {
      ".": "./src/index.ts",
      "./api": "./src/api.ts",
    },
  },
  "@dui/map": {
    dir: join(WORKSPACE_ROOT, "packages/map"),
    exports: {
      ".": "./src/index.ts",
      "./map": "./src/map/index.ts",
      "./marker": "./src/marker/index.ts",
      "./controls": "./src/controls/index.ts",
      "./popup": "./src/popup/index.ts",
      "./route": "./src/route/index.ts",
      "./region": "./src/region/index.ts",
      "./cluster-layer": "./src/cluster-layer/index.ts",
    },
  },
  "@dui/theme-default-templates": {
    dir: join(WORKSPACE_ROOT, "packages/theme-default-templates"),
    exports: {
      "./feed": "./src/feed/index.ts",
      "./dashboard": "./src/dashboard/index.ts",
      "./metrics": "./src/metrics/index.ts",
      "./all": "./src/all.ts",
    },
  },
  "@dui/theme-default": {
    dir: join(WORKSPACE_ROOT, "packages/theme-default"),
    exports: {
      ".": "./src/index.ts",
      "./components/accordion": "./src/components/accordion.ts",
      "./components/accordion-item": "./src/components/accordion-item.ts",
      "./components/button": "./src/components/button.ts",
      "./components/switch": "./src/components/switch.ts",
      "./components/badge": "./src/components/badge.ts",
      "./components/scroll-area": "./src/components/scroll-area.ts",
      "./components/combobox": "./src/components/combobox.ts",
      "./components/menu": "./src/components/menu.ts",
      "./components/menu-item": "./src/components/menu-item.ts",
      "./components/popover": "./src/components/popover.ts",
      "./components/popover-popup": "./src/components/popover-popup.ts",
      "./components/tooltip": "./src/components/tooltip.ts",
      "./components/tooltip-popup": "./src/components/tooltip-popup.ts",
      "./tokens": "./src/tokens.ts",
      "./tokens-raw": "./src/tokens-raw.ts",
      "./prose": "./src/prose.ts",
      "./components/dialog": "./src/components/dialog.ts",
      "./components/dialog-popup": "./src/components/dialog-popup.ts",
      "./components/alert-dialog": "./src/components/alert-dialog.ts",
      "./components/alert-dialog-popup": "./src/components/alert-dialog-popup.ts",
      "./components/breadcrumb": "./src/components/breadcrumb.ts",
      "./components/breadcrumb-item": "./src/components/breadcrumb-item.ts",
      "./components/breadcrumb-link": "./src/components/breadcrumb-link.ts",
      "./components/breadcrumb-page": "./src/components/breadcrumb-page.ts",
      "./components/breadcrumb-separator": "./src/components/breadcrumb-separator.ts",
      "./components/breadcrumb-ellipsis": "./src/components/breadcrumb-ellipsis.ts",
      "./components/checkbox": "./src/components/checkbox.ts",
      "./components/checkbox-group": "./src/components/checkbox-group.ts",
      "./components/collapsible": "./src/components/collapsible.ts",
      "./components/toolbar": "./src/components/toolbar.ts",
      "./components/slider": "./src/components/slider.ts",
      "./components/spinner": "./src/components/spinner.ts",
      "./components/tab": "./src/components/tab.ts",
      "./components/tabs": "./src/components/tabs.ts",
      "./components/tabs-indicator": "./src/components/tabs-indicator.ts",
      "./components/tabs-list": "./src/components/tabs-list.ts",
      "./components/tabs-panel": "./src/components/tabs-panel.ts",
      "./components/textarea": "./src/components/textarea.ts",
      "./components/trunc": "./src/components/trunc.ts",

      "./components/link": "./src/components/link.ts",
      "./components/avatar": "./src/components/avatar.ts",
      "./components/portal": "./src/components/portal.ts",
      "./components/input": "./src/components/input.ts",
      "./components/radio": "./src/components/radio.ts",
      "./components/radio-group": "./src/components/radio-group.ts",
      "./components/dropzone": "./src/components/dropzone.ts",
      "./components/select": "./src/components/select.ts",
      "./components/preview-card": "./src/components/preview-card.ts",
      "./components/preview-card-popup": "./src/components/preview-card-popup.ts",
      "./components/data-table": "./src/components/data-table.ts",
      "./components/command": "./src/components/command.ts",
      "./components/command-input": "./src/components/command-input.ts",
      "./components/command-item": "./src/components/command-item.ts",
      "./components/command-list": "./src/components/command-list.ts",
      "./components/command-group": "./src/components/command-group.ts",
      "./components/command-empty": "./src/components/command-empty.ts",
      "./components/command-separator": "./src/components/command-separator.ts",
      "./components/command-shortcut": "./src/components/command-shortcut.ts",
      "./components/sidebar-provider": "./src/components/sidebar-provider.ts",
      "./components/sidebar": "./src/components/sidebar.ts",
      "./components/sidebar-trigger": "./src/components/sidebar-trigger.ts",
      "./components/sidebar-content": "./src/components/sidebar-content.ts",
      "./components/sidebar-header": "./src/components/sidebar-header.ts",
      "./components/sidebar-footer": "./src/components/sidebar-footer.ts",
      "./components/sidebar-group": "./src/components/sidebar-group.ts",
      "./components/sidebar-group-label": "./src/components/sidebar-group-label.ts",
      "./components/sidebar-menu": "./src/components/sidebar-menu.ts",
      "./components/sidebar-menu-item": "./src/components/sidebar-menu-item.ts",
      "./components/sidebar-menu-button": "./src/components/sidebar-menu-button.ts",
      "./components/sidebar-separator": "./src/components/sidebar-separator.ts",
      "./components/sidebar-inset": "./src/components/sidebar-inset.ts",
      "./components/separator": "./src/components/separator.ts",
      "./components/progress": "./src/components/progress.ts",
      "./components/toggle": "./src/components/toggle.ts",
      "./components/toggle-group": "./src/components/toggle-group.ts",
      "./components/number-field": "./src/components/number-field.ts",
      "./components/menubar": "./src/components/menubar.ts",
      "./components/calendar": "./src/components/calendar.ts",
      "./components/card-grid": "./src/components/card-grid.ts",
    },
  },
};

const duiWorkspacePlugin: esbuild.Plugin = {
  name: "dui-workspace",
  setup(build) {
    // Resolve @dui/* imports
    build.onResolve({ filter: /^@dui\// }, (args) => {
      for (const [pkgName, pkg] of Object.entries(workspacePackages)) {
        if (!args.path.startsWith(pkgName)) continue;
        const subpath = "." + args.path.slice(pkgName.length);
        const mapped = pkg.exports[subpath || "."];
        if (mapped) {
          return { path: resolve(pkg.dir, mapped) };
        }
      }
      return undefined;
    });
  },
};

/** Import `.css` files as raw text strings. */
const cssRawTextPlugin: esbuild.Plugin = {
  name: "css-raw-text",
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const text = await Deno.readTextFile(args.path);
      return { contents: text, loader: "text" };
    });
  },
};

/** Import any file with a `?raw` suffix as a raw text string. */
const rawTextPlugin: esbuild.Plugin = {
  name: "raw-text",
  setup(build) {
    build.onResolve({ filter: /\?raw$/ }, (args) => {
      const filePath = resolve(args.resolveDir, args.path.replace(/\?raw$/, ""));
      return { path: filePath, namespace: "raw-text" };
    });
    build.onLoad({ filter: /.*/, namespace: "raw-text" }, async (args) => {
      const text = await Deno.readTextFile(args.path);
      return { contents: text, loader: "text" };
    });
  },
};

// Generate llms.txt from component registry
function generateLlmsTxt(): string {
  const lines: string[] = [
    "# DUI — Unstyled Lit Component Library",
    "",
    "> Unstyled web components + composable themes. Components provide structure",
    "> and behavior; themes provide aesthetics.",
    "",
    "## Getting Started",
    "",
    "Install: (Deno workspace package)",
    'Import: import { DuiButton } from "@dui/components/button";',
    "Register: applyTheme({ theme: defaultTheme, components: [DuiButton] });",
    "",
    "## Styling Model",
    "",
    "DUI uses a two-layer styling approach:",
    "",
    "### Layer 1: CSS Variables",
    "Each component exposes CSS custom properties for values that variants and sizes toggle.",
    "Variables cascade from ancestor elements, so a parent can theme all descendant components.",
    "The theme uses `background` (shorthand), so variables accept gradients and images, not just colors.",
    "",
    "```css",
    "/* Override button colors */",
    "dui-button {",
    "  --button-bg: linear-gradient(135deg, pink, purple);",
    "  --button-fg: white;",
    "}",
    "",
    "/* Ancestor cascading — all buttons inside .card inherit this */",
    ".card {",
    "  --button-bg: var(--accent);",
    "}",
    "```",
    "",
    "### Layer 2: ::part(root)",
    "For any CSS property not covered by variables — filters, transforms, shadows, clip-paths,",
    "backdrop-filter, blend modes — use ::part(root) on the component. Every component exposes",
    "at least a `root` part. Complex components expose additional parts (e.g., `track`, `thumb`).",
    "",
    "```css",
    "/* Frosted glass */",
    "dui-button::part(root) {",
    "  backdrop-filter: blur(12px) saturate(1.8);",
    "}",
    "",
    "/* Glow shadow */",
    "dui-button::part(root) {",
    "  box-shadow: 0 0 20px oklch(0.7 0.2 280 / 0.4);",
    "}",
    "",
    "/* Bouncy press */",
    "dui-button::part(root):hover { transform: translateY(-1px); }",
    "dui-button::part(root):active { transform: scale(0.97); }",
    "```",
    "",
    "Components include broad transition-property lists (background, box-shadow, filter,",
    "transform, border-color) so ::part() overrides animate smoothly.",
    "",
    "## Components",
    "",
  ];

  for (const c of componentRegistry) {
    lines.push(`### ${c.name}`);
    lines.push(`- Tag: \`<${c.tagName}>\``);
    lines.push(`- Import: \`${c.importPath}\``);
    lines.push(`- Description: ${c.description}`);

    if (c.properties.length > 0) {
      const props = c.properties
        .map((p) => `${p.name} (${p.type}${p.default ? `, ${p.default}` : ""})`)
        .join(", ");
      lines.push(`- Properties: ${props}`);
    }

    if (c.events.length > 0) {
      const events = c.events
        .map((e) => `${e.name}${e.detail ? ` (${e.detail})` : ""}`)
        .join(", ");
      lines.push(`- Events: ${events}`);
    } else {
      lines.push("- Events: none");
    }

    if (c.slots.length > 0) {
      const slots = c.slots
        .map((s) => `${s.name} (${s.description})`)
        .join(", ");
      lines.push(`- Slots: ${slots}`);
    }

    if (c.cssProperties.length > 0) {
      const cssProps = c.cssProperties
        .map((p) => `${p.name} (${p.description})`)
        .join(", ");
      lines.push(`- CSS Variables: ${cssProps}`);
    }

    if (c.cssParts && c.cssParts.length > 0) {
      const parts = c.cssParts
        .map((p) => `${p.name} (${p.description})`)
        .join(", ");
      lines.push(`- CSS Parts: ${parts}`);
    }

    lines.push("");
  }

  return lines.join("\n");
}

// Write llms.txt before starting the server
const llmsTxt = generateLlmsTxt();
await Deno.writeTextFile(join(STATIC_DIR, "llms.txt"), llmsTxt);
console.log("Generated llms.txt");

const buildMode = Deno.args.includes("--build");

if (buildMode) {
  await esbuild.build({
    entryPoints: [DOCS_ENTRY, THEME_EDITOR_ENTRY, INSPECTOR_ENTRY, PREVIEW_TEMPLATE_ENTRY],
    bundle: true,
    format: "esm",
    target: "es2022",
    outdir: STATIC_DIR,
    write: true,
    minify: true,
    plugins: [duiWorkspacePlugin, rawTextPlugin, cssRawTextPlugin],
    nodePaths: [join(WORKSPACE_ROOT, "node_modules")],
    define: { __DUI_VERSION__: JSON.stringify(CORE_VERSION) },
  });
  console.log("Build complete → packages/docs/static/");
  esbuild.stop();
} else {
  const ctx = await esbuild.context({
    entryPoints: [DOCS_ENTRY, THEME_EDITOR_ENTRY, INSPECTOR_ENTRY, PREVIEW_TEMPLATE_ENTRY],
    bundle: true,
    format: "esm",
    target: "es2022",
    outdir: STATIC_DIR,
    write: false,
    plugins: [duiWorkspacePlugin, rawTextPlugin, cssRawTextPlugin],
    nodePaths: [join(WORKSPACE_ROOT, "node_modules")],
    define: { __DUI_VERSION__: JSON.stringify(CORE_VERSION) },
    banner: {
      js: `(() => { new EventSource("/esbuild").addEventListener("change", () => location.reload()); })();`,
    },
  });

  await ctx.watch();

  let port: number;
  try {
    ({ port } = await ctx.serve({
      port: DEFAULT_PORT,
      servedir: STATIC_DIR,
    }));
  } catch {
    // Default port in use — pick a random one
    ({ port } = await ctx.serve({
      port: 0,
      servedir: STATIC_DIR,
    }));
  }

  console.log(`DUI docs → http://localhost:${port} (live reload enabled)`);
}
