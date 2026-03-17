const PersonForm = ({
  addName,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addName}>
      <div>
        <label htmlFor="name-input">name: </label>
        <input
          id="name-input"
          name="name"
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        <label htmlFor="number-input">number: </label>
        <input
          id="number-input"
          name="number"
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
