import accordionSrc from "../../components/src/accordion/accordion.ts?raw";
import accordionItemSrc from "../../components/src/accordion/accordion-item.ts?raw";
import buttonSrc from "../../components/src/button/button.ts?raw";
import switchSrc from "../../components/src/switch/switch.ts?raw";
import badgeSrc from "../../components/src/badge/badge.ts?raw";

export const componentSources = new Map<string, string>([
  ["dui-accordion", accordionSrc],
  ["dui-accordion-item", accordionItemSrc],
  ["dui-button", buttonSrc],
  ["dui-switch", switchSrc],
  ["dui-badge", badgeSrc],
]);
