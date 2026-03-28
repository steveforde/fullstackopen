// 1. Import Mongoose, the tool that lets Node.js talk to MongoDB
const mongoose = require("mongoose");

// 2. Define the 'Schema' - This is the rulebook for our data.
// It says: "Every blog MUST have these fields and they MUST be these types."
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

// 3. The 'toJSON' Transform: Making the data "Frontend Friendly"
// By default, MongoDB uses '_id' (a special object) and '__v' (version number).
// Frontend developers in the real world prefer a simple string called 'id'.
blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // Create a new 'id' property by converting the MongoDB '_id' object to a string
    returnedObject.id = returnedObject._id.toString();

    // Delete the ugly MongoDB-specific fields so the API response is clean
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// 4. Export the Model.
// We call it "Blog". Mongoose will automatically create a collection
// in your database called "blogs" (it pluralizes and lowercases the name).
module.exports = mongoose.model("Blog", blogSchema);
