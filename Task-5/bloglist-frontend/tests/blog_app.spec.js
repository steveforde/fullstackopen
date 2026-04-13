import { test, expect } from '@playwright/test'

/**
 * Playwright test suite for the Blog App.
 * Tests cover login, blog creation, liking, deletion, permissions, and sorting.
 */
test.describe('Blog app', () => {
  /**
   * beforeEach hook runs before every test in this suite.
   * It resets the backend (clears test database) and creates two test users.
   * Then navigates to the frontend.
   */
  test.beforeEach(async ({ page, request }) => {
    // Reset the test database – deletes all blogs and users
    await request.post('http://localhost:3003/api/testing/reset')
    // Create user Sharon Carlow
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'sharon_carlow',
        name: 'Sharon Carlow', // This name appears after login
        password: 'sharonpassword123',
      },
    })
    // Create user Steve Forde
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'steve_limerick',
        name: 'Steve Forde',
        password: 'secretpassword123',
      },
    })
    // Go to the frontend application (Vite dev server)
    await page.goto('http://localhost:5173')
  })

  /**
   * Test: The login form is displayed correctly.
   * Expects a heading with text "Blog App" (your logged-out screen heading).
   */
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Blog App' })).toBeVisible()
  })

  /**
   * Group of tests related to the login functionality.
   */
  test.describe('Login', () => {
    /**
     * Test: Successful login with correct username and password.
     * Uses placeholder selectors (you added 'placeholder="username"' to your TextField).
     * Clicks the LOGIN button, then verifies the welcome message appears.
     */
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByPlaceholder('username').fill('sharon_carlow')
      await page.getByPlaceholder('password').fill('sharonpassword123')
      await page.getByRole('button', { name: 'LOGIN' }).click()
      await expect(page.getByText('Sharon Carlow logged in')).toBeVisible()
    })

    /**
     * Test: Failed login with wrong password.
     * Expects an error message: "Wrong credentials" (as defined in your App.jsx).
     */
    test('fails with wrong credentials', async ({ page }) => {
      await page.getByPlaceholder('username').fill('sharon_carlow')
      await page.getByPlaceholder('password').fill('wrong')
      await page.getByRole('button', { name: 'LOGIN' }).click()
      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })

  /**
   * Group of tests that require the user to be logged in.
   * beforeEach inside this group logs in as Sharon Carlow.
   */
  test.describe('When logged in', () => {
    // Log in before each test in this group
    test.beforeEach(async ({ page }) => {
      await page.getByPlaceholder('username').fill('sharon_carlow')
      await page.getByPlaceholder('password').fill('sharonpassword123')
      await page.getByRole('button', { name: 'LOGIN' }).click()
      await expect(page.getByText('Sharon Carlow logged in')).toBeVisible()
    })

    /**
     * Test: Creating a new blog.
     * Opens the creation form, fills title, author, URL, and submits.
     * Verifies the newly created blog appears on the page.
     */
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

    /**
     * Test: Liking a blog.
     * Creates its own unique blog (so it doesn't depend on previous tests).
     * Uses data-testid="blog-item" (present in your BlogList component) to locate the blog container.
     * Clicks "view" to expand, then "like", and verifies that "likes" text appears.
     */
    test('a blog can be liked', async ({ page }) => {
      const uniqueTitle = `Like Test ${Date.now()}`
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByPlaceholder('title').fill(uniqueTitle)
      await page.getByPlaceholder('author').fill('Test Author')
      await page.getByPlaceholder('url').fill('http://liketest.com')
      await page.getByRole('button', { name: 'create' }).click()

      const blogItem = page.locator(
        `[data-testid="blog-item"]:has-text("${uniqueTitle}")`,
      )
      await expect(blogItem).toBeVisible({ timeout: 5000 })

      await blogItem.getByRole('button', { name: 'view' }).click()
      await expect(blogItem.getByRole('button', { name: 'like' })).toBeVisible({
        timeout: 5000,
      })
      await blogItem.getByRole('button', { name: 'like' }).click()
      await expect(blogItem.getByText(/likes/)).toBeVisible()
    })

    /**
     * Test: Deleting a blog.
     * Creates a unique blog, expands it, accepts the browser confirm dialog,
     * clicks remove, and verifies the blog container is no longer visible.
     */
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
      // Listen for the browser's confirm dialog and automatically accept it
      page.on('dialog', (dialog) => dialog.accept())
      await blogItem.getByRole('button', { name: 'remove' }).click()
      await expect(blogItem).not.toBeVisible()
    })

    /**
     * Test: Only the creator of a blog can see the delete button.
     * Sharon creates a blog, verifies she sees "remove".
     * She logs out, Steve logs in, opens the same blog, and verifies he does NOT see "remove".
     */
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
      // Sharon should see the remove button
      await expect(
        blogItem.getByRole('button', { name: 'remove' }),
      ).toBeVisible()
      await blogItem.getByRole('button', { name: 'hide' }).click()

      // Logout Sharon
      await page.getByRole('button', { name: 'logout' }).click()

      // Login as Steve
      await page.getByPlaceholder('username').fill('steve_limerick')
      await page.getByPlaceholder('password').fill('secretpassword123')
      await page.getByRole('button', { name: 'LOGIN' }).click()
      await expect(page.getByText('Steve Forde logged in')).toBeVisible()

      // Find the same blog (Steve can see it because it exists)
      const steveBlogItem = page.locator(
        `[data-testid="blog-item"]:has-text("${uniqueTitle}")`,
      )
      await expect(steveBlogItem).toBeVisible({ timeout: 5000 })
      await steveBlogItem.getByRole('button', { name: 'view' }).click()
      // Steve should NOT see the remove button
      await expect(
        steveBlogItem.getByRole('button', { name: 'remove' }),
      ).not.toBeVisible()
    })

    /**
     * Test: Blogs are sorted by likes, with the most liked blog appearing first.
     * Creates two blogs: one with few likes, one with many.
     * Adds 3 likes to the "many" blog, 1 like to the "few" blog.
     * Waits for re‑ordering, then finds their positions in the list.
     * Asserts that the "many" blog appears before the "few" blog.
     */
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

      // Like the many-likes blog 3 times
      const manyBlog = page.locator(
        `[data-testid="blog-item"]:has-text("${manyLikesTitle}")`,
      )
      await manyBlog.getByRole('button', { name: 'view' }).click()
      for (let i = 0; i < 3; i++) {
        await manyBlog.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(300) // brief pause between likes
      }
      await manyBlog.getByRole('button', { name: 'hide' }).click()

      // Like the few-likes blog once
      const fewBlog = page.locator(
        `[data-testid="blog-item"]:has-text("${fewLikesTitle}")`,
      )
      await fewBlog.getByRole('button', { name: 'view' }).click()
      await fewBlog.getByRole('button', { name: 'like' }).click()
      await fewBlog.getByRole('button', { name: 'hide' }).click()

      // Wait for the frontend to re‑order the list (based on likes)
      await page.waitForTimeout(2000)

      // Get all blog titles from the home page (the order on screen)
      const allTitles = await page
        .locator('[data-testid="blog-item"] p a')
        .allTextContents()
      const manyIndex = allTitles.findIndex(
        (title) => title === manyLikesTitle,
      )
      const fewIndex = allTitles.findIndex((title) => title === fewLikesTitle)

      // Expect the "many likes" blog to appear before the "few likes" blog
      expect(manyIndex).toBeLessThan(fewIndex)
    })
  })
})
