import { Alert, Box } from "@mui/material";

/**
 * BlogNotification Component
 * Displays temporary status messages (success or error) to the user.
 * Messages auto-dismiss after 5 seconds (controlled by the notify() function in App.jsx).
 *
 * Uses Material-UI Alert component for consistent styling with icons and colors.
 *
 * @param {string} message - The notification text to display (e.g., "a new blog added")
 * @param {string} type - The type of notification: "success" (green) or "error" (red)
 *
 * Exercise 5.30: Converted from custom CSS to Material-UI Alert component.
 */
const BlogNotification = ({ message, type }) => {
  // Guard clause: if there's no message (null), render nothing
  // This prevents an empty notification box from appearing
  if (message === null) {
    return null;
  }

  return (
    // Box with margin-bottom for spacing below the notification
    <Box sx={{ mb: 2 }}>
      {/* 
        MUI Alert component - automatically handles icons and colors based on 'severity'.
        
        severity prop options:
        - "error" → red background, error icon
        - "success" → green background, checkmark icon
        - "warning" → yellow background, warning icon
        - "info" → blue background, info icon
        
        variant="filled" gives a solid colored background.
        Options: "filled", "outlined", or "standard" (default).
        
        elevation={6} adds a shadow under the alert for depth.
      */}
      <Alert
        severity={type === "error" ? "error" : "success"}
        variant="filled"
        elevation={6}
      >
        {message}
      </Alert>
    </Box>
  );
};

export default BlogNotification;
