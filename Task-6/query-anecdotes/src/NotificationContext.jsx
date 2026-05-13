import { createContext, useReducer, useContext } from "react";

/**
 * Reducer function for managing notification state.
 * State is a simple string (the message) or null (no message).
 * Actions:
 * - SET: Updates the message with the provided payload.
 * - CLEAR: Resets the state to null.
 */
const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "CLEAR":
      return null;
    default:
      return state;
  }
};

// Initialize the Context object
const NotificationContext = createContext();

/**
 * Provider Component
 * This wraps the application (or a part of it) to provide the
 * notification state and dispatch function to all children.
 */
export const NotificationContextProvider = (props) => {
  // useReducer manages the state transitions based on the notificationReducer logic
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null,
  );

  return (
    // We pass both the state and the dispatch function as a pair in an array
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

/**
 * Custom hook: useNotificationValue
 * Returns only the current notification string.
 * Used by the Notification component to display the message.
 */
export const useNotificationValue = () => {
  const context = useContext(NotificationContext);
  return context[0];
};

/**
 * Custom hook: useNotificationDispatch
 * Returns only the dispatch function.
 * Internal use only, usually preferred to use useNotify instead.
 */
export const useNotificationDispatch = () => {
  const context = useContext(NotificationContext);
  return context[1];
};

/**
 * Custom hook: useNotify
 * A high-level abstraction hook. Instead of manually dispatching actions
 * and setting timers in components, this hook returns a single function
 * that handles the entire lifecycle of a notification.
 */
export const useNotify = () => {
  const dispatch = useNotificationDispatch();

  // Returns a function that sets a message and automatically clears it after 5 seconds
  return (payload) => {
    dispatch({ type: "SET", payload });
    setTimeout(() => {
      dispatch({ type: "CLEAR" });
    }, 5000);
  };
};

export default NotificationContext;
