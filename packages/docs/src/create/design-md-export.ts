/**
 * DESIGN.md export from the theme editor.
 *
 * Reuses the core generator logic from scripts/lib/ to produce a
 * DESIGN.md string from the current theme editor state, then triggers
 * a file download.
 */

import {
  oklchToHex,
  computeDerivedHex,
  type Oklch,
} from "../../../../scripts/lib/oklch-to-hex.ts";

import {
  generateDesignMd,
  type DesignMdConfig,
} from "../../../../scripts/lib/design-md-template.ts";

import { formatOklch } from "./color-utils.ts";

export interface ThemeEditorState {
  colors: Record<string, Oklch>;  // keyed by token: "--background", "--foreground", etc.
  fontSans: string;
  fontSerif: string;
  fontMono: string;
  radius: string;
}

/**
 * Generate a DESIGN.md string from the current theme editor state.
 */
export function generateDesignMdFromEditor(state: ThemeEditorState): string {
  const bg          = state.colors["--background"]  ?? { l: 0.97, c: 0, h: 0 };
  const fg          = state.colors["--foreground"]  ?? { l: 0.15, c: 0, h: 0 };
  const accent      = state.colors["--accent"]      ?? { l: 0.55, c: 0.25, h: 260 };
  const destructive = state.colors["--destructive"] ?? { l: 0.55, c: 0.22, h: 25 };

  const colors = {
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

  const config: DesignMdConfig = {
    colors,
    oklchOriginals: {
      background:  formatOklch(bg),
      foreground:  formatOklch(fg),
      accent:      formatOklch(accent),
      destructive: formatOklch(destructive),
    },
    fonts: {
      sans: state.fontSans,
      serif: state.fontSerif,
      mono: state.fontMono,
    },
    radiusBase: state.radius,
    includeGrammar: true,
  };

  return generateDesignMd(config);
}

/**
 * Trigger a file download of the given text content.
 */
export function downloadAsFile(content: string, filename: string, mimeType = "text/markdown"): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard and return success status.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
