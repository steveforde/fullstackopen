import { useState, useEffect } from "react";
import blogService from "../services/blogs";
import { Link } from "react-router-dom";

/**
 * Users Component
 * Displays a table of all registered users and how many blogs each has created.
 * Clicking a user's name navigates to their individual detail page.
 */
const Users = () => {
  // State to store the list of users fetched from the backend
  const [users, setUsers] = useState([]);

  /**
   * Effect hook: Fetches all users from the backend when the component mounts.
   * The empty dependency array [] means this runs once when the component first loads.
   */
  useEffect(() => {
    blogService.getUsers().then((initialUsers) => {
      setUsers(initialUsers); // Store the fetched users in state
    });
  }, []);

  /**
   * Inline styles for the table to make it look modern and clean.
   * Using object literals instead of CSS files for simplicity.
   */

  // Table container style
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse", // Removes gaps between table cells
    marginTop: "20px",
  };

  // Standard cell style (applies to both header and body cells)
  const cellStyle = {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #ddd", // Subtle separator between rows
  };

  // Header cell style (inherits from cellStyle, adds background and bold text)
  const headerStyle = {
    ...cellStyle, // Spread operator: copies all properties from cellStyle
    backgroundColor: "#f4f4f4", // Light gray background for header
    fontWeight: "bold",
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Users</h2>
      <table style={tableStyle}>
        {/* Table Header */}
        <thead>
          <tr>
            <th style={headerStyle}>User Name</th>
            <th style={headerStyle}>Blogs Created</th>
          </tr>
        </thead>

        {/* Table Body - maps through users array to create a row for each user */}
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              {" "}
              {/* 'key' is required by React for list rendering */}
              <td style={cellStyle}>
                {/* 
                  Link component from React Router: creates a clickable link 
                  that navigates to `/users/:id` without reloading the page.
                  Example: if user.id is "123", the link goes to "/users/123"
                */}
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td style={cellStyle}>
                {/* 
                  Displays the number of blogs this user has created.
                  user.blogs is an array (populated by the backend), 
                  so .length gives the count.
                */}
                {user.blogs.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
