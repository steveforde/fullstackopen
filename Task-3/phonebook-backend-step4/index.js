const express = require("express");
const app = express();

// This is the hardcoded data for the Phonebook
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

// Route to get all persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// Route to get info
app.get("/info", (request, response) => {
  const count = persons.length;
  const date = new Date();

  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `);
});

// Route to get one person
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// Route to delete a single person's entry
app.delete("/api/persons/:id", (request, response) => {
  // 1. Capture the ID from the URL parameters
  const id = request.params.id;

  // 2. We overwrite the 'persons' array with a new version.
  // .filter() creates a new array containing only the items
  // where the condition (person.id !== id) is TRUE.
  persons = persons.filter((person) => person.id !== id);

  // 3. Status 204 means "No Content".
  // Even if the ID didn't exist in the first place,
  // we usually return 204 to say the end state (item is gone) is achieved.
  response.status(204).end();
});

//port
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
