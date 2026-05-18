import { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * Blog Component
 * Represents a single blog item in the list on the home page.
 *
 * Features:
 * - Collapsible view (shows only title + author + "view" button initially)
 * - Expanded view shows URL, likes, like button, and delete button (if owner)
 * - Clicking the blog title navigates to the detailed blog page
 *
 * @param {Object} blog - The blog data object (title, author, url, likes, user)
 * @param {Function} handleLike - Function to increment blog likes
 * @param {Function} handleDelete - Function to delete the blog
 * @param {Object} currentUser - The currently logged-in user (determines ownership)
 */
const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  // State: true = expanded view showing full details, false = collapsed view
  const [visible, setVisible] = useState(false);

  /**
   * Determine if the current user is the creator of this blog.
   * The delete button is only shown to the blog's owner.
   *
   * Handles three possible data structures from the backend:
   *   1. blog.user.username === currentUser.username (user object populated)
   *   2. blog.user.id === currentUser.id (user object with id)
   *   3. blog.user === currentUser.id (user is just an ID string)
   */
  const isOwner =
    currentUser &&
    blog.user &&
    (blog.user.username === currentUser.username ||
      blog.user.id === currentUser.id ||
      blog.user === currentUser.id);

  /**
   * Toggles the expanded/collapsed state of the blog.
   * Called when "view" or "hide" button is clicked.
   */
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  /**
   * Increases the like count for this blog by 1.
   * Prevents event bubbling, creates an updated blog object,
   * and calls handleLike from the parent (BlogList → App.jsx).
   *
   * @param {Event} event - The click event
   */
  const increaseLikes = (event) => {
    event.preventDefault(); // Prevent any unwanted default behavior
    const updatedBlog = {
      ...blog, // Keep all existing blog properties
      likes: (blog.likes || 0) + 1, // Increment likes (default to 0 if undefined)
      user: blog.user.id || blog.user, // Keep user as ID (backend expects ID string)
    };
    handleLike(blog.id, updatedBlog);
  };

  return (
    // Paper component creates a card-like container with a subtle border
    <Paper
      sx={{ mb: 1, p: 2, border: "1px solid #ddd" }}
      className="blog"
      data-testid="blog-item" // Used by Playwright tests to locate blog containers
    >
      {/* 
        COLLAPSED VIEW (always visible)
        Shows blog title (as a clickable link), author, and view/hide button
      */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body1">
          {/* Blog title links to the detailed blog page */}
          <Link
            to={`/blogs/${blog.id}`}
            style={{ fontWeight: "bold", textDecoration: "none" }}
          >
            {blog.title}
          </Link>{" "}
          {blog.author}
        </Typography>

        {/* Button to toggle expanded/collapsed view */}
        <Button
          variant="outlined"
          size="small"
          onClick={toggleVisibility}
          className="viewButton"
          sx={{ textTransform: "none" }} // Keeps "view"/"hide" lowercase
        >
          {visible ? "hide" : "view"}
        </Button>
      </Box>

      {/* 
        EXPANDED VIEW (only shown when visible === true)
        Shows blog URL, likes count, like button, author name, and delete button (if owner)
      */}
      {visible && (
        <Box
          sx={{ mt: 2, pt: 2, borderTop: "1px solid #eee" }}
          className="togglableContent"
        >
          {/* Blog URL - opens in new tab */}
          <Typography variant="body2" sx={{ mb: 1 }}>
            <a href={blog.url} target="_blank" rel="noreferrer">
              {blog.url}
            </a>
          </Typography>

          {/* Likes row - shows count and like button */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            {/* CRITICAL: Playwright looks for text containing 'likes' */}
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

          {/* Who added this blog */}
          <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1 }}>
            {blog.user?.name || "Unknown User"}
          </Typography>

          {/* Delete button - ONLY shown to the blog's creator */}
          {isOwner && (
            <Button
              variant="outlined"
              color="error" // Red color for delete action
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
