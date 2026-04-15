export interface FontOption {
  family: string;
  weights?: string;
}

export const SANS_FONT_OPTIONS: FontOption[] = [
  { family: "Geist", weights: "400;500;600;700" },
  { family: "Inter", weights: "400;500;600;700" },
  { family: "Noto Sans", weights: "400;500;600;700" },
  { family: "Nunito Sans", weights: "400;600;700" },
  { family: "Figtree", weights: "400;500;600;700" },
  { family: "Roboto", weights: "400;500;700" },
  { family: "Raleway", weights: "400;500;600;700" },
  { family: "DM Sans", weights: "400;500;600;700" },
  { family: "Public Sans", weights: "400;500;600;700" },
  { family: "Outfit", weights: "400;500;600;700" },
];

export const SERIF_FONT_OPTIONS: FontOption[] = [
  { family: "Lora", weights: "400;500;600;700" },
  { family: "Merriweather", weights: "400;700" },
  { family: "Playfair Display", weights: "400;500;600;700" },
  { family: "Source Serif 4", weights: "400;500;600;700" },
  { family: "Libre Baskerville", weights: "400;700" },
  { family: "DM Serif Display", weights: "400" },
  { family: "Bitter", weights: "400;500;600;700" },
  { family: "Crimson Text", weights: "400;600;700" },
];

export const MONO_FONT_OPTIONS: FontOption[] = [
  { family: "Geist Mono", weights: "400;500;600;700" },
  { family: "JetBrains Mono", weights: "400;500;600;700" },
  { family: "Fira Code", weights: "400;500;600;700" },
  { family: "Source Code Pro", weights: "400;500;600;700" },
  { family: "IBM Plex Mono", weights: "400;500;600;700" },
  { family: "Roboto Mono", weights: "400;500;700" },
  { family: "Inconsolata", weights: "400;500;600;700" },
];

export interface RadiusPreset {
  label: string;
  value: string;
}

export const RADIUS_PRESETS: RadiusPreset[] = [
  { label: "0", value: "0" },
  { label: "0.25", value: "0.25rem" },
  { label: "0.5", value: "0.5rem" },
  { label: "0.75", value: "0.75rem" },
  { label: "1.0", value: "1rem" },
];

export interface ColorPrimitive {
  token: string;
  label: string;
  light: string; // oklch default for light theme
  dark: string;  // oklch default for dark theme
}

export const COLOR_PRIMITIVES: ColorPrimitive[] = [
  { token: "--background",  label: "Background",  light: "oklch(0.97 0 0)",       dark: "oklch(0.15 0.015 260)" },
  { token: "--foreground",  label: "Foreground",  light: "oklch(0.15 0 0)",       dark: "oklch(0.93 0 0)" },
  { token: "--accent",      label: "Accent",      light: "oklch(0.55 0.25 260)",  dark: "oklch(0.75 0.18 260)" },
  { token: "--destructive", label: "Destructive", light: "oklch(0.55 0.22 25)",   dark: "oklch(0.70 0.18 25)" },
];

