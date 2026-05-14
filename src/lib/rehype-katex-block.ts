import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin that runs after rehype-katex.
 *
 * Promotes any `<p>` whose sole non-whitespace child is a KaTeX `<span>` into a
 * `<div data-math-block>` so block math is treated as a block-level element.
 *
 * @note Filters whitespace-only text nodes (line breaks from MDX/rehype).
 * @note `className` may be a string or array; we normalise it.
 * @note Matches `katex` or `katex-display`, but only when it is the only child.
 * @note The `data-math-block` flag lets the MDX `div` component style the block.
 *
 * This plugin is pretty necessary to make sure that the different ways of writing
 * inline vs block math in MDX (i.e., `$...$` vs `$$...$$`) are styled consistently,
 * since rehyp-katex and remark-math looks at if the LaTeX is written between dollar
 * signs, with new lines, like the following:
 *
 * ```md
 * This will be display block math:
 * $$
 * \int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
 * $$
 *
 * This will be inline:
 * $$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$
 * ```
 *
 * Unfortunately, most other LaTeX viewing systems don't differentiate between inline
 * and block math like this, instead they focus on whether there is a single or there
 * are double dollar signs.
 *
 * @note In the future, instead of KaTeX, using MathJax might be a better option since
 * Obsidian also uses MathJax and it would be nice to have the same rendering engine
 * across both platforms.
 */
const rehypeKatexBlock = () => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      // Only transform paragraphs.
      if (node.tagName !== "p") return;

      // Ignore whitespace-only text nodes so line breaks don't break the
      // "single child" check after KaTeX renders.
      const meaningfulChildren = node.children.filter((child) => {
        if (child.type !== "text") return true;
        return child.value.trim().length > 0;
      });

      // We only care about paragraphs that contain exactly one KaTeX span.
      if (meaningfulChildren.length !== 1) return;
      const child = meaningfulChildren[0];
      if (child.type !== "element" || child.tagName !== "span") return;

      // `className` can be a string or an array depending on the pipeline.
      const className = child.properties?.className;
      const classes = Array.isArray(className)
        ? className
        : typeof className === "string"
          ? className.split(" ")
          : [];

      // Match both inline and display KaTeX spans, but only when they are the
      // sole child of the paragraph (i.e., block math from `$$ ... $$`).
      if (!classes.includes("katex") && !classes.includes("katex-display")) {
        return;
      }

      // Promote the paragraph to a block-level container and mark it so the
      // MDX `div` component can apply layout styles.
      node.tagName = "div";
      node.properties = { ...node.properties, "data-math-block": true };
    });
  };
};

export default rehypeKatexBlock;
