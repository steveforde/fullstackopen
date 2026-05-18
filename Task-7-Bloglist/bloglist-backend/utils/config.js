// 1. Load the 'dotenv' library and run the config function.
// This reads your hidden '.env' file and adds its variables to 'process.env'.
require('dotenv').config()

// 2. Extract the specific variables we need.
// We keep them in uppercase by convention because they are "Constants".
const PORT = process.env.PORT
// This "Ternary" operator is the magic switch
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

// 3. Export these variables as an object.
// This allows 'app.js' and 'index.js' to use them without needing to know the secret details.
module.exports = {
  MONGODB_URI,
  PORT,
}
