import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // This updates the state so the next render shows the fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // You can log the error details to a service here if needed
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // This matches the exact style shown in your screenshot!
      return (
        <div style={{ padding: "20px" }}>
          <h2>Something went wrong :(</h2>
          <p>Please make a bug report to mluukkai in Discord</p>
        </div>
      );
    }

    // If there is no error, just render the normal page elements
    return this.props.children;
  }
}

export default ErrorBoundary;
