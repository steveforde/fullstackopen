// 1. Setup: Import the tools and the specific function we are testing
const { test, describe } = require('node:test')
const assert = require('node:assert')
const average = require('../utils/for_testing').average

// 2. 'describe' groups all the 'average' tests together in the terminal report
describe('average', () => {
  // Test Case 1: A single number
  test('of one value is the value itself', () => {
    // The average of [1] should obviously be 1
    assert.strictEqual(average([1]), 1)
  })

  // Test Case 2: A standard list of numbers
  test('of many is calculated right', () => {
    // (1+2+3+4+5+6) / 6 = 3.5
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5)
  })

  // Test Case 3: The "Edge Case" (The most important one for the exam!)
  test('of empty array is zero', () => {
    // In math, you can't divide by zero.
    // This test ensures our code handles an empty list gracefully.
    assert.strictEqual(average([]), 0)
  })
})
