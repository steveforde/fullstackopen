import { useAnecdoteQueries } from "./hooks/useAnecdoteQueries";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useNotify } from "./NotificationContext";

/**
 * App Component
 * The root component of the application. It orchestrates the data fetching
 * and manages the primary user interaction for voting on anecdotes.
 */
const App = () => {
  // Access the custom notification hook to trigger messages
  const notify = useNotify();

  // Extract server state and mutation logic from our custom query hook
  const { anecdotesQuery, voteMutation } = useAnecdoteQueries();

  /**
   * handleVote
   * Orchestrates the voting process by triggering a server mutation
   * and notifying the user of the successful action.
   */
  const handleVote = (anecdote) => {
    // Trigger the PUT request via TanStack Query mutation
    voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });

    // Display a confirmation message using the centralized notification hook
    notify(`anecdote '${anecdote.content}' voted`);
  };

  /**
   * Handle Loading State:
   * Provides feedback while TanStack Query is fetching the initial data.
   */
  if (anecdotesQuery.isLoading) return <div>loading data...</div>;

  /**
   * Handle Error State:
   * Displays a fallback UI if the communication with the JSON-server fails.
   */
  if (anecdotesQuery.isError)
    return <div>anecdote service not available...</div>;

  // Extract the data from the query result once loading is complete
  const anecdotes = anecdotesQuery.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      {/* Global notification bar */}
      <Notification />

      {/* Form for creating new anecdotes */}
      <AnecdoteForm />

      {/* Render the list of anecdotes fetched from the server */}
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
