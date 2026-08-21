import * as esbuild from "esbuild";
import { resolve, join } from "jsr:@std/path@^1";

const DEFAULT_PORT = 4040;
const STATIC_DIR = resolve(import.meta.dirname!, "static");
const DOCS_ENTRY = resolve(import.meta.dirname!, "src/index.ts");
const THEME_EDITOR_ENTRY = resolve(import.meta.dirname!, "src/theme-editor.ts");
const INSPECTOR_ENTRY = resolve(import.meta.dirname!, "src/inspector.ts");
const PREVIEW_TEMPLATE_ENTRY = resolve(import.meta.dirname!, "src/preview-template.ts");
const DASHBOARD_EXEMPLAR_ENTRY = resolve(import.meta.dirname!, "src/dashboard-exemplar.ts");
// Spike branch only: scratch consumer for the "eject select" experiment.
const SPIKE_EJECT_ENTRY = resolve(import.meta.dirname!, "../spike-eject/src/spike-eject.ts");
const SPIKE_HEADLESS_ENTRY = resolve(import.meta.dirname!, "../spike-headless/src/spike-headless.ts");
const CONTEXT_ORDER_PROBE_ENTRY = resolve(import.meta.dirname!, "../spike-headless/src/context-order-probe.ts");
const CASCADE_PROBE_ENTRY = resolve(import.meta.dirname!, "../spike-headless/src/cascade-probe.ts");
const LIGHT_DOM_PROBE_ENTRY = resolve(import.meta.dirname!, "../spike-headless/src/light-dom-probe.ts");
const TOAST_PROBE_ENTRY = resolve(import.meta.dirname!, "../spike-headless/src/toast-probe.ts");
const BUI_P1_ENTRY = resolve(import.meta.dirname!, "../spike-light/src/probes/p1.ts");
const BUI_P4_ENTRY = resolve(import.meta.dirname!, "../spike-light/src/probes/p4.ts");
const BUI_P2_ENTRY = resolve(import.meta.dirname!, "../spike-light/src/probes/p2.ts");
const BUI_P2_REACT_ENTRY = resolve(import.meta.dirname!, "../spike-light/src/probes/p2-react.ts");
const BUI_P3_ENTRY = resolve(import.meta.dirname!, "../spike-light/src/probes/p3.ts");
const BUI_P7_ENTRY = resolve(import.meta.dirname!, "../spike-light/src/probes/p7.ts");
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

// llms.txt is generated from the component registry by a standalone module
// (scripts/generate-llms.ts) so it can be regenerated without the docs server.
import { generateLlmsTxt } from "../../scripts/generate-llms.ts";

// Write llms.txt before starting the server
const llmsTxt = generateLlmsTxt();
await Deno.writeTextFile(join(STATIC_DIR, "llms.txt"), llmsTxt);
console.log("Generated llms.txt");

// Regenerate skill references from the registry
import { generateComponentsMd } from "../../scripts/generate-skill-refs.ts";
const skillRefsPath = join(WORKSPACE_ROOT, "skills", "dui", "references", "components.md");
await Deno.writeTextFile(skillRefsPath, generateComponentsMd());
console.log("Generated skills/dui/references/components.md");

/**
 * Explicit `out` names rather than a bare path list. esbuild derives `outbase`
 * from the entry points' common ancestor directory, so a single entry outside
 * `packages/docs/src` (SPIKE_EJECT_ENTRY) would push every bundle down a
 * directory — `/index.js` would become `/docs/src/index.js` and every existing
 * docs URL would 404. Naming the outputs pins them regardless of outbase.
 */
const ENTRY_POINTS = [
  { in: DOCS_ENTRY, out: "index" },
  { in: THEME_EDITOR_ENTRY, out: "theme-editor" },
  { in: INSPECTOR_ENTRY, out: "inspector" },
  { in: PREVIEW_TEMPLATE_ENTRY, out: "preview-template" },
  { in: DASHBOARD_EXEMPLAR_ENTRY, out: "dashboard-exemplar" },
  { in: SPIKE_EJECT_ENTRY, out: "spike-eject" },
  { in: SPIKE_HEADLESS_ENTRY, out: "spike-headless" },
  { in: CONTEXT_ORDER_PROBE_ENTRY, out: "context-order-probe" },
  { in: CASCADE_PROBE_ENTRY, out: "cascade-probe" },
  { in: LIGHT_DOM_PROBE_ENTRY, out: "light-dom-probe" },
  { in: TOAST_PROBE_ENTRY, out: "toast-probe" },
  { in: BUI_P1_ENTRY, out: "bui-p1" },
  { in: BUI_P4_ENTRY, out: "bui-p4" },
  { in: BUI_P2_ENTRY, out: "bui-p2" },
  { in: BUI_P2_REACT_ENTRY, out: "bui-p2-react" },
  { in: BUI_P3_ENTRY, out: "bui-p3" },
  { in: BUI_P7_ENTRY, out: "bui-p7" },
];

const buildMode = Deno.args.includes("--build");

if (buildMode) {
  await esbuild.build({
    entryPoints: ENTRY_POINTS,
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
    entryPoints: ENTRY_POINTS,
    bundle: true,
    format: "esm",
    target: "es2022",
    outdir: STATIC_DIR,
    write: false,
    plugins: [duiWorkspacePlugin, rawTextPlugin, cssRawTextPlugin],
    nodePaths: [join(WORKSPACE_ROOT, "node_modules")],
    define: { __DUI_VERSION__: JSON.stringify(CORE_VERSION) },
    banner: {
      // Live reload, but only the *visible* tab holds an SSE connection.
      // esbuild's dev server is HTTP/1.1 and browsers cap concurrent
      // connections at ~6 per host, so a persistent EventSource per tab
      // exhausts the pool once ~6 docs tabs are open and new tabs hang.
      // Each tab drops its connection when hidden and reconnects when shown;
      // a BroadcastChannel relays the change so backgrounded tabs still
      // reload without each holding a slot.
      js: `(() => {
        const channel = new BroadcastChannel("dui-docs-reload");
        channel.onmessage = () => location.reload();
        let es = null;
        const connect = () => {
          if (es) return;
          es = new EventSource("/esbuild");
          es.addEventListener("change", () => { channel.postMessage("change"); location.reload(); });
        };
        const disconnect = () => { es?.close(); es = null; };
        document.addEventListener("visibilitychange", () => document.hidden ? disconnect() : connect());
        if (!document.hidden) connect();
      })();`,
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
