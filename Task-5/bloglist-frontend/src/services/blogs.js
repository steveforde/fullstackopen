// Import axios for making HTTP requests to the backend
import axios from 'axios'

// Base URL for all blog-related API endpoints
// This will be proxied to the backend server (typically http://localhost:3003/api/blogs)
const baseUrl = '/api/blogs'

// Variable to store the authentication token
// Initially null (user not logged in)
let token = null

/**
 * Sets the authorization token for future API requests
 * @param {string} newToken - The JWT token received from login
 *
 * Format: Adds "Bearer " prefix as required by the backend
 * Example: token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

/**
 * Fetches all blogs from the backend
 * @returns {Promise<Array>} - Array of blog objects
 *
 * Each blog object typically contains:
 * { id, title, author, url, likes, user: { id, name, username } }
 */
const getAll = async () => {
  // Create configuration object with authorization header
  const config = {
    headers: { Authorization: token }, // Send token for authentication
  }

  // Make GET request to fetch all blogs
  const response = await axios.get(baseUrl, config)

  // Return the data array from the response
  return response.data
}

/**
 * Creates a new blog post
 * @param {Object} newObject - Contains title, author, and url
 * @returns {Promise<Object>} - The newly created blog object with server-generated fields
 *
 * Example newObject: { title: "My Blog", author: "John Doe", url: "https://example.com" }
 * Returned object adds: id, likes (default 0), user info
 */
const create = async (newObject) => {
  // Configuration with authorization token (required for creating blogs)
  const config = {
    headers: { Authorization: token }, // Must have valid token
  }

  // POST request to create new blog
  // Sends newObject as request body
  const response = await axios.post(baseUrl, newObject, config)

  // Return the newly created blog with server-assigned fields
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

// Add this function to your services/blogs.js
const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const getUsers = async () => {
  const response = await axios.get('/api/users')
  return response.data
}
// and export it!
export default { getAll, create, update, remove, setToken, getUsers }