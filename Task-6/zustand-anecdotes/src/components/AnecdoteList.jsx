import { useAnecdotes, useAnecdoteActions } from "../store";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const { vote } = useAnecdoteActions();

  // Exercise 6.5: Sort by votes (Descending)
 const sorted = anecdotes.toSorted((a, b) => b.votes - a.votes);

  return (
    <div>
      {sorted.map((anecdote) => (
        <div key={anecdote.id} style={{ marginBottom: "10px" }}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}{" "}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
