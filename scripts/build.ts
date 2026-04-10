#!/usr/bin/env -S deno run --allow-all
/**
 * Build script — compiles DUI packages to npm-publishable JS + .d.ts.
 *
 * Following Lit's publishing guidance:
 * - Compile TypeScript → JavaScript + declaration files
 * - Don't bundle (let consumer bundlers deduplicate Lit)
 * - Don't minify (consumer bundlers handle this)
 * - Preserve module structure
 *
 * Uses tsc for compilation (handles decorators on private fields correctly).
 *
 * Output: dist/<package-name>/
 */

import { resolve, join, relative, dirname } from "jsr:@std/path@^1";
import { ensureDir, exists } from "jsr:@std/fs@^1";

const ROOT = resolve(import.meta.dirname!, "..");
const DIST = join(ROOT, "dist");

/** Package definitions mapping source to npm package names */
const PACKAGES = [
  {
    name: "@deepfuture/dui-core",
    srcDir: "packages/core",
    distDir: "dui-core",
    description: "DUI core — applyTheme(), setup(), event factory, base styles",
    dependencies: {
      "lit": "^3.3.2",
      "@floating-ui/dom": "^1.7.4",
    },
  },
  {
    name: "@deepfuture/dui-components",
    srcDir: "packages/components",
    distDir: "dui-components",
    description: "DUI unstyled web components — structural CSS only, themed via applyTheme()",
    dependencies: {
      "@deepfuture/dui-core": "0.1.0",
      "lit": "^3.3.2",
      "@lit/context": "^1.1.3",
    },
  },
  {
    name: "@deepfuture/dui-theme-default",
    srcDir: "packages/theme-default",
    distDir: "dui-theme-default",
    description: "DUI default theme — design tokens and aesthetic component styles",
    dependencies: {
      "@deepfuture/dui-core": "0.1.0",
      "lit": "^3.3.2",
    },
  },
  {
    name: "@deepfuture/dui-inspector",
    srcDir: "packages/inspector",
    distDir: "dui-inspector",
    description: "DUI Inspector — introspection, mutation, and source mapping for DUI components",
    dependencies: {
      "lit": "^3.3.2",
    },
  },
] as const;

/** Read version from packages/core/deno.json */
async function getVersion(): Promise<string> {
  const coreJson = JSON.parse(
    await Deno.readTextFile(join(ROOT, "packages/core/deno.json")),
  );
  return coreJson.version ?? "0.1.0";
}

/** Rewrite @dui/* imports to @deepfuture/dui-* in file content */
function rewriteImports(content: string): string {
  const rewrites: [string, string][] = [
    ["@dui/core", "@deepfuture/dui-core"],
    ["@dui/components", "@deepfuture/dui-components"],
    ["@dui/theme-default", "@deepfuture/dui-theme-default"],
    ["@dui/inspector", "@deepfuture/dui-inspector"],
  ];
  let result = content;
  for (const [from, to] of rewrites) {
    result = result.replaceAll(`"${from}`, `"${to}`);
    result = result.replaceAll(`'${from}`, `'${to}`);
  }
  return result;
}

/** Recursively rewrite imports in all .js and .d.ts files */
async function rewriteImportsInDir(dir: string): Promise<void> {
  for await (const entry of Deno.readDir(dir)) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory) {
      await rewriteImportsInDir(fullPath);
    } else if (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts")) {
      const content = await Deno.readTextFile(fullPath);
      const rewritten = rewriteImports(content);
      if (rewritten !== content) {
        await Deno.writeTextFile(fullPath, rewritten);
      }
    }
  }
}

