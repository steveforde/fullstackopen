import React, { useState, useEffect, useRef } from 'react'
// React Router components for navigation and routing
import ErrorBoundary from './components/ErrorBoundary'
import { Routes, Route, useNavigate } from 'react-router-dom'
import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore' // Global Zustand blog tracker
import { useField } from './hooks' // Exercise 7.15: Custom hook import

// Material-UI components for styling
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CssBaseline
} from '@mui/material'

// Service imports – handle API communication with backend
import blogService from './services/blogs'
import loginService from './services/login'
import persistentUser from './services/persistentUser' // Exercise 7.15: Storage service

// Component imports – reusable UI pieces
import BlogNotification from './components/BlogNotification'
import Navigation from './components/Navigation'
import Users from './components/Users'
import UserDetail from './components/UserDetail'
import BlogList from './components/BlogList'
import BlogDetail from './components/BlogDetail'
import BlogForm from './components/BlogForm' // Added for our new blog view link route

/**
 * Main App component – the root of the application.
 */
const App = () => {
  // ========== GLOBAL ZUSTAND STORES ==========
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  )
  const blogs = useBlogStore((state) => state.blogs)
  const initializeBlogs = useBlogStore((state) => state.initializeBlogs)
  const storeAddBlog = useBlogStore((state) => state.addBlog)
  const storeLikeBlog = useBlogStore((state) => state.likeBlog)
  const storeDeleteBlog = useBlogStore((state) => state.deleteBlog)

  // ========== CUSTOM HOOKS FOR FORM FIELDS ==========
  // Exercise 7.15: Replaced standard useState strings with useField hooks
  const usernameField = useField('text')
  const passwordField = useField('password')

  // Local state remaining for user arrays
  const [users, setUsers] = useState([]) // All users from backend
  const [user, setUser] = useState(null) // Currently logged-in user

  const blogFormRef = useRef() // Reference to Togglable component
  const navigate = useNavigate() // Programmatic navigation

  /**
   * Effect 1: Check storage service for existing login on page load/refresh.
   */
  useEffect(() => {
    const loggedUser = persistentUser.getUser()
    if (loggedUser) {
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  /**
   * Effect 2: Fetch all blogs and all users from the backend when app loads.
   */
  useEffect(() => {
    initializeBlogs() // Sync state with backend using Zustand
    blogService.getUsers().then((initialUsers) => setUsers(initialUsers))
  }, [initializeBlogs])

  /**
   * Logout handler: removes user via storage service, clears state, shows notification.
   */
  const handleLogout = () => {
    persistentUser.removeUser()
    setUser(null)
    usernameField.reset() // Reset hook value
    passwordField.reset() // Reset hook value
    showNotification('Logged out successfully')
  }

  /**
   * Login handler: sends credentials to backend, stores token, updates state.
   */
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      // Exercise 7.15: Access values using .value from the custom hooks
      const loggedUser = await loginService.login({
        username: usernameField.value,
        password: passwordField.value
      })
      persistentUser.saveUser(loggedUser)
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      usernameField.reset()
      passwordField.reset()
      showNotification(`Welcome back, ${loggedUser.name}!`)
    } catch (exception) {
      showNotification('Wrong username or password', 'error')
    }
  }

  /**
   * Creates a new blog and adds it to the state.
   */
  const addBlog = async (blogObject) => {
    try {
      await storeAddBlog(blogObject, user)
      // Check toggle visibility dynamically if running inside togglable layout context wrappers
      if (blogFormRef.current) {
        blogFormRef.current.toggleVisibility()
      }
      showNotification(
        `A new blog '${blogObject.title}' by ${blogObject.author} added`
      )
      navigate('/')
    } catch {
      showNotification('Error adding blog', 'error')
    }
  }

  /**
   * Updates a blog's likes.
   */
  const updateBlog = async (id, blogObject) => {
    try {
      await storeLikeBlog(id, blogObject)
    } catch (error) {
      showNotification('Error updating likes', 'error')
    }
  }

  /**
   * Deletes a blog after user confirmation.
   */
  const deleteBlog = async (id) => {
    const blogToRemove = blogs.find((b) => b.id === id)
    if (
      window.confirm(
        `Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`
      )
    ) {
      try {
        await storeDeleteBlog(id)
        showNotification(`Deleted ${blogToRemove.title}`)
        navigate('/')
      } catch (error) {
        showNotification('Error deleting blog - are you the owner?', 'error')
      }
    }
  }

  // ========== RENDERING ==========

  if (user === null) {
    return (
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <CssBaseline />
        <Container maxWidth="sm">
          <Paper
            key={user === null ? 'logout' : 'login'}
            elevation={3}
            sx={{ p: 4, textAlign: 'center' }}
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Blog App
            </Typography>
            <BlogNotification />
            <form onSubmit={handleLogin}>
              {/* Exercise 7.15: Destructuring hook variables directly into the component inputs */}
              <TextField
                label="Username"
                placeholder="username"
                variant="outlined"
                fullWidth
                margin="normal"
                type={usernameField.type}
                value={usernameField.value}
                onChange={usernameField.onChange}
                autoComplete="off"
              />
              <TextField
                label="Password"
                placeholder="password"
                variant="outlined"
                fullWidth
                margin="normal"
                type={passwordField.type}
                value={passwordField.value}
                onChange={passwordField.onChange}
                autoComplete="new-password"
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2, fontWeight: 'bold' }}
              >
                LOGIN
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <CssBaseline />

      <Navigation user={user} handleLogout={handleLogout} />

      <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
        <BlogNotification />

        <ErrorBoundary>
          <Routes>
            <Route
              path="/"
              element={
                <BlogList
                  blogs={blogs}
                  updateBlog={updateBlog}
                  deleteBlog={deleteBlog}
                  user={user}
                  addBlog={addBlog}
                  blogFormRef={blogFormRef}
                />
              }
            />
            <Route path="/users" element={<Users users={users} />} />

            <Route
              path="/users/:id"
              element={<UserDetail users={users} blogs={blogs} />}
            />

            <Route
              path="/blogs/:id"
              element={
                <BlogDetail
                  blogs={blogs}
                  handleLike={updateBlog}
                  deleteBlog={deleteBlog}
                  currentUser={user}
                />
              }
            />

            {/* Added: Route handler mapped to handle navigation creation form actions safely */}
            <Route path="/create" element={<BlogForm createBlog={addBlog} />} />

            <Route
              path="*"
              element={
                <Box sx={{ p: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', mb: 1, color: '#d32f2f' }}
                  >
                    404 – Page not found
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#555' }}>
                    The path you are looking for does not exist.
                  </Typography>
                </Box>
              }
            />
          </Routes>
        </ErrorBoundary>
      </Container>
    </Box>
  )
}

export default App
