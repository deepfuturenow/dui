import * as esbuild from "esbuild";
import { resolve, join } from "jsr:@std/path@^1";
import { componentRegistry } from "./src/component-registry.ts";

const PORT = 4040;
const STATIC_DIR = resolve(import.meta.dirname!, "static");
const DOCS_ENTRY = resolve(import.meta.dirname!, "src/index.ts");
const THEME_EDITOR_ENTRY = resolve(import.meta.dirname!, "src/theme-editor.ts");
const INSPECTOR_ENTRY = resolve(import.meta.dirname!, "src/inspector.ts");
const WORKSPACE_ROOT = resolve(import.meta.dirname!, "../..");

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
    },
  },
  "@dui/components": {
    dir: join(WORKSPACE_ROOT, "packages/components"),
    exports: {
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
      lines.push(`- CSS Properties: ${cssProps}`);
    }

    lines.push("");
  }

  return lines.join("\n");
}

// Write llms.txt before starting the server
const llmsTxt = generateLlmsTxt();
await Deno.writeTextFile(join(STATIC_DIR, "llms.txt"), llmsTxt);
console.log("Generated llms.txt");

const ctx = await esbuild.context({
  entryPoints: [DOCS_ENTRY, THEME_EDITOR_ENTRY, INSPECTOR_ENTRY],
  bundle: true,
  format: "esm",
  target: "es2022",
  outdir: STATIC_DIR,
  write: false,
  plugins: [duiWorkspacePlugin, rawTextPlugin, cssRawTextPlugin],
  nodePaths: [join(WORKSPACE_ROOT, "node_modules")],
});

const { port } = await ctx.serve({
  port: PORT,
  servedir: STATIC_DIR,
});

console.log(`DUI docs → http://localhost:${port}`);
