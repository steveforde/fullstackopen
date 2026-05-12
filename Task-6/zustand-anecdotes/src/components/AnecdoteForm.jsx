// Import the custom hook we created in store.js to access our actions
import { useAnecdoteActions } from "../store";

const AnecdoteForm = () => {
  // Destructure the addAnecdote function from our store's actions
  // This function is 'async' behind the scenes, handling the POST request to our backend
  const { addAnecdote } = useAnecdoteActions();

  // The event handler for when the form is submitted
  const onCreate = (event) => {
    // 1. Prevent the default browser behavior (which would reload the page)
    event.preventDefault();

    // 2. Extract the string value from the input field named "anecdote"
    const content = event.target.anecdote.value;

    // 3. Clear the input field immediately after grabbing the text for a better user experience
    event.target.anecdote.value = "";

    // 4. Send the new anecdote content to our Zustand store
    // The store will handle the 'fetch' POST request to http://localhost:3001/anecdotes
    addAnecdote(content);
  };

  return (
    <div>
      <h2>create new</h2>
      {/* Attach our handler to the onSubmit event of the form */}
      <form onSubmit={onCreate}>
        <div>
          {/* We give the input a name attribute so we can easily find it in the 'event' object */}
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
