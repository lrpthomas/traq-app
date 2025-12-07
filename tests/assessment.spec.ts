import { test, expect } from '@playwright/test';

test.describe('Assessment Routes (Unauthenticated)', () => {
  test('new assessment redirects to login', async ({ page }) => {
    await page.goto('/assessment/new');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
    // Redirect param should include assessment/new
    await expect(page).toHaveURL(/redirect.*assessment/);
  });

  test('edit assessment redirects to login', async ({ page }) => {
    await page.goto('/assessment/edit?id=test-id');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('home page redirects to login', async ({ page }) => {
    await page.goto('/');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Login Page UI', () => {
  test('displays login form elements', async ({ page }) => {
    await page.goto('/login');

    // Check page loads
    await expect(page.locator('body')).toBeVisible();

    // Form fields should be present
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"]').first();

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('has navigation links', async ({ page }) => {
    await page.goto('/login');

    // Should have a link to signup
    await expect(page.locator('a[href*="signup"]')).toBeVisible();
  });
});
