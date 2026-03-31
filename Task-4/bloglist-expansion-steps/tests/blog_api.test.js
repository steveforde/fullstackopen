// Import test framework utilities
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert') // For making test assertions
const mongoose = require('mongoose') // MongoDB ODM
const supertest = require('supertest') // For making HTTP requests to our app
const app = require('../app') // Our Express app
const helper = require('./test_helper') // Helper functions and test data
const Blog = require('../models/blog') // Blog model for DB operations
const User = require('../models/user') // User model for DB operations
const jwt = require('jsonwebtoken') // For generating test tokens
const bcrypt = require('bcrypt') // For hashing test passwords

// Create a supertest agent that can make HTTP requests to our app
const api = supertest(app)

let token // We will store the login token here for all tests to use

// beforeEach runs before every test to ensure a clean, consistent state
beforeEach(async () => {
  // Clear all existing data from both collections
  await Blog.deleteMany({})
  await User.deleteMany({})

  // 1. Create a test user with a hashed password
  const passwordHash = await bcrypt.hash('testpassword', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  // 2. Generate a valid token for this user
  // This token will be used in authenticated requests throughout the tests
  const userForToken = { username: user.username, id: user._id }
  token = jwt.sign(userForToken, process.env.SECRET)

  // 3. Add initial blogs and link them to our test user
  // Maps each blog from helper.initialBlogs to a new Blog document with the user ID
  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: user._id }),
  )
  await Blog.insertMany(blogObjects) // Insert all blogs at once
})

// Test 1: Verify the API returns JSON format
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200) // Status code OK
    .expect('Content-Type', /application\/json/) // Response type is JSON
})

// Test 2: Verify all blogs are returned (correct count)
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

// --- UPDATED POST TEST ---
// Test 3: Adding a valid blog with authentication works
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Testing with Tokens',
    author: 'Steve Limerick',
    url: 'https://fullstackopen.com/',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) // SEND THE TOKEN! Authenticates the request
    .send(newBlog)
    .expect(201) // Status Created
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
})

// --- NEW TEST FOR EXERCISE 4.23 ---
// Test 4: Verify authentication is required - requests without token get rejected
test('adding a blog fails with 401 if token is missing', async () => {
  const newBlog = {
    title: 'Ghost Blog',
    author: 'No One',
    url: 'https://ghost.com',
  }

  await api.post('/api/blogs').send(newBlog).expect(401) // Expect failure because no token was sent
})

// Test 5: Verify blogs use 'id' instead of MongoDB's '_id'
test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  assert.ok(response.body[0].id) // 'id' field exists
  assert.strictEqual(response.body[0]._id, undefined) // '_id' field is not present
})

// Test 6: Verify likes defaults to 0 when not provided
test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Steve',
    url: 'https://test.com',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) // SEND THE TOKEN!
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0) // Default value is 0
})

// Group all deletion tests together
describe('deletion of a blog', () => {
  // Test 7: Verify only the owner can delete their blog
  test('succeeds with status code 204 if id is valid and owner deletes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0] // Pick the first blog to delete

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`) // SEND THE TOKEN! Must be the owner
      .expect(204) // No Content - successful deletion

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

// Clean up after all tests are done - close the database connection
after(async () => {
  await mongoose.connection.close()
})
