import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set, get) => ({
  blogs: [],

  // Fetch all blogs from the backend (Exercise 7.12)
  initializeBlogs: async () => {
    try {
      const data = await blogService.getAll()
      // Ensure data is a valid array before attempting to sort it
      const blogArray = Array.isArray(data) ? data : []
      const sortedBlogs = [...blogArray].sort((a, b) => b.likes - a.likes)

      set({ blogs: sortedBlogs })
    } catch (error) {
      console.error('Failed to initialize blogs:', error)
    }
  },

  // Add a new blog (Exercise 7.12)
  addBlog: async (blogObject, user) => {
    const returnedBlog = await blogService.create(blogObject)
    const blogWithUser = {
      ...returnedBlog,
      user: {
        username: user.username,
        name: user.name,
        id: user.id || returnedBlog.user
      }
    }
    set((state) => ({
      blogs: state.blogs.concat(blogWithUser)
    }))
    return blogWithUser
  },

  // Like a blog (Exercise 7.13)
  likeBlog: async (id, blogObject) => {
    const returnedBlog = await blogService.update(id, blogObject)
    const currentBlogs = get().blogs
    const blogToUpdate = currentBlogs.find((b) => b.id === id)
    const updatedBlogWithUser = { ...returnedBlog, user: blogToUpdate.user }

    const updatedList = currentBlogs
      .map((b) => (b.id !== id ? b : updatedBlogWithUser))
      .sort((a, b) => b.likes - a.likes)

    set({ blogs: updatedList })
  },

  // Delete a blog (Exercise 7.13)
  deleteBlog: async (id) => {
    await blogService.remove(id)
    set((state) => ({
      blogs: state.blogs.filter((b) => b.id !== id)
    }))
  },

  // --- EXERCISE 7.19: COMMENTS BACKEND DISPATCHER ---
  // Fires our dedicated backend POST router route and cleanly synchronizes state
  addCommentToBlog: async (id, commentContent) => {
    try {
      // Dispatches HTTP POST connection pipeline to api/blogs/:id/comments
      const updatedBlogFromServer = await blogService.createComment(
        id,
        commentContent
      )

      const currentBlogs = get().blogs

      // Map across global runtime state array, substituting the older instance
      // out with the verified payload array directly from MongoDB
      const updatedList = currentBlogs.map((b) =>
        b.id !== id ? b : updatedBlogFromServer
      )

      set({ blogs: updatedList })
    } catch (error) {
      console.error('Failed to append comment to global state:', error)
      throw error // Re-throw to allow component view handlers to intercept errors
    }
  }
}))

export default useBlogStore
