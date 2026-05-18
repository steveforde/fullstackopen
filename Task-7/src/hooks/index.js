import { useState, useEffect } from "react";
import anecdoteService from "../services/anecdotes"; // Import the provided fetch service

// --- 7.1 & 7.2 form field state manager hook ---
export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return {
    type,
    value,
    onChange,
    reset,
  };
};

// --- 7.4, 7.5 & 7.6 server communication hook ---
export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  // 7.4: Fetch all entries from backend database on mount
  useEffect(() => {
    anecdoteService.getAll().then((initialAnecdotes) => {
      setAnecdotes(initialAnecdotes);
    });
  }, []);

  // 7.5: Post a new entry to the server database and sync state
  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteService.createNew(anecdote);
    setAnecdotes((prev) => prev.concat(newAnecdote));
  };

  // 7.6: Remove an entry from the database and filter it out of state
  const deleteAnecdote = async (id) => {
    await anecdoteService.remove(id);
    setAnecdotes((prev) => prev.filter((a) => a.id !== id));
  };

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote,
  };
};
