/**
 * Variant and size vocabularies for theme-default.
 *
 * These types are theme-specific — a different theme may define
 * entirely different variant names and size scales. Import them
 * from `@dui/theme-default` for type safety when using this theme.
 */

// --- Button ---
export type ButtonVariant = "neutral" | "primary" | "danger";
export type ButtonAppearance = "filled" | "outline" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

// --- Badge ---
export type BadgeVariant = "neutral" | "primary" | "danger";
export type BadgeAppearance = "filled" | "outline" | "ghost";

// --- Spinner ---
export type SpinnerVariant = "pulse" | "lucide-loader" | "lucide-loader-circle";
export type SpinnerSize = "sm" | "md" | "lg";

// --- Textarea ---
export type TextareaVariant = "default" | "ghost";

// --- Sidebar ---
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarMenuButtonSize = "default" | "sm" | "lg";

// --- Toolbar ---
export type ToolbarSize = "sm" | "md" | "lg" | "xl";
