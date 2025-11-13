const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // очищаем базу
    await request.post('http://localhost:3001/api/testing/reset');

    // создаём пользователя
    const newUser = {
      name: 'Test User',
      username: 'testuser',
      password: 'password123'
    };
    await request.post('http://localhost:3001/api/users', { data: newUser });

    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible();
    await expect(page.getByLabel('password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('testuser');
      await page.getByLabel('password').fill('password123');
      await page.getByRole('button', { name: 'login' }).click();

      await expect(page.getByText('Test User logged in')).toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // логинимся перед каждым тестом в этом блоке
      await page.getByLabel('username').fill('testuser');
      await page.getByLabel('password').fill('password123');
      await page.getByRole('button', { name: 'login' }).click();
      await expect(page.getByText('Test User logged in')).toBeVisible();
    });

    test('A blog can be created', async ({ page }) => {
      // открываем форму добавления блога
      await page.getByRole('button', { name: 'new blog' }).click();

      // заполняем форму
      await page.getByLabel('title').fill('Test Blog');
      await page.getByLabel('author').fill('Author Name');
      await page.getByLabel('url').fill('http://testblog.com');

      // сохраняем
      await page.getByRole('button', { name: 'create' }).click();

      // проверяем, что блог появился на странице
      await expect(page.getByText('Test Blog Author Name')).toBeVisible();
    });
  });
});
