import { useState, useImperativeHandle, forwardRef } from "react";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <Box sx={{ mb: 3 }}>
      {/* 1. The "Open" Button (e.g., 'create new blog') */}
      <Box style={hideWhenVisible}>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleVisibility}
          startIcon={<AddIcon />}
          /* FIX: textTransform: "none" ensures "create new blog" stays lowercase */
          sx={{ fontWeight: "bold", textTransform: "none" }}
        >
          {props.buttonLabel}
        </Button>
      </Box>

      {/* 2. The Content and the "Cancel" Button */}
      <Box style={showWhenVisible}>
        {props.children}

        <Button
          variant="outlined"
          color="error"
          onClick={toggleVisibility}
          startIcon={<CancelIcon />}
          /* FIX: textTransform: "none" and lowercase "cancel" */
          sx={{ mt: 1, fontWeight: "bold", textTransform: "none" }}
        >
          cancel
        </Button>
      </Box>
    </Box>
  );
});

Togglable.displayName = "Togglable";

export default Togglable;
