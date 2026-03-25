const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  // If the message starts with 'Error', use the .error class
  // Otherwise, use the .notification class
  const className = message.includes("Error") ? "error" : "notification";

  return <div className={className}>{message}</div>;
};

export default Notification;
