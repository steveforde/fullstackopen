import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  const addName = (event) => {
    event.preventDefault();

    const nameExists = persons.some(
      (person) => person.name.trim() === newName.trim(),
    );

    if (nameExists) {
      alert(`${newName} is already added to phonebook`);
      setNewName("");
      return;
    }

    const nameObject = {
      name: newName,
    };

    setPersons(persons.concat(nameObject));
    setNewName("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h1>Numbers</h1>
      {persons.map((person) => (
        <p key={person.name}>{person.name}</p>
      ))}
    </div>
  );
};

export default App;
