import axios from "axios";

/**
 * Base URL for the JSON-server backend.
 * Centralizing this allows for easy configuration if the API moves
 * to a different environment (e.g., production).
 */
const baseUrl = "http://localhost:3001/anecdotes";

/**
 * Fetches all anecdotes from the server.
 * Returns the data array directly to the caller by unwrapping
 * the Axios response object.
 */
export const getAnecdotes = () => axios.get(baseUrl).then((res) => res.data);

/**
 * Sends a POST request to create a new anecdote.
 * @param {Object} newAnecdote - The anecdote object to be saved.
 * Returns the saved object, including the server-generated ID.
 */
export const createAnecdote = (newAnecdote) =>
  axios.post(baseUrl, newAnecdote).then((res) => res.data);

/**
 * Sends a PUT request to update an existing anecdote (e.g., voting).
 * @param {Object} updated - The complete anecdote object with updated values.
 * Uses the anecdote's ID in the URL to target the specific resource.
 */
export const updateAnecdote = (updated) =>
  axios.put(`${baseUrl}/${updated.id}`, updated).then((res) => res.data);
