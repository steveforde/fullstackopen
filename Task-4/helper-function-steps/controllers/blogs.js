// 1. Create a Router object from Express.
// This lets us define routes here and "plug" them into app.js later.
const blogsRouter = require('express').Router()

// 2. Import the Blog model (the blueprint we made in models/blog.js)
const Blog = require('../models/blog')

// --- GET All Blogs ---
blogsRouter.get('/', (request, response) => {
  // Use Mongoose .find({}) to get every single document in the collection
  Blog.find({}).then((blogs) => {
    // Send back the array of blogs as JSON
    response.json(blogs)
  })
})

// --- GET Single Blog by ID ---
blogsRouter.get('/:id', (request, response, next) => {
  // ':id' is a parameter we get from the URL (request.params.id)
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        // If the blog exists, send it back
        response.json(blog)
      } else {
        // If the ID is valid but doesn't exist, send 404 (Not Found)
        response.status(404).end()
      }
    })
    // If the ID is malformed, jump to the Error Handler middleware
    .catch((error) => next(error))
})

// --- POST (Create) a New Blog ---
blogsRouter.post('/', (request, response, next) => {
  const body = request.body // The data sent by the user

  // Create a new instance of the Blog model
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0, // Fallback: if no likes provided, set to 0
  })

  // Save to MongoDB
  blog
    .save()
    .then((savedBlog) => {
      // 201 means "Created Successfully"
      response.status(201).json(savedBlog)
    })
    .catch((error) => next(error))
})

// --- DELETE a Blog ---
blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      // 204 means "Success, but no content to send back"
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// --- PUT (Update) a Blog ---
blogsRouter.put('/:id', (request, response, next) => {
  const { title, author, url, likes } = request.body // Destructuring the data

  // Find the blog and apply the new data
  // { new: true } returns the updated document instead of the old one
  Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedBlog) => {
      response.json(updatedBlog)
    })
    .catch((error) => next(error))
})

// Export the router so app.js can use it
module.exports = blogsRouter
