import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";

const Navigation = ({ user, handleLogout }) => {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#1976d2", marginBottom: "30px" }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{ mr: 4, fontWeight: "bold" }}
        >
          Blog App
        </Typography>

        <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1">{user.name} logged in</Typography>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="inherit"
            size="small"
            sx={{
              fontWeight: "bold",
              border: "1px solid rgba(255,255,255,0.5)",
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
