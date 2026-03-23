require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Person = require("./models/person");

app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  Person.countDocuments({}).then((count) => {
    const date = new Date();
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
    `);
  });
});

// 1. Updated GET with 'next'
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error)); // Pass error to specialist
});

// 2. Updated DELETE with 'next'
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error)); // Pass error to specialist
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number missing" });
  }

  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        // We handle this manually because we know the exact problem
        return response.status(400).json({ error: "name must be unique" });
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      });

      // We return this save so the NEXT .then handles the success
      return person.save();
    })
    .then((savedPerson) => {
      if (savedPerson) {
        // This check prevents crashing if the duplicate check triggered
        response.json(savedPerson);
      }
    })
    .catch((error) => next(error)); // This catches ANY database crash
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  // findByIdAndUpdate takes (id, newObject, options)
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// 3. The Error Handler Specialist (MUST be at the bottom)
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error); // Forward to default Express error handler
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
