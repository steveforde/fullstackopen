import Blog from "./Blog";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import { Box } from "@mui/material";

/**
 * BlogList Component
 * Displays the list of all blogs on the home page.
 * Includes a togglable form for creating new blogs and a sorted list of existing blogs.
 *
 * @param {Array} blogs - Array of blog objects from App.jsx
 * @param {Function} updateBlog - Function to handle liking a blog (passed to each Blog)
 * @param {Function} deleteBlog - Function to handle deleting a blog (passed to each Blog)
 * @param {Object} user - The currently logged-in user (used to show/hide delete button)
 * @param {Function} addBlog - Function to create a new blog (passed to BlogForm)
 * @param {Object} blogFormRef - Ref to the Togglable component (to close form after submission)
 */
const BlogList = ({
  blogs,
  updateBlog,
  deleteBlog,
  user,
  addBlog,
  blogFormRef,
}) => {
  return (
    <Box>
      {/* 
        Togglable Component:
        - buttonLabel="create new blog": the text on the toggle button
        - ref={blogFormRef}: allows App.jsx to close the form after a blog is created
        - Children (BlogForm): the form that appears when the button is clicked
      */}
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {/* Box container with margin-top for spacing */}
      <Box sx={{ mt: 2 }}>
        {/*
          Steps for displaying blogs:
          1. Create a copy of the blogs array using spread operator [...blogs]
             (prevents mutating the original array when sorting)
          2. Sort by likes in descending order (most likes first)
             b.likes - a.likes → positive means b comes before a
          3. Map each blog to a Blog component
        */}
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id} // Unique key required by React for list rendering
              blog={blog} // The blog data object
              handleLike={updateBlog} // Function to increment likes
              handleDelete={deleteBlog} // Function to delete the blog
              currentUser={user} // Used to conditionally show/hide delete button
            />
          ))}
      </Box>
    </Box>
  );
};

export default BlogList;
