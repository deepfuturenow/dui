import tokensCSS from "./tokens.css" with { type: "text" };
import propertiesCSS from "./properties.css" with { type: "text" };

const tokenSheet = new CSSStyleSheet();
tokenSheet.replaceSync(propertiesCSS + "\n" + tokensCSS);

export { tokenSheet };
