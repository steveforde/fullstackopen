const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // Username is mandatory for authentication
    unique: true, // No duplicates allowed! Ensures each username is unique
  },
  name: String, // Optional display name - not used for login
  passwordHash: String, // Stores bcrypt hash, NOT the plain text password!
  // This is the "Link" to the blogs they own
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId, // References Blog documents by their ID
      ref: 'Blog', // Tells Mongoose which model to populate from
    },
  ],
})

// Transform the document when converting to JSON (e.g., when sending API responses)
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // Convert MongoDB _id to string id
    delete returnedObject._id // Remove the original _id (we now have 'id')
    delete returnedObject.__v // Remove internal version field
    // THE MOST IMPORTANT LINE: Never send the hash back to the user!
    delete returnedObject.passwordHash // Security: password hash never exposed to client
  },
})

module.exports = mongoose.model('User', userSchema) // Create and export the User model
