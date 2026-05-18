import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  message: null,
  type: null, // "success" or "error"

  // Action to display a message that automatically cleans itself up
  showNotification: (message, type = 'success', timeInSeconds = 5) => {
    set({ message, type })

    setTimeout(() => {
      set({ message: null, type: null })
    }, timeInSeconds * 1000)
  },

  // Action to clear instantly if needed
  clearNotification: () => set({ message: null, type: null })
}))

export default useNotificationStore
