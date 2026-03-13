import "./docs-demo.ts";
import "./docs-app.ts";
import "./pages/docs-page-components-index.ts";
import "./pages/docs-page-accordion.ts";
import "./pages/docs-page-button.ts";
import "./pages/docs-page-switch.ts";
import "./pages/docs-page-badge.ts";
import "./pages/docs-page-icon.ts";
import "./pages/docs-page-scroll-area.ts";
import "./pages/docs-page-combobox.ts";
import "./pages/docs-page-colors.ts";
import "./pages/docs-page-blocks.ts";
import { applyTheme } from "@dui/core/apply-theme";
import { defaultTheme } from "@dui/theme-default";
import { DuiAccordion, DuiAccordionItem } from "@dui/components/accordion";
import { DuiBadge } from "@dui/components/badge";
import { DuiButton } from "@dui/components/button";
import { DuiSwitch } from "@dui/components/switch";
import { DuiIcon } from "@dui/components/icon";
import { DuiScrollArea } from "@dui/components/scroll-area";
import { DuiCombobox } from "@dui/components/combobox";

applyTheme({
  theme: defaultTheme,
  components: [
    DuiAccordion,
    DuiAccordionItem,
    DuiBadge,
    DuiButton,
    DuiSwitch,
    DuiIcon,
    DuiScrollArea,
    DuiCombobox,
  ],
});
