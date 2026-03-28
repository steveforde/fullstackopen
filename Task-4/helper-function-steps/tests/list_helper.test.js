// 1. Setup: Import test tools and our custom helper functions
const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

// 2. The Basic Check: Does the test runner actually work?
test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  // We expect exactly 1
  assert.strictEqual(result, 1);
});

// 3. Testing 'totalLikes'
describe("total likes", () => {
  // Test data: A single blog entry
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      likes: 5,
    },
  ];

  // Test data: Multiple blogs
  const blogs = [
    { _id: "1", title: "React patterns", likes: 7 },
    { _id: "2", title: "Go To Statement", likes: 5 },
    { _id: "3", title: "Canonical string", likes: 12 },
  ];

  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(blogs);
    // 7 + 5 + 12 = 24
    assert.strictEqual(result, 24);
  });
});

// 4. Testing 'favoriteBlog'
describe("favorite blog", () => {
  const blogs = [
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    },
    { title: "React patterns", author: "Michael Chan", likes: 7 },
  ];

  test("is the one with most likes", () => {
    const result = listHelper.favoriteBlog(blogs);
    // CRITICAL: We use 'deepStrictEqual' here because we are comparing OBJECTS, not just numbers.
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

// 5. Testing 'mostBlogs'
describe("most blogs", () => {
  const blogs = [
    { author: "Robert C. Martin" },
    { author: "Robert C. Martin" },
    { author: "Edsger W. Dijkstra" },
  ];

  test("returns the author with most blogs and the count", () => {
    const result = listHelper.mostBlogs(blogs);
    // Again, comparing objects requires 'deepStrictEqual'
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 2,
    });
  });
});

// 6. Testing 'mostLikes'
describe("most likes", () => {
  const blogs = [
    { author: "Edsger W. Dijkstra", likes: 5 },
    { author: "Edsger W. Dijkstra", likes: 12 },
    { author: "Robert C. Martin", likes: 10 },
  ];

  test("returns the author with most total likes", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17, // 5 + 12
    });
  });
});
