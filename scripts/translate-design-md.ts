#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-net
/**
 * Translate an external DESIGN.md into a DUI-centric DESIGN.md.
 *
 * Two modes:
 *
 * 1. **Auto (Track A)** — reads a spec-compliant DESIGN.md with YAML
 *    front matter, deterministically maps tokens to DUI's 4 OKLCH
 *    primitives, and generates the output via the standard DUI template.
 *
 *    deno task translate-design-md --in ./source-DESIGN.md
 *
 * 2. **Manual** — accepts pre-interpreted values as CLI flags (for use
 *    by the translate-design-md skill, or for non-compliant sources).
 *
 *    deno task translate-design-md \
 *      --background "#0b1326" --foreground "#dae2fd" \
 *      --accent "#adc9eb" --destructive "#ffb4ab" \
 *      --font-sans "Inter" --radius "0.75rem"
 *
 * Flags:
 *   --in <path|url>        Input DESIGN.md path or URL
 *   --out <path>           Output path (default: ./DESIGN.md)
 *   --background <hex>     Override: background color as hex
 *   --foreground <hex>     Override: foreground color as hex
 *   --accent <hex>         Override: accent color as hex
 *   --destructive <hex>    Override: destructive color as hex
 *   --font-sans <name>     Override: sans-serif font family
 *   --font-serif <name>    Override: serif font family
 *   --font-mono <name>     Override: monospace font family
 *   --radius <rem>         Override: base radius (e.g. "0.75rem")
 *   --name <string>        Design system name for the header comment
 *   --visual-only          Skip interaction grammar sections
 *   --no-lint              Skip lint validation
 */

import {
  hexToOklch,
  formatOklch,
  type Oklch,
} from "./lib/oklch-to-hex.ts";

import {
  parseOklch,
  oklchToHex,
  computeDerivedHex,
} from "./lib/oklch-to-hex.ts";

import {
  generateDesignMd,
  type DesignMdConfig,
} from "./lib/design-md-template.ts";

import {
  detectSpecCompliance,
  translateSpecCompliant,
  type TranslationResult,
  type MappingDecision,
} from "./lib/stitch-to-dui.ts";

/* ═══════════════════════════════════════════════════════════════════
 * CLI argument parsing
 * ═══════════════════════════════════════════════════════════════════ */

interface CliOpts {
  inPath: string | null;
  outPath: string;
  background: string | null;
  foreground: string | null;
  accent: string | null;
  destructive: string | null;
  fontSans: string | null;
  fontSerif: string | null;
  fontMono: string | null;
  radius: string | null;
  name: string | null;
  visualOnly: boolean;
  noLint: boolean;
}

function parseArgs(args: string[]): CliOpts {
  const result: CliOpts = {
    inPath: null,
    outPath: "./DESIGN.md",
    background: null,
    foreground: null,
    accent: null,
    destructive: null,
    fontSans: null,
    fontSerif: null,
    fontMono: null,
    radius: null,
    name: null,
    visualOnly: false,
    noLint: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = () => {
      if (i + 1 >= args.length) throw new Error(`Missing value for ${arg}`);
      return args[++i];
    };
    switch (arg) {
      case "--in":          result.inPath = next(); break;
      case "--out":         result.outPath = next(); break;
      case "--background":  result.background = next(); break;
      case "--foreground":  result.foreground = next(); break;
      case "--accent":      result.accent = next(); break;
      case "--destructive": result.destructive = next(); break;
      case "--font-sans":   result.fontSans = next(); break;
      case "--font-serif":  result.fontSerif = next(); break;
      case "--font-mono":   result.fontMono = next(); break;
      case "--radius":      result.radius = next(); break;
      case "--name":        result.name = next(); break;
      case "--visual-only": result.visualOnly = true; break;
      case "--no-lint":     result.noLint = true; break;
      default:
        console.warn(`Unknown argument: ${arg}`);
    }
  }
  return result;
}

/* ═══════════════════════════════════════════════════════════════════
 * Read input (file or URL)
 * ═══════════════════════════════════════════════════════════════════ */

