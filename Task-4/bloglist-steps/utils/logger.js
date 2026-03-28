// 1. A function for normal messages (like "Server running on port 3003")
// The '...params' is the "Spread" operator—it collects all arguments into an array.
const info = (...params) => {
  // Right now it just logs to the console, but in the future,
  // you could add a check here to STOP logging during automated tests.
  console.log(...params);
};

// 2. A function specifically for error messages
const error = (...params) => {
  // console.error prints to the 'stderr' stream, which is standard for errors.
  console.error(...params);
};

// 3. Export both functions so other files can use 'logger.info'
// instead of the generic 'console.log'.
module.exports = {
  info,
  error,
};
