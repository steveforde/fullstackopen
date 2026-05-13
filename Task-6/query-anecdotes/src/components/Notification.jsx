import { useNotificationValue } from "../NotificationContext";

/**
 * Notification Component
 * This component acts as a global message bar. It subscribes to the
 * notification state and only renders when a message exists.
 */
const Notification = () => {
  // Pulls the current notification string from the global context state
  const notification = useNotificationValue();

  // Inline styling for the notification box
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  /**
   * Conditional Rendering:
   * If the notification state is null (our default state), we return null.
   * This prevents an empty box from appearing on the screen when there is no message.
   */
  if (!notification) return null;

  return <div style={style}>{notification}</div>;
};

export default Notification;
