import { useParams } from "react-router-dom";

const UserDetail = ({ users, blogs = [] }) => {
  // default to empty array
  const { id } = useParams();
  const user = users?.find((u) => u.id === id);
  if (!user) return <p>Loading...</p>;

  // Ensure blogs is an array before filtering
  const userBlogs = (blogs || []).filter(
    (b) => b.user?.id === id || b.user === id,
  );



  return (
    <div style={{ padding: "20px" }}>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {/* 2. The Sort: Use (b - a) to put the HIGH numbers at the TOP */}
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
