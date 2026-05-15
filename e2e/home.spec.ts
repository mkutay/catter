import { expect, test } from "@playwright/test";

test("home page loads and displays posts", async ({ page }) => {
  await page.goto("/");

  // Verify Heading
  await expect(page.getByText("Hey, I'm Kutay!")).toBeVisible();

  // Verify Post rendering
  const postLinks = page.locator("a[href^='/posts/']");
  await expect(postLinks.first()).toBeVisible();

  // Verify images in posts
  const images = page.locator("img[alt*='post cover image']");
  await expect(images.first()).toBeVisible();

  // Verify Views
  const views = page.locator("text=/\\d+ views/");
  await expect(views.first()).toBeVisible();

  // Verify hover states on post titles
  const postTitle = postLinks.locator("span").first();
  const initialStyles = await postTitle.evaluate(
    (el) => getComputedStyle(el).backgroundSize,
  );

  await postTitle.hover();

  // The hover effect triggers a background size change
  // We check if the background size contains '100%' after hover.
  await page.waitForFunction(() => {
    const el = document.querySelector("a[href^='/posts/'] span");
    if (!el) return false;
    return getComputedStyle(el).backgroundSize.includes("100%");
  });

  const hoveredStyles = await postTitle.evaluate(
    (el) => getComputedStyle(el).backgroundSize,
  );
  expect(initialStyles).not.toEqual(hoveredStyles);
  expect(hoveredStyles).toContain("100%");
});
