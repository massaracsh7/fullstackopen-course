const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3001/api/testing/reset");

    const newUser = {
      name: "Test User",
      username: "testuser",
      password: "password123",
    };
    await request.post("http://localhost:3001/api/users", { data: newUser });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel("username").fill("testuser");
      await page.getByLabel("password").fill("password123");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Test User logged in")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel("username").fill("testuser");
      await page.getByLabel("password").fill("password123");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Test User logged in")).toBeVisible();
    });

    test("A blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();

      await page.getByLabel("title").fill("Test Blog");
      await page.getByLabel("author").fill("Author Name");
      await page.getByLabel("url").fill("http://testblog.com");

      await page.getByRole("button", { name: "create" }).click();

      await expect(page.getByText("Test Blog Author Name")).toBeVisible();
    });
    test("A blog can be liked", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByLabel("title").fill("Blog to like");
      await page.getByLabel("author").fill("Tester");
      await page.getByLabel("url").fill("http://likeblog.com");
      await page.getByRole("button", { name: "create" }).click();

      await page.getByRole("button", { name: "view" }).click();

      await page.getByRole("button", { name: "like" }).click();

      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("User who created a blog can delete it", async ({ page }) => {
      await page.getByRole("button", { name: "new blog" }).click();
      await page.getByLabel("title").fill("Deletable Blog");
      await page.getByLabel("author").fill("Tester");
      await page.getByLabel("url").fill("http://deleteblog.com");
      await page.getByRole("button", { name: "create" }).click();

      await page.getByRole("button", { name: "view" }).click();

      await page.getByRole("button", { name: "remove" }).click();

      await expect(page.getByText("Deletable Blog Tester")).not.toBeVisible();
    });

    test("Blogs are ordered by number of likes", async ({ page }) => {
      async function createBlog(title) {
        await page.getByRole("button", { name: "new blog" }).click();
        await page.getByLabel("title").fill(title);
        await page.getByLabel("author").fill("Test Author");
        await page.getByLabel("url").fill("http://example.com");
        await page.getByRole("button", { name: "create" }).click();
      }

      await createBlog("Blog1");
      await createBlog("Blog2");
      await createBlog("Blog3");

      const viewButtons = page.getByRole("button", { name: "view" });
      await viewButtons.nth(0).click();
      await viewButtons.nth(1).click();
      await viewButtons.nth(2).click();

      async function likeBlog(nth, times) {
        const likeButton = page.getByRole("button", { name: "like" }).nth(nth);
        for (let i = 0; i < times; i++) {
          await likeButton.click();
          await page.waitForTimeout(200);
        }
      }

      await likeBlog(0, 1);
      await likeBlog(1, 3);
      await likeBlog(2, 2);

      const blogElements = await page.locator(".blog").allTextContents();

      expect(blogElements[0]).toContain("Blog2");
      expect(blogElements[1]).toContain("Blog3");
      expect(blogElements[2]).toContain("Blog1");
    });
  });
});
