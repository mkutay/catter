import { expect, test } from "@playwright/test";

test.describe("Markdown Rendering Integration", () => {
  test("renders a complex markdown document", async ({ page }) => {
    await page.goto("/posts/history-of-chess-computers-the-minimax");

    // Verify Headings
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();

    const h2 = page.locator("h2", { hasText: "Why?" }).first();
    await expect(h2).toBeVisible();

    // Verify Link
    const link = page.getByRole("link", {
      name: /ChatGPT plays a game of chess/i,
    });
    await expect(link).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=rSCNW1OCk_M",
    );

    // Verify Blockquote
    const blockquote = page.locator("blockquote").first();
    await expect(blockquote).toBeVisible();

    // Verify List
    const list = page.locator("ul").first();
    await expect(list).toBeVisible();

    // Verify HR
    const hr = page.getByText("§").first();
    await expect(hr).toBeVisible();

    // Verify Image
    const img = page.getByAltText("Chess line").first();
    await expect(img).toBeVisible();

    // Verify TOC extraction
    const tocItem = page.getByRole("link", { name: "Why?" }).first();
    await expect(tocItem).toBeVisible();

    // Verify ToggleParentheses Context Button
    const hideShowButton = page
      .getByRole("button", { name: /Hide|Show/ })
      .first();
    await expect(hideShowButton).toBeVisible();

    await hideShowButton.click();

    // Check if Math is rendered (KaTeX)
    // The markdown contains $\text{eval}(\text{P})$
    const mathElement = page.locator(".katex").first();
    await expect(mathElement).toBeVisible();
  });

  test("renders specialised markdown features", async ({ page }) => {
    await page.goto("/posts/history-of-chess-computers-the-minimax");

    // Verify Image placeholder
    // The image has a blur placeholder, verify it's an image.
    const img = page.getByAltText(/post cover image/i).first();
    await expect(img).toBeVisible();

    // Verify KaTeX displays are centered.
    const katexDisplay = page.locator(".katex-display").first();
    await expect(katexDisplay).toBeVisible();
    const align = await katexDisplay.evaluate(
      (el) => getComputedStyle(el).textAlign,
    );
    expect(align).toBe("center");

    // Verify Side TOC
    const toc = page
      .locator(".sticky.top-20")
      .filter({ hasText: "Contents" })
      .first();
    await expect(toc).toBeVisible();

    // Verify View Count
    const viewCount = page.locator("text=/\\d+ views/");
    await expect(viewCount).toBeVisible();

    // Verify Tags
    const tag = page.locator("a[href^='/tags/']").first();
    await expect(tag).toBeVisible();

    // Verify Share Button
    const shareButton = page.getByRole("button", { name: "Share" });
    await expect(shareButton).toBeVisible();

    await shareButton.click();
  });
});
