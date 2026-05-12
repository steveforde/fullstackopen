import { create } from "zustand";

// The URL of our 'json-server' backend.
// Using a variable makes it easy to change if we move to a real production server later.
const baseUrl = "http://localhost:3001/anecdotes";

// --- ANECDOTE STORE ---
// This store manages our main data and talks to the server.
export const useAnecdoteStore = create((set, get) => ({
  anecdotes: [], // The local 'cache' of data currently visible in the app
  actions: {
    // GET: Fetches the entire list from the server when the app starts
    initAnecdotes: async () => {
      const response = await fetch(baseUrl);
      const data = await response.json();
      set({ anecdotes: data }); // Replaces the local array with server data
    },

    // POST: Sends a brand new anecdote to the server
    addAnecdote: async (content) => {
      const newObject = { content, votes: 0 };
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newObject),
      });
      const savedAnecdote = await response.json(); // The server returns the object + a unique ID
      // Update local state by appending the new object
      set((state) => ({ anecdotes: [...state.anecdotes, savedAnecdote] }));
    },

    // PUT: Updates an existing object on the server
    vote: async (id) => {
      // 1. Find the specific object in our local state using its ID
      const anecdoteToChange = get().anecdotes.find((a) => a.id === id);

      // 2. Create a modified copy (don't mutate the original!)
      const updatedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };

      // 3. Tell the server to replace the old version with this updated version
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAnecdote),
      });
      const savedAnecdote = await response.json();

      // 4. Update local state: replace the old anecdote with the one returned by the server
      set((state) => ({
        anecdotes: state.anecdotes.map((a) =>
          a.id !== id ? a : savedAnecdote,
        ),
      }));
    },

    // DELETE: Removes an object from the server and local state
    deleteAnecdote: async (id) => {
      await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
      // Filter out the deleted item from our local list
      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id),
      }));
    },
  },
}));

// Selectors for Anecdotes
export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes);
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);

// --- FILTER STORE ---
export const useFilterStore = create((set) => ({
  filter: "",
  setFilter: (filter) => set({ filter }),
}));

// Selectors for Filter
export const useFilterValue = () => useFilterStore((state) => state.filter);
export const useFilterActions = () => {
  const setFilter = useFilterStore((state) => state.setFilter);
  return { setFilter };
};

// --- NOTIFICATION STORE ---
// We keep timeoutId OUTSIDE the store so it doesn't trigger re-renders
let timeoutId = null;

export const useNotificationStore = create((set) => ({
  message: null,
  showNotification: (message) => {
    // IF a notification is already running, cancel the old timer!
    // This prevents the new message from disappearing too early.
    if (timeoutId) clearTimeout(timeoutId);

    set({ message });

    // Set a fresh timer to clear the message after 5 seconds
    timeoutId = setTimeout(() => {
      set({ message: null });
      timeoutId = null;
    }, 5000);
  },
}));

// Selectors for Notification
export const useNotificationValue = () =>
  useNotificationStore((state) => state.message);
export const useNotificationActions = () => {
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );
  return { showNotification };
};
