// Import testing utilities from React Testing Library
// render: renders a React component in a virtual DOM for testing
// screen: provides methods to query for elements in the rendered component
import { render, screen } from '@testing-library/react'

// userEvent: simulates actual user interactions (clicks, typing, etc.)
// More realistic than fireEvent because it triggers full browser events
import userEvent from '@testing-library/user-event'

// Import the Blog component to test
import Blog from './Blog'

// describe() groups related test cases together
// First argument: description of the test suite
// Second argument: function containing individual tests
describe('<Blog />', () => {
  // ========== TEST DATA (MOCK OBJECTS) ==========

  // Mock blog object that simulates what the backend would return
  const blog = {
    title: 'Testing React with Vitest',
    author: 'Steve Forde',
    url: 'https://fullstackopen.com',
    likes: 12,
    user: {
      username: 'sharon', // Owner of the blog
      name: 'Sharon',
    },
  }

  // Mock currentUser object (logged-in user)
  // Same username as blog.user, so this user OWNS the blog
  const currentUser = {
    username: 'sharon',
    name: 'Sharon',
  }

  // ========== TEST 1: Default Rendering ==========
  // 5.13: Step 1 - Verify initial view shows only title + author
  test('renders title and author, but not URL or likes by default', () => {
    // Render the Blog component with test props
    render(<Blog blog={blog} currentUser={currentUser} />)

    // SHOULD be visible: title and author
    // getByText: finds element by text content - throws error if not found
    // Using regex /text/ for case-insensitive partial matching
    expect(screen.getByText(/Testing React with Vitest/)).toBeDefined()
    expect(screen.getByText(/Steve Forde/)).toBeDefined()

    // SHOULD NOT be visible: URL and likes
    // queryByText: returns null if element not found (doesn't throw error)
    // This is perfect for testing that something is NOT in the DOM
    const url = screen.queryByText('https://fullstackopen.com')
    const likes = screen.queryByText('likes 12')

    // Assert that both elements are absent from the DOM
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  // ========== TEST 2: View Button Shows Details ==========
  // 5.14: Step 2 - Verify clicking "view" reveals URL and likes
  test('blog URL and likes are shown when "view" button is clicked', async () => {
    // Render component
    render(<Blog blog={blog} currentUser={currentUser} />)

    // Create a user instance for simulating interactions
    const user = userEvent.setup()

    // Find the "view" button and click it
    const button = screen.getByText('view')
    await user.click(button) // await because click returns a Promise

    // After clicking, URL and likes should now be visible
    expect(screen.getByText('https://fullstackopen.com')).toBeDefined()
    expect(screen.getByText(/likes 12/)).toBeDefined()
  })

  // ========== TEST 3: Like Button Handler Called Twice ==========
  // 5.15: Step 3 - Verify that clicking "like" calls the handler correctly
  test('if the like button is clicked twice, the event handler is called twice', async () => {
    // Create a mock function to track if/when updateBlog is called
    // vi.fn() is Vitest's mock function (similar to Jest's jest.fn())
    const mockHandler = vi.fn()

    // Render component with the mock handler as updateBlog prop
    render(
      <Blog
        blog={blog}
        currentUser={currentUser}
        updateBlog={mockHandler} // Pass mock instead of real function
      />,
    )

    const user = userEvent.setup()

    // STEP 1: Click "view" button to reveal the like button
    // Like button is hidden by default, must expand details first
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    // STEP 2: Find the like button (now visible) and click it twice
    const likeButton = screen.getByText('like')
    await user.click(likeButton) // First click
    await user.click(likeButton) // Second click

    // STEP 3: Verify mock handler was called exactly 2 times
    // mock.calls is an array of all calls to the mock function
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
