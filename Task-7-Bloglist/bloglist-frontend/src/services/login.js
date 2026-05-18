// Import axios for making HTTP requests to the backend
import axios from 'axios'

// Base URL for the login authentication endpoint
// This will be proxied to the backend server (typically http://localhost:3003/api/login)
const baseUrl = '/api/login'

/**
 * Authenticates a user with username and password
 * @param {Object} credentials - Contains username and password
 * @returns {Promise<Object>} - User data including token, username, and name
 *
 * Example credentials: { username: "johndoe", password: "secret123" }
 * Example response: {
 *   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   username: "johndoe",
 *   name: "John Doe"
 * }
 */
const login = async (credentials) => {
  // Make POST request to login endpoint with credentials in request body
  // The backend validates username/password and returns a JWT token if valid
  const response = await axios.post(baseUrl, credentials)

  // Return the parsed response data (token + user info)
  return response.data
}

// Export the login function for use in components (e.g., LoginForm.jsx)
export default { login }
