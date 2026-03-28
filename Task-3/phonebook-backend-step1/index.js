// 1. Import the Express framework
const express = require("express");
// 2. Initialize the app instance
const app = express();

// 3. Hardcoded Data (The "State")
// This is a 'let' because we might want to add/delete from it later.
// In a real app, this would be moved to MongoDB.
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
  { id: "5", name: "Arto Forde", number: "39-23-6423122" },
  { id: "6", name: "Arto Järvinen", number: "39-23-6423122" },
  { id: "7", name: "Arto fox", number: "39-23-6423332" },
  { id: "8", name: "Ada Fox", number: "39-23-9873122" },
  { id: "9", name: "Mary Järvinen", number: "39-23-4353122" },
  { id: "10", name: "jonny Järvinen", number: "39-23-4373122" },
  { id: "11", name: "Arto smith", number: "39-23-64288882" },
  { id: "12", name: "jimmy fox", number: "39-23-6423122" },
];

// 4. GET Route: Fetch all people
// When someone visits http://localhost:3001/api/persons
app.get("/api/persons", (request, response) => {
  // We send the array back as a JSON response
  response.json(persons);
});

// 5. Port Configuration
// We hardcode 3001 here for Part 3, but later we use .env
const PORT = 3001;

// 6. Start the Server
app.listen(PORT, () => {
  // This tells the developer the server is actually listening
  console.log(`Server running on port ${PORT}`);
});
