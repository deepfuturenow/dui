import { applyTheme } from "@dui/core/apply-theme";
import { defaultTheme } from "@dui/theme-default";
import { DuiButton } from "@dui/components/button";
import { DuiSwitch } from "@dui/components/switch";
import { DuiBadge } from "@dui/components/badge";

applyTheme({
  theme: defaultTheme,
  components: [DuiButton, DuiSwitch, DuiBadge],
});
