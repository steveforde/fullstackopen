// Import the test runner, my app, and the supertest tool to "fake" browser requests
const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

// Wrap my app in supertest so I can call api.get() or api.post() easily
const api = supertest(app)

// I need to reset the database before EVERY test so the results are predictable
beforeEach(async () => {
  // Wipe the test database completely
  await Blog.deleteMany({})
  // Fill it back up with the two standard blogs from my helper file
  await Blog.insertMany(helper.initialBlogs)
})

// Check if the GET route returns JSON and a 200 OK status
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// Make sure the number of blogs I get back matches my initial setup (should be 2)
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

// Grab all the titles and make sure one of my specific initial blogs is there
test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  const titles = response.body.map((b) => b.title)
  assert(titles.includes('React patterns'))
})

// Test if I can successfully add a new blog and if the count increases to 3
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Testing the POST route',
    author: 'Steve Limerick',
    url: 'https://fullstackopen.com/',
    likes: 10,
  }

  // Send the post and expect a 201 Created status
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Use my helper to check the database count again
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  // Verify that my specific title actually made it into the DB
  const titles = blogsAtEnd.map((n) => n.title)
  assert(titles.includes('Testing the POST route'))
})

// EXERCISE 4.9: Verify that Mongoose transformed _id to id
test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  // Check if .id exists and ._id is gone
  assert.ok(response.body[0].id)
  assert.strictEqual(response.body[0]._id, undefined)
})

// EXERCISE 4.11: Test the 'default' logic in my Mongoose schema
test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Steve',
    url: 'https://test.com',
  }

  const response = await api.post('/api/blogs').send(newBlog).expect(201)

  // My model should have automatically set this to 0
  assert.strictEqual(response.body.likes, 0)
})

// EXERCISE 4.12: Test the 'required' validation in my Mongoose schema
test('blog without title or url returns 400 Bad Request', async () => {
  const newBlog = {
    author: 'Steve',
    likes: 5,
  }

  // If I miss a title/url, my server must reject it with a 400 error
  await api.post('/api/blogs').send(newBlog).expect(400)
})

// Once the whole file is finished, kill the database connection
// so the test process can actually stop
after(async () => {
  await mongoose.connection.close()
})