/** Build the "exports" field for package.json from the deno.json exports */
function buildExportsMap(
  pkg: typeof PACKAGES[number],
): Record<string, { import: string; types: string } | string> {
  const denoJson = JSON.parse(
    Deno.readTextFileSync(join(ROOT, pkg.srcDir, "deno.json")),
  );
  const exports: Record<string, { import: string; types: string } | string> = {};

  for (const [key, value] of Object.entries(denoJson.exports as Record<string, string>)) {
    // Convert ./src/foo.ts → ./foo.js
    const jsPath = (value as string)
      .replace(/^\.\/src\//, "./")
      .replace(/\.ts$/, ".js");
    const dtsPath = jsPath.replace(/\.js$/, ".d.ts");

    exports[key] = {
      import: jsPath,
      types: dtsPath,
    };
  }

  return exports;
}

/**
 * Compile a package using tsc.
 * Emits both JS and .d.ts with proper decorator handling.
 */
async function compilePackage(
  pkg: typeof PACKAGES[number],
  version: string,
): Promise<void> {
  const srcRoot = join(ROOT, pkg.srcDir, "src");
  const outDir = join(DIST, pkg.distDir);

  console.log(`\n📦 Building ${pkg.name}...`);

  // Clean output
  try {
    await Deno.remove(outDir, { recursive: true });
  } catch { /* doesn't exist */ }
  await ensureDir(outDir);

  // Create a tsconfig for this package
  const tsconfig = {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      declaration: true,
      declarationMap: false,
      sourceMap: false,
      outDir: outDir,
      rootDir: srcRoot,
      experimentalDecorators: true,
      useDefineForClassFields: false,
      lib: ["DOM", "DOM.Iterable", "ES2022"],
      skipLibCheck: true,
      strict: false,
      noEmit: false,
      noEmitOnError: false,
      // Resolve @dui/* workspace imports for type-checking
      paths: {
        "@dui/core": [join(ROOT, "packages/core/src/index.ts")],
        "@dui/core/*": [join(ROOT, "packages/core/src/*.ts")],
        "@dui/components/*": [join(ROOT, "packages/components/src/*/index.ts")],
        "@dui/theme-default": [join(ROOT, "packages/theme-default/src/index.ts")],
        "@dui/theme-default/*": [join(ROOT, "packages/theme-default/src/*.ts")],
        "@dui/inspector": [join(ROOT, "packages/inspector/src/index.ts")],
        "@dui/inspector/*": [join(ROOT, "packages/inspector/src/*.ts")],
      },
    },
    include: [srcRoot + "/**/*.ts"],
    exclude: [srcRoot + "/**/*.test.ts"],
  };

  const tsconfigPath = join(outDir, "_tsconfig.build.json");
  await Deno.writeTextFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));

  // Run tsc
  console.log(`   Compiling with tsc...`);
  const tscCmd = new Deno.Command("npx", {
    args: ["tsc", "--project", tsconfigPath],
    cwd: ROOT,
    stdout: "piped",
    stderr: "piped",
  });
  const tscResult = await tscCmd.output();
  const stderr = new TextDecoder().decode(tscResult.stderr);
  const stdout = new TextDecoder().decode(tscResult.stdout);

  if (!tscResult.success) {
    // Filter out known harmless errors (TS5097 = .ts extensions, TS6059 = rootDir cross-ref,
    // TS1240/TS1206 = decorator signature mismatches in tsc 5.x with experimental decorators)
    const output = (stdout + stderr).trim();
    const lines = output.split("\n");
    const serious = lines.filter(l =>
      l.includes("error TS") &&
      !l.includes("TS5097") &&
      !l.includes("TS6059") &&
      !l.includes("TS1240") &&
      !l.includes("TS1206") &&
      !l.includes("TS2304") &&
      !l.includes("TS2307") &&
      !l.includes("TS2823")
    );
    if (serious.length > 0) {
      console.warn(`   \u26a0\ufe0f  tsc errors (${serious.length}):\n${serious.slice(0, 5).join("\n")}`);
    }
  }

  // Clean up tsconfig
  await Deno.remove(tsconfigPath);

  // Handle CSS text imports for theme-default:
  // Replace `import x from "./tokens.css" with { type: "text" }` with inlined CSS string
  if (pkg.srcDir === "packages/theme-default") {
    const cssFile = join(ROOT, pkg.srcDir, "src", "tokens.css");
    if (await exists(cssFile)) {
      // Copy CSS file for consumers who want it raw
      await Deno.copyFile(cssFile, join(outDir, "tokens.css"));
      console.log(`   Copied tokens.css`);

      // Inline CSS into tokens.js and tokens-raw.js
      const cssContent = await Deno.readTextFile(cssFile);
      const escapedCSS = JSON.stringify(cssContent);

      for (const jsFile of ["tokens.js", "tokens-raw.js"]) {
        const jsPath = join(outDir, jsFile);
        if (await exists(jsPath)) {
          let js = await Deno.readTextFile(jsPath);
          // Replace: import tokensCSS from "./tokens.css" with { type: "text" };
          js = js.replace(
            /import\s+(\w+)\s+from\s+["']\.\/tokens\.css["']\s*(?:with\s*\{[^}]*\})?\s*;/,
            `const $1 = ${escapedCSS};`,
          );
          await Deno.writeTextFile(jsPath, js);
        }
      }
      console.log(`   Inlined tokens.css into JS modules`);
    }
  }

  // Fix .ts extension imports in output .js files → .js
  // (tsc preserves import paths as-is, but they reference .ts in source)
  await fixExtensionsInDir(outDir);

  // Rewrite @dui/* → @deepfuture/dui-*
  console.log(`   Rewriting imports...`);
  await rewriteImportsInDir(outDir);

  // Generate package.json
  const packageJson = generatePackageJson(pkg, version);
  await Deno.writeTextFile(
    join(outDir, "package.json"),
    JSON.stringify(packageJson, null, 2) + "\n",
  );

  // Copy global.d.ts for components (HTMLElementTagNameMap)
  if (pkg.srcDir === "packages/components") {
    const globalDts = join(ROOT, pkg.srcDir, "src/global.d.ts");
    if (await exists(globalDts)) {
      let content = await Deno.readTextFile(globalDts);
      // Rewrite .ts imports to .js for the declaration file
      content = content.replace(
        /(from\s+["'])(\.\.?\/[^"']*?)\.ts(["'])/g,
        '$1$2.js$3',
      );
      await Deno.writeTextFile(join(outDir, "global.d.ts"), content);
      console.log(`   \u2705 HTMLElementTagNameMap declarations included`);
    }
  }

  // Copy README into dist folder (npm displays it on the package page)
  const readmePath = join(ROOT, "README.md");
  if (await exists(readmePath)) {
    await Deno.copyFile(readmePath, join(outDir, "README.md"));
  }

  // Count output files
  let jsCount = 0, dtsCount = 0;
  for await (const entry of walkDir(outDir)) {
    if (entry.endsWith(".js")) jsCount++;
    if (entry.endsWith(".d.ts")) dtsCount++;
  }

  console.log(`   ✅ ${pkg.name} → dist/${pkg.distDir}/ (${jsCount} .js, ${dtsCount} .d.ts)`);
}

