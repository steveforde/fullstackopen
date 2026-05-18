import { useParams } from "react-router-dom";

/**
 * UserDetail Component
 * Displays a single user's profile page showing their name and all blogs they've created.
 * Blogs are sorted by likes (most likes first).
 *
 * @param {Array} users - List of all users (passed from App.jsx)
 * @param {Array} blogs - List of all blogs (passed from App.jsx), defaults to empty array
 */
const UserDetail = ({ users, blogs = [] }) => {
  // blogs = [] ensures it's never undefined
  // useParams extracts the dynamic `:id` from the URL
  // Example: /users/123 → id = "123"
  const { id } = useParams();

  // Find the user object that matches the ID from the URL
  // users?.find() uses optional chaining (?.) in case users is undefined
  const user = users?.find((u) => u.id === id);

  // If user not found (still loading or invalid ID), show loading message
  if (!user) return <p>Loading...</p>;

  /**
   * Filter blogs to only show those belonging to this user.
   * Handles two cases:
   *   1. blog.user.id === id (when user object is populated)
   *   2. blog.user === id (when user is just an ID string)
   */
  const userBlogs = (blogs || []).filter(
    (b) => b.user?.id === id || b.user === id,
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* Display the user's full name */}
      <h2>{user.name}</h2>

      <h3>added blogs</h3>

      {/* Unordered list of the user's blogs */}
      <ul>
        {/*
          Steps for sorting:
          1. Create a copy of the array using spread operator [...userBlogs]
             (sort() mutates the original array, so we copy first)
          2. Sort by likes in descending order (highest first)
             Number(b.likes) - Number(a.likes) → positive means b comes first
          3. Map each blog to a list item
        */}
        {[...userBlogs]
          .sort((a, b) => Number(b.likes) - Number(a.likes))
          .map((blog) => (
            <li key={blog.id}>
              {blog.title} — <strong>{blog.likes} likes</strong>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UserDetail;
