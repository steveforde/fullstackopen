// 1. Importing the 'building blocks' and our custom helpers
const config = require('./utils/config') // Secret URLs and Port numbers
const express = require('express') // The web framework itself
const app = express() // Creating the actual app instance
const cors = require('cors') // Allows the frontend to talk to the backend
const blogsRouter = require('./controllers/blogs') // The rules for /api/blogs
const middleware = require('./utils/middleware') // Our custom 'checkpoint' functions
const logger = require('./utils/logger') // Our custom console printer
const mongoose = require('mongoose') // The tool that talks to MongoDB
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// 2. Database Connection Setup
mongoose.set('strictQuery', false) // Preparation for Mongoose updates
logger.info('connecting to MongoDB...')

// Connect using the URL from our config file
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB') // Success message
  })
  .catch((error) => {
    // If the database is down or the password is wrong, tell us why
    logger.error('error connecting to MongoDB:', error.message)
  })

// 3. Middleware (The Request Pipeline)
// These run in order for every single request that comes in!
app.use(cors()) // Let different domains talk to us
app.use(express.static('dist')) // Serve the frontend files if they exist
app.use(express.json()) // Parse incoming data so we can read 'request.body'
app.use(middleware.requestLogger) // Print details of every request to the console
app.use(middleware.tokenExtractor)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)

// 4. Routes (The Traffic Controller)
// Any request starting with /api/blogs is handed over to the blogsRouter
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

// 5. Error Handling (The Safety Net)
// These only run if the request didn't match a route or if something crashed
app.use(middleware.unknownEndpoint) // Handles 404 - Page not found
app.use(middleware.errorHandler) // Handles database errors or bad data


// 6. Export the app so 'index.js' can start it
module.exports = app
