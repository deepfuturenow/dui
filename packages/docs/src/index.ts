import { applyTheme } from "@dui/core/apply-theme";
import { defaultTheme } from "@dui/theme-default";
import { DuiAccordion, DuiAccordionItem } from "@dui/components/accordion";
import { DuiBadge } from "@dui/components/badge";
import { DuiButton } from "@dui/components/button";
import { DuiSwitch } from "@dui/components/switch";

applyTheme({
  theme: defaultTheme,
  components: [DuiAccordion, DuiAccordionItem, DuiBadge, DuiButton, DuiSwitch],
});
