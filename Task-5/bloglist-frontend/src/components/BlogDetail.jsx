import { useParams } from "react-router-dom";
import {
  Typography,
  Button,
  Paper,
  Link,
  Box,
  Divider,
  Chip,
} from "@mui/material";
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
      user: blog.user.id || blog.user, // Maintain user reference consistency
    };
    handleLike(blog.id, updatedBlog);
  };

  return (
    <Box sx={{ maxWidth: 800, mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Title and Author */}
        <Typography variant="h4" component="h2" gutterBottom color="primary">
          {blog.title}
        </Typography>
        <Typography
          variant="h6"
          color="textSecondary"
          gutterBottom
          sx={{ mb: 2 }}
        >
          by {blog.author}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* URL Link */}
        <Typography variant="body1" sx={{ mb: 2 }}>
          Visit:{" "}
          <Link
            href={blog.url}
            target="_blank"
            rel="noreferrer"
            underline="hover"
          >
            {blog.url}
          </Link>
        </Typography>

        {/* Likes Section */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
          <Chip
            label={`${blog.likes} likes`}
            color="primary"
            variant="outlined"
            sx={{ fontSize: "1rem", p: 1 }}
          />
          {currentUser && (
            <Button
              startIcon={<ThumbUpIcon />}
              variant="contained"
              size="small"
              onClick={increaseLikes}
            >
              like
            </Button>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary">
          Added by <strong>{blog.user?.name || "Unknown User"}</strong>
        </Typography>

        {/* Action Buttons */}
        {isOwner && (
          <Box sx={{ mt: 3 }}>
            <Button
              startIcon={<DeleteIcon />}
              variant="outlined"
              color="error"
              onClick={() => deleteBlog(blog.id)}
            >
              remove
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default BlogDetail;
