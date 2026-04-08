import { useState } from "react";

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [visible, setVisible] = useState(false);

  const isOwner =
    blog.user &&
    ((blog.user.username && blog.user.username === currentUser.username) ||
      (typeof blog.user === "string" && blog.user === currentUser.id) ||
      (blog.user.id && blog.user.id === currentUser.id));

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog-item">
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? "hide" : "view"}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button
              onClick={() =>
                updateBlog(blog.id, {
                  ...blog,
                  likes: blog.likes + 1,
                  user: blog.user.id || blog.user,
                })
              }
            >
              like
            </button>
          </div>
          <div>{blog.user.name || currentUser.name}</div>

          {isOwner && (
            <button
              style={{ backgroundColor: "lightblue", marginTop: "5px" }}
              onClick={() => deleteBlog(blog.id)}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
