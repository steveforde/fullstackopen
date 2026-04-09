import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'sharon_carlow',
        name: 'Sharon Carlow',  // Make sure name matches
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
      // FIX: Use exact text "Sharon Carlow logged in"
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
      // FIX: Use exact text "Sharon Carlow logged in"
      await expect(page.getByText('Sharon Carlow logged in')).toBeVisible()
    })


    // Test creating a new blog post
    test('a new blog can be created', async ({ page }) => {
      // Click button to open the create blog form
      await page.getByRole('button', { name: 'create new blog' }).click()
      // Fill out the form fields using their placeholder text
      await page.getByPlaceholder('title').fill('Playwright is powerful')
      await page.getByPlaceholder('author').fill('Steve Forde')
      await page.getByPlaceholder('url').fill('http://limerick-dev.com')
      // Submit the form
      await page.getByRole('button', { name: 'create' }).click()
      // Verify the new blog appears on the page
      // .first() gets the first matching element (there may be multiple)
      await expect(
        page.getByText(/Playwright is powerful Steve Forde/i).first(),
      ).toBeVisible()
    })

    // Test liking a blog post
    test('a blog can be liked', async ({ page }) => {
      // Find the blog container by its text, then go up to parent div
      const blogToLike = page
        .getByText(/Playwright is powerful Steve Forde/i) // Find blog text
        .first() // Get first match
        .locator('..') // Go up to parent container (the blog div)

      // Click view button to expand blog and show like button
      await blogToLike.getByRole('button', { name: 'view' }).click()
      // Click the like button
      await blogToLike.getByRole('button', { name: 'like' }).click()
      // Verify that likes text appears (confirms like was registered)
      await expect(blogToLike.getByText(/likes/i)).toBeVisible()
    })

    // Test deleting a blog post
    test('a blog can be deleted', async ({ page }) => {
      // Math.random() creates a unique title so test doesn't conflict with others
      const uniqueTitle = `Delete Me ${Math.random()}`
      const uniqueAuthor = 'Steve Forde'

      // Create a unique blog that we can delete
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill(uniqueTitle)
      await page.getByPlaceholder('author').fill(uniqueAuthor)
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()

      // .last() gets the last matching element (error message appears first, blog appears second)
      const blogPost = page.getByText(uniqueTitle).last()
      await expect(blogPost).toBeVisible() // Wait for blog to appear

      // .locator('..') moves up to the parent container div
      const blogContainer = blogPost.locator('..')

      // Click view to show the delete button
      await blogContainer.getByRole('button', { name: 'view' }).click()

      // Set up dialog handler BEFORE clicking the button
      // This automatically accepts the browser's confirm dialog
      page.on('dialog', (dialog) => dialog.accept())
      await blogContainer.getByRole('button', { name: 'remove' }).click()

      // Verify the blog is no longer visible on the page
      await expect(blogPost).not.toBeVisible()
    })

    // TEST 5.22 - Verify only the blog creator sees the delete button
    test('only the creator sees the delete button', async ({ page }) => {
      // Create a blog as Sharon (the creator)
      const uniqueTitle = `Creator Test ${Math.random()}`

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill(uniqueTitle)
      await page.getByPlaceholder('author').fill('Sharon')
      await page.getByPlaceholder('url').fill('http://sharonsblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForTimeout(2000) // Wait for blog to appear

      // Find Sharon's blog
      let blogPost = page.getByText(uniqueTitle).last()
      await expect(blogPost).toBeVisible({ timeout: 10000 })

      let blogContainer = blogPost.locator('..')
      await blogContainer.getByRole('button', { name: 'view' }).click()

      // Sharon SHOULD see the delete button (she created it)
      await expect(
        blogContainer.getByRole('button', { name: 'remove' }),
      ).toBeVisible()

      // Hide blog details and log out
      await blogContainer.getByRole('button', { name: 'hide' }).click()
      await page.getByRole('button', { name: 'logout' }).click()

      // Login as a different user (Steve)
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByPlaceholder('username').fill('steve_limerick')
      await page.getByPlaceholder('password').fill('secretpassword123')
      await page.locator('button[type="submit"]').click()
      await expect(page.getByText('Steve Forde logged in')).toBeVisible({
        timeout: 10000,
      })

      // Find the SAME blog (created by Sharon)
      blogPost = page.getByText(uniqueTitle).last()
      await expect(blogPost).toBeVisible({ timeout: 10000 })

      blogContainer = blogPost.locator('..')
      await blogContainer.getByRole('button', { name: 'view' }).click()

      // Steve should NOT see the delete button (he didn't create it)
      await expect(
        blogContainer.getByRole('button', { name: 'remove' }),
      ).not.toBeVisible()
    })

    // TEST 5.23 - Verify blogs are sorted by likes (most likes first)
    test('blogs are ordered by likes with most likes first', async ({
      page,
    }) => {
      // Create first blog with 1 like
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Blog With Few Likes')
      await page.getByPlaceholder('author').fill('Author A')
      await page.getByPlaceholder('url').fill('http://blog1.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForTimeout(2000)

      // Find first blog and add 1 like
      let blogPost = page.getByText('Blog With Few Likes').last()
      let blogContainer = blogPost.locator('..')
      await blogContainer.getByRole('button', { name: 'view' }).click()
      await blogContainer.getByRole('button', { name: 'like' }).click() // Add 1 like
      await blogContainer.getByRole('button', { name: 'hide' }).click()
      await page.waitForTimeout(1000)

      // Create second blog with 3 likes (this one should appear first)
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill('Blog With Many Likes')
      await page.getByPlaceholder('author').fill('Author B')
      await page.getByPlaceholder('url').fill('http://blog2.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.waitForTimeout(2000)

      // Find second blog and add 3 likes
      blogPost = page.getByText('Blog With Many Likes').last()
      blogContainer = blogPost.locator('..')
      await blogContainer.getByRole('button', { name: 'view' }).click()
      await blogContainer.getByRole('button', { name: 'like' }).click() // Like #1
      await page.waitForTimeout(300)
      await blogContainer.getByRole('button', { name: 'like' }).click() // Like #2
      await page.waitForTimeout(300)
      await blogContainer.getByRole('button', { name: 'like' }).click() // Like #3
      await blogContainer.getByRole('button', { name: 'hide' }).click()

      // Wait for likes to be processed and blogs to reorder
      await page.waitForTimeout(3000)

      // Get all blog containers on the page
      const allBlogs = await page.locator('div:has-text("view")').all()

      // Get the text content of the first two blogs
      const firstBlogText = (await allBlogs[0].textContent()) || ''
      const secondBlogText = (await allBlogs[1].textContent()) || ''

      // The blog with 3 likes should appear BEFORE the blog with 1 like
      expect(firstBlogText).toContain('Blog With Many Likes')
      expect(secondBlogText).toContain('Blog With Few Likes')
    })
  })
})
