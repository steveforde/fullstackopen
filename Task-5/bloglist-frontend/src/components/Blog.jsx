import { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [visible, setVisible] = useState(false);

  // Checks ownership by comparing username or ID string
  const isOwner =
    currentUser &&
    blog.user &&
    (blog.user.username === currentUser.username ||
      blog.user.id === currentUser.id ||
      blog.user === currentUser.id);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const increaseLikes = (event) => {
    event.preventDefault();
    const updatedBlog = {
      ...blog,
      likes: (blog.likes || 0) + 1,
      // CRITICAL: Send only the ID string to the backend, not the whole object
      user: blog.user.id || blog.user,
    };
    handleLike(blog.id, updatedBlog);
  };

  return (
    <Paper sx={{ mb: 1, p: 2, border: "1px solid #ddd" }} className="blog">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body1">
          <Link
            to={`/blogs/${blog.id}`}
            style={{
              textDecoration: "none",
              color: "#1976d2",
              fontWeight: "bold",
            }}
          >
            {blog.title}
          </Link>{" "}
          by {blog.author}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={toggleVisibility}
          className="viewButton"
        >
          {visible ? "hide" : "view"}
        </Button>
      </Box>

      {visible && (
        <Box
          sx={{ mt: 2, pt: 2, borderTop: "1px solid #eee" }}
          className="togglableContent"
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            <a href={blog.url} target="_blank" rel="noreferrer">
              {blog.url}
            </a>
          </Typography>

          {/* LIKES ROW - Matches Michael Chan style */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="body2" className="likesCount">
              {blog.likes} likes
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={increaseLikes}
              className="likeButton"
              sx={{ fontWeight: "bold" }}
            >
              LIKE
            </Button>
          </Box>

          <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1 }}>
            {blog.user?.name || "Unknown User"}
          </Typography>

          {isOwner && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(blog.id)}
              sx={{ mt: 1, fontWeight: "bold" }}
              className="removeButton"
            >
              REMOVE
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default Blog;
