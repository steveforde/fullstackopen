const blogsRouter = require("express").Router(); // 1. Router name is fine, but we'll use it for blogs
const Blog = require("../models/blog"); // 2. Change 'Person' to 'Blog' and path to '../models/blog'

// GET all blogs
blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    // 3. Use Blog models
    response.json(blogs);
  });
});

// GET single blog by ID
blogsRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id) // 4. Use Blog model
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// POST a new blog
blogsRouter.post("/", (request, response, next) => {
  const body = request.body;

  const blog = new Blog({
    // 5. Create new Blog instance
    title: body.title, // 6. Use Blog fields (title, author, url, likes)
    author: body.author,
    url: body.url,
    likes: body.likes || 0, // Default to 0 likes if not provided
  });

  blog
    .save()
    .then((savedBlog) => {
      response.status(201).json(savedBlog); // Exercise 4.1 asks for status 201
    })
    .catch((error) => next(error));
});

// DELETE a blog
blogsRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id) // 7. Use Blog model
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// PUT (update) a blog
blogsRouter.put("/:id", (request, response, next) => {
  const { title, author, url, likes } = request.body; // 8. Destructure Blog fields

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

module.exports = blogsRouter; // 9. Export the blogsRouter
