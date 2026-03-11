import * as esbuild from "esbuild";
import { resolve, join } from "jsr:@std/path@^1";

const PORT = 4040;
const STATIC_DIR = resolve(import.meta.dirname!, "static");
const ENTRY = resolve(import.meta.dirname!, "src/index.ts");
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
      "./button": "./src/button/index.ts",
      "./switch": "./src/switch/index.ts",
      "./badge": "./src/badge/index.ts",
    },
  },
  "@dui/theme-default": {
    dir: join(WORKSPACE_ROOT, "packages/theme-default"),
    exports: {
      ".": "./src/index.ts",
      "./components/button": "./src/components/button.ts",
      "./components/switch": "./src/components/switch.ts",
      "./components/badge": "./src/components/badge.ts",
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

const ctx = await esbuild.context({
  entryPoints: [ENTRY],
  bundle: true,
  format: "esm",
  target: "es2022",
  outdir: STATIC_DIR,
  write: false,
  plugins: [duiWorkspacePlugin, cssRawTextPlugin],
  nodePaths: [join(WORKSPACE_ROOT, "node_modules")],
});

const { port } = await ctx.serve({
  port: PORT,
  servedir: STATIC_DIR,
});

console.log(`DUI docs → http://localhost:${port}`);
