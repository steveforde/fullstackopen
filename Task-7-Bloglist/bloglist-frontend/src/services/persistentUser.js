/**
 * persistentUser Service
 * Handles reading, writing, and deleting the logged-in user data from window.localStorage.
 * * Exercise 7.15: Centralizes localStorage access to prevent direct calls throughout the app.
 */

const STORAGE_KEY = 'loggedBlogappUser'

// Retrieve the parsed user object from localStorage
const getUser = () => {
  const userJSON = window.localStorage.getItem(STORAGE_KEY)
  return userJSON ? JSON.parse(userJSON) : null
}

// Save the user object to localStorage
const saveUser = (user) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

// Clear the user object from localStorage on logout
const removeUser = () => {
  window.localStorage.removeItem(STORAGE_KEY)
}

export default {
  getUser,
  saveUser,
  removeUser
}
