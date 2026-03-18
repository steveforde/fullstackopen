// 1. Destructure removePerson from the props
const Persons = ({ filteredPersons, removePerson }) => {
  return (
    <>
      {filteredPersons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}{" "}
          {/* 2. Add the button with an arrow function */}
          <button onClick={() => removePerson(person.id)}>delete</button>
        </p>
      ))}
    </>
  );
};

export default Persons;
