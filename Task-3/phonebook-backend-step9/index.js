require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person') // Import our MongoDB 'Person' model

app.use(express.static('dist')) // Serve the frontend (React) files
app.use(express.json()) // Allow the server to read JSON data from requests

// 1. MORGAN LOGGING: Shows what we sent to the server in the terminal
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)

// 2. GET ALL: Fetch every person from the database
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => next(error)) // If DB fails, tell the error handler
})

// 3. GET INFO: Shows how many people are in the phonebook
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      const date = new Date()
      response.send(
        `<p>Phonebook has info for ${count} people</p><p>${date}</p>`,
      )
    })
    .catch((error) => next(error))
})

// 4. GET ONE: Find a specific person by their ID
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end() // If ID is valid format but not found
      }
    })
    .catch((error) => next(error)) // If ID is totally malformed
})

// 5. DELETE: Remove a person from the database
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end() // 204 means "Success, nothing more to say"
    })
    .catch((error) => next(error))
})

// 6. POST: Create a new person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // Manual check for missing data
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  // Check for duplicate names
  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        // This is where we send a nice error instead of crashing!
        return response.status(400).json({ error: 'name must be unique' })
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      })

      return person.save() // Save the new person
    })
    .then((savedPerson) => {
      if (savedPerson) {
        response.json(savedPerson) // Return the person (including the new ID)
      }
    })
    .catch((error) => next(error))
})

// 7. PUT: Update an existing person's number
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { returnDocument: 'after', runValidators: true, context: 'query' },
  )
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error)) // This sends validation errors to your error handler!
})

// 8. ERROR HANDLER: The central hub for all problems
const errorHandler = (error, request, response, next) => {
  console.error('Error Message:', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    // This catches the 'name too short' or 'number too short' errors
    return response.status(400).json({ error: error.message })
  }

  next(error) // Pass any unknown errors to Express default handler
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
