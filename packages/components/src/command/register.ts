import { DuiCommand } from "./command.ts";
import { DuiCommandInput } from "./command-input.ts";
import { DuiCommandList } from "./command-list.ts";
import { DuiCommandGroup } from "./command-group.ts";
import { DuiCommandItem } from "./command-item.ts";
import { DuiCommandEmpty } from "./command-empty.ts";
import { DuiCommandSeparator } from "./command-separator.ts";
import { DuiCommandShortcut } from "./command-shortcut.ts";

for (const C of [
  DuiCommand,
  DuiCommandInput,
  DuiCommandList,
  DuiCommandGroup,
  DuiCommandItem,
  DuiCommandEmpty,
  DuiCommandSeparator,
  DuiCommandShortcut,
]) {
  if (!customElements.get(C.tagName)) {
    customElements.define(C.tagName, C);
  }
}
