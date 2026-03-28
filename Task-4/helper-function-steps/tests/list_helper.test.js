const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  const blogs = [
    { _id: "1", title: "React patterns", likes: 7 },
    { _id: "2", title: "Go To Statement Considered Harmful", likes: 5 },
    { _id: "3", title: "Canonical string reduction", likes: 12 },
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
    assert.strictEqual(result, 24); // 7 + 5 + 12 = 24
  });
});

describe("favorite blog", () => {
  const blogs = [
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    },
    { title: "React patterns", author: "Michael Chan", likes: 7 },
    { title: "First class tests", author: "Robert C. Martin", likes: 10 },
  ];

  test("is the one with most likes", () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

describe("most blogs", () => {
  const blogs = [
    { title: "Blog 1", author: "Robert C. Martin", likes: 10 },
    { title: "Blog 2", author: "Robert C. Martin", likes: 5 },
    { title: "Blog 3", author: "Edsger W. Dijkstra", likes: 12 },
    { title: "Blog 4", author: "Robert C. Martin", likes: 0 },
  ];

  test("returns the author with most blogs and the count", () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  const blogs = [
    { title: "Blog 1", author: "Edsger W. Dijkstra", likes: 5 },
    { title: "Blog 2", author: "Edsger W. Dijkstra", likes: 12 },
    { title: "Blog 3", author: "Robert C. Martin", likes: 10 },
  ];

  test("returns the author with most total likes", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17, // 5 + 12
    });
  });
});
