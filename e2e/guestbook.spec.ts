import { expect, test } from "@playwright/test";

test.describe("Guestbook Page", () => {
  test("renders guestbook page for unauthenticated user", async ({ page }) => {
    await page.goto("/guestbook");

    // Verify Title
    await expect(page.getByText("Sign My Guestbook!")).toBeVisible();

    // Verify Sign In message for unauthenticated users
    await expect(
      page.getByText(
        "Sign in to leave your mark on this infinite internet, here.",
      ),
    ).toBeVisible();

    // Verify Social Login buttons
    await expect(page.getByRole("button", { name: /GitHub/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Discord/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Spotify/i })).toBeVisible();

    // Verify Guestbook entries container
    const entries = page.locator(
      ".flex.flex-col.divide-border.divide-y.wrap-break-word",
    );
    await expect(entries).toBeVisible();
  });
});
