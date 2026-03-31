// Import Mongoose for MongoDB object modeling
const mongoose = require('mongoose')

// 1. THE SCHEMA (The Rules)
// This defines exactly what a "Blog" document must have before it hits the DB.
// Think of this as a blueprint or contract - every blog document must follow these rules
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // If the user sends a POST without a title,
    // Mongoose will "REJECT" it and trigger a 400 Bad Request.
    // This is database-level validation - the document won't even be created
  },
  author: {
    type: String,
    // Author is optional - if not provided, it will be undefined
    // No validation rules means any string is accepted, or it can be omitted
  },
  url: {
    type: String,
    required: true, // Same as title. No URL = No Save.
    // Both title and url are required to ensure every blog has essential content
  },
  likes: {
    type: Number,
    default: 0, // This is the "Safety Net". If the user
    // sends nothing for likes, Mongoose automatically plugs in 0.
    // This prevents undefined values and ensures we always have a number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // This is a special type that stores MongoDB ObjectIds
    ref: 'User', // This creates a reference to the User model
    // When we populate this field, Mongoose knows to look in the User collection
    // This creates a relationship: each blog belongs to one user
  },
})

// 2. THE TRANSFORMER (The Cleaning Crew)
// MongoDB stores IDs as an object called _id.
// Our frontend prefers a simple string called 'id'. This block fixes that.
// This transform runs automatically whenever a blog document is converted to JSON
// (for example, when we send it as a response to the client)
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // The transform function receives:
    // - document: the original Mongoose document
    // - returnedObject: the plain JavaScript object that will be sent as JSON

    // We create a new 'id' field from the weird MongoDB '_id'
    // .toString() converts the ObjectId to a simple string like "507f1f77bcf86cd799439011"
    returnedObject.id = returnedObject._id.toString()

    // We delete the old versions so the user never sees them.
    // This keeps the API clean and consistent - we only expose 'id', not '_id'
    delete returnedObject._id // Remove the MongoDB-specific ID field
    delete returnedObject.__v // __v is just a Mongoose internal version number.
    // The __v field tracks document version for internal use - clients don't need it
  },
})

// 3. THE EXPORT
// We turn this schema into a "Model" called 'Blog' and export it.
// The model is the actual interface we use to interact with the blogs collection
// It provides methods like find(), create(), update(), delete(), etc.
module.exports = mongoose.model('Blog', blogSchema)
