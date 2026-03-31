export interface FontOption {
  family: string;
  weights?: string;
}

export const FONT_OPTIONS: FontOption[] = [
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

export const ICON_LIBRARIES = [
  "Lucide",
  "Tabler",
  "HugeIcons",
  "Phosphor Icons",
  "Remix Icon",
  "Material Design",
];
