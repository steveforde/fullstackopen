import { useParams } from "react-router-dom";
import { Typography, Button, Paper, Link, Box } from "@mui/material";

/**
 * BlogDetail Component
 * Displays a single blog's full details on its own page.
 * Shows title, author, URL, who added it, likes count, and like/remove buttons.
 *
 * @param {Array} blogs - All blogs from App.jsx (filters to find the correct one)
 * @param {Function} handleLike - Function to increment blog likes (passed from App.jsx)
 * @param {Function} deleteBlog - Function to delete a blog (passed from App.jsx)
 * @param {Object} currentUser - The currently logged-in user (determines button visibility)
 */
const BlogDetail = ({ blogs, handleLike, deleteBlog, currentUser }) => {
  // Extract the dynamic `id` from the URL (e.g., /blogs/123 → id = "123")
  const { id } = useParams();

  // Find the blog object that matches the ID from the URL
  const blog = blogs.find((b) => b.id === id);

  // Guard clause: if blog not found (still loading or invalid ID), show loading message
  if (!blog) {
    return <Typography sx={{ p: 2 }}>Loading blog details...</Typography>;
  }

  /**
   * Determine if the currently logged-in user is the owner/creator of this blog.
   * The delete button is only shown to the owner.
   *
   * Handles two possible data structures from backend:
   *   1. blog.user is an object with username property
   *   2. blog.user is just an ID string
   */
  const isOwner =
    currentUser &&
    blog.user &&
    (blog.user.username === currentUser.username ||
      blog.user === currentUser.id);

  /**
   * Increases the like count for this blog by 1.
   * Creates an updated blog object and calls handleLike from App.jsx.
   */
  const increaseLikes = () => {
    const updatedBlog = {
      ...blog, // Keep all existing blog properties
      likes: (blog.likes || 0) + 1, // Increment likes (default to 0 if undefined)
      user: blog.user.id || blog.user, // Keep user as ID (backend expects ID string)
    };
    handleLike(blog.id, updatedBlog);
  };

  return (
    <Box sx={{ maxWidth: 800, mt: 4 }}>
      {/* Paper component creates a card-like container with elevation (shadow) */}
      <Paper
        elevation={1}
        sx={{ p: 4, borderRadius: 1, border: "1px solid #eee" }}
      >
        {/* Blog Title */}
        <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
          {blog.title}
        </Typography>

        {/* Blog Author */}
        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
          by {blog.author}
        </Typography>

        {/* Blog URL - opens in new tab when clicked */}
        <Link
          href={blog.url}
          target="_blank" // Opens in new tab
          rel="noreferrer" // Security: prevents the new page from accessing this page
          underline="hover" // Underline appears only on hover
          sx={{ display: "block", mb: 1 }}
        >
          {blog.url}
        </Link>

        {/* Who added this blog */}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Added by {blog.user?.name || "Unknown User"}
        </Typography>

        {/* LIKES AND BUTTONS ROW */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Like count display */}
          <Typography variant="body1" sx={{ fontWeight: "medium", mr: 1 }}>
            {blog.likes} likes
          </Typography>

          {/* Like button - shown to ALL logged-in users */}
          {currentUser && (
            <Button
              variant="outlined"
              size="small"
              onClick={increaseLikes}
              sx={{ fontWeight: "bold", textTransform: "none" }} // Keep "like" lowercase
            >
              like
            </Button>
          )}

          {/* Remove button - ONLY shown to the blog's creator */}
          {isOwner && (
            <Button
              variant="outlined"
              color="error" // Red color for delete action
              size="small"
              onClick={() => deleteBlog(blog.id)}
              sx={{ fontWeight: "bold", textTransform: "none" }} // Keep "remove" lowercase
            >
              remove
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default BlogDetail;
