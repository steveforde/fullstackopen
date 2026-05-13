import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationContextProvider } from "./NotificationContext";
import App from "./App";

/**
 * main.jsx
 * The entry point of the application where we wrap the root component
 * with the necessary Providers for global state management.
 */

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    {/* 
        NotificationContextProvider: 
        Our custom wrapper that provides the useReducer-based state 
        for the notification system to all components. 
    */}
    <NotificationContextProvider>
      <App />
    </NotificationContextProvider>
  </QueryClientProvider>,
);
