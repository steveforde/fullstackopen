import { useState } from "react";
import { Link } from "react-router-dom"; // 1. Add this import

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => setVisible(!visible);

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user,
    };
    updateBlog(blog.id, updatedBlog);
  };

  return (
    <div style={blogStyle} className="blog">
      <div>
        {/* 2. Wrap the title and author in a Link */}
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
        <button onClick={toggleVisibility} style={{ marginLeft: "10px" }}>
          {visible ? "hide" : "view"}
        </button>
      </div>

      {visible && (
        <div className="blog-details">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike} style={{ marginLeft: "5px" }}>
              like
            </button>
          </div>
          <div>{blog.user?.name}</div>
          {/* Keep your existing delete button logic here too if you want it in both places */}
        </div>
      )}
    </div>
  );
};

export default Blog;
