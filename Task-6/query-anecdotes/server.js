import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("db.json"); // Connects the server to your local JSON database
const middlewares = jsonServer.defaults(); // Loads standard settings (logger, static files, CORS)

/**
 * Custom Validator Middleware
 * This function intercepts incoming requests before they reach the database.
 * It enforces business rules—in this case, a minimum character length for anecdotes.
 */
const validator = (request, response, next) => {
  // Destructure the content from the request body (requires bodyParser)
  const { content } = request.body;

  /**
   * Validation Logic:
   * Only checks POST requests (creating new data).
   * If the content is missing or shorter than 5 characters, it blocks the request.
   */
  if (request.method === "POST" && (!content || content.length < 5)) {
    // Return a 400 Bad Request status and an error object
    return response.status(400).json({
      error: "too short anecdote, must have length 5 or more characters",
    });
  } else {
    /**
     * next() is a crucial Express/JSON-server function.
     * It tells the server the request is valid and it can move to the next step
     * (which is the 'router' that actually saves the data).
     */
    next();
  }
};

// Applying the tools in a specific order:
server.use(middlewares);
server.use(jsonServer.bodyParser); // Needed to read 'request.body' in the validator
server.use(validator); // Runs our custom check
server.use(router); // Finally handles the data persistence

// Start the server on port 3001
server.listen(3001, () => {
  console.log("JSON Server is running");
});
