import { Link } from "react-router-dom";

const Navigation = ({ user, handleLogout }) => {
 const navStyle = {
   padding: "15px",
   backgroundColor: "#f0f0f0",
   display: "flex",
   gap: "20px",
   alignItems: "center",
   marginBottom: "20px", // Adds space so 'blog app' doesn't touch it
 };

  return (
    <nav style={navStyle}>
      <Link to="/">blogs</Link>
      <Link to="/users">users</Link>
      <span>
        {user.name} logged in
        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
          logout
        </button>
      </span>
    </nav>
  );
};

export default Navigation;
