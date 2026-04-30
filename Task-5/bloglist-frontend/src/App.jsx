// React core hooks
import { useState, useEffect, useRef } from "react";
// React Router components for navigation and routing
import { Routes, Route, useNavigate } from "react-router-dom";
// Material-UI components for styling
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CssBaseline,
} from "@mui/material";

// Service imports – handle API communication with backend
import blogService from "./services/blogs";
import loginService from "./services/login";

// Component imports – reusable UI pieces
import BlogNotification from "./components/BlogNotification";
import Navigation from "./components/Navigation";
import Users from "./components/Users";
import UserDetail from "./components/UserDetail";
import BlogList from "./components/BlogList";
import BlogDetail from "./components/BlogDetail";

/**
 * Main App component – the root of the application.
 * Handles:
 * - User authentication (login/logout)
 * - Global state (blogs, users, notifications)
 * - Routing between pages (home, users, user detail, blog detail)
 */
const App = () => {
  // ========== STATE VARIABLES ==========
  const [blogs, setBlogs] = useState([]); // All blogs from backend
  const [users, setUsers] = useState([]); // All users from backend
  const [username, setUsername] = useState(""); // Login form username field
  const [password, setPassword] = useState(""); // Login form password field
  const [user, setUser] = useState(null); // Currently logged-in user (null = not logged in)
  const [notification, setNotification] = useState(null); // Notification message text
  const [notificationType, setNotificationType] = useState("success"); // "success" or "error"

  const blogFormRef = useRef(); // Reference to Togglable component (to close form after submit)
  const navigate = useNavigate(); // Programmatic navigation (redirect after actions)

  /**
   * Effect 1: Check localStorage for existing login on page load/refresh.
   * Runs once when component mounts (empty dependency array).
   * If a logged-in user is found in localStorage, restore their session.
   */
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token); // Set auth token for future API requests
    }
  }, []);

  /**
   * Effect 2: Fetch all blogs and all users from the backend when app loads.
   * Runs once when component mounts.
   */
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
    blogService.getUsers().then((initialUsers) => setUsers(initialUsers));
  }, []);

  /**
   * Logout handler: removes user from localStorage, clears state, shows notification.
   */
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser"); // Clear saved session
    setUser(null); // Set user to null (show login form)
    setUsername(""); // Clear username field
    setPassword(""); // Clear password field
    notify("Logged out successfully");
  };

  /**
   * Login handler: sends credentials to backend, stores token, updates state.
   * Called when the login form is submitted.
   */
  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent page reload
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user)); // Persist login
      blogService.setToken(user.token); // Set token for future API calls
      setUser(user); // Set logged-in user
      setUsername(""); // Clear form fields
      setPassword("");
    } catch (exception) {
      notify("Wrong credentials", "error"); // Show error notification
    }
  };

  /**
   * Shows a temporary notification (auto-dismisses after 5 seconds).
   * @param {string} message - The notification text
   * @param {string} type - "success" (green) or "error" (red)
   */
  const notify = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(null), 5000);
  };

  /**
   * Creates a new blog and adds it to the state.
   * Called from BlogForm component.
   */
  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      blogFormRef.current.toggleVisibility(); // Close the creation form
      // Attach user info to the blog for display purposes
      const blogWithUser = {
        ...returnedBlog,
        user: {
          username: user.username,
          name: user.name,
          id: user.id || returnedBlog.user,
        },
      };
      setBlogs(blogs.concat(blogWithUser)); // Add new blog to list
      notify(`a new blog ${blogObject.title} by ${blogObject.author} added`);
      navigate("/"); // Redirect to home page
    } catch {
      notify("error adding blog", "error");
    }
  };

  /**
   * Updates a blog's likes (or other properties).
   * Called from BlogDetail when user clicks "like".
   * @param {string} id - Blog ID
   * @param {object} blogObject - Updated blog data
   */
  const updateBlog = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject);
      // Preserve the original user object (backend might not return it)
      const blogToUpdate = blogs.find((b) => b.id === id);
      const updatedBlogWithUser = { ...returnedBlog, user: blogToUpdate.user };
      setBlogs(blogs.map((b) => (b.id !== id ? b : updatedBlogWithUser)));
    } catch (error) {
      notify("Error updating likes", "error");
    }
  };

  /**
   * Deletes a blog after user confirmation.
   * @param {string} id - Blog ID to delete
   */
  const deleteBlog = async (id) => {
    const blogToRemove = blogs.find((b) => b.id === id);
    if (
      window.confirm(
        `Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`,
      )
    ) {
      try {
        await blogService.remove(id);
        setBlogs(blogs.filter((b) => b.id !== id)); // Remove from state
        notify(`Deleted ${blogToRemove.title}`);
      } catch (error) {
        notify("Error deleting blog - are you the owner?", "error");
      }
    }
  };

  // ========== RENDERING ==========

  /**
   * RENDER FOR UNAUTHENTICATED USERS (user === null)
   * Shows a centered login form with Material-UI styling.
   */
  if (user === null) {
    return (
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <CssBaseline /> {/* Normalize CSS across browsers */}
        <Container maxWidth="sm">
          {/* Paper component creates a card-like container */}
          {/* Key forces re‑mount on logout to clear autofill */}
          <Paper
            key={user === null ? "logout" : "login"}
            elevation={3}
            sx={{ p: 4, textAlign: "center" }}
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Blog App
            </Typography>
            <BlogNotification message={notification} type={notificationType} />
            <form onSubmit={handleLogin}>
              <TextField
                label="Username"
                placeholder="username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
                autoComplete="off" // Prevent browser autofill
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
                autoComplete="new-password" // Stronger autofill prevention
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 2, fontWeight: "bold" }}
              >
                LOGIN
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
    );
  }

  /**
   * RENDER FOR AUTHENTICATED USERS
   * Shows navigation bar, notification area, and routes to different pages.
   */
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <CssBaseline />
      {/* Navigation bar with user name and logout button */}
      <Navigation user={user} handleLogout={handleLogout} />
      <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
        <BlogNotification message={notification} type={notificationType} />

        {/* React Router: define which component renders for each URL path */}
        <Routes>
          {/* Home page: list of blogs */}
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
          {/* Users directory page */}
          <Route path="/users" element={<Users users={users} />} />
          {/* Individual user detail page (shows their added blogs) */}
          <Route
            path="/users/:id"
            element={<UserDetail users={users} blogs={blogs} />}
          />
          {/* Individual blog detail page (shows full content, like button, remove button) */}
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
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
