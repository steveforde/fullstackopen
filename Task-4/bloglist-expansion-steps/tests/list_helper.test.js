// 1. Setup: Bring in the testing tools and the logic file I'm actually checking
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// 2. The "Handshake" Test: Just making sure my test runner is talking to my code
test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  // No matter what I send, I coded this to return 1. Simple starting point.
  assert.strictEqual(result, 1)
})

// 3. Testing 'totalLikes': Checking my addition logic
describe('total likes', () => {
  // Creating a small test set with just one blog (5 likes)
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      likes: 5,
    },
  ]

  // Creating a bigger test set (Total should be 24 likes)
  const blogs = [
    { _id: '1', title: 'React patterns', likes: 7 },
    { _id: '2', title: 'Go To Statement', likes: 5 },
    { _id: '3', title: 'Canonical string', likes: 12 },
  ]

  test('of empty list is zero', () => {
    // If I have no blogs, I better get 0 likes back
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    // With one blog, the total is just that one blog's likes
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    // Testing the loop or 'reduce' function: 7 + 5 + 12 = 24
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 24)
  })
})

// 4. Testing 'favoriteBlog': Checking if I can find the "Winner"
describe('favorite blog', () => {
  const blogs = [
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    },
    { title: 'React patterns', author: 'Michael Chan', likes: 7 },
  ]

  test('is the one with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    // I use 'deepStrictEqual' here because objects are compared by content,
    // not just their "address" in the computer memory.
    assert.deepStrictEqual(result, {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })
})

// 5. Testing 'mostBlogs': Finding the most productive author
describe('most blogs', () => {
  const blogs = [
    { author: 'Robert C. Martin' },
    { author: 'Robert C. Martin' },
    { author: 'Edsger W. Dijkstra' },
  ]

  test('returns the author with most blogs and the count', () => {
    const result = listHelper.mostBlogs(blogs)
    // Checking if my logic correctly counted Uncle Bob twice
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 2,
    })
  })
})

// 6. Testing 'mostLikes': Finding the most "popular" author
describe('most likes', () => {
  const blogs = [
    { author: 'Edsger W. Dijkstra', likes: 5 },
    { author: 'Edsger W. Dijkstra', likes: 12 },
    { author: 'Robert C. Martin', likes: 10 },
  ]

  test('returns the author with most total likes', () => {
    const result = listHelper.mostLikes(blogs)
    // Dijkstra has 5 + 12 = 17. Martin has 10. Dijkstra wins.
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})
