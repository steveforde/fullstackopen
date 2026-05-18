// Import my Blog model so I can talk to the database directly in these helpers
const Blog = require('../models/blog')

// 1. My "Seeding" Data:
// This is the standard set of data I want in my database at the start of every test.
// By having two blogs here, I know exactly what to expect (length should be 2).
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

// 2. The Database Snapshot:
// I'll use this function after a POST or DELETE request to see what's left in the DB.
const blogsInDb = async () => {
  // 'await' because I'm asking a server in the cloud for the list
  const blogs = await Blog.find({})

  // I map over them and call .toJSON() so the ID is 'id' instead of '_id'
  // and I'm working with a clean array of objects instead of Mongoose documents.
  return blogs.map((blog) => blog.toJSON())
}

// 3. Export these so my blog_api.test.js can use them
module.exports = {
  initialBlogs,
  blogsInDb,
}
