// 1. Import our custom logger to print messages to the terminal
const logger = require('./logger')
const jwt = require('jsonwebtoken') // For decoding and verifying JWT tokens
const User = require('../models/user') // To find users from the database

// 2. The Request Logger: Prints details of every incoming request
// 'next' is a function that tells Express to move to the next middleware
// This runs BEFORE any route handlers (GET, POST, etc.)
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method) // e.g., GET or POST
  logger.info('Path:  ', request.path) // e.g., /api/blogs
  logger.info('Body:  ', request.body) // The data sent by the user
  logger.info('---')
  next() // CRITICAL: Without this, the request would just hang and never finish!
}

// 3. Unknown Endpoint: Runs if the user hits a URL that doesn't exist
// This goes at the END of all routes in app.js (after all API routes)
const unknownEndpoint = (request, response) => {
  // We send a 404 status code (Not Found)
  response.status(404).send({ error: 'unknown endpoint' })
}

// EXTRACTOR 1: Pulls the token out of the Authorization header
// Example header: "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
const tokenExtractor = (request, response, next) => {
  // Get the Authorization header from the request
  const authorization = request.get('authorization')

  // Check if header exists AND starts with "Bearer "
  if (authorization && authorization.startsWith('Bearer ')) {
    // Remove "Bearer " prefix and keep just the token
    // "Bearer abc123" becomes "abc123"
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null // No token provided
  }

  // Very important: move to the next piece of code
  next()
}

// EXTRACTOR 2: Takes the token and finds the user who owns it
// This runs AFTER tokenExtractor (so request.token exists)
const userExtractor = async (request, response, next) => {
  // Only process if we have a token
  if (request.token) {
    // Verify the token is valid and decode it
    // jwt.verify throws an error if token is invalid or expired
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    // If token contains a user ID (it should, we put it there during login)
    if (decodedToken.id) {
      // Find the actual user document from the database
      // Now request.user contains the FULL user object
      request.user = await User.findById(decodedToken.id)
    }
  }
  next() // Move to the route handler
}

// 4. Error Handler: The final safety net for the whole app
// This function has FOUR parameters (error, request, response, next)
// Express recognizes this as an error-handling middleware because of the 4 parameters
const errorHandler = (error, request, response, next) => {
  logger.error(error.message) // Log the error for debugging

  // Handle different types of errors:

  // CastError: When an ID format is wrong (e.g., "abc" instead of valid ObjectId)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  // ValidationError: When data doesn't match schema (e.g., missing required field)
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  // MongoServerError with duplicate key: When username already exists
  else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' })
  }

  // JsonWebTokenError: When token is malformed or missing
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // TokenExpiredError: When token has expired
  else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  // If none of the above, pass to Express default error handler
  next(error)
}

// 5. Exporting as an object so app.js can use them
module.exports = {
  requestLogger, // Logs all requests
  unknownEndpoint, // Handles 404 routes
  errorHandler, // Catches and formats errors
  tokenExtractor, // Extracts token from headers
  userExtractor, // Finds user from token
}
