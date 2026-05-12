// Import the specific store for filtering logic
import useFilterStore from "../store";

const Filter = () => {
  // Use a 'selector' to grab only the setFilter function.
  // This is efficient because this component only cares about changing the filter,
  // it doesn't actually need to know what the current filter 'value' is.
  const setFilter = useFilterStore((state) => state.setFilter);

  // Event handler for every keystroke in the input field
  const handleChange = (event) => {
    // We pass the current text in the input box directly to our Zustand store
    setFilter(event.target.value);
  };

  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      {/* The 'onChange' event triggers our handler every time the user 
        types or deletes a character, making the search feel "live."
      */}
      filter <input onChange={handleChange} />
    </div>
  );
};

export default Filter;
