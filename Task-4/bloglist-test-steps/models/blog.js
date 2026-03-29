const mongoose = require('mongoose')

// 1. THE SCHEMA (The Rules)
// This defines exactly what a "Blog" document must have before it hits the DB.
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // EXERCISE 4.12: If the user sends a POST without a title,
    // Mongoose will "REJECT" it and trigger that 400 Bad Request.
  },
  author: String,
  url: {
    type: String,
    required: true, // EXERCISE 4.12: Same as title. No URL = No Save.
  },
  likes: {
    type: Number,
    default: 0, // EXERCISE 4.11: This is the "Safety Net". If the user
    // sends nothing for likes, Mongoose automatically plugs in 0.
  },
})

// 2. THE TRANSFORMER (The Cleaning Crew)
// MongoDB stores IDs as an object called _id. Frontend developers (and the course)
// prefer a simple string called 'id'. This block fixes that.
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // EXERCISE 4.9: We create a new 'id' field from the weird MongoDB '_id'
    returnedObject.id = returnedObject._id.toString()

    // We delete the old versions so the user never sees them.
    delete returnedObject._id
    delete returnedObject.__v // __v is just a Mongoose internal version number.
  },
})

// 3. THE EXPORT
// We turn this schema into a "Model" called 'Blog' and export it.
module.exports = mongoose.model('Blog', blogSchema)
