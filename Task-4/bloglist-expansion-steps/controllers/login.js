// Import the jsonwebtoken library for creating and verifying JWTs
const jwt = require('jsonwebtoken')
// Import bcrypt for comparing password hashes securely
const bcrypt = require('bcrypt')
// Create a new router instance specifically for login routes
const loginRouter = require('express').Router()
// Import the User model to query the database for existing users
const User = require('../models/user')

// POST endpoint for user authentication - this is where users send their credentials
loginRouter.post('/', async (request, response) => {
  // Destructure username and password from the request body
  // This expects the client to send { username: "user", password: "pass" }
  const { username, password } = request.body

  // Query the database to find a user with the provided username
  // If no user exists, 'user' will be null
  const user = await User.findOne({ username })

  // Check if the password is correct:
  // - If user doesn't exist, passwordCorrect becomes false
  // - If user exists, compare the provided password with the stored hash
  //   bcrypt.compare hashes the provided password and compares it to user.passwordHash
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  // If user doesn't exist OR password is incorrect, return 401 Unauthorized
  // We use a generic error message for security - don't reveal which field was wrong
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  // Create the payload that will be embedded in the JWT
  // We only include non-sensitive information here
  const userForToken = {
    username: user.username, // Include username for reference
    id: user._id, // Include user ID so middleware can identify the user
  }

  // Generate the actual JWT token:
  // - First parameter: the payload (userForToken)
  // - Second parameter: secret key from environment variables (kept secure)
  // The token can be decoded later to verify the user's identity
  const token = jwt.sign(userForToken, process.env.SECRET)

  // Send back the authentication token along with user info
  // Client should store this token and include it in future requests
  response.status(200).send({
    token, // JWT token to be used for authentication
    username: user.username, // Send username back for client use
    name: user.name, // Send user's display name back
  })
})

// Export the router so it can be mounted in the main app.js file
// Typically mounted as: app.use('/api/login', loginRouter)
module.exports = loginRouter
