// 1. Importing tools and custom helpers
const config = require('./utils/config') // Secret URLs and Port numbers
const express = require('express') // The web framework
const app = express() // Creating the app instance
const cors = require('cors') // Allows frontend/backend communication
const blogsRouter = require('./controllers/blogs') // The rules for blog routes
const middleware = require('./utils/middleware') // Our custom 'checkpoints'
const logger = require('./utils/logger') // Our custom console printer
const mongoose = require('mongoose') // The database tool

// 2. Database Connection Logic
mongoose.set('strictQuery', false) // Preparing for future Mongoose versions
logger.info('connecting to MongoDB...')

// Connect using the hidden URI from our config
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB') // Success!
  })
  .catch((error) => {
    // If the database connection fails, tell us why
    logger.error('error connecting to MongoDB:', error.message)
  })

// 3. Middleware Pipeline (ORDER MATTERS HERE!)
app.use(cors()) // Let different domains talk to us
app.use(express.static('dist')) // Serve the frontend files
app.use(express.json()) // Parse incoming data so we can use 'request.body'
app.use(middleware.requestLogger) // Log every request to the terminal

// 4. Routing
// Any request starting with /api/blogs gets sent to the blogsRouter
app.use('/api/blogs', blogsRouter)

// 5. Final Safety Checks
app.use(middleware.unknownEndpoint) // If no route matches, send a 404
app.use(middleware.errorHandler) // If an error happens, handle it here

// 6. Export the app so index.js can use it
module.exports = app
