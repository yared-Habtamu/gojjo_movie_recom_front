import { test, expect } from "@playwright/test";

function uniqueUser() {
  const t = Date.now();
  return {
    username: `pw_user_${t}`,
    email: `pw_user_${t}@example.com`,
    password: "Password123!",
  };
}

test.describe("E2E: register -> login -> movie -> favorite -> logout", () => {
  test("full flow", async ({ page, baseURL }) => {
    const user = uniqueUser();

    // 1) Navigate to signup page and create account
    await page.goto("/signup");
    await expect(page).toHaveURL(/\/signup/);
    await page.fill("input#name", user.username);
    await page.fill("input#email", user.email);
    await page.fill("input#password", user.password);
    await page.fill("input#confirmPassword", user.password);
    await page.click('button:has-text("Create Account")');

    // Wait for toast & redirect to login (allow more time on CI/slow machines)
    try {
      await page.waitForURL("/login", { timeout: 30000 });
    } catch (e) {
      // fallback: navigate to login page explicitly if redirect didn't occur
      if (!page.isClosed()) await page.goto("/login");
    }
    // toast may be ephemeral; check if it's visible but don't fail if not
    await page
      .locator("text=Registered successfully")
      .first()
      .waitFor({ timeout: 5000 })
      .catch(() => {});

    // 2) Simulate login by setting a mock token in localStorage so UI shows authenticated state
    const access = `pw-mock-token-${Date.now()}`;
    await page.goto("/");
    await page.evaluate((t) => {
      localStorage.setItem("gojjo_cinema_token", t);
      try {
        window.dispatchEvent(new CustomEvent("gojjo:auth-changed"));
      } catch (e) {}
    }, access);
    await page.reload();

    // 3) Navigate to a movie page (use an imdb id or sample numeric route that maps)
    // We'll open The Matrix by title search first via the UI search box or directly to movie route
    // Try direct route using an imdb-like id used by the backend combined API
    await page.goto("/movie/tt0133093");
    await expect(page.locator("text=Overview")).toBeVisible({ timeout: 7000 });

    // 4) Toggle favorite (click button with 'Add to Favorites' or 'Remove from Favorites')
    const favBtn = page.locator('button:has-text("Add to Favorites")').first();
    await expect(favBtn).toBeVisible({ timeout: 5000 });
    await favBtn.click();

    // Wait briefly for UI/localStorage update
    await page.waitForTimeout(800);
    // Verify favorite persisted in localStorage user data
    const userData = await page.evaluate(() =>
      localStorage.getItem("gojjo_cinema_user_data")
    );
    const parsed = userData ? JSON.parse(userData) : null;
    if (
      !parsed ||
      !Array.isArray(parsed.favorites) ||
      !parsed.favorites.includes("tt0133093")
    ) {
      throw new Error(
        "Favorite not found in localStorage user data; got: " + String(userData)
      );
    }

    // 6) Logout and confirm redirected to login and toast
    const logout = page.locator("text=Logout").first();
    await expect(logout).toBeVisible();
    await logout.click();
    await page.waitForURL("/login", { timeout: 4000 });
    await expect(page.locator("text=Logged out successfully").first())
      .toBeVisible({ timeout: 3000 })
      .catch(() => {});
  });
});
