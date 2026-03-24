// Import mongoose library (used to connect to MongoDB)
const mongoose = require("mongoose");

// Turn off strict query warnings (keeps things simple)
mongoose.set("strictQuery", false);

// Get the MongoDB connection URL from environment variables
const url = process.env.MONGODB_URI;

console.log("connecting to MongoDB...");

// Connect to MongoDB
mongoose
  .connect(url, { family: 4 }) // family: 4 forces IPv4 (avoids some network issues)
  .then((result) => {
    console.log("connected to MongoDB"); // Runs if connection is successful
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message); // Runs if error
  });

// Define what a "Person" looks like in the database
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Modify how data is returned when converted to JSON
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // Change _id to id (easier to use)
    returnedObject.id = returnedObject._id.toString();

    // Remove MongoDB-specific fields we don't want to show
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Export the model so other files can use it
module.exports = mongoose.model("Person", personSchema);
