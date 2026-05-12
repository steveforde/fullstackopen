import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Notification from "./components/Notification";
import { useEffect } from "react";
// We import our actions from the store to interact with the backend
import { useFilterActions, useAnecdoteActions } from "./store";

/**
 * FILTER COMPONENT
 * Even though this is in the same file, it's a separate functional component.
 * It captures user input and sends it to the Zustand store.
 */
const Filter = () => {
  const { setFilter } = useFilterActions();

  return (
    <div style={{ marginBottom: 10 }}>
      {/* Every change in the input updates the global 'filter' state immediately */}
      filter <input onChange={(e) => setFilter(e.target.value)} />
    </div>
  );
};

/**
 * MAIN APP COMPONENT
 * The entry point for your UI.
 */
const App = () => {
  // We grab the initialization action from the store
  const { initAnecdotes } = useAnecdoteActions();

  /**
   * THE HOOK THAT STARTS IT ALL
   * useEffect runs 'side effects'. In this case, fetching data.
   * By passing [] or [initAnecdotes] as the dependency array, this code
   * runs EXACTLY ONCE when the browser finishes loading the app.
   */
  useEffect(() => {
    // This triggers the GET request to http://localhost:3001/anecdotes
    initAnecdotes();
  }, [initAnecdotes]);

  // Basic layout styling to keep the UI clean
  const containerStyle = {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "10px",
  };

  return (
    <div style={containerStyle}>
      <h2>Anecdotes</h2>
      {/* Components are rendered in order. 
         Notification is at the top so users always see feedback first.
      */}
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
