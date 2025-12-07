import { test, expect } from '@playwright/test';

test.describe('Public Page Navigation', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('signup page loads', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('reset password page loads', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page).toHaveURL(/\/reset-password/);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Authentication Redirects', () => {
  test('home redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('settings redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/login/);
  });

  test('team settings redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/team/settings');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Mobile Viewport', () => {
  test('login page works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');

    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Page Load Performance', () => {
  test('login page loads quickly', async ({ page }) => {
    const start = Date.now();
    await page.goto('/login');
    await expect(page.locator('body')).toBeVisible();
    const loadTime = Date.now() - start;

    // Should load in under 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});
