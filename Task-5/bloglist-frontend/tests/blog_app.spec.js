import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'sharon_carlow',
        name: 'Sharon Carlow', // ← MUST match the logged-in message
        password: 'sharonpassword123',
      },
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'steve_limerick',
        name: 'Steve Forde',
        password: 'secretpassword123',
      },
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByPlaceholder('username').fill('sharon_carlow')
      await page.getByPlaceholder('password').fill('sharonpassword123')
      await page.locator('button[type="submit"]').click()
      await expect(page.getByText('Sharon Carlow logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByPlaceholder('username').fill('sharon_carlow')
      await page.getByPlaceholder('password').fill('wrong')
      await page.locator('button[type="submit"]').click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByPlaceholder('username').fill('sharon_carlow')
      await page.getByPlaceholder('password').fill('sharonpassword123')
      await page.locator('button[type="submit"]').click()
      await expect(page.getByText('Sharon Carlow logged in')).toBeVisible() // ← fixed typo
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Playwright is powerful')
      await page.getByPlaceholder('author').fill('Steve Forde')
      await page.getByPlaceholder('url').fill('http://limerick-dev.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(
        page.getByText(/Playwright is powerful Steve Forde/i).first(),
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      const blogToLike = page
        .getByText(/Playwright is powerful Steve Forde/i)
        .first()
        .locator('..')

      await blogToLike.getByRole('button', { name: 'view' }).click()
      await blogToLike.getByRole('button', { name: 'like' }).click()
      await expect(blogToLike.getByText(/likes/i)).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      const uniqueTitle = `Delete Me ${Math.random()}`
      const uniqueAuthor = 'Steve Forde'

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill(uniqueTitle)
      await page.getByPlaceholder('author').fill(uniqueAuthor)
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()

      const blogPost = page.getByText(uniqueTitle).last()
      await expect(blogPost).toBeVisible()

      const blogContainer = blogPost.locator('..')
      await blogContainer.getByRole('button', { name: 'view' }).click()

      page.on('dialog', (dialog) => dialog.accept())
      await blogContainer.getByRole('button', { name: 'remove' }).click()

      await expect(blogContainer).not.toBeVisible() // ← fixed line
    })

    test('only the creator sees the delete button', async ({ page }) => {
      const uniqueTitle = `Creator Test ${Math.random()}`

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill(uniqueTitle)
      await page.getByPlaceholder('author').fill('Sharon Carlow')
      await page.getByPlaceholder('url').fill('http://sharonsblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForTimeout(2000)

      let blogPost = page.getByText(uniqueTitle).last()
      await expect(blogPost).toBeVisible({ timeout: 10000 })

      let blogContainer = blogPost.locator('..')
      await blogContainer.getByRole('button', { name: 'view' }).click()

      await expect(
        blogContainer.getByRole('button', { name: 'remove' }),
      ).toBeVisible()

      await blogContainer.getByRole('button', { name: 'hide' }).click()
      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByRole('button', { name: 'login' }).click()
      await page.getByPlaceholder('username').fill('steve_limerick')
      await page.getByPlaceholder('password').fill('secretpassword123')
      await page.locator('button[type="submit"]').click()
      await expect(page.getByText('Steve Forde logged in')).toBeVisible({
        timeout: 10000,
      })

      blogPost = page.getByText(uniqueTitle).last()
      await expect(blogPost).toBeVisible({ timeout: 10000 })

      blogContainer = blogPost.locator('..')
      await blogContainer.getByRole('button', { name: 'view' }).click()

      await expect(
        blogContainer.getByRole('button', { name: 'remove' }),
      ).not.toBeVisible()
    })

    test('blogs are ordered by likes with most likes first', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Blog With Few Likes')
      await page.getByPlaceholder('author').fill('Author A')
      await page.getByPlaceholder('url').fill('http://blog1.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForTimeout(2000)

      let blogPost = page.getByText('Blog With Few Likes').last()
      let blogContainer = blogPost.locator('..')
      await blogContainer.getByRole('button', { name: 'view' }).click()
      await blogContainer.getByRole('button', { name: 'like' }).click()
      await blogContainer.getByRole('button', { name: 'hide' }).click()
      await page.waitForTimeout(1000)

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Blog With Many Likes')
      await page.getByPlaceholder('author').fill('Author B')
      await page.getByPlaceholder('url').fill('http://blog2.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForTimeout(2000)

      blogPost = page.getByText('Blog With Many Likes').last()
      blogContainer = blogPost.locator('..')
      await blogContainer.getByRole('button', { name: 'view' }).click()
      await blogContainer.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(300)
      await blogContainer.getByRole('button', { name: 'like' }).click()
      await page.waitForTimeout(300)
      await blogContainer.getByRole('button', { name: 'like' }).click()
      await blogContainer.getByRole('button', { name: 'hide' }).click()

      await page.waitForTimeout(3000)

      const allBlogs = await page.locator('div:has-text("view")').all()
      const firstBlogText = (await allBlogs[0].textContent()) || ''
      const secondBlogText = (await allBlogs[1].textContent()) || ''

      expect(firstBlogText).toContain('Blog With Many Likes')
      expect(secondBlogText).toContain('Blog With Few Likes')
    })
  })
})
