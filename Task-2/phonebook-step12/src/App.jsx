import { useState, useEffect } from "react";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();

    if (newName === "" || newNumber === "") {
      alert("Please enter both a name and a phone number");
      return;
    }

    const existingPerson = persons.find(
      (p) => p.name.trim().toLowerCase() === newName.trim().toLowerCase(),
    );

    // 1. UPDATE PATH
    if (existingPerson) {
      if (
        window.confirm(`${newName} is already added. Replace the old number?`)
      ) {
        const changedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(existingPerson.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : returnedPerson,
              ),
            );
            setMessage(`Updated ${newName}'s number`);
            setTimeout(() => setMessage(null), 7000);
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            // NEW: This checks if the error is a Mongoose Validation error first
            if (error.response && error.response.data.error) {
              setMessage(`Error: ${error.response.data.error}`);
            } else {
              setMessage(
                `Error: Information of ${existingPerson.name} was already removed from server`,
              );
              setPersons(persons.filter((p) => p.id !== existingPerson.id));
            }
            setTimeout(() => setMessage(null), 7000);
          });
      }
      return;
    }

    // 2. CREATE PATH
    const nameObject = { name: newName, number: newNumber };

    personService
      .create(nameObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setMessage(`Added ${newName}`);
        setTimeout(() => setMessage(null), 7000);
        setNewName("");
        setNewNumber("");
      })
      .catch((error) => {
        // NEW: Displays the "Name too short" or "Number too short" message from Backend
        setMessage(`Error: ${error.response.data.error}`);
        setTimeout(() => setMessage(null), 7000);
      });
  };

  const removePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
  };

  const filteredPersons = persons.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />

      <Filter
        filter={filter}
        handleFilterChange={(e) => setFilter(e.target.value)}
      />

      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} removePerson={removePerson} />
    </div>
  );
};

export default App;
