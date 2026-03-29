// 1. We pull in the Router from Express.
// Think of this as creating a specific "sub-menu" just for Blogs.
const blogsRouter = require('express').Router()

// 2. We import our Blog "Blueprint" (the Model).
// This tells the code what a Blog is allowed to look like (Title, URL, etc.)
const Blog = require('../models/blog')

// --- EXERCISE 4.8: FETCHING THE LIST ---
// We use 'async' because talking to a database takes time.
blogsRouter.get('/', async (request, response) => {
  // 'await' tells the code: "Pause here. Go to MongoDB, find every blog,
  // and don't move to the next line until you have them in your hand."
  const blogs = await Blog.find({})

  // Once the blogs are here, we send them back to the user as a JSON list.
  response.json(blogs)
})

// --- EXERCISE 4.10: SAVING A NEW ENTRY ---
blogsRouter.post('/', async (request, response) => {
  // We take the "package" (request.body) the user sent us
  // and wrap it in our Blog blueprint.
  const blog = new Blog(request.body)

  // 'await' again: We tell the database to save this new blog.
  // If the title or URL is missing, the Model we built will
  // throw an error right here, and Express 5 will handle it.
  const savedBlog = await blog.save()

  // 201 means "Created". We send the successfully saved blog
  // back so the user knows exactly what was stored.
  response.status(201).json(savedBlog)
})

// 3. We export this menu so our main app.js can use it.
module.exports = blogsRouter
