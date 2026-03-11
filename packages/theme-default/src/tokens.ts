import tokensCSS from "./tokens.css" with { type: "text" };

const tokenSheet = new CSSStyleSheet();
tokenSheet.replaceSync(tokensCSS);

export { tokenSheet };
