import React from 'react'
import { useParams } from 'react-router-dom'
// Exercise 7.17: Import Material-UI elements for clean list styling
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material'

/**
 * UserDetail Component
 * Displays a single user's profile page showing their name and all blogs they've created.
 * * Exercise 7.17: Implements polished Material-UI display layout for personal blog metrics.
 */
const UserDetail = ({ users, blogs = [] }) => {
  const { id } = useParams()

  // Find the user object that matches the ID from the URL
  const user = users?.find((u) => u.id === id)

  // If user not found yet (loading or invalid ID), show clean fallback text
  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="textSecondary">
          Loading user data...
        </Typography>
      </Box>
    )
  }

  // Filter blogs belonging to this specific user
  const userBlogs = (blogs || []).filter(
    (b) => b.user?.id === id || b.user === id
  )

  return (
    <Box sx={{ padding: '20px' }}>
      {/* User Header Profile */}
      <Typography
        variant="h4"
        component="h2"
        sx={{ fontWeight: 'bold', mb: 1 }}
      >
        {user.name}
      </Typography>

      <Typography
        variant="h6"
        color="textSecondary"
        sx={{ mb: 2, fontStyle: 'italic' }}
      >
        added blogs
      </Typography>

      {/* CORRECTED CONTAINER: 
        Swapped out TableContainer for a pure Paper component to eliminate 
        MUI DOM property propagation warnings in the console.
      */}
      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        {userBlogs.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography variant="body1" color="textSecondary">
              This user hasn't added any blogs yet.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {[...userBlogs]
              .sort((a, b) => Number(b.likes) - Number(a.likes))
              .map((blog, index) => (
                <React.Fragment key={blog.id}>
                  <ListItem sx={{ py: 1.5, px: 3 }}>
                    <ListItemText
                      primary={blog.title}
                      secondary={`${blog.likes} likes`}
                      slotProps={{
                        primary: {
                          // MUI expects typography configurations inside the sx object or as direct system props
                          sx: {
                            fontWeight: '500',
                            fontSize: '1.05rem'
                          }
                        },
                        secondary: {
                          variant: 'body2',
                          color: 'textSecondary',
                          sx: { mt: 0.5 }
                        }
                      }}
                    />
                  </ListItem>
                  {/* Draw a dividing line between items, but drop it for the final item */}
                  {index < userBlogs.length - 1 && <Divider />}
                </React.Fragment>
              ))}
          </List>
        )}
      </Paper>
    </Box>
  )
}

export default UserDetail
