/**
 * Stitch / spec-compliant DESIGN.md → DUI token mapping.
 *
 * Handles Track A (deterministic) of the translate-design-md pipeline:
 * - Spec compliance detection
 * - YAML front matter parsing
 * - Color mapping (MD3 / spec tokens → DUI's 4 OKLCH primitives)
 * - Typography extraction
 * - Radius extraction
 * - Dark/light mode detection
 */

import { hexToOklch, formatOklch, type Oklch } from "./oklch-to-hex.ts";

/* ═══════════════════════════════════════════════════════════════════
 * Types
 * ═══════════════════════════════════════════════════════════════════ */

export interface SpecDetectionResult {
  isCompliant: boolean;
  hasYamlFrontMatter: boolean;
  hasColorsSection: boolean;
  hasHexValues: boolean;
  /** Human-readable explanation of what was found / missing. */
  reason: string;
}

export interface MappingDecision {
  duiToken: string;
  sourceToken: string;
  sourceHex: string;
  oklch: Oklch;
  oklchStr: string;
  notes: string[];
}

export interface TranslationResult {
  /** Name from the DESIGN.md front matter, if present. */
  name: string | null;
  /** Detected color mode. */
  mode: "light" | "dark";
  /** Background luminance (0–1). */
  backgroundLuminance: number;
  /** The 4 DUI color primitive mappings. */
  colors: {
    background: MappingDecision;
    foreground: MappingDecision;
    accent: MappingDecision;
    destructive: MappingDecision;
  };
  /** Extracted font families. */
  fonts: {
    sans: string;
    serif: string;
    mono: string;
  };
  /** Font extraction notes (what was found, what fell back to default). */
  fontNotes: string[];
  /** Base radius in rem. */
  radiusBase: string;
  /** Radius extraction note. */
  radiusNote: string;
  /** Source prose sections (heading → body) for optional merge. */
  proseSections: Record<string, string>;
}

/* ═══════════════════════════════════════════════════════════════════
 * Spec detection — the 3-point test
 * ═══════════════════════════════════════════════════════════════════ */

/**
 * Check whether a DESIGN.md file has spec-compliant structured YAML
 * front matter suitable for deterministic (Track A) processing.
 *
 * Three checks:
 * 1. File starts with `---\n`
 * 2. Front matter contains `colors:` with at least one key
 * 3. Color values look like hex strings
 */
export function detectSpecCompliance(content: string): SpecDetectionResult {
  // Check 1: YAML front matter delimiters
  if (!content.startsWith("---\n") && !content.startsWith("---\r\n")) {
    return {
      isCompliant: false,
      hasYamlFrontMatter: false,
      hasColorsSection: false,
      hasHexValues: false,
      reason: "No YAML front matter found (file does not start with ---).",
    };
  }

  // Extract front matter
  const endIdx = content.indexOf("\n---", 4);
  if (endIdx === -1) {
    return {
      isCompliant: false,
      hasYamlFrontMatter: false,
      hasColorsSection: false,
      hasHexValues: false,
      reason: "Opening --- found but no closing --- delimiter.",
    };
  }

  const yaml = content.slice(4, endIdx);

  // Check 2: Has a `colors:` section with at least one key
  const colorsMatch = yaml.match(/^colors:\s*$/m);
  if (!colorsMatch) {
    return {
      isCompliant: false,
      hasYamlFrontMatter: true,
      hasColorsSection: false,
      hasHexValues: false,
      reason: "YAML front matter found but no `colors:` section.",
    };
  }

  // Check 3: At least one hex color value under colors
  const hexPattern = /^\s+[\w-]+:\s*["']?#[0-9a-fA-F]{3,8}["']?/m;
  const hasHex = hexPattern.test(yaml);
  if (!hasHex) {
    return {
      isCompliant: false,
      hasYamlFrontMatter: true,
      hasColorsSection: true,
      hasHexValues: false,
      reason:
        "YAML has `colors:` section but no hex color values found (values may be prose descriptions).",
    };
  }

  return {
    isCompliant: true,
    hasYamlFrontMatter: true,
    hasColorsSection: true,
    hasHexValues: true,
    reason: "Spec-compliant YAML front matter with structured color tokens.",
  };
}

/* ═══════════════════════════════════════════════════════════════════
 * YAML front matter parser (reused from import-design-md.ts,
 * extended for the broader Stitch token vocabulary)
 * ═══════════════════════════════════════════════════════════════════ */

export interface ParsedYaml {
  name: string | null;
  colors: Record<string, string>;
  typography: Record<string, Record<string, string>>;
  spacing: Record<string, string>;
  rounded: Record<string, string>;
}

/** Strip YAML comments while preserving # inside quoted strings. */
function stripYamlComment(line: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === "#" && !inSingle && !inDouble) {
      return line.slice(0, i).trimEnd();
    }
  }
  return line.trimEnd();
}

