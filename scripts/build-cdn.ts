#!/usr/bin/env -S deno run --allow-all
/**
 * CDN build script — creates a single pre-bundled file with all components
 * and Lit inlined. Zero dependencies at runtime.
 *
 * Output: dist/dui-cdn/dui.min.js
 *
 * Usage:
 *   <script type="module" src="https://cdn.jsdelivr.net/npm/@deepfuture/dui-cdn/dui.min.js"></script>
 *
 * This auto-registers all components (import = ready).
 */

import { resolve, join } from "jsr:@std/path@^1";
import { ensureDir } from "jsr:@std/fs@^1";
import * as esbuild from "npm:esbuild@0.25.2";

const ROOT = resolve(import.meta.dirname!, "..");
const PRIMITIVES_ROOT = resolve(ROOT, "../dui-primitives");
const DIST = join(ROOT, "dist", "dui-cdn");

// Self-registering — nothing to wire
const CDN_ENTRY = `
import "@dui/components";
`;

/** Resolve @dui/* workspace imports */
function duiResolverPlugin(): esbuild.Plugin {
  const workspacePackages: Record<string, { dir: string; exports: Record<string, string> }> = {
    "@dui/primitives": {
      dir: join(PRIMITIVES_ROOT, "packages/primitives"),
      exports: JSON.parse(Deno.readTextFileSync(join(PRIMITIVES_ROOT, "packages/primitives/deno.json"))).exports,
    },
    "@dui/components": {
      dir: join(ROOT, "packages/components"),
      exports: JSON.parse(Deno.readTextFileSync(join(ROOT, "packages/components/deno.json"))).exports,
    },
  };

  return {
    name: "dui-workspace-resolver",
    setup(build) {
      // Resolve @dui/* imports
      build.onResolve({ filter: /^@dui\// }, (args) => {
        let importPath = args.path;

        // @dui/core is now part of @dui/primitives — rewrite the prefix
        // e.g. @dui/core/base → @dui/primitives/core/base
        if (importPath === "@dui/core" || importPath.startsWith("@dui/core/")) {
          importPath = importPath.replace("@dui/core", "@dui/primitives/core");
        }

        for (const [pkgName, pkg] of Object.entries(workspacePackages)) {
          if (importPath === pkgName || importPath.startsWith(pkgName + "/")) {
            const subpath = importPath === pkgName
              ? "."
              : "./" + importPath.slice(pkgName.length + 1);

            const mapped = pkg.exports[subpath];
            if (mapped) {
              return { path: join(pkg.dir, mapped) };
            }
          }
        }
        return undefined;
      });

      // Handle CSS imports with `with { type: "text" }`
      build.onLoad({ filter: /\.css$/ }, async (args) => {
        const css = await Deno.readTextFile(args.path);
        return {
          contents: `export default ${JSON.stringify(css)};`,
          loader: "js",
        };
      });
    },
  };
}

async function main() {
  console.log("🌐 DUI CDN Build — creating pre-bundled distribution\n");

  await ensureDir(DIST);

  // Write temporary entry file
  const entryPath = join(DIST, "_entry.ts");
  await Deno.writeTextFile(entryPath, CDN_ENTRY);

  try {
    const result = await esbuild.build({
      entryPoints: [entryPath],
      outfile: join(DIST, "dui.min.js"),
      bundle: true,
      minify: true,
      format: "esm",
      target: "es2022",
      platform: "browser",
      plugins: [duiResolverPlugin()],
      metafile: true,
      legalComments: "none",
    });

    // Also build a non-minified version for debugging
    await esbuild.build({
      entryPoints: [entryPath],
      outfile: join(DIST, "dui.js"),
      bundle: true,
      minify: false,
      format: "esm",
      target: "es2022",
      platform: "browser",
      plugins: [duiResolverPlugin()],
      legalComments: "none",
    });

    // Report sizes
    const minified = await Deno.stat(join(DIST, "dui.min.js"));
    const unminified = await Deno.stat(join(DIST, "dui.js"));

    console.log(`   dui.min.js: ${(minified.size / 1024).toFixed(1)} KB`);
    console.log(`   dui.js:     ${(unminified.size / 1024).toFixed(1)} KB`);

    // Gzip size estimate
    const minContent = await Deno.readFile(join(DIST, "dui.min.js"));
    const compressed = new Blob([minContent]).stream().pipeThrough(
      new CompressionStream("gzip"),
    );
    const compressedData = await new Response(compressed).arrayBuffer();
    console.log(`   dui.min.js (gzip): ${(compressedData.byteLength / 1024).toFixed(1)} KB`);

    // Write package.json
    const version = JSON.parse(
      await Deno.readTextFile(join(ROOT, "packages/components/deno.json")),
    ).version ?? "0.1.0";

    const packageJson = {
      name: "@deepfuture/dui-cdn",
      version,
      description: "DUI CDN bundle — all components, Lit inlined. Zero dependencies.",
      type: "module",
      license: "MIT",
      main: "dui.min.js",
      module: "dui.min.js",
      unpkg: "dui.min.js",
      jsdelivr: "dui.min.js",
      exports: {
        ".": "./dui.min.js",
        "./dui.js": "./dui.js",
        "./dui.min.js": "./dui.min.js",
      },
      files: ["dui.js", "dui.min.js"],
      keywords: [
        "web-components",
        "lit",
        "unstyled",
        "components",
        "dui",
        "cdn",
      ],
      repository: {
        type: "git",
        url: "https://github.com/deepfuturenow/dui.git",
      },
      sideEffects: true,
    };

    await Deno.writeTextFile(
      join(DIST, "package.json"),
      JSON.stringify(packageJson, null, 2) + "\n",
    );

    console.log(`\n✅ CDN bundle ready → dist/dui-cdn/`);
  } finally {
    // Clean up temp entry
    try { await Deno.remove(entryPath); } catch { /* ok */ }
    esbuild.stop();
  }
}

main();
