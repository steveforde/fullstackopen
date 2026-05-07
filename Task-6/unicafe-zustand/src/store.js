// src/store.js
import { create } from "zustand";

const useFeedbackStore = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,

  // Actions to update the state
  incrementGood: () => set((state) => ({ good: state.good + 1 })),
  incrementNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
  incrementBad: () => set((state) => ({ bad: state.bad + 1 })),

  // Action to reset all feedback back to zero
  resetFeedback: () => set({ good: 0, neutral: 0, bad: 0 }),
}));

export default useFeedbackStore;
