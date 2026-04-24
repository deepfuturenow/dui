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
const PRIMITIVES_ROOT = resolve(ROOT, "../dui-primitives");

/** Package definitions mapping source to npm package names */
const PACKAGES = [
  {
    name: "@deepfuture/dui-components",
    srcDir: "packages/components",
    distDir: "dui-components",
    description: "DUI styled web components — extends dui-primitives with design tokens and variant CSS",
    dependencies: {
      "@deepfuture/dui-core": "0.1.0",
      "@deepfuture/dui-primitives": "0.1.0",
      "lit": "^3.3.2",
      "@lit/context": "^1.1.3",
    },
  },
  {
    name: "@deepfuture/dui-templates",
    srcDir: "packages/templates",
    distDir: "dui-templates",
    description: "DUI templates — pre-composed UI patterns built from DUI components",
    dependencies: {
      "@deepfuture/dui-core": "0.1.0",
      "@deepfuture/dui-components": "0.1.0",
      "lit": "^3.3.2",
    },
  },
] as const;

/** Read version from packages/components/deno.json (this repo's source of truth) */
async function getVersion(): Promise<string> {
  const json = JSON.parse(
    await Deno.readTextFile(join(ROOT, "packages/components/deno.json")),
  );
  return json.version ?? "0.1.0";
}

/** Read the primitives version for cross-repo dependency pinning */
async function getPrimitivesVersion(): Promise<string> {
  const json = JSON.parse(
    await Deno.readTextFile(join(PRIMITIVES_ROOT, "packages/core/deno.json")),
  );
  return json.version ?? "0.1.0";
}

