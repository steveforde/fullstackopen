// 1. Import our custom logger so we can print messages to the terminal
const logger = require("./logger");

// 2. The Receptionist (Request Logger):
// This function looks at every single visitor (request) and writes down
// what they are doing in the terminal.
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method); // GET, POST, etc.
  logger.info("Path:  ", request.path); // e.g., /api/blogs
  logger.info("Body:  ", request.body); // The data they sent
  logger.info("---");
  // CRITICAL: next() tells Express: "I'm done, move to the next function!"
  next();
};

// 3. The Security Guard (Unknown Endpoint):
// This only runs if a visitor tries to go to a room (URL) that doesn't exist.
const unknownEndpoint = (request, response) => {
  // We send a 404 (Not Found) and a helpful message
  response.status(404).send({ error: "unknown endpoint" });
};

// 4. The Maintenance Crew (Error Handler):
// This only runs if something breaks or goes wrong in the other rooms.
// Notice it has FOUR parameters: (error, request, response, next)
const errorHandler = (error, request, response, next) => {
  logger.error(error.message); // Log the actual error for the developer

  // Handle specific MongoDB errors
  if (error.name === "CastError") {
    // This usually means an ID in the URL is the wrong format
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    // This happens if the user sends data that breaks our Schema rules
    return response.status(400).json({ error: error.message });
  }

  // If it's an error we didn't plan for, pass it to Express's default handler
  next(error);
};

// 5. Export as an object so app.js can plug them into the main pipeline
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
