// Import bcrypt for hashing passwords before storing them in the database
const bcrypt = require('bcrypt')
// Create a new router instance specifically for user-related routes
const usersRouter = require('express').Router()
// Import the User model to interact with the users collection in the database
const User = require('../models/user')

/**
 * GET /api/users
 * Retrieves all users from the database
 * No authentication required - anyone can see the list of users
 *
 * Populates the 'blogs' field for each user, showing which blogs they've created
 * This creates a view of users with their associated blog posts
 */
usersRouter.get('/', async (request, response) => {
  // Find all users in the database
  // .populate('blogs') is like a JOIN - it replaces each blog ID with the actual blog document
  // The second argument specifies which blog fields to include (title, author, url)
  // This prevents sending unnecessary blog data like __v, likes, etc. if we wanted to limit it
  const users = await User.find({}).populate('blogs', {
    title: 1, // Include the blog title
    author: 1, // Include the blog author
    url: 1, // Include the blog URL
  })

  // Send the array of users with their populated blogs as JSON
  response.json(users)
})

/**
 * POST /api/users
 * Creates a new user account (signup)
 *
 * Request body should contain:
 *   - username: string (required, min 3 chars, must be unique)
 *   - name: string (optional, display name)
 *   - password: string (required, min 3 chars, will be hashed before storage)
 *
 * Note: We never store the plain text password - only the hash
 */
usersRouter.post('/', async (request, response) => {
  // Destructure the user data from the request body
  const { username, name, password } = request.body

  // --- VALIDATION SECTION ---
  // These validations happen before any database operations
  // We check both presence and minimum length requirements

  // 1. Password validation
  // Password is required and must be at least 3 characters long
  // We check this manually because the password is hashed before storage
  // The model validation would check the hash, which doesn't have length constraints
  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long',
    })
  }

  // 2. Username validation
  // Username is required and must be at least 3 characters long
  if (!username || username.length < 3) {
    return response.status(400).json({
      error: 'username must be at least 3 characters long',
    })
  }

  // 3. Check if username already exists
  // This ensures usernames are unique across the system
  // We query the database to see if any user already has this username
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'expected `username` to be unique',
    })
  }

  // --- PASSWORD HASHING ---
  // We never store plain text passwords for security reasons
  // bcrypt hashes the password using a salt - a random string added to the password
  // The salt rounds parameter (10) determines how computationally expensive the hashing is
  // Higher numbers = more secure but slower. 10 is a good balance for most applications
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // --- CREATE AND SAVE USER ---
  // Create a new User instance with the validated data
  // Note: We store passwordHash, NOT the original password
  const user = new User({
    username, // The unique username for login
    name, // The display name (can be undefined if not provided)
    passwordHash, // The hashed password - never store the plain text!
  })

  // Save the user to the database
  // If any validation fails at the model level, this will throw an error
  const savedUser = await user.save()

  // Return the saved user with status 201 (Created)
  // Note: The response does NOT include the password hash for security
  response.status(201).json(savedUser)
})

// Export the router so it can be mounted in the main app.js
// Typically mounted as: app.use('/api/users', usersRouter)
module.exports = usersRouter
