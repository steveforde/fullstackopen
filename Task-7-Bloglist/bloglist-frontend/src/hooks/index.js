import { useState } from 'react'

/**
 * useField - Custom hook for managing form input states cleanly
 * Exercise 7.15
 */
export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  // We return value, type, and onChange so they can be spread directly onto <input> or <TextField>
  return {
    type,
    value,
    onChange,
    reset
  }
}
