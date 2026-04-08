// Import test framework utilities
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert') // For making test assertions
const mongoose = require('mongoose') // MongoDB ODM
const supertest = require('supertest') // For making HTTP requests to our app
const app = require('../app') // Our Express app
const api = supertest(app) // Create test agent
const User = require('../models/user') // User model for DB operations

// We reset the users before each test
// Ensures each test starts with a clean database
beforeEach(async () => {
  await User.deleteMany({}) // Clear all users from the database
})

// Group all tests that assume one user initially exists (though we start empty)
describe('when there is initially one user in db', () => {
  // Test: Password validation - rejects passwords that are too short
  test('creation fails with proper statuscode and message if password is too short', async () => {
    const newUser = {
      username: 'steve_test',
      name: 'Steve Forde',
      password: '12', // Too short! (Requirement 4.16 - minimum 3 characters)
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400) // Bad Request status
      .expect('Content-Type', /application\/json/) // JSON error response

    // Check that the error message is what we expect
    assert(
      result.body.error.includes('password must be at least 3 characters long'),
    )
  })

  // Test: Username validation - rejects usernames that are too short
  test('creation fails with status code 400 if username is too short', async () => {
    const newUser = {
      username: 'st', // Too short! (Requirement 4.16 - minimum 3 characters)
      name: 'Steve',
      password: 'validpassword',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)

    assert(
      result.body.error.includes('username must be at least 3 characters long'),
    )
  })
})

// Clean up after all tests are done - close the database connection
after(async () => {
  await mongoose.connection.close()
})
