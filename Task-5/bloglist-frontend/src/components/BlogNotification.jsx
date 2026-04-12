// BlogNotification component - displays temporary status messages to the user
// Receives two props:
// - message: the text content to display (string or null)
// - type: determines the message style ("error" or "success")
const BlogNotification = ({ message, type }) => {
  // Guard clause: if there's no message (null), render nothing
  // This prevents an empty notification box from appearing
  if (message === null) {
    return null; // Return null = render nothing in React
  }

  // Dynamic inline styles based on notification type
  const style = {
    // Ternary operator: red for errors, green for success messages
    color: type === "error" ? "red" : "green",

    // Common styling for both error and success types
    background: "lightgrey", // Light gray background
    fontSize: 20, // 20 pixel font size
    borderStyle: "solid", // Solid border
    borderRadius: 5, // Slightly rounded corners (5px radius)
    padding: 10, // 10px padding inside the box
    marginBottom: 10, // 10px space below the notification
  };

  // Render the notification div with:
  // - Inline styles (style object)
  // - CSS class name "error" (useful for CSS frameworks or testing selectors)
  // - The message text as content
  return (
    <div style={style} className="error">
      {message}
    </div>
  );
};

// Export component so it can be used elsewhere (e.g., in App.jsx)
export default BlogNotification;
