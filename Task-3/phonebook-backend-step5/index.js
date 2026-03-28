const express = require("express");
const app = express();

app.use(express.json());

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

// Route to get one person by id
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// Route to delete a person by id
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

// Route to add a new entry to the phonebook
app.post("/api/persons", (request, response) => {
  const body = request.body;

  // 1. Validation Check:
  // If the user forgot the name or the number, we stop immediately.
  // We use 'return' so the rest of the function doesn't run.
  if (!body.name || !body.number) {
    // 400 Bad Request: The client sent us incomplete data
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  // 2. ID Generation:
  // Since we don't have a database yet, we create a large random number.
  // We wrap it in String() because our existing IDs are strings.
  const randomId = Math.floor(Math.random() * 1000000);

  // 3. Object Creation:
  // We build the new person object using the data from 'body'
  const person = {
    id: String(randomId),
    name: body.name,
    number: body.number,
  };

  // 4. Updating the State:
  // .concat() is used instead of .push() because it creates a
  // NEW array, which is a cleaner way to handle data updates.
  persons = persons.concat(person);

  // 5. Success Response:
  // We send back the newly created person object
  response.json(person);
});

//port
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