export function extractFrontMatter(content: string): { yaml: string; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error("No YAML front matter found.");
  return { yaml: match[1], body: match[2] };
}

export function parseYaml(yaml: string): ParsedYaml {
  const result: ParsedYaml = {
    name: null,
    colors: {},
    typography: {},
    spacing: {},
    rounded: {},
  };

  let currentSection = "";
  let currentSubKey = "";

  for (const rawLine of yaml.split("\n")) {
    const line = stripYamlComment(rawLine);
    if (!line.trim()) continue;

    // Top-level `name:` field
    const nameMatch = line.match(/^name:\s*(.+)$/);
    if (nameMatch) {
      result.name = nameMatch[1].replace(/^["']|["']$/g, "").trim();
      continue;
    }

    // Top-level section (no indent)
    const sectionMatch = line.match(/^(\w[\w-]*):\s*$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      currentSubKey = "";
      continue;
    }

    // Sub-key (2-space indent, no value — starts a nested block)
    const subKeyMatch = line.match(/^  ([\w][\w-]*):\s*$/);
    if (subKeyMatch && currentSection) {
      currentSubKey = subKeyMatch[1];
      continue;
    }

    // Value at 2-space indent (flat key: value)
    const flatValueMatch = line.match(/^  ([\w][\w-]*):\s*(.+)$/);
    if (flatValueMatch && currentSection && !currentSubKey) {
      const key = flatValueMatch[1];
      const value = flatValueMatch[2].replace(/^["']|["']$/g, "").trim();
      switch (currentSection) {
        case "colors":
          result.colors[key] = value;
          break;
        case "spacing":
          result.spacing[key] = value;
          break;
        case "rounded":
          result.rounded[key] = value;
          break;
      }
      continue;
    }

    // Value at 4-space indent (nested under sub-key)
    const nestedValueMatch = line.match(/^    ([\w][\w-]*):\s*(.+)$/);
    if (nestedValueMatch && currentSection && currentSubKey) {
      const key = nestedValueMatch[1];
      const value = nestedValueMatch[2].replace(/^["']|["']$/g, "").trim();
      if (currentSection === "typography") {
        if (!result.typography[currentSubKey]) result.typography[currentSubKey] = {};
        result.typography[currentSubKey][key] = value;
      }
      continue;
    }

    // Value at 2-space indent that resets sub-key
    if (flatValueMatch && currentSection && currentSubKey) {
      currentSubKey = flatValueMatch[1];
      const value = flatValueMatch[2]?.replace(/^["']|["']$/g, "").trim();
      if (value) {
        currentSubKey = "";
        switch (currentSection) {
          case "colors":
            result.colors[flatValueMatch[1]] = value;
            break;
          case "spacing":
            result.spacing[flatValueMatch[1]] = value;
            break;
          case "rounded":
            result.rounded[flatValueMatch[1]] = value;
            break;
        }
      }
    }
  }

  return result;
}

/* ═══════════════════════════════════════════════════════════════════
 * Prose section extraction
 * ═══════════════════════════════════════════════════════════════════ */

/**
 * Extract `## Heading` sections from the markdown body.
 * Returns a map of heading → body text.
 */
export function extractProseSections(body: string): Record<string, string> {
  const sections: Record<string, string> = {};
  let currentHeading = "";
  let currentBody: string[] = [];

  for (const line of body.split("\n")) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      if (currentHeading) {
        sections[currentHeading] = currentBody.join("\n").trim();
      }
      currentHeading = headingMatch[1].trim();
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }
  if (currentHeading) {
    sections[currentHeading] = currentBody.join("\n").trim();
  }

  return sections;
}

/* ═══════════════════════════════════════════════════════════════════
 * Color mapping — Track A (deterministic)
 * ═══════════════════════════════════════════════════════════════════ */

/** Check if a hex color is effectively achromatic or at extreme luminance. */
function isUnsuitableAccent(hex: string): { unsuitable: boolean; reason: string } {
  const oklch = hexToOklch(hex);

  if (oklch.c < 0.03) {
    return {
      unsuitable: true,
      reason: `achromatic (C=${oklch.c.toFixed(2)})`,
    };
  }
  if (oklch.l > 0.93) {
    return {
      unsuitable: true,
      reason: `near-white (L=${oklch.l.toFixed(2)})`,
    };
  }
  if (oklch.l < 0.07) {
    return {
      unsuitable: true,
      reason: `near-black (L=${oklch.l.toFixed(2)})`,
    };
  }
  return { unsuitable: false, reason: "" };
}

/** Check if a string looks like a valid hex color. */
function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$/.test(value);
}

/**
 * Map a spec-compliant color vocabulary to DUI's 4 primitives.
 *
 * Tries candidates in priority order, skipping values that fail
 * the suitability check (for accent).
 */
export function mapColors(
  colors: Record<string, string>,
): TranslationResult["colors"] {
  // --- background ---
  const bgCandidates = ["background", "surface", "canvas", "surface-container-lowest"];
  const bg = pickColor(colors, bgCandidates, "--background", "Page canvas / base surface");

  // --- foreground ---
  const fgCandidates = [
    "on-background",
    "on-surface",
    "foreground",
    "ink",
    "text-1",
  ];
  const fg = pickColor(colors, fgCandidates, "--foreground", "Primary text color");

  // --- accent (with suitability gate) ---
  const accentCandidates = [
    "primary",
    "accent",
    "secondary",
    "tertiary",
    "primary-container",
    "secondary-container",
  ];
  const accent = pickAccentColor(colors, accentCandidates);

  // --- destructive ---
  const destructiveCandidates = ["error", "destructive", "danger"];
  const destructive = pickColor(
    colors,
    destructiveCandidates,
    "--destructive",
    "Danger/error color",
  );
  // If no error token found, use DUI's default
  if (!destructive.sourceHex) {
    const defaultOklch = { l: 0.55, c: 0.22, h: 25 };
    destructive.sourceHex = "#c53030"; // approximate
    destructive.sourceToken = "(DUI default)";
    destructive.oklch = defaultOklch;
    destructive.oklchStr = formatOklch(defaultOklch);
    destructive.notes.push("No error/destructive token found — using DUI default.");
  }

  return { background: bg, foreground: fg, accent, destructive };
}

function pickColor(
  colors: Record<string, string>,
  candidates: string[],
  duiToken: string,
  description: string,
): MappingDecision {
  const notes: string[] = [];
  for (const candidate of candidates) {
    const value = colors[candidate];
    if (value && isHexColor(value)) {
      const oklch = hexToOklch(value);
      return {
        duiToken,
        sourceToken: candidate,
        sourceHex: value,
        oklch,
        oklchStr: formatOklch(oklch),
        notes: [`← ${candidate} (${description})`],
      };
    }
  }
  // No match — return empty with notes
  return {
    duiToken,
    sourceToken: "(not found)",
    sourceHex: "",
    oklch: { l: 0.5, c: 0, h: 0 },
    oklchStr: "oklch(0.50 0.00 0)",
    notes: [
      `No match for ${duiToken} — tried: ${candidates.join(", ")}`,
    ],
  };
}

function pickAccentColor(
  colors: Record<string, string>,
  candidates: string[],
): MappingDecision {
  const notes: string[] = [];
  for (const candidate of candidates) {
    const value = colors[candidate];
    if (!value || !isHexColor(value)) continue;

    const check = isUnsuitableAccent(value);
    if (check.unsuitable) {
      notes.push(
        `Skipped ${candidate} (${value}) — ${check.reason}`,
      );
      continue;
    }

    const oklch = hexToOklch(value);
    notes.push(`← ${candidate} (Brand/interactive color)`);
    return {
      duiToken: "--accent",
      sourceToken: candidate,
      sourceHex: value,
      oklch,
      oklchStr: formatOklch(oklch),
      notes,
    };
  }

  // Fallback: DUI default accent
  const defaultOklch = { l: 0.55, c: 0.25, h: 260 };
  notes.push("No suitable accent found — using DUI default.");
  return {
    duiToken: "--accent",
    sourceToken: "(DUI default)",
    sourceHex: "#4f46e5",
    oklch: defaultOklch,
    oklchStr: formatOklch(defaultOklch),
    notes,
  };
}

/* ═══════════════════════════════════════════════════════════════════
 * Typography extraction
 * ═══════════════════════════════════════════════════════════════════ */

const MONO_PATTERNS = [
  "mono",
  "code",
  "fira code",
  "jetbrains",
  "source code",
  "courier",
  "consolas",
  "menlo",
  "sf mono",
  "geist mono",
];

const SERIF_PATTERNS = [
  "serif",
  "georgia",
  "times",
  "garamond",
  "palatino",
  "lora",
  "merriweather",
  "playfair",
  "dm serif",
  "noto serif",
  "source serif",
  "libre baskerville",
];

export function extractFonts(
  typography: Record<string, Record<string, string>>,
): { fonts: TranslationResult["fonts"]; notes: string[] } {
  const notes: string[] = [];

  // Collect all fontFamily values and count occurrences
  const familyCounts: Record<string, number> = {};
  for (const [_level, props] of Object.entries(typography)) {
    const family = props.fontFamily;
    if (family) {
      familyCounts[family] = (familyCounts[family] || 0) + 1;
    }
  }

  // Classify each family
  let sans = "Geist";
  let serif = "Lora";
  let mono = "Geist Mono";
  let sansCount = 0;

  for (const [family, count] of Object.entries(familyCounts)) {
    const lower = family.toLowerCase();

    if (MONO_PATTERNS.some((p) => lower.includes(p))) {
      mono = family;
      notes.push(`Mono: ${family} (from ${count} typography entries)`);
      continue;
    }

    if (SERIF_PATTERNS.some((p) => lower.includes(p))) {
      serif = family;
      notes.push(`Serif: ${family} (from ${count} typography entries)`);
      continue;
    }

    // Sans-serif candidate — pick the most common
    if (count > sansCount) {
      sans = family;
      sansCount = count;
    }
  }

  if (sansCount > 0) {
    notes.push(
      `Sans: ${sans} (from ${sansCount}/${Object.values(familyCounts).reduce((a, b) => a + b, 0)} typography entries)`,
    );
  } else {
    notes.push(`Sans: Geist (DUI default — none found in source)`);
  }

  if (!notes.some((n) => n.startsWith("Mono:"))) {
    notes.push(`Mono: Geist Mono (DUI default — none found in source)`);
  }
  if (!notes.some((n) => n.startsWith("Serif:"))) {
    notes.push(`Serif: Lora (DUI default — none found in source)`);
  }

  return { fonts: { sans, serif, mono }, notes };
}

/* ═══════════════════════════════════════════════════════════════════
 * Radius extraction
 * ═══════════════════════════════════════════════════════════════════ */

export function extractRadius(
  rounded: Record<string, string>,
): { radiusBase: string; note: string } {
  // Look for DEFAULT, md, or base — these represent the "standard" radius
  const baseCandidates = ["DEFAULT", "md", "base"];

  for (const key of baseCandidates) {
    if (rounded[key]) {
      const value = rounded[key];
      const rem = toRem(value);
      return {
        radiusBase: `${rem}rem`,
        note: `${rem}rem (from source "${key}: ${value}")`,
      };
    }
  }

  // If we have sm and lg but no md, interpolate
  if (rounded["sm"] && rounded["lg"]) {
    const smRem = toRem(rounded["sm"]);
    const lgRem = toRem(rounded["lg"]);
    const midRem = ((smRem + lgRem) / 2).toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
    return {
      radiusBase: `${midRem}rem`,
      note: `${midRem}rem (interpolated from sm: ${rounded["sm"]}, lg: ${rounded["lg"]})`,
    };
  }

  // Fallback to DUI default
  return {
    radiusBase: "0.5rem",
    note: "0.5rem (DUI default — no base radius found in source)",
  };
}

/** Convert a CSS dimension to rem. */
function toRem(value: string): number {
  const num = parseFloat(value);
  if (value.includes("rem")) return num;
  if (value.includes("px")) return num / 16;
  return num; // assume rem if no unit
}

/* ═══════════════════════════════════════════════════════════════════
 * Full Track A translation
 * ═══════════════════════════════════════════════════════════════════ */

/**
 * Run the full deterministic translation pipeline for a
 * spec-compliant DESIGN.md file.
 */
export function translateSpecCompliant(content: string): TranslationResult {
  const { yaml, body } = extractFrontMatter(content);
  const parsed = parseYaml(yaml);

  // Colors
  const colors = mapColors(parsed.colors);

  // Mode detection
  const bgL = colors.background.oklch.l;
  const mode = bgL < 0.5 ? "dark" : "light";

  // Typography
  const { fonts, notes: fontNotes } = extractFonts(parsed.typography);

  // Radius
  const { radiusBase, note: radiusNote } = extractRadius(parsed.rounded);

  // Prose sections
  const proseSections = extractProseSections(body);

  return {
    name: parsed.name,
    mode,
    backgroundLuminance: bgL,
    colors,
    fonts,
    fontNotes,
    radiusBase,
    radiusNote,
    proseSections,
  };
}
