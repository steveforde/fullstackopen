import { useParams } from 'react-router-dom'
import React from 'react'
import {
  Typography,
  Button,
  Paper,
  Link,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent
} from '@mui/material'
import { useField } from '../hooks'
import useBlogStore from '../stores/blogStore'

/**
 * BlogDetail Component
 * Exercise 7.20: Enhanced layout adding custom bullet points to the modern
 * Material-UI comments list without throwing console attribute warnings.
 */
const BlogDetail = ({ blogs, handleLike, deleteBlog, currentUser }) => {
  const { id } = useParams()
  const commentField = useField('text')

  // Extract our dedicated backend POST comment action from our Zustand store
  const addCommentToBlog = useBlogStore((state) => state.addCommentToBlog)

  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Loading blog details...
        </Typography>
      </Box>
    )
  }

  const isOwner =
    currentUser &&
    blog.user &&
    (blog.user.username === currentUser.username ||
      blog.user === currentUser.id)

  const increaseLikes = () => {
    const updatedBlog = {
      ...blog,
      likes: (blog.likes || 0) + 1,
      user: blog.user.id || blog.user
    }
    handleLike(blog.id, updatedBlog)
  }

  const addComment = async (event) => {
    event.preventDefault()
    const content = commentField.value.trim()

    if (!content) return

    try {
      await addCommentToBlog(blog.id, content)
      commentField.reset()
    } catch (error) {
      console.error('Failed to post comment to server', error)
    }
  }

  const comments = blog.comments || []

  return (
    <Box sx={{ maxWidth: 800, mt: 2, px: 1 }}>
      {/* Primary Blog Content Card */}
      <Card
        variant="outlined"
        sx={{ mb: 4, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: '800',
              mb: 1,
              color: '#1a1a1a',
              fontSize: '2.2rem'
            }}
          >
            {blog.title}
          </Typography>

          {/* Core Author Details */}
          <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 1 }}>
            by <strong>{blog.author}</strong>
          </Typography>

          <Link
            href={blog.url}
            target="_blank"
            rel="noreferrer"
            underline="hover"
            sx={{
              display: 'inline-block',
              mb: 1,
              fontWeight: '500',
              wordBreak: 'break-all',
              color: '#1976d2'
            }}
          >
            {blog.url}
          </Link>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Added by {blog.user?.name || 'Unknown User'}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Action Row Bar - Side-by-side Layout */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: '700', fontSize: '1.1rem' }}
            >
              {blog.likes} likes
            </Typography>

            {currentUser && (
              <Button
                variant="outlined"
                size="small"
                onClick={increaseLikes}
                sx={{
                  fontWeight: 'normal',
                  textTransform: 'none',
                  px: 2,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  '&:hover': {
                    borderColor: '#115293',
                    backgroundColor: '#f5f9ff'
                  }
                }}
              >
                like
              </Button>
            )}

            {isOwner && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => deleteBlog(blog.id)}
                sx={{
                  fontWeight: 'normal',
                  textTransform: 'none',
                  px: 2,
                  borderColor: '#d32f2f',
                  color: '#d32f2f',
                  '&:hover': {
                    borderColor: '#c62828',
                    backgroundColor: '#fffbfe'
                  }
                }}
              >
                remove
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* --- COMMENTS LAYER --- */}
      <Typography variant="h5" component="h3" sx={{ fontWeight: '700', mb: 2 }}>
        comments
      </Typography>

      {/* Text Box Submission Area */}
      <Box
        component="form"
        onSubmit={addComment}
        sx={{ display: 'flex', gap: 1.5, mb: 4, alignItems: 'center' }}
      >
        <TextField
          size="small"
          label="add a comment..."
          placeholder="write a comment..."
          type={commentField.type}
          value={commentField.value}
          onChange={commentField.onChange}
          sx={{ flexGrow: 1, maxWidth: '400px' }}
        />
        <Button
          variant="contained"
          type="submit"
          size="medium"
          disableElevation
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            height: '40px',
            px: 3
          }}
        >
          add comment
        </Button>
      </Box>

      {/* Material UI List Box Container */}
      {comments.length === 0 ? (
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ fontStyle: 'italic', pl: 1 }}
        >
          No comments on this blog yet.
        </Typography>
      ) : (
        <Paper
          variant="outlined"
          sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}
        >
          <List disablePadding>
            {comments.map((comment, index) => {
              const displayText =
                typeof comment === 'object' ? comment.content : comment
              return (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      py: 1.5,
                      px: 3,
                      backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {/* Visual Bullet CSS Injection */}
                    <Box
                      sx={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#666',
                        mr: 2,
                        flexShrink: 0
                      }}
                    />
                    <ListItemText
                      primary={displayText}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: '0.98rem',
                            color: '#333',
                            lineHeight: '1.5'
                          }
                        }
                      }}
                    />
                  </ListItem>
                  {index < comments.length - 1 && <Divider />}
                </React.Fragment>
              )
            })}
          </List>
        </Paper>
      )}
    </Box>
  )
}

export default BlogDetail
