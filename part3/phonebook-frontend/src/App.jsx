import { useState, useEffect } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import personService from "./services/persons";
import Notification from "./Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      const personsWithId = initialPersons.map(person => ({
        ...person,
        id: person._id,
      }));
      setPersons(personsWithId);
    });
  }, []);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : returnedPerson
              )
            );
            setNotification({ message: `Updated ${newName}`, type: "success" });
            setTimeout(() => {
              setNotification({ message: null, type: null });
            }, 5000);
          })
          .catch((error) => {
            setNotification({
              message: `Information of ${newName} has already been removed from server`,
              type: "error",
            });
            setTimeout(() => {
              setNotification({ message: null, type: null });
            }, 5000);
            setPersons(persons.filter((p) => p.id !== existingPerson.id));
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      personService
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNotification({ message: `Added ${newName}`, type: "success" });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          setNotification({
            message: error.response?.data?.error || "Error adding person",
            type: "error",
          });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
        });
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          setNotification({
            message: `Information of ${newName} has already been removed from server`,
            type: "error",
          });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
