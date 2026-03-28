// 1. Reverse: Takes a string and flips it backwards
const reverse = (string) => {
  // .split("") turns "hello" into ["h", "e", "l", "l", "o"]
  // .reverse() turns it into ["o", "l", "l", "e", "h"]
  // .join("") turns it back into "olleh"
  return string.split("").reverse().join("");
};

// 2. Average: Calculates the mean of an array of numbers
const average = (array) => {
  // The 'reducer' function defines HOW to combine two numbers
  const reducer = (sum, item) => {
    return sum + item;
  };

  // If the array is empty, we return 0 to avoid "Division by Zero" errors.
  // Otherwise, we sum everything up with .reduce() and divide by the count.
  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

// 3. Exporting the helpers so the test files can import them
module.exports = {
  reverse,
  average,
};
