// 1. We pull in the Router from Express.
// Think of this as creating a specific "sub-menu" just for Blogs.
const blogsRouter = require('express').Router()

// 2. We import our Blog "Blueprint" (the Model).
// This tells the code what a Blog is allowed to look like (Title, URL, etc.)
const Blog = require('../models/blog')

const User = require('../models/user') // 1. Don't forget to import the User model!
const jwt = require('jsonwebtoken') // Top of file

// --- EXERCISE 4.8: FETCHING THE LIST ---
// We use 'async' because talking to a database takes time.
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 }) // This "joins" the user data

  response.json(blogs)
})

// --- EXERCISE 4.10 & 4.19: SAVING A NEW ENTRY ---
blogsRouter.post('/', async (request, response) => {
  const user = request.user // Already found by middleware!

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user.id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

// 4.13: DELETE a single blog
// 4.13 & 4.21: DELETE a single blog
blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user // 1. Middleware already found the user for us!

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // 2. Compare the blog creator's ID with the ID of the user from the token
  if (blog.user.toString() !== user.id.toString()) {
    return response
      .status(401)
      .json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// 4.14: UPDATE (PUT) a blog's likes
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes,
  }

  // { new: true } makes sure the 'updatedBlog' variable contains the
  // NEW data, not the old data from before the update.
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    returnDocument: 'after',
  })

  response.json(updatedBlog)
})

// 3. We export this menu so our main app.js can use it.
module.exports = blogsRouter
