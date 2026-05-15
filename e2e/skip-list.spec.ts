import { expect, test } from "@playwright/test";

test.describe("Skip-List Post Rendering", () => {
  test("renders the skip-list blog post correctly", async ({ page }) => {
    await page.goto("/posts/skip-list");

    // Verify Title and Description
    await expect(page.locator("h1")).toContainText(
      /A data structure that can simulate a binary search/i,
    );
    await expect(page.getByText(/Yes, please!/i).first()).toBeVisible();

    // Verify Metadata
    await expect(page.getByText("Mar 20, 2025").first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Algorithms", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Code", exact: true }),
    ).toBeVisible();

    // Verify TOC
    const toc = page.locator(".sticky.top-20").filter({ hasText: "Contents" });
    await expect(toc).toBeVisible();
    await expect(
      toc.getByRole("link", { name: "Time to write some code" }),
    ).toBeVisible();

    // Verify Image Presence (Cover)
    await expect(page.getByAltText(/post cover image/i)).toBeVisible();

    // Verify Content Images
    const contentImage = page.getByAltText(
      /An example of a sequence-based priority queue on a sorted list with trivial insertion/i,
    );
    await expect(contentImage).toBeVisible();
    await expect(contentImage).toHaveAttribute(
      "src",
      /.*\/api\/images\/.*n-squared-insertion\.png.*/,
    );

    // Verify Math (KaTeX)
    // $O(1)$ should be rendered as KaTeX
    await expect(page.locator(".katex").first()).toBeVisible();
    await expect(page.getByText(/O\(1\)/).first()).toBeVisible();

    // Verify Code Blocks (CodeHike)
    const codeBlocks = page.locator("pre");
    await expect(codeBlocks.first()).toBeVisible();
    await expect(codeBlocks.first()).toContainText("template<typename T>");

    // Verify Line Numbers in CodeHike
    await expect(
      page.locator("span.text-right.select-none").first(),
    ).toBeVisible();

    // Verify Copy Buttons
    const copyButtons = page.getByRole("button", { name: /copy/i });
    await expect(copyButtons.first()).toBeVisible();

    // Verify Toggle Parentheses feature
    const parenthesesText = "as the elements are pushed";
    await expect(page.getByText(`(${parenthesesText})`)).toBeVisible();

    // Find the global toggle button (Show/Hide)
    const globalToggleButton = page.getByRole("button", { name: /Hide|Show/i });
    await expect(globalToggleButton).toContainText("Hide");

    // Click Hide
    await globalToggleButton.click();
    await expect(globalToggleButton).toContainText("Show");

    // The text should now be hidden (replaced by dots in a button).
    await expect(page.getByText(`(${parenthesesText})`)).not.toBeVisible();

    // Click Show
    await globalToggleButton.click();
    await expect(page.getByText(`(${parenthesesText})`)).toBeVisible();

    // Verify View Display
    // The view display might be null if no views yet or API fails, but we can check if it exists or just skip if unreliable.
    // For now, let's just check the shortened link button which is more reliable.
    await expect(page.getByRole("button", { name: /share/i })).toBeVisible();
  });
});
