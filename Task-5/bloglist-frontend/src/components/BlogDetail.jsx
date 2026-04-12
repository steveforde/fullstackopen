import { useParams } from "react-router-dom";

const BlogDetail = ({ blogs, handleLike }) => {
  const { id } = useParams();
  // Find the blog from the props passed from App.jsx
  const blog = blogs.find((b) => b.id === id);

  // 1. Safety check: If blogs haven't loaded yet, don't crash
  if (!blog) {
    return <p>Loading blog details...</p>;
  }

  const increaseLikes = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    handleLike(blog.id, updatedBlog);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>{blog.title}</h2>
      <div style={{ marginBottom: "10px" }}>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>

      <div
        style={{ background: "#f9f9f9", padding: "10px", borderRadius: "5px" }}
      >
        <span>{blog.likes} likes</span>
        <button onClick={increaseLikes} style={{ marginLeft: "10px" }}>
          like
        </button>
      </div>

      <p style={{ marginTop: "20px", color: "#666" }}>
        added by <strong>{blog.user?.name || "Unknown User"}</strong>
      </p>
    </div>
  );
};

export default BlogDetail;
