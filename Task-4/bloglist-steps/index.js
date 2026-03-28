// 1. We import the 'app' where all the logic (routes, middleware) lives.
const app = require("./app");

// 2. We import 'config' to get our PORT number (usually 3003).
const config = require("./utils/config");

// 3. We import our custom 'logger' to print messages to the terminal.
const logger = require("./utils/logger");

// 4. This is the "Start" command. It tells the app to listen for
// incoming requests on the port defined in our config.
app.listen(config.PORT, () => {
  // Once the server is successfully running, we log a confirmation message.
  logger.info(`Server running on port ${config.PORT}`);
});
