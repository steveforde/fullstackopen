import { Alert, Box } from "@mui/material";

/**
 * BlogNotification component - displays temporary status messages to the user
 * Now styled using Material UI Alert for Exercise 5.30.
 */
const BlogNotification = ({ message, type }) => {
  // Guard clause: if there's no message (null), render nothing
  if (message === null) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      {/* MUI Alert automatically handles icons and colors based on 'severity'.
        We map your 'error' type to 'error' and everything else to 'success'.
      */}
      <Alert
        severity={type === "error" ? "error" : "success"}
        variant="filled" // Options: "filled", "outlined", or "standard"
        elevation={6} // Adds a nice shadow
      >
        {message}
      </Alert>
    </Box>
  );
};

export default BlogNotification;
