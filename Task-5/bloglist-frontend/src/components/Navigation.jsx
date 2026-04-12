import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";

const Navigation = ({ user, handleLogout }) => {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#1976d2", marginBottom: "30px" }}
    >
      <Toolbar>
        {/* Brand Title (Left side) */}
        <Typography
          variant="h5"
          component="div"
          sx={{
            mr: 4,
            fontWeight: "bold",
            display: { xs: "none", sm: "block" },
          }}
        >
          Blog App
        </Typography>

        {/* Navigation Links (Middle) */}
        <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ fontWeight: "bold" }}
          >
            BLOGS
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/users"
            sx={{ fontWeight: "bold" }}
          >
            USERS
          </Button>
        </Box>

        {/* User Info & Logout (Right side) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="body1"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            {user.name} logged in
          </Typography>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="inherit"
            size="small"
            sx={{
              fontWeight: "bold",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            LOGOUT
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
