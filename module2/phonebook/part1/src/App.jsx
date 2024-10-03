import { useState, useEffect} from 'react';
import axios from 'axios';
import personsService from './services/persons';
import timeout from './services/apiHelpers';

const Filter = ({ value, onChange }) => (
  <div>
    filter shown with: <input value={value} onChange={onChange} />
  </div>
);

const PersonForm = ({ onSubmit, newName, newPhoneNumber, handleNameChange, handlePhoneNumberChange }) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      phone number: <input value={newPhoneNumber} onChange={handlePhoneNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons, onDelete }) => (
  <ul>
    {persons.map(person => (
      <li key={person.id}>
        {person.name} {person.number}
        <button onClick={() => onDelete(person.id)}>Delete</button>
      </li>
    ))}
  </ul>
);

const Notification = ({ message, type }) => {
  if (!message || !type) {
    return null;
  }

  const className = type === 'success' ? 'success' : 'error';

  return (
    <div className={className}>
      {message}
    </div>
  );
};


const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data.map(person => ({...person, key: person.id})))
      })
  }, [])
  console.log('render', persons.length, 'persons')
  
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [message, setNotificationMessage] = useState('')

  const addEntry = (event) => {
    event.preventDefault();
  
    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());
  
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newPhoneNumber }; 
    
        timeout(5000, personsService
          .update(existingPerson.id, updatedPerson) 
          .then(response => {
            setPersons(persons.map(person => (person.id === existingPerson.id ? response.data : person)));
            setNewName('');
            setNewPhoneNumber('');
            setNotificationMessage(newName ? `Added ${newName}` : null, 'success');
            setTimeout(() => setNotificationMessage(null, 'null'), 5000); // Clear the message after 5 seconds
          })
          .catch(error => {
            console.error(`Error updating the person with ID ${existingPerson.id}:`, error);
            setNotificationMessage(newName ? `Error updating ${newName}: ${error.message}` : null, 'error');
            setTimeout(() => setNotificationMessage(null, 'null'), 5000); // Clear the message after 5 seconds
          }));
      }
      return; 
    }
  
    const newPerson = {
      name: newName,
      number: newPhoneNumber,
      id: (Math.max(...persons.map(person => parseInt(person.id))) + 1).toString()
    };
  
    timeout(5000, personsService
      .create(newPerson)
      .then(response => {
        setPersons(persons.concat(response.data));
        setNewName('');
        setNewPhoneNumber('');
        setNotificationMessage(newName ? `Added ${newName}` : null, 'success');
        setTimeout(() => setNotificationMessage(null, 'null'), 5000); // Clear the message after 5 seconds
      })
      .catch(error => {
        console.error(`Error creating a new person:`, error);
        setNotificationMessage(newName ? `Error updating ${newName}: ${error.message}` : null, 'error');
        setTimeout(() => setNotificationMessage(null, 'null'), 5000); // Clear the message after 5 seconds
      }));
  };
 
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setNewPhoneNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  const deletePerson = (id) => {
    if (window.confirm(`Delete ${id}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.error(`Error deleting person with ID ${id}:`, error);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      {message !== null && (
        <Notification message={message} type={message ? 'success' : 'error'} />
      )}
      
      <Filter value={newFilter} onChange={handleFilterChange} />
      
      <h2>Add a new</h2>

      <PersonForm
        onSubmit={addEntry}
        newName={newName}
        newPhoneNumber={newPhoneNumber}
        handleNameChange={handleNameChange}
        handlePhoneNumberChange={handlePhoneNumberChange}
      />

      <h2>Numbers</h2>

      <Persons persons={filteredPersons} onDelete={deletePerson} />
    </div>
  );
};

export default App;
