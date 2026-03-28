// 1. We create a Router object from Express.
// This allows us to group all "blog-related" routes together.
const blogsRouter = require("express").Router();

// 2. Import the Blog model (the blueprint from models/blog.js)
const Blog = require("../models/blog");

// --- GET All Blogs ---
blogsRouter.get("/", (request, response) => {
  // Mongoose .find({}) returns all documents in the collection
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

// --- GET Single Blog by ID ---
blogsRouter.get("/:id", (request, response, next) => {
  // ':id' is a parameter from the URL (e.g., /api/blogs/123)
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        // If the ID format is correct but no blog exists, return 404
        response.status(404).end();
      }
    })
    // If the ID is a weird format, 'next(error)' sends it to the Error Handler
    .catch((error) => next(error));
});

// --- POST (Create) a New Blog ---
blogsRouter.post("/", (request, response, next) => {
  const body = request.body; // The JSON data sent by the user

  // Create a new instance of our Blog model
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0, // Logical OR: defaults to 0 if likes is missing
  });

  blog
    .save()
    .then((savedBlog) => {
      // 201 means "Created Successfully"
      response.status(201).json(savedBlog);
    })
    .catch((error) => next(error));
});

// --- DELETE a Blog ---
blogsRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      // 204 means "Success, but I have no content to send back"
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// --- PUT (Update) a Blog ---
blogsRouter.put("/:id", (request, response, next) => {
  // Using 'destructuring' to pull fields out of the request body
  const { title, author, url, likes } = request.body;

  // { new: true } makes Mongoose return the UPDATED version of the blog
  Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: "query" },
  )
    .then((updatedBlog) => {
      response.json(updatedBlog);
    })
    .catch((error) => next(error));
});

// Export the router so 'app.js' can plug it in
module.exports = blogsRouter;
