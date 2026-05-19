import React from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'
import { useField } from '../hooks' // Exercise 7.15: Import custom hook

/**
 * BlogForm Component
 * A form for creating new blog posts using custom hooks.
 * Contains three fields: title, author, and URL.
 * Submits the data to the parent component (BlogList → App.jsx).
 *
 * @param {Function} createBlog - Function from App.jsx to add a new blog
 */
const BlogForm = ({ createBlog }) => {
  // Exercise 7.15: Replaced local states with custom hooks
  const titleField = useField('text')
  const authorField = useField('text')
  const urlField = useField('text')

  /**
   * Handles form submission.
   * Prevents default browser reload, calls createBlog with the form data,
   * then clears all input fields using the hook reset functions.
   *
   * @param {Event} event - The form submit event
   */
  const addBlog = (event) => {
    event.preventDefault() // Stop page from refreshing

    // Exercise 7.15: Extract input values using .value
    createBlog({
      title: titleField.value,
      author: authorField.value,
      url: urlField.value
    })

    // Exercise 7.15: Reset form fields back to empty strings
    titleField.reset()
    authorField.reset()
    urlField.reset()
  }

  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        create new
      </Typography>

      <form onSubmit={addBlog}>
        {/* Title Input Field */}
        <TextField
          label="Title"
          id="title"
          placeholder="title"
          type={titleField.type}
          value={titleField.value}
          onChange={titleField.onChange}
          fullWidth
          margin="dense"
        />

        {/* Author Input Field */}
        <TextField
          label="Author"
          id="author"
          placeholder="author"
          type={authorField.type}
          value={authorField.value}
          onChange={authorField.onChange}
          fullWidth
          margin="dense"
        />

        {/* URL Input Field */}
        <TextField
          label="URL"
          id="url"
          placeholder="url"
          type={urlField.type}
          value={urlField.value}
          onChange={urlField.onChange}
          fullWidth
          margin="dense"
        />

        {/* Submit Button */}
        <Button
          id="create-button"
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 1, textTransform: 'none' }}
        >
          create
        </Button>
      </form>
    </Box>
  )
}

export default BlogForm
