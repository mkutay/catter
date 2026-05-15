import { expect, test } from "@playwright/test";

test.describe("About Page", () => {
  test("renders about page correctly", async ({ page }) => {
    await page.goto("/about");

    // Verify Title
    await expect(page.locator("h1")).toBeVisible();

    // Verify Image
    const portrait = page.getByAltText(/Mehmet Kutay Bozkurt portrait image/i);
    await expect(portrait).toBeVisible();

    // Verify Content
    const mainContent = page.locator("main").nth(1);
    await expect(mainContent).toBeVisible();

    // Check for some text that should be in the about page
    // Since it's dynamic from MDX, we can at least check for the existence of paragraphs
    const paragraphs = mainContent.locator("p");
    await expect(paragraphs.first()).toBeVisible();
  });
});
