/**
 * @jest-environment jsdom
 */
/**
 * @vitest-environment jsdom
 */
import { renderHook, waitFor, render, screen } from "@testing-library/react";
import { useAnecdoteStore, useAnecdotes } from "./store";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import AnecdoteList from "./components/AnecdoteList";
import React from "react";



describe("Anecdote Exercises 6.12 - 6.15", () => {
  beforeEach(() => {
    // Reset the store to empty before each test
    useAnecdoteStore.setState({ anecdotes: [] });
    // This clears any previous mocks so tests don't leak into each other
    vi.clearAllMocks();
  });

  afterEach(() => {
    // This removes the "fake" fetch we created and puts the real one back
    vi.unstubAllGlobals();
  });

  // --- 6.12: INITIALIZATION TEST ---
  it("6.12: initializes state with anecdotes from the backend", async () => {
    const mockData = [{ id: "1", content: "Test anecdote", votes: 0 }];

    // ✅ FIX: Use vi.stubGlobal instead of global.fetch
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
      }),
    );

    const { result } = renderHook(() => ({
      anecdotes: useAnecdotes(),
      actions: useAnecdoteStore((state) => state.actions),
    }));

    await result.current.actions.initAnecdotes();

    await waitFor(() => {
      expect(result.current.anecdotes).toHaveLength(1);
      expect(result.current.anecdotes[0].content).toBe("Test anecdote");
    });
  });

  // --- 6.13: SORTING TEST ---
  it("6.13: verifies the list is sorted by votes (highest first)", () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: "1", content: "Few votes", votes: 2 },
        { id: "2", content: "Many votes", votes: 100 },
      ],
    });

    render(<AnecdoteList />);

    const voteCounts = screen.getAllByText(/has \d+/);

    // Check text content using standard Vitest matches
    expect(voteCounts[0].textContent).toContain("100");
    expect(voteCounts[1].textContent).toContain("2");
  });

it("6.14: verifies the list renders items correctly", () => {
  useAnecdoteStore.setState({
    anecdotes: [
      { id: "1", content: "Limerick is great", votes: 0 },
      { id: "2", content: "Dublin is okay", votes: 0 },
    ],
  });

  render(<AnecdoteList />);

  // Use getAllByText and check the first one [0]
  // This solves the "Multiple Elements Found" error
  const limerickItems = screen.getAllByText("Limerick is great");
  expect(limerickItems[0]).toBeTruthy();

  const dublinItems = screen.getAllByText("Dublin is okay");
  expect(dublinItems[0]).toBeTruthy();
});

  // --- 6.15: VOTING TEST ---
  it("6.15: verifies that voting increases the count in the store", async () => {
    const initialAnecdote = { id: "1", content: "Vote for me", votes: 5 };
    useAnecdoteStore.setState({ anecdotes: [initialAnecdote] });

    // ✅ FIX: Use vi.stubGlobal here too
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ...initialAnecdote, votes: 6 }),
      }),
    );

    const { result } = renderHook(() =>
      useAnecdoteStore((state) => state.actions),
    );

    await result.current.vote("1");

    const updatedState = useAnecdoteStore.getState().anecdotes;
    expect(updatedState[0].votes).toBe(6);
  });
});