/** Rewrite @dui/* imports to @deepfuture/dui-* in file content */
function rewriteImports(content: string): string {
  const rewrites: [string, string][] = [
    ["@dui/core", "@deepfuture/dui-core"],
    ["@dui/primitives", "@deepfuture/dui-primitives"],
    ["@dui/components", "@deepfuture/dui-components"],
    ["@dui/inspector", "@deepfuture/dui-inspector"],
    ["@dui/templates", "@deepfuture/dui-templates"],
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
      // Standard decorators (TC39) — required for @lit/context's @provide
      // and @consume to compose correctly with Lit's @state decorator.
      // Do NOT use experimentalDecorators — __decorate overwrites @provide's
      // Object.defineProperty wrapper, breaking context propagation.
      lib: ["DOM", "DOM.Iterable", "ES2022"],
      skipLibCheck: true,
      strict: false,
      noEmit: false,
      noEmitOnError: false,
      // Resolve @dui/* workspace imports for type-checking
      paths: {
        "@dui/core": [join(PRIMITIVES_ROOT, "packages/core/src/index.ts")],
        "@dui/core/*": [join(PRIMITIVES_ROOT, "packages/core/src/*.ts")],
        "@dui/primitives/*": [join(PRIMITIVES_ROOT, "packages/primitives/src/*/index.ts")],
        "@dui/components": [join(ROOT, "packages/components/src/all.ts")],
        "@dui/components/*": [join(ROOT, "packages/components/src/*/index.ts")],
        "@dui/templates": [join(ROOT, "packages/templates/src/all.ts")],
        "@dui/templates/*": [join(ROOT, "packages/templates/src/*.ts")],
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

  // Handle CSS text imports (tokens, prose):
  // Find all `import x from "./foo.css" with { type: "text" }` in .js output,
  // read the corresponding CSS source, and inline it as a const string.
  if (pkg.srcDir === "packages/components") {
    const cssImportRe = /import\s+(\w+)\s+from\s+["'](\.\/.+?\.css)["']\s*(?:with\s*\{[^}]*\})?\s*;/g;

    for await (const filePath of walkDir(outDir)) {
      if (!filePath.endsWith(".js")) continue;
      let js = await Deno.readTextFile(filePath);
      let modified = false;

      js = js.replace(cssImportRe, (_match, varName, cssRelPath) => {
        // Resolve CSS path relative to the JS file's location in the source tree
        const jsRelDir = relative(outDir, dirname(filePath));
        const cssFileName = cssRelPath.replace("./", "");
        const cssSourcePath = join(ROOT, pkg.srcDir, "src", jsRelDir, cssFileName);
        try {
          const cssContent = Deno.readTextFileSync(cssSourcePath);
          // Also copy the raw CSS file for consumers who want it
          const cssOutPath = join(outDir, jsRelDir, cssFileName);
          try { Deno.writeTextFileSync(cssOutPath, cssContent); } catch { /* already exists */ }
          modified = true;
          return `const ${varName} = ${JSON.stringify(cssContent)};`;
        } catch {
          console.warn(`   \u26a0\ufe0f  CSS file not found: ${cssSourcePath}`);
          return _match;
        }
      });

      if (modified) await Deno.writeTextFile(filePath, js);
    }
    console.log(`   Inlined CSS text imports`);
  }

  // Fix .ts extension imports in output .js files → .js
  // (tsc preserves import paths as-is, but they reference .ts in source)
  await fixExtensionsInDir(outDir);

  // Rewrite @dui/* → @deepfuture/dui-*
  console.log(`   Rewriting imports...`);
  await rewriteImportsInDir(outDir);

  // Generate package.json
  const primVer = await getPrimitivesVersion();
  const packageJson = generatePackageJson(pkg, version, primVer);
  await Deno.writeTextFile(
    join(outDir, "package.json"),
    JSON.stringify(packageJson, null, 2) + "\n",
  );

  // Copy global.d.ts for primitives (HTMLElementTagNameMap)
  if (pkg.srcDir === "packages/primitives") {
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
  primitivesVersion: string,
): Record<string, unknown> {
  const deps = { ...pkg.dependencies } as Record<string, string>;

  // Fix lockstep version references
  // Core and primitives are pinned to the primitives repo version
  const primVer = primitivesVersion;
  if ("@deepfuture/dui-core" in deps) {
    deps["@deepfuture/dui-core"] = primVer;
  }
  if ("@deepfuture/dui-primitives" in deps) {
    deps["@deepfuture/dui-primitives"] = primVer;
  }
  // Components are pinned to this repo's version
  if ("@deepfuture/dui-components" in deps) {
    deps["@deepfuture/dui-components"] = version;
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
    // Do NOT set sideEffects:false — DUI components register via
    // customElements.define (a global side effect). Marking them
    // side-effect-free lets bundlers tree-shake the registration away.
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

  // Post-build smoke tests
  await verifyBuildOutput();

  console.log("\n✨ Build complete! Output in dist/");
  console.log("   dist/dui-components/");

  console.log("   dist/dui-templates/");
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

/**
 * Post-build smoke tests — catch packaging bugs before they reach consumers.
 * Runs automatically after every build.
 */
async function verifyBuildOutput(): Promise<void> {
  console.log("\n🔍 Verifying build output...");
  const errors: string[] = [];

  // 1. No experimental __decorate helper (must use standard __esDecorate)
  for await (const file of walkDir(join(DIST, "dui-components"))) {
    if (!file.endsWith(".js")) continue;
    const content = await Deno.readTextFile(file);
    // Match __decorate definition, not references in comments
    if (content.includes("var __decorate") || content.includes("this.__decorate")) {
      errors.push(`Experimental __decorate found in ${relative(DIST, file)} — build must use standard decorators`);
    }
  }

  // 2. No sideEffects:false in any package.json
  for (const pkg of PACKAGES) {
    const pkgJsonPath = join(DIST, pkg.distDir, "package.json");
    try {
      const pkgJson = JSON.parse(await Deno.readTextFile(pkgJsonPath));
      if (pkgJson.sideEffects === false) {
        errors.push(`${pkg.name}/package.json has sideEffects:false — breaks tree-shaking of barrel re-exports`);
      }
    } catch { /* package not built */ }
  }

  // 3. Verify all.js exists in styled components
  const allJs = join(DIST, "dui-components", "all.js");
  try {
    await Deno.stat(allJs);
  } catch {
    errors.push(`all.js not found at ${allJs}`);
  }

  if (errors.length > 0) {
    console.error("\n❌ Build verification FAILED:");
    for (const e of errors) {
      console.error(`   • ${e}`);
    }
    Deno.exit(1);
  }

  console.log("   ✅ No experimental __decorate helpers");
  console.log("   ✅ No sideEffects:false in package.json");
  console.log("   ✅ all.js exists in dui-components");
}

main();
