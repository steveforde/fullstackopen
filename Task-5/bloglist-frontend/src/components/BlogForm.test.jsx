// Import testing utilities from React Testing Library
// render: renders a React component in a virtual DOM for testing
// screen: provides methods to query for elements in the rendered component
import { render, screen } from '@testing-library/react'

// userEvent: simulates actual user interactions (typing, clicking, etc.)
// More realistic than fireEvent because it triggers full browser events
import userEvent from '@testing-library/user-event'

// Import the BlogForm component to test
import BlogForm from './BlogForm'

// ========== TEST: BlogForm Submission ==========
// Verifies that when a user fills out and submits the form,
// the createBlog event handler receives the correct data
test('<BlogForm /> calls the event handler with the right details when a new blog is created', async () => {
  // Create a mock function to track if/when createBlog is called
  // vi.fn() is Vitest's mock function (similar to jest.fn())
  // This replaces the real createBlog function passed from App.jsx
  const createBlog = vi.fn()

  // Create a user instance for simulating interactions
  // setup() initializes userEvent with default options
  const user = userEvent.setup()

  // Render the BlogForm component with the mock handler as a prop
  // Normally createBlog would be the addBlog function from App.jsx
  render(<BlogForm createBlog={createBlog} />)

  // ========== FIND FORM ELEMENTS ==========
  // Use getByPlaceholderText to find input fields by their placeholder attribute
  // These must match the placeholder text in your BlogForm component
  // Example: <input placeholder="title" ... />
  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')

  // Find the submit button by its text content
  const sendButton = screen.getByText('create')

  // ========== SIMULATE USER ACTIONS ==========
  // user.type() simulates a user typing into an input field
  // First argument: the input element to type into
  // Second argument: the text to type
  // Each character triggers input events just like a real user
  await user.type(titleInput, 'Limerick Dev Blog')
  await user.type(authorInput, 'Steve')
  await user.type(urlInput, 'www.steve.com')

  // user.click() simulates a mouse click on the button
  // This triggers the form's onSubmit event
  await user.click(sendButton)

  // ========== VERIFY MOCK FUNCTION WAS CALLED CORRECTLY ==========

  // Check that the handler was called exactly once
  // mock.calls is an array containing all calls to the mock function
  // .toHaveLength(1) means the function was called 1 time
  expect(createBlog.mock.calls).toHaveLength(1)

  // Check the content of the first argument of the first call
  // mock.calls[0] - the first call to the function
  // mock.calls[0][0] - the first argument passed in that call
  // The createBlog function receives a blog object: { title, author, url }
  expect(createBlog.mock.calls[0][0].title).toBe('Limerick Dev Blog')
  expect(createBlog.mock.calls[0][0].author).toBe('Steve')
  expect(createBlog.mock.calls[0][0].url).toBe('www.steve.com')
})
