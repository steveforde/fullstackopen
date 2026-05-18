import React from 'react'
import { useState } from 'react' // Imported for the temporary error test
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { Box, Button } from '@mui/material' // Added Button from Material-UI

/**
 * BlogList Component
 * Displays the list of all blogs on the home page.
 * Includes a togglable form for creating new blogs and a sorted list of existing blogs.
 */
const BlogList = ({
  blogs,
  updateBlog,
  deleteBlog,
  user,
  addBlog,
  blogFormRef
}) => {
  return (
    <Box>
      {/* Togglable Component:
        - buttonLabel="create new blog": the text on the toggle button
        - ref={blogFormRef}: allows App.jsx to close the form after a blog is created
        - Children (BlogForm): the form that appears when the button is clicked
      */}
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {/* Box container with margin-top for spacing */}
      <Box sx={{ mt: 2 }}>
        {/* Directly map over blogs since they are already sorted by the Zustand store */}
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={updateBlog}
            handleDelete={deleteBlog}
            currentUser={user}
          />
        ))}
      </Box>
    </Box>
  )
}

export default BlogList
