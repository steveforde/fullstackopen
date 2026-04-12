import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'sharon_carlow',
        name: 'Sharon Carlow',
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
    await expect(page.getByRole('heading', { name: 'Blog App' })).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByPlaceholder('username').fill('sharon_carlow')
      await page.getByPlaceholder('password').fill('sharonpassword123')
      await page.getByRole('button', { name: 'LOGIN' }).click()
      await expect(page.getByText('Sharon Carlow logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByPlaceholder('username').fill('sharon_carlow')
      await page.getByPlaceholder('password').fill('wrong')
      await page.getByRole('button', { name: 'LOGIN' }).click()
      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByPlaceholder('username').fill('sharon_carlow')
      await page.getByPlaceholder('password').fill('sharonpassword123')
      await page.getByRole('button', { name: 'LOGIN' }).click()
      await expect(page.getByText('Sharon Carlow logged in')).toBeVisible()
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
      // Create a unique blog
      const uniqueTitle = `Like Test ${Date.now()}`
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill(uniqueTitle)
      await page.getByPlaceholder('author').fill('Test Author')
      await page.getByPlaceholder('url').fill('http://liketest.com')
      await page.getByRole('button', { name: 'create' }).click()

      // Find the blog container using data-testid
      const blogItem = page.locator(
        `[data-testid="blog-item"]:has-text("${uniqueTitle}")`,
      )
      await expect(blogItem).toBeVisible({ timeout: 5000 })

      // Click the view button inside that container
      await blogItem.getByRole('button', { name: 'view' }).click()

      // Now the like button appears – wait and click
      await expect(blogItem.getByRole('button', { name: 'like' })).toBeVisible({
        timeout: 5000,
      })
      await blogItem.getByRole('button', { name: 'like' }).click()

      // Verify likes count is present
      await expect(blogItem.getByText(/likes/)).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      const uniqueTitle = `Delete Me ${Date.now()}`
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill(uniqueTitle)
      await page.getByPlaceholder('author').fill('Steve Forde')
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()

      const blogItem = page.locator(
        `[data-testid="blog-item"]:has-text("${uniqueTitle}")`,
      )
      await expect(blogItem).toBeVisible({ timeout: 5000 })

      await blogItem.getByRole('button', { name: 'view' }).click()
      page.on('dialog', (dialog) => dialog.accept())
      await blogItem.getByRole('button', { name: 'remove' }).click()

      await expect(blogItem).not.toBeVisible()
    })

    test('only the creator sees the delete button', async ({ page }) => {
      const uniqueTitle = `Creator Test ${Date.now()}`

      // Sharon creates a blog
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill(uniqueTitle)
      await page.getByPlaceholder('author').fill('Sharon Carlow')
      await page.getByPlaceholder('url').fill('http://sharonsblog.com')
      await page.getByRole('button', { name: 'create' }).click()

      const blogItem = page.locator(
        `[data-testid="blog-item"]:has-text("${uniqueTitle}")`,
      )
      await expect(blogItem).toBeVisible({ timeout: 5000 })
      await blogItem.getByRole('button', { name: 'view' }).click()

      // Sharon should see remove button
      await expect(
        blogItem.getByRole('button', { name: 'remove' }),
      ).toBeVisible()
      await blogItem.getByRole('button', { name: 'hide' }).click()

      // Logout
      await page.getByRole('button', { name: 'logout' }).click()

      // Login as Steve
      await page.getByPlaceholder('username').fill('steve_limerick')
      await page.getByPlaceholder('password').fill('secretpassword123')
      await page.getByRole('button', { name: 'LOGIN' }).click()
      await expect(page.getByText('Steve Forde logged in')).toBeVisible()

      // Find the same blog (Steve should see it)
      const steveBlogItem = page.locator(
        `[data-testid="blog-item"]:has-text("${uniqueTitle}")`,
      )
      await expect(steveBlogItem).toBeVisible({ timeout: 5000 })
      await steveBlogItem.getByRole('button', { name: 'view' }).click()

      // Steve should NOT see remove button
      await expect(
        steveBlogItem.getByRole('button', { name: 'remove' }),
      ).not.toBeVisible()
    })

    test('blogs are ordered by likes with most likes first', async ({
      page,
    }) => {
      const fewLikesTitle = `Few Likes ${Date.now()}`
      const manyLikesTitle = `Many Likes ${Date.now()}`

      // Create blog with few likes
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill(fewLikesTitle)
      await page.getByPlaceholder('author').fill('Author A')
      await page.getByPlaceholder('url').fill('http://blog1.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(
        page.locator(`[data-testid="blog-item"]:has-text("${fewLikesTitle}")`),
      ).toBeVisible({ timeout: 5000 })

      // Create blog with many likes
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill(manyLikesTitle)
      await page.getByPlaceholder('author').fill('Author B')
      await page.getByPlaceholder('url').fill('http://blog2.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(
        page.locator(`[data-testid="blog-item"]:has-text("${manyLikesTitle}")`),
      ).toBeVisible({ timeout: 5000 })

      // Like the many‑likes blog 3 times
      const manyBlog = page.locator(
        `[data-testid="blog-item"]:has-text("${manyLikesTitle}")`,
      )
      await manyBlog.getByRole('button', { name: 'view' }).click()
      for (let i = 0; i < 3; i++) {
        await manyBlog.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(300)
      }
      await manyBlog.getByRole('button', { name: 'hide' }).click()

      // Like the few‑likes blog once
      const fewBlog = page.locator(
        `[data-testid="blog-item"]:has-text("${fewLikesTitle}")`,
      )
      await fewBlog.getByRole('button', { name: 'view' }).click()
      await fewBlog.getByRole('button', { name: 'like' }).click()
      await fewBlog.getByRole('button', { name: 'hide' }).click()

      // Wait for reorder (home page sorts by likes)
      await page.waitForTimeout(2000)

      // Get all blog titles from the home page
      const allTitles = await page
        .locator('[data-testid="blog-item"] p a')
        .allTextContents()
      const manyIndex = allTitles.findIndex((title) => title === manyLikesTitle)
      const fewIndex = allTitles.findIndex((title) => title === fewLikesTitle)

      expect(manyIndex).toBeLessThan(fewIndex)
    })
  })
})
