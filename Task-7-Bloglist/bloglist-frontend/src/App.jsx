import React, { useState, useEffect, useRef } from 'react'
// React Router components for navigation and routing
import ErrorBoundary from './components/ErrorBoundary'
import { Routes, Route, useNavigate } from 'react-router-dom'
import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore' // Global Zustand blog tracker

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

// Component imports – reusable UI pieces
import BlogNotification from './components/BlogNotification'
import Navigation from './components/Navigation'
import Users from './components/Users'
import UserDetail from './components/UserDetail'
import BlogList from './components/BlogList'
import BlogDetail from './components/BlogDetail'

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

  // ========== LOCAL STATE VARIABLES ==========
  const [users, setUsers] = useState([]) // All users from backend
  const [username, setUsername] = useState('') // Login form username field
  const [password, setPassword] = useState('') // Login form password field
  const [user, setUser] = useState(null) // Currently logged-in user

  const blogFormRef = useRef() // Reference to Togglable component
  const navigate = useNavigate() // Programmatic navigation

  /**
   * Effect 1: Check localStorage for existing login on page load/refresh.
   */
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
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
   * Logout handler: removes user from localStorage, clears state, shows notification.
   */
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUsername('')
    setPassword('')
    showNotification('Logged out successfully')
  }

  /**
   * Login handler: sends credentials to backend, stores token, updates state.
   */
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`Welcome back, ${user.name}!`)
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
      blogFormRef.current.toggleVisibility()
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

  /**
   * RENDER FOR UNAUTHENTICATED USERS (user === null)
   */
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
              <TextField
                label="Username"
                placeholder="username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
                autoComplete="off"
              />
              <TextField
                label="Password"
                type="password"
                placeholder="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
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

  /**
   * RENDER FOR AUTHENTICATED USERS
   */
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

            <Route
              path="*"
              element={
                <Box sx={{ p: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      color: '#d32f2f'
                    }}
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
