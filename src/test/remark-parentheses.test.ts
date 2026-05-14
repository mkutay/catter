import { remark } from "remark";
import remarkMdx from "remark-mdx";
import { describe, expect, it } from "vitest";
import remarkParentheses from "@/lib/remark-parentheses";

describe("remarkParentheses", () => {
  it("wraps text in parentheses with ToggleParentheses component", async () => {
    const processor = remark().use(remarkMdx).use(remarkParentheses);
    const input = "This is a test (with parentheses).";
    const result = await processor.process(input);
    const output = result.toString();

    expect(output).toContain(
      "<ToggleParentheses>with parentheses</ToggleParentheses>",
    );
    expect(output).toContain("This is a test");
  });

  it("handles multiple parentheses in one paragraph", async () => {
    const processor = remark().use(remarkMdx).use(remarkParentheses);
    const input = "First (one) and second (two).";
    const result = await processor.process(input);
    const output = result.toString();

    expect(output).toContain("<ToggleParentheses>one</ToggleParentheses>");
    expect(output).toContain("<ToggleParentheses>two</ToggleParentheses>");
  });

  it("handles unclosed parentheses by falling back to original text", async () => {
    const processor = remark().use(remarkMdx).use(remarkParentheses);
    const input = "This is (unclosed.";
    const result = await processor.process(input);
    const output = result.toString();

    expect(output).not.toContain("<ToggleParentheses>");
    expect(output).toContain("This is (unclosed.");
  });

  it("handles nested nodes inside parentheses (e.g., bold text)", async () => {
    const processor = remark().use(remarkMdx).use(remarkParentheses);
    const input = "Text with (**bold**) inside.";
    const result = await processor.process(input);
    const output = result.toString();

    expect(output).toContain("<ToggleParentheses>**bold**</ToggleParentheses>");
  });
});
