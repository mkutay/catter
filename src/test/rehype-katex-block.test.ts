import rehypeKatex from "rehype-katex";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { describe, expect, it } from "vitest";
import rehypeKatexBlock from "@/lib/rehype-katex-block";

describe("rehypeKatexBlock", () => {
  describe("isolated rehype tests", () => {
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeKatex)
      .use(rehypeKatexBlock)
      .use(rehypeStringify);

    it("promotes a paragraph with a single katex-display span to a div with data-math-block", async () => {
      const input = `<p><span class="katex-display">math</span></p>`;
      const result = await processor.process(input);
      const output = result.toString();

      expect(output).toContain("<div data-math-block");
      expect(output).toContain('<span class="katex-display">');
      expect(output).not.toContain("<p>");
    });

    it("promotes a paragraph with a single katex span to a div with data-math-block", async () => {
      const input = `<p><span class="katex">math</span></p>`;
      const result = await processor.process(input);
      const output = result.toString();

      expect(output).toContain("<div data-math-block");
      expect(output).toContain('<span class="katex">');
    });

    it("ignores paragraphs with other content", async () => {
      const input = `<p>Some text <span class="katex">math</span></p>`;
      const result = await processor.process(input);
      const output = result.toString();

      expect(output).toContain("<p>");
      expect(output).not.toContain("data-math-block");
    });

    it("handles whitespace in paragraphs", async () => {
      const input = `<p>
        <span class="katex-display">math</span>
      </p>`;
      const result = await processor.process(input);
      const output = result.toString();

      expect(output).toContain("<div data-math-block");
    });
  });

  describe("markdown integration", () => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeKatexBlock)
      .use(rehypeStringify);

    it("handles double dollar signs ($$math$$)", async () => {
      const input = "$$x^2$$";
      const result = await processor.process(input);
      const output = result.toString();

      // For $$...$$, remark-math and rehype-katex produce a span wrapped in a paragraph.
      // rehypeKatexBlock promotes this paragraph to a div with data-math-block.
      expect(output).toContain("<div data-math-block");
      expect(output).toContain("katex");
    });

    it("promotes single dollar signs on their own line ($math$)", async () => {
      const input = "$x^2$";
      const result = await processor.process(input);
      const output = result.toString();

      // Even for single dollar signs, if they are the sole content of a paragraph,
      // they are promoted to a block-level div for consistent styling.
      expect(output).toContain("<div data-math-block");
      expect(output).toContain("katex");
      expect(output).not.toContain("<p>");
    });

    it("handles math code blocks (```math)", async () => {
      const input = "```math\nx^2\n```";
      const result = await processor.process(input);
      const output = result.toString();

      // rehype-katex handles code blocks with the "math" language by default,
      // typically producing a span with the "katex-display" class.
      expect(output).toContain("katex-display");
      expect(output).toContain("katex");
    });

    it("does not promote inline math within text", async () => {
      const input = "Formula: $x^2$ is nice.";
      const result = await processor.process(input);
      const output = result.toString();

      // When math is part of a larger paragraph, it remains inline.
      expect(output).toContain("<p>");
      expect(output).not.toContain("data-math-block");
      expect(output).toContain("katex");
    });
  });
});
