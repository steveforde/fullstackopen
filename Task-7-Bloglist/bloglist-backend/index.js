// 1. We import the 'app' where all the Express routes and middleware are defined.
const app = require('./app')

// 2. We import the 'config' which holds our sensitive info (like PORT and MongoDB URL).
const config = require('./utils/config')

// 3. We import our custom 'logger' to print messages to the console nicely.
const logger = require('./utils/logger')

// 4. This actually starts the server and tells it which port to listen on.
app.listen(config.PORT, () => {
  // Once the server is live, this message confirms it to the developer.
  logger.info(`Server running on port ${config.PORT}`)
})
