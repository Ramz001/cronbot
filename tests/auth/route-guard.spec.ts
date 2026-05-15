import { test, expect } from '@playwright/test'
import { ADMIN_USER } from '../consts/auth-tokens'
import { getWhiteboxSessionToken } from '../utils/whitebox-auth'

test.describe('unauthenticated user', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies()
  })

  test('cannot access the settings page', async ({ page }) => {
    await page.goto(`/settings`)
    await expect(page).toHaveURL('/auth/sign-in')
  })
})

test.describe('admin user', () => {
  test('can access admin page', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'authjs.session-token',
        value: await getWhiteboxSessionToken(ADMIN_USER),
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false, // true for HTTPS
        sameSite: 'Lax',
        expires: Math.round((Date.now() + 86400000 * 1) / 1000),
      },
    ])

    await page.goto('/admin')
    await expect(page.getByRole('heading', { name: /admin/i })).toBeVisible()
  })
})
