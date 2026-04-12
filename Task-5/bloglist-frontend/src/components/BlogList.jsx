import Blog from "./Blog";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import { Box } from "@mui/material";

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
      <Togglable buttonLabel="CREATE NEW BLOG" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <Box sx={{ mt: 2 }}>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={updateBlog} // Passed as handleLike
              handleDelete={deleteBlog} // Passed as handleDelete
              currentUser={user}
            />
          ))}
      </Box>
    </Box>
  );
};

export default BlogList;