/** Walk directory recursively, yielding file paths */
async function* walkDir(dir: string): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(dir)) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory) {
      yield* walkDir(fullPath);
    } else {
      yield fullPath;
    }
  }
}

/** Fix .ts extensions in import/export statements → .js */
async function fixExtensionsInDir(dir: string): Promise<void> {
  for await (const entry of Deno.readDir(dir)) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory) {
      await fixExtensionsInDir(fullPath);
    } else if (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts")) {
      let content = await Deno.readTextFile(fullPath);
      // Fix: from "./foo.ts" → from "./foo.js" and import "./foo.ts" → import "./foo.js"
      const fixed = content.replace(
        /((?:from|import)\s+["'])(\.\.?\/[^"']*?)\.ts(["'])/g,
        "$1$2.js$3",
      );
      if (fixed !== content) {
        await Deno.writeTextFile(fullPath, fixed);
      }
    }
  }
}

/** Generate package.json for an npm package */
function generatePackageJson(
  pkg: typeof PACKAGES[number],
  version: string,
): Record<string, unknown> {
  const deps = { ...pkg.dependencies } as Record<string, string>;

  // Fix lockstep version references
  if ("@deepfuture/dui-core" in deps) {
    deps["@deepfuture/dui-core"] = version;
  }

  const packageJson: Record<string, unknown> = {
    name: pkg.name,
    version,
    description: pkg.description,
    type: "module",
    license: "MIT",
    repository: {
      type: "git",
      url: "https://github.com/deepfuturenow/dui.git",
      directory: pkg.srcDir,
    },
    exports: buildExportsMap(pkg),
    files: ["**/*.js", "**/*.d.ts", "**/*.css", "README.md"],
    dependencies: deps,
    sideEffects: false,
    keywords: [
      "web-components",
      "lit",
      "unstyled",
      "components",
      "dui",
      "theme",
    ],
  };

  // For components package, include the global type declarations
  if (pkg.srcDir === "packages/components") {
    packageJson.types = "./global.d.ts";
    packageJson.typesVersions = {
      "*": {
        "*": ["./*"],
      },
    };
  }

  return packageJson;
}

// --- Main ---
async function main() {
  console.log("🔨 DUI Build — compiling packages for npm distribution\n");

  // Clean dist (but preserve dui-cdn if it exists)
  for (const pkg of PACKAGES) {
    try {
      await Deno.remove(join(DIST, pkg.distDir), { recursive: true });
    } catch { /* doesn't exist */ }
  }
  await ensureDir(DIST);

  const version = await getVersion();
  console.log(`📋 Version: ${version}`);

  for (const pkg of PACKAGES) {
    await compilePackage(pkg, version);
  }

  // Clean up any tsc artifacts leaked into source directories
  // (happens when tsc resolves cross-package @dui/* paths)
  await cleanTscArtifacts(join(ROOT, "packages"));

  console.log("\n✨ Build complete! Output in dist/");
  console.log("   dist/dui-core/");
  console.log("   dist/dui-components/");
  console.log("   dist/dui-theme-default/");
  console.log("   dist/dui-inspector/");
}

/** Remove .js and .d.ts files that tsc leaked into source directories */
async function cleanTscArtifacts(dir: string): Promise<void> {
  for await (const entry of Deno.readDir(dir)) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory) {
      await cleanTscArtifacts(fullPath);
    } else if (
      (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts")) &&
      !entry.name.endsWith(".global.d.ts")
    ) {
      // Check if there's a corresponding .ts source file
      const tsPath = fullPath.replace(/\.js$/, ".ts").replace(/\.d\.ts$/, ".ts");
      try {
        await Deno.stat(tsPath);
        // .ts source exists → this .js/.d.ts is a tsc artifact
        await Deno.remove(fullPath);
      } catch { /* no .ts source → keep it */ }
    }
  }
}

main();
