import React from 'react'
import { Alert, Box } from '@mui/material'
import useNotificationStore from '../stores/notificationStore' // 💡 Import your Zustand store

/**
 * BlogNotification Component
 * Displays temporary status messages (success or error) to the user.
 * * Now reads directly from the global Zustand store, removing prop dependency.
 */
const BlogNotification = () => {
  // 💡 Pull message and type directly from your global Zustand store
  const message = useNotificationStore((state) => state.message)
  const type = useNotificationStore((state) => state.type)

  // Guard clause: if there's no message text at all, render absolutely nothing
  if (!message) {
    return null
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Alert
        severity={type === 'error' ? 'error' : 'success'}
        variant="filled"
        elevation={6}
      >
        {message}
      </Alert>
    </Box>
  )
}

export default BlogNotification
