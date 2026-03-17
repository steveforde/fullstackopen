import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
    { name: "Arto Forde", number: "39-23-6423122", id: 5 },
    { name: "Arto Järvinen", number: "39-23-6423122", id: 6 },
    { name: "Arto fox", number: "39-23-6423332", id: 7 },
    { name: "Ada Fox", number: "39-23-9873122", id: 8 },
    { name: "Mary Järvinen", number: "39-23-4353122", id: 9 },
    { name: "jonny Järvinen", number: "39-23-4373122", id: 10 },
    { name: "Arto smith", number: "39-23-64288882", id: 11 },
    { name: "jimmy fox", number: "39-23-6423122", id: 12 },
  ]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addName = (event) => {
    event.preventDefault();
    const nameExists = persons.some(
      (person) =>
        person.name.trim().toLowerCase() === newName.trim().toLowerCase(),
    );

    if (nameExists) {
      alert(`${newName} is already added to the phonebook`);
      setNewName("");
      return;
    }

    const nameObject = {
      name: newName,
      number: newNumber,
    };

    setPersons(persons.concat(nameObject));
    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} />
    </div>
  );
};

export default App;
