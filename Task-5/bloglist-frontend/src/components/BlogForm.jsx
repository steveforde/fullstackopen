// Import the useState hook from React to manage local component state
import { useState } from "react";

// Define BlogForm component that receives createBlog function as a prop
// createBlog is a callback function that will be called when a new blog is submitted
const BlogForm = ({ createBlog }) => {
  // Declare state variables for each form field
  // title state - stores the blog post title
  const [title, setTitle] = useState("");
  // author state - stores the blog post author name
  const [author, setAuthor] = useState("");
  // url state - stores the blog post URL/link
  const [url, setUrl] = useState("");

  // Handler function called when the form is submitted
  const addBlog = (event) => {
    // Prevent default browser form submission (which would reload the page)
    event.preventDefault();

    // Call the createBlog function passed from parent component
    // Pass an object containing the current form values
    createBlog({
      title: title, // Current title state value
      author: author, // Current author state value
      url: url, // Current url state value
    });

    // Clear all form fields after successful submission
    setTitle(""); // Reset title input to empty
    setAuthor(""); // Reset author input to empty
    setUrl(""); // Reset url input to empty
  };

  // Render the form JSX
  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="title" // <--- Added for the test
          />
        </div>

        <div>
          author:
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="author" // <--- Added for the test
          />
        </div>

        <div>
          url:
          <input
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="url" // <--- Added for the test
          />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  );
};

// Export component so it can be imported by parent components (like App.jsx)
export default BlogForm;
