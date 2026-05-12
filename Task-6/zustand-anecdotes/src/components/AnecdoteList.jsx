// Import the custom hooks from our central store
import {
  useAnecdotes,
  useAnecdoteActions,
  useFilterValue,
  useNotificationActions,
} from "../store";

const AnecdoteList = () => {
  // Access the current list of anecdotes and the active filter string
  const anecdotes = useAnecdotes();
  const filter = useFilterValue();

  // Get the functions (actions) that change our state
  const { vote, deleteAnecdote } = useAnecdoteActions();
  const { showNotification } = useNotificationActions();

  // Helper function to bundle two actions together:
  // 1. Update the database/state (vote)
  // 2. Alert the user (showNotification)
  const handleVote = (anecdote) => {
    vote(anecdote.id);
    showNotification(`you voted '${anecdote.content}'`);
  };

  // Logic to process the data before rendering:
  // First, we filter by the text input (case-insensitive)
  // Second, we sort so the most voted anecdotes are at the top
  // Note: .toSorted() is a modern JS method that creates a new array without mutating the original
  const filteredAndSorted = anecdotes
    .filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase()),
    )
    .toSorted((a, b) => b.votes - a.votes);

  return (
    <div>
      {/* Map through our processed list to generate the HTML */}
      {filteredAndSorted.map((anecdote) => (
        <div key={anecdote.id} style={{ marginBottom: "10px" }}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}{" "}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {/* Exercise 6.11 logic: Conditional Rendering */}
            {/* If the expression before '&&' is true, the button is rendered. 
                Once a vote is added, this becomes false and the button disappears! */}
            {anecdote.votes === 0 && (
              <button
                style={{ marginLeft: "5px", color: "red" }}
                onClick={() => deleteAnecdote(anecdote.id)}
              >
                delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
