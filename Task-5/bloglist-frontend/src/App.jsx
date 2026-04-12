import { useState, useEffect, useRef } from "react";
import { Routes, Route, useMatch } from "react-router-dom";

// Service imports
import blogService from "./services/blogs";
import loginService from "./services/login";

// Component imports
import BlogNotification from "./components/BlogNotification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import Navigation from "./components/Navigation";
import Users from "./components/Users";
import UserDetail from "./components/UserDetail";
import BlogList from "./components/BlogList";
import BlogDetail from "./components/BlogDetail";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]); // Added for User views
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");

  const blogFormRef = useRef();

  // EFFECT: Persistent Login
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // EFFECT: Initial Data Fetch (Blogs and Users)
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
    blogService.getUsers().then((initialUsers) => setUsers(initialUsers));
  }, []);

  // ========== HANDLERS ==========

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      notify("wrong username or password", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
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
    } catch {
      notify("error adding blog", "error");
    }
  };

  const updateBlog = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject);
      const blogToUpdate = blogs.find((b) => b.id === id);
      const updatedBlogWithUser = { ...returnedBlog, user: blogToUpdate.user };

      setBlogs(blogs.map((b) => (b.id !== id ? b : updatedBlogWithUser)));
    } catch {
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
      } catch {
        notify("Error deleting blog - are you the owner?", "error");
      }
    }
  };

  // ========== RENDERING ==========

  if (user === null) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Log in to application</h2>
        <BlogNotification message={notification} type={notificationType} />
        <Togglable buttonLabel="login">
          <form onSubmit={handleLogin}>
            <div>
              username{" "}
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
                placeholder="username"
              />
            </div>
            <div>
              password{" "}
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder="password"
              />
            </div>
            <button type="submit">login</button>
          </form>
        </Togglable>
      </div>
    );
  }

  return (
    <div>
      <Navigation user={user} handleLogout={handleLogout} />

      <div style={{ padding: "0 20px" }}>
        <h2>blog app</h2>
        <BlogNotification message={notification} type={notificationType} />

        <Routes>
          {/* Default Home View: The list of blogs */}
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

          {/* User Management Views */}
          <Route path="/users" element={<Users users={users} />} />
          <Route
            path="/users/:id"
            element={<UserDetail users={users} blogs={blogs} />}
          />

          {/* Single Blog Detail View */}
          <Route
            path="/blogs/:id"
            element={<BlogDetail blogs={blogs} handleLike={updateBlog} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
