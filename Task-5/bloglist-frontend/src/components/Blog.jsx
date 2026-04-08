import { useState } from "react";

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  // State to track whether blog details are visible or hidden
  // false = only title/author visible, true = full details shown
  const [visible, setVisible] = useState(false);

  // Determine if the currently logged-in user is the creator of this blog
  // This controls whether the "remove" button appears
  const isOwner =
    blog.user &&
    ((blog.user.username && blog.user.username === currentUser.username) ||
      (typeof blog.user === "string" && blog.user === currentUser.id) ||
      (blog.user.id && blog.user.id === currentUser.id));

  // Inline CSS styles for the blog container
  const blogStyle = {
    paddingTop: 10, // Space at the top
    paddingLeft: 2, // Space on the left
    border: "solid", // Solid border around the blog
    borderWidth: 1, // 1 pixel thick border
    marginBottom: 5, // Space below each blog
  };

  return (
    <div style={blogStyle} className="blog-item">
      {/* Always visible header section - shows title, author, and toggle button */}
      <div>
        {blog.title} {blog.author}
        {/* Toggle button - click shows/hides blog details */}
        <button onClick={() => setVisible(!visible)}>
          {visible ? "hide" : "view"} {/* Button text changes based on state */}
        </button>
      </div>

      {/* Conditionally rendered blog details - only shown when visible is true */}
      {visible && (
        <div>
          {/* Blog URL/link */}
          <div>{blog.url}</div>

          {/* Like counter and button */}
          <div>
            likes {blog.likes}
            <button
              onClick={() =>
                updateBlog(blog.id, {
                  ...blog, // Spread existing blog properties
                  likes: blog.likes + 1, // Increment likes by 1
                  user: blog.user.id || blog.user, // Handle user object or ID format
                })
              }
            >
              like
            </button>
          </div>

          {/* Display the name of the user who created the blog */}
          <div>{blog.user.name || currentUser.name}</div>

          {/* Remove button - ONLY shown if current user is the blog creator */}
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
