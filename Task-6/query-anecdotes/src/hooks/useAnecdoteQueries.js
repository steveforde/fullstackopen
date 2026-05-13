import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, createAnecdote, updateAnecdote } from "../requests";

/**
 * useAnecdoteQueries Hook
 * A custom hook that centralizes all TanStack Query logic for the application.
 * This abstracts data fetching and mutations away from the components,
 * following the principle of Separation of Concerns.
 */
export const useAnecdoteQueries = () => {
  const queryClient = useQueryClient();

  /**
   * Fetching Logic: useQuery
   * - queryKey: Identifies this specific data in the cache.
   * - queryFn: The actual Axios call to get data from the server.
   * - retry: Set to 1 to prevent excessive server hammering on failure.
   */
  const anecdotesQuery = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
  });

  /**
   * Create Logic: useMutation
   * Handles sending a POST request to add a new anecdote.
   * On success, it "invalidates" the cache, forcing TanStack Query to
   * re-fetch the list so the UI updates immediately.
   */
  const addMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
    },
  });

  /**
   * Vote Logic: useMutation
   * Handles updating an existing anecdote (PUT request).
   * Similar to 'add', it triggers a cache invalidation to keep the
   * vote counts synchronized across the UI.
   */
  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
    },
  });

  // Return the query and mutation objects to be used by components
  return { anecdotesQuery, addMutation, voteMutation };
};
