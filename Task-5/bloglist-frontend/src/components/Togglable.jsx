import { useState, useImperativeHandle, forwardRef } from "react";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";

/**
 * Togglable Component
 * A reusable component that hides/shows its children content.
 *
 * Common use case: "Create new blog" form – shows form when button is clicked,
 * hides it when "cancel" is clicked.
 *
 * @param {string} props.buttonLabel - Text on the toggle button (e.g., "create new blog")
 * @param {ReactNode} props.children - Content to show/hide (e.g., the BlogForm)
 * @param {React.Ref} ref - Forwarded ref to expose toggleVisibility method to parent
 */
const Togglable = forwardRef((props, ref) => {
  // State: true = content visible, false = content hidden
  const [visible, setVisible] = useState(false);

  /**
   * Inline styles for conditional rendering.
   * When visible is true: hideWhenVisible has display: "none" (hides the open button)
   * When visible is false: showWhenVisible has display: "none" (hides the content and cancel button)
   */
  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  /**
   * Toggles the visibility state between true/false.
   * Called when "create new blog" button is clicked (opens form)
   * Called when "cancel" button is clicked (closes form)
   */
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  /**
   * useImperativeHandle exposes the toggleVisibility function to parent components
   * via the ref prop. This allows the parent (App.jsx) to close the form
   * programmatically after a blog is created.
   *
   * Example in App.jsx: blogFormRef.current.toggleVisibility()
   */
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <Box sx={{ mb: 3 }}>
      {" "}
      {/* mb = margin-bottom (spacing) */}
      {/* 1. The "Open" Button (e.g., 'create new blog') */}
      {/* Only visible when the content is HIDDEN (hideWhenVisible) */}
      <Box style={hideWhenVisible}>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleVisibility} // Clicking opens the form
          startIcon={<AddIcon />} // Plus icon before the text
          sx={{ fontWeight: "bold", textTransform: "none" }} // textTransform: "none" keeps original casing
        >
          {props.buttonLabel} // e.g., "create new blog"
        </Button>
      </Box>
      {/* 2. The Content and the "Cancel" Button */}
      {/* Only visible when the content is SHOWN (showWhenVisible) */}
      <Box style={showWhenVisible}>
        {props.children} {/* This is where BlogForm gets rendered */}
        <Button
          variant="outlined"
          color="error" // Red color for cancel button
          onClick={toggleVisibility} // Clicking closes the form
          startIcon={<CancelIcon />} // X icon before the text
          sx={{ mt: 1, fontWeight: "bold", textTransform: "none" }} // mt = margin-top
        >
          cancel
        </Button>
      </Box>
    </Box>
  );
});

// Sets a display name for debugging in React DevTools
Togglable.displayName = "Togglable";

export default Togglable;
