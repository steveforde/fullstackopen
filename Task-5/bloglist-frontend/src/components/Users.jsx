import { useState, useEffect } from "react";
import blogService from "../services/blogs";
import { Link } from "react-router-dom";


const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    blogService.getUsers().then((initialUsers) => {
      setUsers(initialUsers);
    });
  }, []);

  // Styles to make it look modern
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  };

  const cellStyle = {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #ddd",
  };

  const headerStyle = {
    ...cellStyle,
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Users</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>User Name</th>
            <th style={headerStyle}>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={cellStyle}>
                {/* Wrap the name in a Link like this */}
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td style={cellStyle}>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
