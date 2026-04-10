import { tokenSheet } from "@dui/theme-default/tokens";
import { applyTheme } from "@dui/core/apply-theme";
import { defaultTheme } from "@dui/theme-default";
import { DuiButton } from "@dui/components/button";
import { DuiSelect } from "@dui/components/select";
import { DuiInput } from "@dui/components/input";
import { DuiSlider } from "@dui/components/slider";
import { DuiCollapsible } from "@dui/components/collapsible";
import { DuiScrollArea } from "@dui/components/scroll-area";
import "./theme-editor/views/theme-editor-view.ts";

// Inject design tokens into :root so they cascade into shadow DOM
if (!document.adoptedStyleSheets.includes(tokenSheet)) {
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, tokenSheet];
}

// Register DUI components used by the theme editor
applyTheme({
  theme: defaultTheme,
  components: [
    DuiButton,
    DuiSelect,
    DuiInput,
    DuiSlider,
    DuiCollapsible,
    DuiScrollArea,
  ],
});
