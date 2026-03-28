// 1. Import mongoose library (used to connect to MongoDB)
const mongoose = require('mongoose')

// 2. Turn off strict query warnings (keeps things simple and avoids console noise)
mongoose.set('strictQuery', false)

// 3. Get the MongoDB connection URL from environment variables (.env file)
const url = process.env.MONGODB_URI

console.log('connecting to MongoDB...')

// 4. Connect to MongoDB using the URL
// { family: 4 } forces IPv4, which often fixes connection timeouts on modern networks
mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB') // Success message for the terminal
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message) // Logs the specific error
  })

// 5. Define the Schema: This is the "Blueprint" for every person in the database
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3, // Validation: Name must be 3+ characters (e.g. 'Ada')
    required: true, // Validation: You cannot save a person without a name
  },
  number: {
    type: String,
    minLength: 8, // Validation: Number must be 8+ characters total
    required: true, // Validation: Number is mandatory
    validate: {
      validator: function (v) {
        // Regex: 2 or 3 digits, a dash, then more digits (e.g. 061-123456)
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Use format 09-123456 or 040-123456`,
    },
  },
})

// 6. Data Transformation: Customize how the data looks when sent to the frontend
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // MongoDB uses '_id' (an object). We convert it to a simple string named 'id'
    returnedObject.id = returnedObject._id.toString()

    // Delete the MongoDB-specific internal fields so the API response is clean
    delete returnedObject._id
    delete returnedObject.__v
  },
})

// 7. Export the model so it can be imported in index.js or other controller files
module.exports = mongoose.model('Person', personSchema)
