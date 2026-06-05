import { test, expect } from "@playwright/test";
import Redis from "ioredis";

const STORIES_KEY = "hn:best:stories";
let redis: Redis;

const mockStories = [
  {
    id: "e2e-123",
    url: "https://example.com/playwright",
    title: "Playwright makes E2E testing easy",
    byline: "Automated Tester",
    content: "<p>This is the full article content rendered via HTML.</p>",
    excerpt: "A short summary of the playwright article.",
    imageUrl: null,
  },
];

test.describe.serial("Hacker News Application Flow", () => {
  test.beforeAll(async () => {
    redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
  });

  test.afterAll(async () => {
    await redis.quit();
  });

  test("displays stories on home page and navigates to details", async ({
    page,
  }) => {
    await redis.set(STORIES_KEY, JSON.stringify(mockStories));
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await page.goto("/");
    console.log(page.locator("h1"));
    await expect(page.locator("h1")).toContainText("Hacker News Top Stories");

    const storyCardTitle = page.getByText("Playwright makes E2E testing easy", {
      exact: false,
    });
    await expect(storyCardTitle).toBeVisible();

    await expect(page.getByText("✍️ Automated Tester")).toBeVisible();
    await expect(page.getByText("A short summary")).toBeVisible();

    await storyCardTitle.click();
    await expect(page).toHaveURL(/\/story\/e2e-123/);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Playwright makes E2E testing easy"
    );

    const backLink = page.getByRole("link", { name: "← Back" });
    await backLink.click();
    await expect(page).toHaveURL("/");
  });

  test("displays empty state when Redis is empty", async ({ page }) => {
    await redis.del(STORIES_KEY);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await page.goto("/");
    await expect(page.getByText("We are processing articles")).toBeVisible();
  });
});
