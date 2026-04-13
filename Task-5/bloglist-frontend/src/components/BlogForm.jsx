import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

/**
 * BlogForm Component
 * A form for creating new blog posts.
 * Contains three fields: title, author, and URL.
 * Submits the data to the parent component (BlogList → App.jsx).
 *
 * @param {Function} createBlog - Function from App.jsx to add a new blog
 */
const BlogForm = ({ createBlog }) => {
  // State variables for each form field
  const [newTitle, setNewTitle] = useState(""); // Blog title input
  const [newAuthor, setNewAuthor] = useState(""); // Blog author input
  const [newUrl, setNewUrl] = useState(""); // Blog URL input

  /**
   * Handles form submission.
   * Prevents default browser reload, calls createBlog with the form data,
   * then clears all input fields.
   *
   * @param {Event} event - The form submit event
   */
  const addBlog = (event) => {
    event.preventDefault(); // Stop page from refreshing
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });

    // Clear form fields after successful creation
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  return (
    // Box container with margin-bottom, padding, border, and rounded corners
    <Box sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        create new
      </Typography>

      <form onSubmit={addBlog}>
        {/* Title Input Field */}
        <TextField
          label="Title" // Floating label text
          id="title" // HTML id attribute (used by Playwright tests)
          placeholder="title" // Placeholder text (CRITICAL for Playwright tests)
          value={newTitle} // Controlled component value
          onChange={({ target }) => setNewTitle(target.value)} // Update state on change
          fullWidth // Takes full width of container
          margin="dense" // Smaller margin (compact layout)
        />

        {/* Author Input Field */}
        <TextField
          label="Author"
          id="author"
          placeholder="author" // CRITICAL: Playwright uses this selector
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
          fullWidth
          margin="dense"
        />

        {/* URL Input Field */}
        <TextField
          label="URL"
          id="url"
          placeholder="url" // CRITICAL: Playwright uses this selector
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
          fullWidth
          margin="dense"
        />

        {/* Submit Button */}
        <Button
          id="create-button" // HTML id for Playwright tests
          variant="contained" // Solid button style
          color="primary" // Blue color (theme primary)
          type="submit" // Triggers form submission
          sx={{ mt: 1, textTransform: "none" }} // margin-top, prevent uppercase
        >
          create // Button text (lowercase as expected by tests)
        </Button>
      </form>
    </Box>
  );
};

export default BlogForm;
