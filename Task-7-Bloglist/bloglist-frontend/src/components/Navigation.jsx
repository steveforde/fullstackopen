import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";

/**
 * Navigation Component
 * The top navigation bar that appears when a user is logged in.
 * Shows the app title, navigation links (blogs, users), user name, and logout button.
 *
 * @param {Object} user - The currently logged-in user object (contains name, username, etc.)
 * @param {Function} handleLogout - Function to call when logout button is clicked
 */
const Navigation = ({ user, handleLogout }) => {
  return (
    // AppBar: Material-UI component that creates a responsive top navigation bar
    // position="static": stays at the top of its container (doesn't scroll with page)
    // sx: custom styling (MUI's styling prop)
    <AppBar
      position="static"
      sx={{ backgroundColor: "#1976d2", marginBottom: "30px" }}
    >
      {/* Toolbar: Material-UI container that holds the navigation content */}
      <Toolbar>
        {/* 
          Typography: Material-UI component for text
          variant="h5": heading level 5 (medium size)
          component="div": renders as a <div> instead of default <h1>
          sx={{ mr: 4 }}: margin-right: 32px (spacing)
        */}
        <Typography
          variant="h5"
          component="div"
          sx={{ mr: 4, fontWeight: "bold" }}
        >
          Blog App
        </Typography>

        {/* 
          Box: Material-UI layout container (like a div)
          flexGrow: 1: pushes content to the right (takes up remaining space)
          display: "flex": makes children align horizontally
          gap: 1: spacing between buttons
        */}
        <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
          {/* 
            Button with component={Link}: turns the button into a React Router link
            to="/": navigates to home page when clicked
            color="inherit": uses the parent's text color (white in this case)
            textTransform: "none": prevents automatic uppercase conversion
          */}
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ fontWeight: "bold", textTransform: "none" }}
          >
            blogs
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/users"
            sx={{ fontWeight: "bold", textTransform: "none" }}
          >
            users
          </Button>
        </Box>

        {/* 
          Second Box: contains user info and logout button
          alignItems: "center": vertically centers the items
          gap: 2: spacing between user name and logout button
        */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Display the user's name with "logged in" text */}
          <Typography variant="body1">{user.name} logged in</Typography>

          <Button
            onClick={handleLogout} // Call the logout function from App.jsx
            variant="outlined" // Outlined button style (transparent with border)
            color="inherit" // White text and border
            size="small" // Smaller button size
            sx={{
              fontWeight: "bold",
              border: "1px solid rgba(255,255,255,0.5)", // Semi-transparent white border
              textTransform: "none",
            }}
          >
            logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
