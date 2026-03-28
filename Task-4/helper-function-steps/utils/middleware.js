// 1. Import our custom logger to print messages to the terminal
const logger = require("./logger");

// 2. The Request Logger: Prints details of every incoming request
// 'next' is a function that tells Express to move to the next middleware
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method); // e.g., GET or POST
  logger.info("Path:  ", request.path); // e.g., /api/blogs
  logger.info("Body:  ", request.body); // The data sent by the user
  logger.info("---");
  next(); // CRITICAL: Without this, the request would just hang and never finish!
};

// 3. Unknown Endpoint: Runs if the user hits a URL that doesn't exist
const unknownEndpoint = (request, response) => {
  // We send a 404 status code (Not Found)
  response.status(404).send({ error: "unknown endpoint" });
};

// 4. Error Handler: The final safety net for the whole app
// This function has FOUR parameters (error, request, response, next)
const errorHandler = (error, request, response, next) => {
  logger.error(error.message); // Print the actual error message for the dev

  // Handle specific MongoDB errors
  if (error.name === "CastError") {
    // Usually happens when an ID in the URL is the wrong format (too short/long)
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    // Happens if the user tries to save a blog without a title or URL
    return response.status(400).json({ error: error.message });
  }

  // If it's an error we didn't expect, pass it to the default Express error handler
  next(error);
};

// 5. Exporting as an object so app.js can use them
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
