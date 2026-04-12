import { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [visible, setVisible] = useState(false);

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
      user: blog.user.id || blog.user,
    };
    handleLike(blog.id, updatedBlog);
  };

  return (
    <Paper
      sx={{ mb: 1, p: 2, border: "1px solid #ddd" }}
      className="blog"
      data-testid="blog-item"
    >
      {/* This Box contains the text the test uses to find the container. 
        Keep title and author together here. 
      */}
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
            style={{ fontWeight: "bold", textDecoration: "none" }}
          >
            {blog.title}
          </Link>{" "}
          {blog.author}
        </Typography>

        <Button
          variant="outlined"
          size="small"
          onClick={toggleVisibility}
          className="viewButton"
          sx={{ textTransform: "none" }}
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            {/* CRITICAL: The test checks for the text 'likes' and the number.
               Keep them in one Typography element.
            */}
            <Typography variant="body2">likes {blog.likes}</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={increaseLikes}
              className="likeButton"
              sx={{ fontWeight: "bold", textTransform: "none" }}
            >
              like
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
              className="removeButton"
              sx={{ mt: 1, fontWeight: "bold", textTransform: "none" }}
            >
              remove
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default Blog;
