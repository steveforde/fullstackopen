const express = require("express");
const app = express();
app.use(express.json());

let notes = [
  {
    id: "1",
    content: "HTML is actually quite fun",
    important: false,
    date: new Date(),
  },
  {
    id: "2",
    content: "Browser can execute along with other things JavaScript",
    important: true,
    date: new Date(),
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
    date: new Date(),
  },
  {
    id: "4",
    content: "HTTP Status Code 404 means not found",
    important: true,
    date: new Date(),
  },
  {
    id: "5",
    content: "HTTP Status Code 200 means OK",
    important: true,
    date: new Date(),
  },
  {
    id: "6",
    content: "Steve is getting more familiar with express and nodejs",
    important: false,
    date: new Date(),
  },
];

// 1. Welcome Route
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// 2. GET all notes
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

// 3. GET a single note by ID
app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  console.log(`Fetching note with ID: ${id}`);

  const note = notes.find((n) => n.id === id);

  if (note) {
    response.json(note);
  } else {
    console.log(`Note ${id} not found.`);
    response.status(404).end();
  }
});

// 4. DELETE a note by ID
app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  console.log(`Deleting note with ID: ${id}`);

  notes = notes.filter((n) => n.id !== id);

  response.status(204).end();
});

// 5. POST a new note
app.post("/api/notes", (request, response) => {
  const body = request.body;
  console.log("Received new note:", body);
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: String(Math.floor(Math.random() * 1000)),
    date: new Date(),
  };

  notes = notes.concat(note);
  console.log("Added new note:", note);
  response.json(note);
});

// This tells the server how to handle "PUT" requests
app.put("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const body = request.body;

  // 1. Find the note in our list
  const note = notes.find((n) => n.id === id);

  if (note) {
    // 2. Create the updated version (flipping important to true)
    const updatedNote = { ...note, important: body.important };

    // 3. Swap the old note for the new one in the array
    notes = notes.map((n) => (n.id !== id ? n : updatedNote));

    console.log(`Updated note ${id} successfully!`);
    response.json(updatedNote);
  } else {
    // 4. If ID 666 isn't in the list, send a 404
    response.status(404).json({ error: "Note not found" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
