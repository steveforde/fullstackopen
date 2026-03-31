// 1. We pull in the Router from Express.
// Think of this as creating a specific "sub-menu" just for Blogs.
const blogsRouter = require('express').Router()

// 2. We import our Blog "Blueprint" (the Model).
// This tells the code what a Blog is allowed to look like (Title, URL, etc.)
const Blog = require('../models/blog')

// Import the User model so we can update user documents when blogs are created
const User = require('../models/user')
// Import jsonwebtoken - though it's imported here, the actual token verification
// happens in middleware before requests reach these routes
const jwt = require('jsonwebtoken') // Top of file

// --- EXERCISE 4.8: FETCHING THE LIST ---
// We use 'async' because talking to a database takes time.
blogsRouter.get('/', async (request, response) => {
  // Find all blogs in the database
  // .populate() is like a SQL JOIN - it replaces the user ID with the actual user data
  // The second argument { username: 1, name: 1 } tells Mongoose to only include
  // the username and name fields from the user document, not the entire user object
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  // Send the blogs array back as JSON
  response.json(blogs)
})

// --- EXERCISE 4.10 & 4.19: SAVING A NEW ENTRY ---
blogsRouter.post('/', async (request, response) => {
  // The user is already attached to the request object by the token-extracting middleware
  // This middleware runs before this route handler and verifies the JWT token
  const user = request.user

  // If there's no user (token missing, invalid, or expired), reject the request
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // Create a new Blog instance with data from the request body
  const blog = new Blog({
    title: request.body.title, // Blog title (required)
    author: request.body.author, // Blog author name
    url: request.body.url, // Blog URL (required)
    likes: request.body.likes || 0, // If likes not provided, default to 0
    user: user.id, // Associate this blog with the authenticated user
  })

  // Save the blog to the database
  const savedBlog = await blog.save()

  // Update the user's blogs array to include this new blog's ID
  // This creates a two-way relationship: blog has user reference, user has blogs array
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  // Return the saved blog with status 201 (Created)
  response.status(201).json(savedBlog)
})

// 4.13: DELETE a single blog
// 4.13 & 4.21: DELETE a single blog
blogsRouter.delete('/:id', async (request, response) => {
  // The authenticated user is attached by middleware
  const user = request.user

  // Verify authentication
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // Find the blog to be deleted by its ID from the URL parameter
  const blog = await Blog.findById(request.params.id)

  // If blog doesn't exist, return 404 Not Found
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // Authorization check: only the user who created the blog can delete it
  // Convert both IDs to strings to ensure proper comparison (they might be ObjectId objects)
  if (blog.user.toString() !== user.id.toString()) {
    return response
      .status(401)
      .json({ error: 'only the creator can delete this blog' })
  }

  // Delete the blog from the database
  await Blog.findByIdAndDelete(request.params.id)

  // Return 204 No Content - successful deletion with no response body
  response.status(204).end()
})

// 4.14: UPDATE (PUT) a blog's likes
blogsRouter.put('/:id', async (request, response) => {
  // Extract the request body data
  const body = request.body

  // Create an object with the fields to update
  // In this case, we're only updating the likes count
  const blog = {
    likes: body.likes,
  }

  // Find the blog by ID and update it
  // returnDocument: 'after' makes sure the 'updatedBlog' variable contains the
  // NEW data after the update, not the old data from before the update.
  // Without this, updatedBlog would contain the document as it was BEFORE the update
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id, // The ID of the blog to update
    blog, // The updates to apply
    {
      returnDocument: 'after', // Return the updated document
    },
  )

  // Return the updated blog as JSON
  response.json(updatedBlog)
})

// 3. We export this menu so our main app.js can use it.
// This allows the main app to mount these routes with something like:
// app.use('/api/blogs', blogsRouter)
module.exports = blogsRouter
