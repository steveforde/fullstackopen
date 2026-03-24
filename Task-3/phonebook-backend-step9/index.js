// Load environment variables from .env file
require("dotenv").config();

// Import libraries
const express = require("express");
const morgan = require("morgan");

// Create Express app
const app = express();

// Import Person model (MongoDB schema)
const Person = require("./models/person");

// Serve static frontend files (from "dist" folder)
app.use(express.static("dist"));

// Parse JSON body from requests (needed for POST/PUT)
app.use(express.json());

// Create custom Morgan token to log request body
morgan.token("body", (req) => JSON.stringify(req.body));

// Use Morgan middleware to log requests
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

// GET all persons
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons); // return all persons as JSON
  });
});

// GET info (count + current date)
app.get("/info", (request, response) => {
  Person.countDocuments({}).then((count) => {
    const date = new Date();
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
    `);
  });
});

// GET one person by ID
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person); // found → return it
      } else {
        response.status(404).end(); // not found
      }
    })
    .catch((error) => next(error)); // pass error to error handler
});

// DELETE a person by ID
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end(); // success, no content
    })
    .catch((error) => next(error)); // handle errors
});

// CREATE a new person
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  // Check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number missing" });
  }

  // Check if name already exists
  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        return response.status(400).json({ error: "name must be unique" });
      }

      // Create new person object
      const person = new Person({
        name: body.name,
        number: body.number,
      });

      return person.save(); // save to database
    })
    .then((savedPerson) => {
      if (savedPerson) {
        response.json(savedPerson); // return saved person
      }
    })
    .catch((error) => next(error)); // catch any database errors
});

// UPDATE a person by ID
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  // New updated data
  const person = {
    name: body.name,
    number: body.number,
  };

  // Find and update
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson); // return updated person
      } else {
        response.status(404).end(); // not found
      }
    })
    .catch((error) => next(error)); // handle errors
});

// ERROR HANDLER (catches errors from all routes)
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  // If ID format is invalid (not MongoDB ObjectId)
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error); // pass to default error handler if not handled
};

// Use the error handler
app.use(errorHandler);

// port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
