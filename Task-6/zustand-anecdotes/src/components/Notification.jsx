// Import the selector hook that grabs just the current message string
import { useNotificationValue } from "../store";

const Notification = () => {
  // We subscribe to the 'message' state in the store.
  // When the store updates (e.g., after a vote), this component re-renders.
  const message = useNotificationValue();

  // --- CONDITIONAL RENDERING ---
  // If the message is null or an empty string, we return null.
  // In React, returning null means "don't render anything to the DOM."
  if (!message) return null;

  // This style only exists inside this component.
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    color: "green", // Green color provides positive feedback to the user
  };

  return (
    <div style={style}>
      {/* The actual text (e.g., "you voted 'Limerick...'") goes here */}
      {message}
    </div>
  );
};

export default Notification;
