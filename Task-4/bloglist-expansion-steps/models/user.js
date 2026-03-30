const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // No duplicates allowed!
  },
  name: String,
  passwordHash: String,
  // This is the "Link" to the blogs they own
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // THE MOST IMPORTANT LINE: Never send the hash back to the user!
    delete returnedObject.passwordHash
  },
})

module.exports = mongoose.model('User', userSchema)
