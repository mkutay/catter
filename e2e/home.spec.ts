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
  const views = page.locator("text=/\\d+ views?/");
  await expect(views.first()).toBeVisible();

  // Verify navigation to a post
  const firstPost = postLinks.first();
  const href = await firstPost.getAttribute("href");
  await firstPost.click();
  await expect(page).toHaveURL(new RegExp(href as string));
});
