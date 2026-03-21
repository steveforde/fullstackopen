const express = require("express");
const morgan = require("morgan"); // 1. Import morgan
const app = express();

// This middleware allows the server to read JSON data from requests
app.use(express.json());
app.use(morgan("tiny"));

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

// FETCH ALL: This gets the full list of people
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// INFO PAGE: Shows count of people and current time
app.get("/info", (request, response) => {
  const count = persons.length;
  const date = new Date();

  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `);
});

// SEARCH ONE: This filters the list to find one person by ID
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// DELETE: This removes a person from the list by filtering them out
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end(); // 204 means success, nothing to show
});

// ADD PERSON: This creates a new entry with validation and a random ID
app.post("/api/persons", (request, response) => {
  const body = request.body;

  // Error Check 1: Missing name or number
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing, you need both",
    });
  }

  // Error Check 2: Duplicate name search
  const nameExists = persons.some((p) => p.name === body.name);
  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  // Generate a big random ID
  const randomId = Math.floor(Math.random() * 1000000);

  const person = {
    id: String(randomId),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