async function readInput(path: string): Promise<string> {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    const resp = await fetch(path);
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status} ${resp.statusText}`);
    return resp.text();
  }
  return Deno.readTextFile(path);
}

/* ═══════════════════════════════════════════════════════════════════
 * Derived color computation (same as generate-design-md.ts)
 * ═══════════════════════════════════════════════════════════════════ */

function computeAllColors(bg: Oklch, fg: Oklch, accent: Oklch, destructive: Oklch) {
  return {
    background:           oklchToHex(bg),
    foreground:           oklchToHex(fg),
    accent:               oklchToHex(accent),
    destructive:          oklchToHex(destructive),
    "surface-1":          computeDerivedHex(bg, { lightnessOffset: +0.02 }),
    "surface-2":          computeDerivedHex(bg, { lightnessOffset: +0.05 }),
    "surface-3":          computeDerivedHex(bg, { lightnessOffset: +0.09 }),
    "text-1":             computeDerivedHex(fg, { alpha: 0.90 }, bg),
    "text-2":             computeDerivedHex(fg, { alpha: 0.63 }, bg),
    "text-3":             computeDerivedHex(fg, { alpha: 0.45 }, bg),
    "border":             computeDerivedHex(fg, { alpha: 0.15 }, bg),
    "accent-subtle":      computeDerivedHex(accent, { alpha: 0.10 }, bg),
    "destructive-subtle": computeDerivedHex(destructive, { alpha: 0.10 }, bg),
  };
}

/* ═══════════════════════════════════════════════════════════════════
 * Terminal summary
 * ═══════════════════════════════════════════════════════════════════ */

function printSummary(
  result: {
    name: string | null;
    mode: "light" | "dark";
    backgroundLuminance: number;
    colors: Record<string, MappingDecision>;
    fonts: { sans: string; serif: string; mono: string };
    fontNotes: string[];
    radiusBase: string;
    radiusNote: string;
    proseSections: Record<string, string>;
    track: "A" | "B";
    specReason?: string;
  },
  outPath: string,
  outputSize: number,
) {
  const W = 62;
  const line = (s: string) => console.log(s);
  const pad = (s: string) => `  ${s}`;

  line("");
  line("┌" + "─".repeat(W) + "┐");
  line("│" + center(`DESIGN.md Translation: "${result.name ?? "Untitled"}" → DUI`, W) + "│");
  line("├" + "─".repeat(W) + "┤");
  line("│" + " ".repeat(W) + "│");

  if (result.track === "A") {
    line("│" + padRight(pad(`Track A (deterministic — spec-compliant YAML)`), W) + "│");
  } else {
    line("│" + padRight(pad(`Track B (LLM-interpreted — non-compliant source)`), W) + "│");
  }
  line("│" + padRight(pad(`Mode: ${result.mode} (background L=${result.backgroundLuminance.toFixed(2)})`), W) + "│");
  line("│" + " ".repeat(W) + "│");

  // Colors
  line("│" + padRight(pad("── Color Mapping " + "─".repeat(40)), W) + "│");
  line("│" + " ".repeat(W) + "│");

  for (const dec of Object.values(result.colors)) {
    line("│" + padRight(
      pad(`${dec.duiToken.padEnd(16)} ← ${dec.sourceToken.padEnd(20)} ${dec.sourceHex}`),
      W,
    ) + "│");
    line("│" + padRight(
      pad(`${"".padEnd(16)}   → ${dec.oklchStr}`),
      W,
    ) + "│");
    // Print warnings (notes beyond the first one, which is the standard "← source" note)
    for (const note of dec.notes) {
      if (note.startsWith("Skipped") || note.startsWith("No ")) {
        line("│" + padRight(pad(`  ⚠ ${note}`), W) + "│");
      }
    }
  }

  line("│" + " ".repeat(W) + "│");

  // Typography
  line("│" + padRight(pad("── Typography " + "─".repeat(43)), W) + "│");
  line("│" + " ".repeat(W) + "│");
  for (const n of result.fontNotes) {
    line("│" + padRight(pad(n), W) + "│");
  }

  line("│" + " ".repeat(W) + "│");

  // Radius
  line("│" + padRight(pad("── Shape " + "─".repeat(48)), W) + "│");
  line("│" + " ".repeat(W) + "│");
  line("│" + padRight(pad(`Radius base: ${result.radiusNote}`), W) + "│");

  line("│" + " ".repeat(W) + "│");

  // Prose
  line("│" + padRight(pad("── Prose " + "─".repeat(48)), W) + "│");
  line("│" + " ".repeat(W) + "│");
  const sourceCount = Object.keys(result.proseSections).length;
  if (sourceCount > 0) {
    line("│" + padRight(
      pad(`Source sections: ${Object.keys(result.proseSections).join(", ")}`),
      W,
    ) + "│");
    line("│" + padRight(
      pad(`Output: DUI template prose (use skill for merge)`),
      W,
    ) + "│");
  } else {
    line("│" + padRight(pad(`No source prose found — using DUI defaults`), W) + "│");
  }

  line("│" + " ".repeat(W) + "│");

  // Output
  line("│" + padRight(pad(`Output: ${outPath} (${outputSize.toLocaleString()} bytes)`), W) + "│");
  line("│" + " ".repeat(W) + "│");
  line("└" + "─".repeat(W) + "┘");
  line("");
}

function center(s: string, w: number): string {
  if (s.length >= w) return s.slice(0, w);
  const left = Math.floor((w - s.length) / 2);
  return " ".repeat(left) + s + " ".repeat(w - left - s.length);
}

function padRight(s: string, w: number): string {
  if (s.length >= w) return s.slice(0, w);
  return s + " ".repeat(w - s.length);
}

/* ═══════════════════════════════════════════════════════════════════
 * Lint
 * ═══════════════════════════════════════════════════════════════════ */

async function runLint(filePath: string): Promise<boolean> {
  console.log("🔍 Running DESIGN.md lint...");
  try {
    const cmd = new Deno.Command("npx", {
      args: ["@google/design.md", "lint", filePath],
      stdout: "piped",
      stderr: "piped",
    });
    const { code, stdout, stderr } = await cmd.output();
    const out = new TextDecoder().decode(stdout);
    const err = new TextDecoder().decode(stderr);
    if (out.trim()) console.log(out.trim());
    if (err.trim()) console.error(err.trim());
    if (code !== 0) {
      console.error("❌ Lint found issues.");
      return false;
    }
    console.log("✅ Lint passed.");
    return true;
  } catch {
    console.warn(
      "⚠️  Lint skipped (@google/design.md CLI not available).",
    );
    return true;
  }
}

/* ═══════════════════════════════════════════════════════════════════
 * Main
 * ═══════════════════════════════════════════════════════════════════ */

async function main() {
  const opts = parseArgs(Deno.args);

  // Determine if we have manually-supplied colors (Track B / skill mode)
  const hasManualColors = !!(
    opts.background && opts.foreground && opts.accent && opts.destructive
  );

  let translation: TranslationResult;
  let track: "A" | "B";

  if (hasManualColors) {
    // Manual mode: use provided values directly
    track = "B";

    const bgOklch = hexToOklch(opts.background!);
    const fgOklch = hexToOklch(opts.foreground!);
    const accentOklch = hexToOklch(opts.accent!);
    const destructiveOklch = hexToOklch(opts.destructive!);

    translation = {
      name: opts.name ?? null,
      mode: bgOklch.l < 0.5 ? "dark" : "light",
      backgroundLuminance: bgOklch.l,
      colors: {
        background: {
          duiToken: "--background",
          sourceToken: "(manual)",
          sourceHex: opts.background!,
          oklch: bgOklch,
          oklchStr: formatOklch(bgOklch),
          notes: ["← provided via --background flag"],
        },
        foreground: {
          duiToken: "--foreground",
          sourceToken: "(manual)",
          sourceHex: opts.foreground!,
          oklch: fgOklch,
          oklchStr: formatOklch(fgOklch),
          notes: ["← provided via --foreground flag"],
        },
        accent: {
          duiToken: "--accent",
          sourceToken: "(manual)",
          sourceHex: opts.accent!,
          oklch: accentOklch,
          oklchStr: formatOklch(accentOklch),
          notes: ["← provided via --accent flag"],
        },
        destructive: {
          duiToken: "--destructive",
          sourceToken: "(manual)",
          sourceHex: opts.destructive!,
          oklch: destructiveOklch,
          oklchStr: formatOklch(destructiveOklch),
          notes: ["← provided via --destructive flag"],
        },
      },
      fonts: {
        sans: opts.fontSans ?? "Geist",
        serif: opts.fontSerif ?? "Lora",
        mono: opts.fontMono ?? "Geist Mono",
      },
      fontNotes: [
        opts.fontSans ? `Sans: ${opts.fontSans} (provided via --font-sans)` : "Sans: Geist (DUI default)",
        opts.fontMono ? `Mono: ${opts.fontMono} (provided via --font-mono)` : "Mono: Geist Mono (DUI default)",
        opts.fontSerif ? `Serif: ${opts.fontSerif} (provided via --font-serif)` : "Serif: Lora (DUI default)",
      ],
      radiusBase: opts.radius ?? "0.5rem",
      radiusNote: opts.radius
        ? `${opts.radius} (provided via --radius)`
        : "0.5rem (DUI default)",
      proseSections: {},
    };
  } else if (opts.inPath) {
    // Auto mode: read and detect
    const content = await readInput(opts.inPath);
    const detection = detectSpecCompliance(content);

    if (detection.isCompliant) {
      track = "A";
      console.log(`📖 Reading ${opts.inPath}...`);
      console.log(`   ${detection.reason}`);
      translation = translateSpecCompliant(content);
    } else {
      // Non-compliant: print guidance and exit
      console.log(`📖 Reading ${opts.inPath}...`);
      console.log(`   ${detection.reason}`);
      console.log("");
      console.log("This file is not spec-compliant (no structured YAML front matter).");
      console.log("Two options:");
      console.log("");
      console.log("  1. Use the translate-design-md skill for LLM-assisted translation:");
      console.log("     /translate-design-md");
      console.log("");
      console.log("  2. Provide colors manually:");
      console.log(`     deno task translate-design-md \\`);
      console.log(`       --background "#ffffff" --foreground "#222222" \\`);
      console.log(`       --accent "#ff385c" --destructive "#c13515" \\`);
      console.log(`       --font-sans "Inter" --radius "0.5rem"`);
      console.log("");
      Deno.exit(1);
    }
  } else {
    console.error("Usage: deno task translate-design-md --in <path|url>");
    console.error("   or: deno task translate-design-md --background <hex> --foreground <hex> --accent <hex> --destructive <hex>");
    Deno.exit(1);
  }

  // Apply CLI overrides on top of auto-detected values
  if (opts.fontSans) translation.fonts.sans = opts.fontSans;
  if (opts.fontSerif) translation.fonts.serif = opts.fontSerif;
  if (opts.fontMono) translation.fonts.mono = opts.fontMono;
  if (opts.radius) translation.radiusBase = opts.radius;
  if (opts.name) translation.name = opts.name;

  // Build the DUI DESIGN.md
  const bg = translation.colors.background.oklch;
  const fg = translation.colors.foreground.oklch;
  const accent = translation.colors.accent.oklch;
  const destructive = translation.colors.destructive.oklch;

  const allColors = computeAllColors(bg, fg, accent, destructive);

  const config: DesignMdConfig = {
    colors: allColors,
    oklchOriginals: {
      background: formatOklch(bg),
      foreground: formatOklch(fg),
      accent: formatOklch(accent),
      destructive: formatOklch(destructive),
    },
    fonts: translation.fonts,
    radiusBase: translation.radiusBase,
    includeGrammar: !opts.visualOnly,
    grammarOverrides: undefined,
  };

  let output = generateDesignMd(config);

  // For dark-mode sources, prepend a note
  if (translation.mode === "dark") {
    const darkNote = [
      "<!-- NOTE: This design was translated from a dark-mode source.",
      `     Background: ${translation.colors.background.sourceHex} (L=${translation.backgroundLuminance.toFixed(2)})`,
      "",
      "     The OKLCH primitives below are tuned for dark mode. To use",
      "     as DUI's dark theme, set these values under:",
      '       :root[data-theme="dark"] { ... }',
      "",
      "     For a light-mode base, consider inverting:",
      `       --background:  oklch(0.97 ${bg.c.toFixed(2)} ${Math.round(bg.h)})`,
      `       --foreground:  oklch(0.15 ${fg.c.toFixed(2)} ${Math.round(fg.h)})`,
      "-->",
      "",
    ].join("\n");
    output = darkNote + output;
  }

  // Write
  await Deno.writeTextFile(opts.outPath, output);

  // Print summary
  printSummary(
    {
      name: translation.name,
      mode: translation.mode,
      backgroundLuminance: translation.backgroundLuminance,
      colors: translation.colors,
      fonts: translation.fonts,
      fontNotes: translation.fontNotes,
      radiusBase: translation.radiusBase,
      radiusNote: translation.radiusNote,
      proseSections: translation.proseSections,
      track,
    },
    opts.outPath,
    output.length,
  );

  // Lint
  if (!opts.noLint) {
    await runLint(opts.outPath);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  Deno.exit(1);
});
