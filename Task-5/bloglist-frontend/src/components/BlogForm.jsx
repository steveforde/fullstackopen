import { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleCreate = (event) => {
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

  // Inside BlogForm.jsx
return (
  <Paper elevation={3} sx={{ p: 4, mb: 3, width: '100%' }}> {/* Changed to width: 100% */}
    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
      Create New
    </Typography>
    <form onSubmit={handleCreate}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}> {/* Increased gap */}
        <TextField
          label="Title"
          variant="outlined"
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
          fullWidth
        />
        <TextField
          label="Author"
          variant="outlined"
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
          fullWidth
        />
        <TextField
          label="URL"
          variant="outlined"
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
          fullWidth
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          size="large" // Made button bigger
          sx={{ fontWeight: 'bold', py: 1.5 }}
        >
          CREATE
        </Button>
      </Box>
    </form>
  </Paper>
)
};

export default BlogForm;
