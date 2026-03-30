const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const api = supertest(app)

let token // We will store the login token here for all tests to use

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // 1. Create a test user with a hashed password
  const passwordHash = await bcrypt.hash('testpassword', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  // 2. Generate a valid token for this user
  const userForToken = { username: user.username, id: user._id }
  token = jwt.sign(userForToken, process.env.SECRET)

  // 3. Add initial blogs and link them to our test user
  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: user._id }),
  )
  await Blog.insertMany(blogObjects)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

// --- UPDATED POST TEST ---
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Testing with Tokens',
    author: 'Steve Limerick',
    url: 'https://fullstackopen.com/',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) // SEND THE TOKEN!
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
})

// --- NEW TEST FOR EXERCISE 4.23 ---
test('adding a blog fails with 401 if token is missing', async () => {
  const newBlog = {
    title: 'Ghost Blog',
    author: 'No One',
    url: 'https://ghost.com',
  }

  await api.post('/api/blogs').send(newBlog).expect(401) // Expect failure because no token was sent
})

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  assert.ok(response.body[0].id)
  assert.strictEqual(response.body[0]._id, undefined)
})

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

  assert.strictEqual(response.body.likes, 0)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid and owner deletes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`) // SEND THE TOKEN!
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
