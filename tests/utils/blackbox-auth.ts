import { Page } from '@playwright/test'
import 'dotenv/config'

export async function loginAsTestUser(page: Page): Promise<void> {
  const email = process.env.TEST_USER_EMAIL
  const password = process.env.TEST_USER_PASSWORD

  if (!email || !password) {
    throw new Error(
      'Missing required environment variables: TEST_USER_EMAIL and TEST_USER_PASSWORD must be set'
    )
  }

  // Navigate to login page
  await page.goto('/auth/sign-in')

  // Fill in the login form
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)

  // Submit the form
  await page.getByRole('button', { name: 'Login', exact: true }).click()

  // Wait for navigation to complete (login redirects to /settings)
  await page.waitForURL('/settings', { timeout: 10000 })
}
