// 1. Import the 'test' function from Node's built-in test runner
const { test } = require("node:test");

// 2. Import 'assert' to compare the actual result with what we expect
const assert = require("node:assert");

// 3. Import the specific function we want to test (reverse)
const reverse = require("../utils/for_testing").reverse;

// Test Case 1: A single character
test("reverse of a", () => {
  const result = reverse("a"); // Execute the function
  // Verify: Does "a" reversed still equal "a"?
  assert.strictEqual(result, "a");
});

// Test Case 2: A normal word
test("reverse of react", () => {
  const result = reverse("react");
  // Verify: Does "react" come back as "tcaer"?
  assert.strictEqual(result, "tcaer");
});

// Test Case 3: A Palindrome (a word that's the same backwards)
// 'saippuakauppias' is Finnish for 'soap merchant'!
test("reverse of saippuakauppias", () => {
  const result = reverse("saippuakauppias");
  // Verify: It should be exactly the same string
  assert.strictEqual(result, "saippuakauppias");
});
