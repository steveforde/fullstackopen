const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

// 1. DEFINING A CUSTOM TOKEN
// We tell Morgan: "Whenever you see :body, run this function."
// It takes the request (req.body) and turns it into a readable string.
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

// 2. APPLYING THE CUSTOM FORMAT
// We manually list the pieces of info we want, ending with our new :body token.
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

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

// DELETE: This removes a person by ID
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end(); // 204 means success, nothing to show
});

// ADD PERSON:
app.post("/api/persons", (request, response) => {
  const body = request.body;

  //error handling
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing, you need both",
    });
  }

  //error handling
  const nameExists = persons.some((p) => p.name === body.name);
  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  // Generate a random id
  const randomId = Math.floor(Math.random() * 1000000);

  request.body.id = randomId;

  // Add the new person
  const person = {
    id: String(randomId),
    name: body.name,
    number: body.number,
  };

  // Add the new person
  persons = persons.concat(person);
  response.json(person);
});

//port
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
