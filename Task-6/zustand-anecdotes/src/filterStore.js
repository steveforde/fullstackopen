// Import the 'create' function from Zustand to build our state container
import { create } from "zustand";

/**
 * FILTER STORE
 * This store manages the search text used to narrow down the anecdote list.
 * It is decoupled from the Anecdote Store to keep the logic organized.
 */
const useFilterStore = create((set) => ({
  // The 'filter' piece of state: starts as an empty string (no filtering)
  filter: "",

  // The 'action' used to update the filter:
  // It takes a 'value' (the text from the input field) and updates the 'filter' key.
  // Using set({ filter: value }) tells Zustand to merge this change into the state.
  setFilter: (value) => set({ filter: value }),
}));

// Export the store so components like Filter.jsx and AnecdoteList.jsx can use it
export default useFilterStore;
