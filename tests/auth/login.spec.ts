import { test, expect } from '@playwright/test'
// import { loginAsTestUser } from '../utils/blackbox-auth'

test.describe('Login functionality', () => {
  // test('should login successfully using environment variables', async ({
  //   page,
  // }) => {
  //   // Use the blackbox login utility
  //   await loginAsTestUser(page)

  //   // Verify we're on the settings page
  //   await expect(page).toHaveURL('/settings')

  //   // Verify user is authenticated (check for logout button or user info)
  //   await expect(page.getByText('Settings')).toBeVisible()
  // })

  test('should show error for invalid credentials', async ({ page }) => {
    // Navigate to sign in page
    await page.goto('/auth/sign-in')

    // Fill in invalid credentials
    await page.getByLabel('Email').fill('invalid@example.com')
    await page.getByLabel('Password').fill('wrongpassword')

    // Submit the form
    await page.getByRole('button', { name: 'Login', exact: true }).click()

    // Verify error toast appears (auth returns 'Invalid email or password.')
    await expect(
      page.getByText('Invalid email or password.')
    ).toBeVisible({ timeout: 10000 })
  })
})
