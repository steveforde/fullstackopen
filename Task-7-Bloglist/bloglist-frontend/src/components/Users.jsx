import React from 'react'
import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import { Link } from 'react-router-dom'
// Exercise 7.16: Import clean Material-UI table layout components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material'

/**
 * Users Component
 * Displays a table of all registered users, their usernames, and total blogs created.
 * Clicking a user's name navigates to their individual detail page.
 * * Exercise 7.16: Implements full structural users table view matching layout requirements.
 */
const Users = () => {
  const [users, setUsers] = useState([])

  /**
   * Effect hook: Fetches all users from the backend when the component mounts.
   */
  useEffect(() => {
    blogService.getUsers().then((initialUsers) => {
      setUsers(initialUsers)
    })
  }, [])

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        Users
      </Typography>

      {/* Material-UI Paper acts as a clean elevated white card backing for the table */}
      <TableContainer component={Paper} elevation={2} sx={{ mt: 2 }}>
        <Table aria-label="users summary table">
          {/* Table Header Section */}
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                Username
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                Blogs created
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body Section - Loops through users array */}
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }} // Removes bottom line on last row
              >
                {/* Column 1: Full Name (Clickable link) */}
                <TableCell component="th" scope="row">
                  <Link
                    to={`/users/${user.id}`}
                    style={{
                      textDecoration: 'none',
                      fontWeight: '500',
                      color: '#1976d2'
                    }}
                  >
                    {user.name}
                  </Link>
                </TableCell>

                {/* Column 2: Username (Exercise 7.16 Requirement addition) */}
                <TableCell sx={{ color: '#555' }}>{user.username}</TableCell>

                {/* Column 3: Total Count of Created Blogs */}
                <TableCell>{user.blogs ? user.blogs.length : 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Users
