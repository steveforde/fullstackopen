// 1. A function for normal messages (like "Server running...")
// '...params' is the "Spread" operator—it lets the function take any number of arguments
const info = (...params) => {
  // We only print if we aren't in 'test' mode (optional future upgrade)
  console.log(...params)
}

// 2. A function specifically for error messages
const error = (...params) => {
  // console.error prints to the 'stderr' stream, which is standard for errors
  console.error(...params)
}

// 3. Export them so other files don't have to use 'console.log' directly
module.exports = {
  info,
  error,
}
