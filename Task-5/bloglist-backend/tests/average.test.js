// Import the test runners and the 'average' function I wrote in utils
const { test, describe } = require('node:test') // Node.js built-in test framework
const assert = require('node:assert') // Assertion library for making comparisons
const average = require('../utils/for_testing').average // The function we're testing

// Grouping all my 'average' tests so the terminal output isn't a mess
describe('average', () => {
  // Check if the function can handle a single-item array
  test('of one value is the value itself', () => {
    // If I only have [1], the average must be 1
    // strictEqual checks exact equality (no type coercion)
    assert.strictEqual(average([1]), 1)
  })

  // Testing a standard range to make sure the math holds up
  test('of many is calculated right', () => {
    // (1+2+3+4+5+6) / 6 should give me 3.5
    // Verifies the arithmetic logic works correctly with multiple numbers
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5)
  })

  // The "Edge Case": Need to make sure the app doesn't crash on an empty list
  test('of empty array is zero', () => {
    // If the array is empty, I want it to return 0 instead of 'NaN' or an error
    // This tests defensive programming - handling edge cases gracefully
    assert.strictEqual(average([]), 0)
  })
})
