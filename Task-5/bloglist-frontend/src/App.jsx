import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CssBaseline,
} from "@mui/material";

// Service imports
import blogService from "./services/blogs";
import loginService from "./services/login";

// Component imports
import BlogNotification from "./components/BlogNotification";
import Navigation from "./components/Navigation";
import Users from "./components/Users";
import UserDetail from "./components/UserDetail";
import BlogList from "./components/BlogList";
import BlogDetail from "./components/BlogDetail";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");

  const blogFormRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
    blogService.getUsers().then((initialUsers) => setUsers(initialUsers));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      navigate("/");
    } catch {
      notify("wrong username or password", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    navigate("/");
  };

  const notify = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(null), 5000);
  };

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      blogFormRef.current.toggleVisibility();
      const blogWithUser = {
        ...returnedBlog,
        user: {
          username: user.username,
          name: user.name,
          id: user.id || returnedBlog.user,
        },
      };
      setBlogs(blogs.concat(blogWithUser));
      notify(`a new blog ${blogObject.title} by ${blogObject.author} added`);
      navigate("/");
    } catch {
      notify("error adding blog", "error");
    }
  };

  // Inside App.jsx
  const updateBlog = async (id, blogObject) => {
    try {
      // Send only what the backend needs
      const returnedBlog = await blogService.update(id, blogObject);

      // Find the original blog to keep the user object (name, username) in our state
      const blogToUpdate = blogs.find((b) => b.id === id);
      const updatedBlogWithUser = { ...returnedBlog, user: blogToUpdate.user };

      setBlogs(blogs.map((b) => (b.id !== id ? b : updatedBlogWithUser)));
    } catch (error) {
      notify("Error updating likes", "error");
    }
  };

  const deleteBlog = async (id) => {
    const blogToRemove = blogs.find((b) => b.id === id);
    if (
      window.confirm(
        `Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`,
      )
    ) {
      try {
        await blogService.remove(id);
        setBlogs(blogs.filter((b) => b.id !== id));
        notify(`Deleted ${blogToRemove.title}`);
      } catch (error) {
        notify("Error deleting blog - are you the owner?", "error");
      }
    }
  };

  // Rendering for unauthenticated users
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
        <CssBaseline />
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Blog App
            </Typography>
            <BlogNotification message={notification} type={notificationType} />
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
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

  // Main App Rendering (Authenticated)
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <CssBaseline />
      <Navigation user={user} handleLogout={handleLogout} />
      <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
        <BlogNotification message={notification} type={notificationType} />

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
        </Routes>
      </Container>
    </Box>
  );
};;

export default App;
