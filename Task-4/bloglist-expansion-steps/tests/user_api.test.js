const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

// We reset the users before each test
beforeEach(async () => {
  await User.deleteMany({})
})

describe('when there is initially one user in db', () => {
  test('creation fails with proper statuscode and message if password is too short', async () => {
    const newUser = {
      username: 'steve_test',
      name: 'Steve Forde',
      password: '12', // Too short! (Requirement 4.16)
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    // Check that the error message is what we expect
    assert(
      result.body.error.includes('password must be at least 3 characters long'),
    )
  })

  test('creation fails with status code 400 if username is too short', async () => {
    const newUser = {
      username: 'st', // Too short! (Requirement 4.16)
      name: 'Steve',
      password: 'validpassword',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)

    assert(
      result.body.error.includes('username must be at least 3 characters long'),
    )
  })
})

after(async () => {
  await mongoose.connection.close()
})
