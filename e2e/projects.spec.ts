import { expect, test } from "@playwright/test";

test.describe("Projects Page", () => {
  test("renders projects page correctly", async ({ page }) => {
    await page.goto("/projects");

    // Verify Title
    await expect(page.getByText("My Projects")).toBeVisible();

    // Verify Project Cards
    const projectCards = page.locator(".grid > div");
    await expect(projectCards.first()).toBeVisible();

    // Verify specific elements within a project card
    const firstCard = projectCards.first();
    await expect(firstCard.locator("img")).toBeVisible();
    await expect(firstCard.locator("h3")).toBeVisible();
    await expect(
      firstCard.getByRole("link", { name: /Read More/i }),
    ).toBeVisible();
  });
});
