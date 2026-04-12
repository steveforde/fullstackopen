import { useParams } from "react-router-dom";

const BlogDetail = ({ blogs, handleLike, deleteBlog, currentUser }) => {
  const { id } = useParams();

  // Find the blog from the props passed from App.jsx
  const blog = blogs.find((b) => b.id === id);

  // 1. Safety check: If blogs haven't loaded yet or ID is wrong, don't crash
  if (!blog) {
    return <p>Loading blog details...</p>;
  }

  // 2. Permission Check: Is the logged-in user the creator of this blog? (Task 5.27)
  // We check both object-style user and ID-style user to be safe
  const isOwner =
    currentUser &&
    blog.user &&
    (blog.user.username === currentUser.username ||
      blog.user === currentUser.id);

  const increaseLikes = () => {
    const updatedBlog = {
      ...blog,
      likes: (blog.likes || 0) + 1,
    };
    handleLike(blog.id, updatedBlog);
  };

  const removeBlog = () => {
    deleteBlog(blog.id);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>
        {blog.title} by {blog.author}
      </h2>

      <div style={{ marginBottom: "10px" }}>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>

      <div
        style={{
          background: "#f9f9f9",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
      >
        <span>{blog.likes} likes</span>
        {/* Task 5.25: Only logged-in users can like */}
        {currentUser && (
          <button onClick={increaseLikes} style={{ marginLeft: "10px" }}>
            like
          </button>
        )}
      </div>

      <p style={{ color: "#666" }}>
        added by <strong>{blog.user?.name || "Unknown User"}</strong>
      </p>

      {/* Task 5.27: The blog's creator is also shown the delete button */}
      {isOwner && (
        <button
          onClick={removeBlog}
          style={{
            marginTop: "10px",
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          remove
        </button>
      )}
    </div>
  );
};

export default BlogDetail;
