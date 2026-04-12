import Blog from "./Blog";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";

const BlogList = ({
  blogs,
  updateBlog,
  deleteBlog,
  user,
  addBlog,
  blogFormRef,
}) => {
  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <div style={{ marginTop: "10px" }} className="blog-list">
        {[...blogs]
          // Force numerical sort so Sharon (8 likes) is at the top
          .sort((a, b) => Number(b.likes) - Number(a.likes))
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              currentUser={user}
            />
          ))}
      </div>
    </div>
  );
};

export default BlogList;
