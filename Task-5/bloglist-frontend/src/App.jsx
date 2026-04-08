// Import React hooks and components
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogNotification from './components/BlogNotification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

// Main App component - root of the application
const App = () => {
  // ========== STATE VARIABLES ==========

  // Stores all blog posts fetched from the backend
  const [blogs, setBlogs] = useState([])

  // Form field for login username
  const [username, setUsername] = useState('')

  // Form field for login password
  const [password, setPassword] = useState('')

  // Stores the currently logged-in user object (null if not logged in)
  const [user, setUser] = useState(null)

  // Message to display in notification (null = no notification)
  const [notification, setNotification] = useState(null)

  // Determines notification style: "success" (green) or "error" (red)
  const [notificationType, setNotificationType] = useState('success')

  // Ref to access Togglable component's methods (like toggleVisibility)
  const blogFormRef = useRef()

  // ========== EFFECT HOOKS ==========

  // EFFECT 1: Check for existing login on page load/refresh
  // Runs once when component mounts (empty dependency array)
  useEffect(() => {
    // Look for user data in localStorage
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      // Parse the JSON string back into an object
      const user = JSON.parse(loggedUserJSON)
      // Set user in state (user stays logged in after refresh)
      setUser(user)
      // Set the token in blogService for authenticated requests
      blogService.setToken(user.token)
    }
  }, []) // Empty array = run only once on mount

  // EFFECT 2: Fetch all blogs from the backend
  // Runs once when component mounts
  useEffect(() => {
    // Call blogService to get all blogs, then update state
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, []) // Empty array = run only once on mount

  // ========== EVENT HANDLERS ==========

  /**
   * Handles user login form submission
   * @param {Event} event - Form submit event
   */
  // Define an asynchronous function to handle user login when the form is submitted
  const handleLogin = async (event) => {
    // Prevent the browser's default form submission behavior (which would cause a page reload)
    event.preventDefault()

    try {
      // Attempt to authenticate the user by calling the login service
      // Pass the username and password (from component state) to the backend API
      // The 'await' keyword pauses execution until the login request completes
      const user = await loginService.login({ username, password })

      // Log the returned user object to the browser console for debugging
      // Typically contains user info and an authentication token
      console.log('User object from server:', user)

      // Save the user data to localStorage to persist login state across browser refreshes
      // The user object is converted to a JSON string because localStorage only stores strings
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      // Configure the blogService with the user's authentication token
      // This token will be automatically included in all future API requests to the backend
      // This is how the server knows the user is authenticated
      blogService.setToken(user.token)

      // Update React component state with the logged-in user
      // This triggers a re-render and typically shows the user interface for authenticated users
      setUser(user)

      // Clear the username input field by resetting its state variable to an empty string
      setUsername('')

      // Clear the password input field by resetting its state variable to an empty string
      setPassword('')
    } catch {
      // If any error occurs during the login process (wrong credentials, network error, etc.):

      // Set an error notification message to be displayed to the user
      setNotification('wrong username or password')

      // Set the notification type to "error" (likely changes styling to red or similar)
      setNotificationType('error')

      // Automatically clear the notification after 5 seconds
      // This prevents the error message from staying on screen forever
      setTimeout(() => setNotification(null), 5000)
    }
  }

  /**
   * Handles user logout
   * Removes user data from localStorage and clears state
   */
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser') // Clear stored user
    setUser(null) // Reset user state to null (logged out)
  }

  /**
   * Creates a new blog post
   * @param {Object} blogObject - Contains title, author, and url
   */
  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()

      // MANUALLY add the current user info to the returned blog
      // This makes the 'isOwner' check in Blog.jsx work immediately!
      const blogWithUser = {
        ...returnedBlog,
        user: {
          username: user.username,
          name: user.name,
          id: user.id || returnedBlog.user, // Ensure we keep the ID link
        },
      }

      setBlogs(blogs.concat(blogWithUser))

      setNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
      )
      setNotificationType('success')
      setTimeout(() => setNotification(null), 5000)
    } catch {
      setNotification('error adding blog')
      setNotificationType('error')
      setTimeout(() => setNotification(null), 5000)
    }
  }

  /**
   * Updates a blog (typically incrementing likes)
   * @param {string} id - The ID of the blog to update
   * @param {Object} blogObject - The updated blog data from the server
   *
   * NOTE: The backend returns a blog with user as an ID string,
   * but we want to preserve the full user object in our frontend state
   */
  const updateBlog = async (id, blogObject) => {
    try {
      // Send update request to backend (PUT request)
      const returnedBlog = await blogService.update(id, blogObject)

      // Find the current version of this blog in our state to get the user info
      // Our local state has the full user object (with name and username)
      // The server returns only the user ID as a string
      const blogToUpdate = blogs.find((b) => b.id === id)

      // Merge: Use everything from the server (the new likes count),
      // BUT keep the user object from our local state
      // This preserves the user's name and username for display
      const updatedBlogWithUser = {
        ...returnedBlog, // Spread all server data (including updated likes)
        user: blogToUpdate.user, // Keep the full user object from local state
      }

      // Update the state array by replacing the old blog with our merged object
      // map() creates a new array - if blog.id matches, use updated version
      setBlogs(
        blogs.map((blog) => (blog.id !== id ? blog : updatedBlogWithUser)),
      )
    } catch {
      // Show error notification for 5 seconds
      setNotification('Error updating likes')
      setNotificationType('error')
      setTimeout(() => setNotification(null), 5000)
    }
  }

  /**
   * Deletes a blog post
   * @param {string} id - The ID of the blog to delete
   *
   * Only the blog's owner can delete it (backend enforces this)
   */
  const deleteBlog = async (id) => {
    // Find the blog to remove before deleting (for the confirmation message)
    const blogToRemove = blogs.find((b) => b.id === id)

    // Show browser confirmation dialog before deleting
    if (
      window.confirm(
        `Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`,
      )
    ) {
      try {
        // Send DELETE request to backend
        await blogService.remove(id)

        // Filter out the deleted blog from the state
        // filter() keeps all blogs that DON'T match the deleted ID
        setBlogs(blogs.filter((blog) => blog.id !== id))

        // Show success notification for 5 seconds
        setNotification(`Deleted ${blogToRemove.title}`)
        setNotificationType('success')
        setTimeout(() => setNotification(null), 5000)
      } catch {
        // Show error notification (usually because user isn't the owner)
        setNotification('Error deleting blog - are you the owner?')
        setNotificationType('error')
        setTimeout(() => setNotification(null), 5000)
      }
    }
  }

  // ========== CONDITIONAL RENDERING ==========

  // If no user is logged in, show the login form
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {/* Display any notification messages (errors, etc.) */}
        <BlogNotification message={notification} type={notificationType} />
        {/* Login form wrapped in Togglable (collapsible) */}
        <Togglable buttonLabel="login">
          <form onSubmit={handleLogin}>
            <div>
              username{" "}
              <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
                placeholder="username" // <--- Add this
              />
            </div>
            <div>
              password{" "}
              <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
                placeholder="password" // <--- Add this
              />
            </div>
            <button type="submit">login</button>
          </form>
        </Togglable>{" "}
      </div>
    );
  }

  // If user IS logged in, show the main blog list view
  return (
    <div>
      <h2>blogs</h2>

      {/* Notification component for success/error messages */}
      <BlogNotification message={notification} type={notificationType} />

      {/* User info bar with logout button */}
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      {/* Togglable form for creating new blogs - ref allows external control */}
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {/* Blog list - sorted by likes (highest first) */}
      <div style={{ marginTop: '10px' }}>
        {/* Create a copy of blogs array with [...blogs], then sort descending by likes */}
        {[...blogs]
          .sort((a, b) => b.likes - a.likes) // b.likes - a.likes = descending order
          .map((blog) => (
            <Blog
              key={blog.id} // Unique key for React reconciliation
              blog={blog} // The blog data to display
              updateBlog={updateBlog} // Function to handle liking a blog
              deleteBlog={deleteBlog} // Function to handle deleting a blog
              currentUser={user} // Pass logged-in user for ownership checks
            />
          ))}
      </div>
    </div>
  )
}

export default App
