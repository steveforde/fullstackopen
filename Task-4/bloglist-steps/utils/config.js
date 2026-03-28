// 1. Load the 'dotenv' library and run the .config() function.
// This reads your hidden '.env' file and adds its variables to 'process.env'.
require("dotenv").config();

// 2. Extract the specific variables we need from the environment.
// We use uppercase (PORT, MONGODB_URI) by convention for "Constants."
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

// 3. Export these variables as an object.
// This allows 'app.js' and 'index.js' to use them without seeing the raw secret data.
module.exports = {
  MONGODB_URI,
  PORT,
};
