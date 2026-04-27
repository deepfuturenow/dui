#!/usr/bin/env -S deno run --allow-all
/**
 * Lockstep version bump — updates version across all packages simultaneously.
 *
 * Usage:
 *   deno run --allow-all scripts/version.ts 0.2.0
 *   deno run --allow-all scripts/version.ts patch   # 0.1.0 → 0.1.1
 *   deno run --allow-all scripts/version.ts minor   # 0.1.0 → 0.2.0
 *   deno run --allow-all scripts/version.ts major   # 0.1.0 → 1.0.0
 */

import { resolve, join } from "jsr:@std/path@^1";

const ROOT = resolve(import.meta.dirname!, "..");

const PRIMITIVES_ROOT = resolve(import.meta.dirname!, "../../dui-primitives");

const DENO_JSON_FILES = [
  "packages/components/deno.json",
  "packages/templates/deno.json",
  "packages/chart/deno.json",
  "packages/map/deno.json",
  "packages/docs/deno.json",
];

function parseVersion(v: string): [number, number, number] {
  const parts = v.split(".").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid version: ${v}`);
  }
  return parts as [number, number, number];
}

function bumpVersion(current: string, bump: string): string {
  if (bump.match(/^\d+\.\d+\.\d+$/)) return bump;

  const [major, minor, patch] = parseVersion(current);
  switch (bump) {
    case "patch": return `${major}.${minor}.${patch + 1}`;
    case "minor": return `${major}.${minor + 1}.0`;
    case "major": return `${major + 1}.0.0`;
    default: throw new Error(`Unknown bump type: ${bump}. Use patch, minor, major, or x.y.z`);
  }
}

async function main() {
  const bump = Deno.args[0];
  if (!bump) {
    console.error("Usage: deno run --allow-all scripts/version.ts <patch|minor|major|x.y.z>");
    Deno.exit(1);
  }

  // Read current version from components (core/primitives are versioned separately)
  const componentsJson = JSON.parse(
    await Deno.readTextFile(join(ROOT, "packages/components/deno.json")),
  );
  const currentVersion = componentsJson.version ?? "0.1.0";
  const newVersion = bumpVersion(currentVersion, bump);

  console.log(`📦 Version bump: ${currentVersion} → ${newVersion}\n`);

  // Update all deno.json files
  for (const file of DENO_JSON_FILES) {
    const path = join(ROOT, file);
    try {
      const json = JSON.parse(await Deno.readTextFile(path));
      if (json.version) {
        json.version = newVersion;
        await Deno.writeTextFile(path, JSON.stringify(json, null, 2) + "\n");
        console.log(`   ✅ ${file}`);
      }
    } catch (e) {
      console.log(`   ⏭️  ${file} (skipped: ${e instanceof Error ? e.message : e})`);
    }
  }

  console.log(`\n✨ All packages updated to ${newVersion}`);
  console.log(`   Next: git commit and tag with v${newVersion}`);
}

main();
