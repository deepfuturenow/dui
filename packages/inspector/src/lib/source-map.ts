/**
 * Source file mapping — bridges runtime mutations to static source files.
 *
 * Given the changelog + a source map config, generates structured descriptions
 * of what changed in which files, so agents can apply changes to source code.
 */

import type { SourceMapConfig, SourceChange } from "./types.ts";
import { changelog } from "./changelog.ts";

let sourceMapConfig: SourceMapConfig = {};

/** Set the source map configuration. */
export function setSourceMap(config: SourceMapConfig): void {
  sourceMapConfig = config;
}

/** Get the current source map configuration. */
export function getSourceMap(): SourceMapConfig {
  return sourceMapConfig;
}

/**
 * Export all changelog mutations as source file changes.
 * Maps each mutation to the file it should be applied to.
 */
export function exportChangeset(): SourceChange[] {
  const entries = changelog.entries();
  const changes: SourceChange[] = [];

  for (const entry of entries) {
    switch (entry.action) {
      case "setToken": {
        const file = sourceMapConfig.tokens ?? "(unknown tokens file)";
        changes.push({
          file,
          changeType: "token",
          description: `Change ${entry.target} to ${entry.params.value}`,
          tokenName: entry.target,
          tokenValue: entry.params.value as string,
        });
        break;
      }

      case "setComponentToken": {
        // Scoped token — could go in the page file or a component-specific override
        const tagName = extractTagFromSelector(entry.target);
        const file = tagName && sourceMapConfig.themeStyles?.[tagName]
          ? sourceMapConfig.themeStyles[tagName]
          : sourceMapConfig.page ?? "(unknown page file)";
        changes.push({
          file,
          changeType: "token",
          description: `Set ${entry.params.name} = ${entry.params.value} on ${entry.target}`,
          tokenName: entry.params.name as string,
          tokenValue: entry.params.value as string,
          selector: entry.target,
        });
        break;
      }

      case "setProp": {
        const file = sourceMapConfig.page ?? "(unknown page file)";
        changes.push({
          file,
          changeType: "prop",
          description: `Set ${entry.params.prop} = ${JSON.stringify(entry.params.value)} on ${entry.target}`,
          selector: entry.target,
          propName: entry.params.prop as string,
          propValue: entry.params.value,
        });
        break;
      }

      case "insertComponent": {
        const file = sourceMapConfig.page ?? "(unknown page file)";
        const tag = entry.params.tag as string;
        const props = entry.params.props as Record<string, unknown> | undefined;
        const slotContent = entry.params.slotContent as string | undefined;

        let htmlStr = `<${tag}`;
        if (props) {
          for (const [k, v] of Object.entries(props)) {
            if (typeof v === "boolean" && v) {
              htmlStr += ` ${k}`;
            } else if (typeof v === "string") {
              htmlStr += ` ${k}="${v}"`;
            } else {
              htmlStr += ` .${k}=\${${JSON.stringify(v)}}`;
            }
          }
        }
        if (slotContent) {
          htmlStr += `>${slotContent}</${tag}>`;
        } else {
          htmlStr += `></${tag}>`;
        }

        changes.push({
          file,
          changeType: "template",
          description: `Insert <${tag}> ${entry.params.position} ${entry.params.parentSelector}`,
          html: htmlStr,
          selector: entry.params.parentSelector as string,
        });
        break;
      }

      case "removeComponent": {
        const file = sourceMapConfig.page ?? "(unknown page file)";
        changes.push({
          file,
          changeType: "template",
          description: `Remove element at ${entry.target}`,
          selector: entry.target,
        });
        break;
      }

      case "moveComponent": {
        const file = sourceMapConfig.page ?? "(unknown page file)";
        changes.push({
          file,
          changeType: "template",
          description: `Move ${entry.target} to ${entry.params.position} ${entry.params.to}`,
          selector: entry.target,
        });
        break;
      }

      case "setSlotContent": {
        const file = sourceMapConfig.page ?? "(unknown page file)";
        changes.push({
          file,
          changeType: "template",
          description: `Replace slot "${entry.params.slotName}" content on ${entry.target}`,
          html: entry.params.html as string,
          selector: entry.target,
        });
        break;
      }

      case "editThemeCSS": {
        const tagName = extractTagFromSelector(entry.target);
        const file = tagName && sourceMapConfig.themeStyles?.[tagName]
          ? sourceMapConfig.themeStyles[tagName]
          : "(unknown theme style file)";
        changes.push({
          file,
          changeType: "theme-style",
          description: `Edit theme CSS for ${entry.target}`,
          selector: entry.target,
        });
        break;
      }
    }
  }

  return changes;
}

/** Extract the tag name from a CSS selector (e.g., "dui-button:nth-of-type(2)" → "dui-button"). */
function extractTagFromSelector(selector: string): string | null {
  const match = selector.match(/\b(dui-[\w-]+)/);
  return match ? match[1] : null;
}
