import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Import Router for client‑side routing
import App from "./App";

// Create a React root and render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  // Router provides routing context so that <Link> and <Route> components work
  <Router>
    <App />
  </Router>,
);
