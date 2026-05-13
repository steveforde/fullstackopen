import { useNotify } from "../NotificationContext";
import { useAnecdoteQueries } from "../hooks/useAnecdoteQueries";

/**
 * AnecdoteForm Component
 * Responsible for rendering the input form and handling the creation of new anecdotes.
 * It utilizes TanStack Query for server mutations and a custom Context hook for user feedback.
 */
const AnecdoteForm = () => {
  // Custom hook to trigger global notification messages with auto-clear logic
  const notify = useNotify();

  // Destructuring the addMutation function from our centralized query hook
  const { addMutation } = useAnecdoteQueries();

  /**
   * Form submission handler
   * Captures input, triggers the server mutation, and provides feedback based on the result.
   */
  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;

    // Trigger the mutation to save the new anecdote to the backend
    addMutation.mutate(
      { content, votes: 0 },
      {
        // Executes if the server successfully saves the data
        onSuccess: () => {
          event.target.anecdote.value = ""; // Clear the input field
          notify(`anecdote '${content}' created`);
        },
        // Executes if the server returns an error (e.g., validation failure)
        onError: (error) => {
          // Extracts error message from server response or provides a fallback
          const message =
            error.response?.data?.error ||
            "too short anecdote, must have length 5 or more";
          notify(message);
        },
      },
    );
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
