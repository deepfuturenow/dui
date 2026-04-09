import proseCSS from "./prose.css" with { type: "text" };

const proseSheet = new CSSStyleSheet();
proseSheet.replaceSync(proseCSS);

export { proseSheet };
