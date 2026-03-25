// Import mongoose library (used to connect to MongoDB)
const mongoose = require('mongoose')

// Turn off strict query warnings (keeps things simple)
mongoose.set('strictQuery', false)

// Get the MongoDB connection URL from environment variables
const url = process.env.MONGODB_URI

console.log('connecting to MongoDB...')

// Connect to MongoDB
mongoose
  .connect(url, { family: 4 }) // force IPv4 (avoids some network issues)
  .then(() => {
    console.log('connected to MongoDB') // success
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message) // error
  })

// Define what a "Person" looks like in the database
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        // Must be 2 or 3 digits, dash, then numbers (e.g. 09-123456)
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Use format 09-123456 or 040-123456`,
    },
  },
})

// Modify how data is returned when converted to JSON
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Change _id to id
    returnedObject.id = returnedObject._id.toString()

    // Remove MongoDB internal fields
    delete returnedObject._id
    delete returnedObject.__v
  },
})

// Export the model so other files can use it
module.exports = mongoose.model('Person', personSchema)
