import { test, expect } from '@playwright/test';

test.describe('Authentication Pages', () => {
  test('login page loads correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);

    // Check for form elements
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('signup page loads correctly', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveURL(/\/signup/);

    // Check for form elements
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    // Signup has password and confirm password
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('reset password page loads correctly', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page).toHaveURL(/\/reset-password/);

    // Check for email field
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
  });

  test('login page has link to signup', async ({ page }) => {
    await page.goto('/login');
    const signupLink = page.locator('a[href*="signup"]');
    await expect(signupLink).toBeVisible();
  });

  test('signup page has link to login', async ({ page }) => {
    await page.goto('/signup');
    const loginLink = page.locator('a[href*="login"]');
    await expect(loginLink).toBeVisible();
  });
});

test.describe('Authentication Redirects', () => {
  test('home page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/');
    // Should redirect to login with redirect parameter
    await expect(page).toHaveURL(/\/login/);
  });

  test('protected pages redirect to login', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/login.*redirect/);
  });

  test('assessment pages redirect to login', async ({ page }) => {
    await page.goto('/assessment/new');
    await expect(page).toHaveURL(/\/login.*redirect.*assessment/);
  });
});
