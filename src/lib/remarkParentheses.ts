import type { Paragraph, PhrasingContent } from "mdast";
import type { MdxJsxTextElement } from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

/**
 * A remark plugin that converts parentheses in paragraphs to ToggleParentheses components as JSX elements.
 */
const remarkParentheses: Plugin = () => {
  return (tree: Node) => {
    visit(tree, "paragraph", (node: Paragraph) => {
      const newChildren: PhrasingContent[] = [];
      let inParentheses = false;
      let parenthesesContent: PhrasingContent[] = [];

      for (const child of node.children) {
        if (child.type === "text") {
          const text = child.value;
          let currentIndex = 0;

          while (currentIndex < text.length) {
            if (!inParentheses) {
              const openIndex = text.indexOf("(", currentIndex);
              if (openIndex === -1) {
                // No opening parenthesis found, add remaining text
                if (currentIndex < text.length) {
                  newChildren.push({
                    type: "text",
                    value: text.slice(currentIndex),
                  });
                }
                break;
              }

              // Add text before opening parenthesis
              if (openIndex > currentIndex) {
                newChildren.push({
                  type: "text",
                  value: text.slice(currentIndex, openIndex),
                });
              }

              // Start collecting parentheses content
              inParentheses = true;
              parenthesesContent = [];
              currentIndex = openIndex + 1;
            } else {
              const closeIndex = text.indexOf(")", currentIndex);
              if (closeIndex === -1) {
                // No closing parenthesis in this text node, add all remaining text to content
                if (currentIndex < text.length) {
                  parenthesesContent.push({
                    type: "text",
                    value: text.slice(currentIndex),
                  });
                }
                break;
              }

              // Add text before closing parenthesis to content
              if (closeIndex > currentIndex) {
                parenthesesContent.push({
                  type: "text",
                  value: text.slice(currentIndex, closeIndex),
                });
              }

              const toggleElement: MdxJsxTextElement = {
                type: "mdxJsxTextElement",
                name: "ToggleParentheses",
                attributes: [],
                children: parenthesesContent,
              };

              newChildren.push(toggleElement);

              // Reset for next parentheses pair
              inParentheses = false;
              parenthesesContent = [];
              currentIndex = closeIndex + 1;
            }
          }
        } else {
          // Non-text node
          if (inParentheses) {
            // Add the entire node to parentheses content
            parenthesesContent.push(child);
          } else {
            // Add the node directly to new children
            newChildren.push(child);
          }
        }
      }

      // Handle unclosed parentheses - add remaining content as regular text
      if (inParentheses && parenthesesContent.length > 0) {
        // Add opening parenthesis back as text since it wasn't closed
        newChildren.push({
          type: "text",
          value: "(",
        });
        newChildren.push(...parenthesesContent);
      }

      node.children = newChildren;
    });
  };
};

export default remarkParentheses;
