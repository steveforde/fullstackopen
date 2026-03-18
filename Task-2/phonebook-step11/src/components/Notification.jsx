const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  // Check if it's an error or a success message for styling
  const className = message.toLowerCase().includes("error")
    ? "error"
    : "notification";

  return <div className={className}>{message}</div>;
};

export default Notification;
