import { useParams } from "react-router-dom";
import { Typography, Button, Paper, Link, Box, Divider } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DeleteIcon from "@mui/icons-material/Delete";

const BlogDetail = ({ blogs, handleLike, deleteBlog, currentUser }) => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return <Typography sx={{ p: 2 }}>Loading blog details...</Typography>;
  }

  const isOwner =
    currentUser &&
    blog.user &&
    (blog.user.username === currentUser.username ||
      blog.user === currentUser.id);

  const increaseLikes = () => {
    const updatedBlog = {
      ...blog,
      likes: (blog.likes || 0) + 1,
      user: blog.user.id || blog.user,
    };
    handleLike(blog.id, updatedBlog);
  };

  return (
    <Box sx={{ maxWidth: 800, mt: 4 }}>
      <Paper
        elevation={1}
        sx={{ p: 4, borderRadius: 1, border: "1px solid #eee" }}
      >
        {/* Title and Author */}
        <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
          {blog.title}
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
          by {blog.author}
        </Typography>

        {/* URL Link */}
        <Link
          href={blog.url}
          target="_blank"
          rel="noreferrer"
          underline="hover"
          sx={{ display: "block", mb: 1 }}
        >
          {blog.url}
        </Link>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Added by {blog.user?.name || "Unknown User"}
        </Typography>

        {/* LIKES AND BUTTONS ROW */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: "medium", mr: 1 }}>
            {blog.likes} likes
          </Typography>

          {currentUser && (
            <Button
              variant="outlined"
              size="small"
              onClick={increaseLikes}
              sx={{ fontWeight: "bold" }}
            >
              LIKE
            </Button>
          )}

          {isOwner && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => deleteBlog(blog.id)}
              sx={{ fontWeight: "bold" }}
            >
              REMOVE
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default BlogDetail;
