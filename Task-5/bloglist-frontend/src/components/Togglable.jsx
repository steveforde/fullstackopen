// Import React hooks and forwardRef utility
// useState: manages the component's visibility state
// useImperativeHandle: exposes methods to parent components via ref
// forwardRef: allows this component to receive a ref from its parent
import { useState, useImperativeHandle, forwardRef } from "react";

// forwardRef wraps the component to accept a ref argument from parent
// This ref is passed as the second parameter (first is props)
const Togglable = forwardRef((props, ref) => {
  // State variable: tracks whether the content is visible
  // visible = true → content shown, visible = false → content hidden
  const [visible, setVisible] = useState(false);

  // Style object for the button that toggles content OPEN
  // When visible is true → hide this button (display: "none")
  // When visible is false → show this button (display: "")
  const hideWhenVisible = { display: visible ? "none" : "" };

  // Style object for the content that toggles open/close
  // When visible is true → show content (display: "")
  // When visible is false → hide content (display: "none")
  const showWhenVisible = { display: visible ? "" : "none" };

  // Function that flips the visible state (true ↔ false)
  const toggleVisibility = () => {
    setVisible(!visible); // Toggle: if true becomes false, if false becomes true
  };

  // useImperativeHandle exposes methods to parent components via the ref
  // This allows App.js to call toggleVisibility() directly
  // Example: blogFormRef.current.toggleVisibility() from parent
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility, // Expose the toggle function to parent
    };
  });

  // Render the component
  return (
    <div>
      {/* Button container - only visible when content is HIDDEN */}
      {/* Clicking this button opens the content */}
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>
          {props.buttonLabel}{" "}
          {/* Label passed from parent (e.g., "new blog") */}
        </button>
      </div>

      {/* Content container - only visible when content is SHOWN */}
      {/* Clicking "cancel" button closes the content */}
      <div style={showWhenVisible}>
        {props.children}{" "}
        {/* This renders whatever is between the Togglable tags */}
        <button onClick={toggleVisibility}>cancel</button> {/* Close button */}
      </div>
    </div>
  );
});
Togglable.displayName = "Togglable";

export default Togglable;
