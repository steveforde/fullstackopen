// 1. Import our custom logger to print messages to the terminal
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// 2. The Request Logger: Prints details of every incoming request
// 'next' is a function that tells Express to move to the next middleware
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method) // e.g., GET or POST
  logger.info('Path:  ', request.path) // e.g., /api/blogs
  logger.info('Body:  ', request.body) // The data sent by the user
  logger.info('---')
  next() // CRITICAL: Without this, the request would just hang and never finish!
}

// 3. Unknown Endpoint: Runs if the user hits a URL that doesn't exist
const unknownEndpoint = (request, response) => {
  // We send a 404 status code (Not Found)
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    // We attach the token directly to the request object!
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }

  // Very important: move to the next piece of code
  next()
}

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (decodedToken.id) {
      request.user = await User.findById(decodedToken.id)
    }
  }
  next()
}

// 4. Error Handler: The final safety net for the whole app
// This function has FOUR parameters (error, request, response, next)
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    // This catches if someone tries to pick a username that's already taken
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    // This catches missing or messed up tokens
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    // This catches tokens that are too old
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

// 5. Exporting as an object so app.js can use them
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
