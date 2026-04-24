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
const PRIMITIVES_ROOT = resolve(WORKSPACE_ROOT, "../dui-primitives");
const CORE_VERSION: string = JSON.parse(
  Deno.readTextFileSync(join(PRIMITIVES_ROOT, "packages/primitives/deno.json")),
).version;

/**
 * Resolve `@dui/*` workspace package imports using their deno.json exports maps.
 * npm packages (lit, @lit/context, etc.) are resolved natively by esbuild
 * from node_modules, thanks to Deno's `nodeModulesDir: "auto"`.
 */
const workspacePackages: Record<string, { dir: string; exports: Record<string, string> }> = {
  "@dui/primitives": {
    dir: join(PRIMITIVES_ROOT, "packages/primitives"),
    exports: JSON.parse(Deno.readTextFileSync(join(PRIMITIVES_ROOT, "packages/primitives/deno.json"))).exports,
  },
  "@dui/components": {
    dir: join(WORKSPACE_ROOT, "packages/components"),
    exports: JSON.parse(Deno.readTextFileSync(join(WORKSPACE_ROOT, "packages/components/deno.json"))).exports,
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
  "@dui/chart": {
    dir: join(WORKSPACE_ROOT, "packages/chart"),
    exports: {
      ".": "./src/index.ts",
      "./chart": "./src/chart/index.ts",
      "./scales": "./src/scales.ts",
    },
  },
  "@dui/templates": {
    dir: join(WORKSPACE_ROOT, "packages/templates"),
    exports: JSON.parse(Deno.readTextFileSync(join(WORKSPACE_ROOT, "packages/templates/deno.json"))).exports,
  },

};

/** Resolve @dui/inspector from the npm package @deepfuture/dui-inspector in node_modules */
const inspectorNpmDir = join(WORKSPACE_ROOT, "node_modules/@deepfuture/dui-inspector");
const inspectorExports: Record<string, string> = {
  ".": "./index.js",
  "./api": "./api.js",
};

const duiWorkspacePlugin: esbuild.Plugin = {
  name: "dui-workspace",
  setup(build) {
    // Resolve @dui/* imports
    build.onResolve({ filter: /^@dui\// }, (args) => {
      // @dui/core is now part of @dui/primitives — rewrite the prefix
      // e.g. @dui/core/base → @dui/primitives/core/base
      let importPath = args.path;
      if (importPath === "@dui/core" || importPath.startsWith("@dui/core/")) {
        importPath = importPath.replace("@dui/core", "@dui/primitives/core");
      }

      // @dui/inspector → npm package @deepfuture/dui-inspector
      if (importPath === "@dui/inspector" || importPath.startsWith("@dui/inspector/")) {
        const subpath = importPath === "@dui/inspector" ? "." : "." + importPath.slice("@dui/inspector".length);
        const mapped = inspectorExports[subpath];
        if (mapped) {
          return { path: resolve(inspectorNpmDir, mapped) };
        }
      }

      for (const [pkgName, pkg] of Object.entries(workspacePackages)) {
        if (!importPath.startsWith(pkgName)) continue;
        const subpath = "." + importPath.slice(pkgName.length);
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
    'Import: import "@dui/components/button"; // self-registers',
    'Or: import { DuiButton } from "@dui/components/button"; // also self-registers',
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
