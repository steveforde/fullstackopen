import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });

    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  return (
    <Box sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        create new
      </Typography>
      <form onSubmit={addBlog}>
        <TextField
          label="Title"
          id="title"
          /* CRITICAL: Playwright looks for this exact placeholder */
          placeholder="title"
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Author"
          id="author"
          /* CRITICAL: Playwright looks for this exact placeholder */
          placeholder="author"
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="URL"
          id="url"
          /* CRITICAL: Playwright looks for this exact placeholder */
          placeholder="url"
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
          fullWidth
          margin="dense"
        />
        <Button
          id="create-button"
          variant="contained"
          color="primary"
          type="submit"
          /* CRITICAL: Must be lowercase and no-transform for the test */
          sx={{ mt: 1, textTransform: "none" }}
        >
          create
        </Button>
      </form>
    </Box>
  );
};

export default BlogForm;
