// 1. We pull in the Router from Express.
// Think of this as creating a specific "sub-menu" just for Blogs.
const blogsRouter = require('express').Router()

// 2. We import our Blog "Blueprint" (the Model).
// This tells the code what a Blog is allowed to look like (Title, URL, etc.)
const Blog = require('../models/blog')

const User = require('../models/user') // 1. Don't forget to import the User model!

// --- EXERCISE 4.8: FETCHING THE LIST ---
// We use 'async' because talking to a database takes time.
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 }) // This "joins" the user data

  response.json(blogs)
})

// --- EXERCISE 4.10: SAVING A NEW ENTRY ---
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // 2. Fetch all users and just pick the first one from the list
  const users = await User.find({})
  const user = users[0]

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id, // 3. Put the User's ID into the blog
  })

  const savedBlog = await blog.save()

  // 4. IMPORTANT: Update the User's list of blogs too!
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// 4.13: DELETE a single blog
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  // 204 No Content is the standard for a successful deletion
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
