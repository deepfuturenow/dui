#!/usr/bin/env -S deno run --allow-all
/**
 * Lockstep publish — builds all packages and publishes to npm.
 *
 * Usage:
 *   deno run --allow-all scripts/publish.ts           # dry run
 *   deno run --allow-all scripts/publish.ts --publish  # real publish
 *
 * Prerequisites:
 *   - npm login (must be authenticated to @deepfuture org)
 *   - All changes committed and pushed
 */

import { resolve, join } from "jsr:@std/path@^1";

const ROOT = resolve(import.meta.dirname!, "..");
const DIST = join(ROOT, "dist");

const PACKAGES = [
  "dui-core",
  "dui-components",
  "dui-theme-default",
  "dui-theme-default-templates",
  "dui-inspector",
  "dui-cdn",
] as const;

async function run(cmd: string[], cwd: string): Promise<boolean> {
  const proc = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
    cwd,
    stdout: "inherit",
    stderr: "inherit",
  });
  const result = await proc.output();
  return result.success;
}

async function main() {
  const dryRun = !Deno.args.includes("--publish");

  if (dryRun) {
    console.log("🏗️  DUI Publish — DRY RUN (pass --publish to actually publish)\n");
  } else {
    console.log("🚀 DUI Publish — LIVE PUBLISH to npm\n");
  }

  // Step 1: Build all packages
  console.log("Step 1: Building packages...\n");
  const buildOk = await run(["deno", "run", "--allow-all", "scripts/build.ts"], ROOT);
  if (!buildOk) {
    console.error("❌ Build failed");
    Deno.exit(1);
  }

  // Step 2: Build CDN bundle
  console.log("\nStep 2: Building CDN bundle...\n");
  const cdnOk = await run(["deno", "run", "--allow-all", "scripts/build-cdn.ts"], ROOT);
  if (!cdnOk) {
    console.error("❌ CDN build failed");
    Deno.exit(1);
  }

  // Step 3: Verify all packages have package.json
  console.log("\nStep 3: Verifying packages...\n");
  for (const pkg of PACKAGES) {
    const pkgDir = join(DIST, pkg);
    try {
      const pkgJson = JSON.parse(
        await Deno.readTextFile(join(pkgDir, "package.json")),
      );
      console.log(`   ✅ ${pkgJson.name}@${pkgJson.version}`);
    } catch {
      console.error(`   ❌ ${pkg}: missing package.json`);
      Deno.exit(1);
    }
  }

  // Step 4: Publish (or dry-run)
  console.log(`\nStep 4: ${dryRun ? "Dry-run" : "Publishing"}...\n`);

  // Publish order matters: core first, then components + theme, then CDN
  const publishOrder = ["dui-core", "dui-components", "dui-theme-default", "dui-inspector", "dui-cdn"];

  for (const pkg of publishOrder) {
    const pkgDir = join(DIST, pkg);
    const args = dryRun
      ? ["npm", "publish", "--access", "public", "--dry-run"]
      : ["npm", "publish", "--access", "public"];

    console.log(`   📤 ${pkg}...`);
    const ok = await run(args, pkgDir);
    if (!ok) {
      console.error(`   ❌ Failed to publish ${pkg}`);
      Deno.exit(1);
    }
  }

  console.log(`\n✨ ${dryRun ? "Dry run" : "Publish"} complete!`);
  if (dryRun) {
    console.log("   Run with --publish to actually publish to npm.");
  }
}

main();
