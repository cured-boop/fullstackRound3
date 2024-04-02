import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = ({newSearch, handleSearchChange}) => {
  return (
   <div>
     filter shown with<input
     value = {newSearch}
     onChange= {handleSearchChange}
     />
   </div>
  )
}

const showPeople = ({peopleToShow, removePerson}) => {
  return (
    peopleToShow.map(person => <Person key = {person.name} person = {person} removePerson={removePerson}/>)
  )
}

const Person = ({person, removePerson}) => {
  return (
      <p>
        {person.name} {person.number} 
        <button onClick= {() => removePerson(person.id)}>delete</button> 
      </p>
  )
}


const addPerson = ({newName, newNumber, handleNoteChange, handleNumChange, addNote}) => {
  
  return (
    <form onSubmit={addNote}>
        <div>
          name: <input 
          value = {newName} 
          onChange={handleNoteChange}
          />
        </div>
        <div>
          number: <input
          value = {newNumber}
          onChange={handleNumChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}



const App = () => {
  const [persons, setPersons] = useState([])
  const [newSearch, setNewSearch] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState(null)

  const hook = () => {
    console.log('effect')
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response)
    })
  }
  useEffect(hook, [])

  console.log('render', persons.length, 'people')

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    console.log(persons)
    const newObject = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personId = persons.find(person => person.name === newObject.name).id
        console.log(newObject.name)
        console.log(personId)
        personService
          .put(newObject, personId)
          .then(response => {
            console.log('res', response)
            setPersons(persons.map(person => person.id !== response.id ? person : response)) //muokkaa henkilön
            setMessage(`Changed number of ${newObject.name}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            console.log('alreadyRemoved')
            setMessage(`Information of ${newObject.name} has already been removed from server`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
      }
      
    }
    else {
    personService 
      .create(newObject)
      .then(response => {
        setPersons(persons.concat(response)) //lisää henkilön
    setMessage(`Added ${newObject.name}`)
    setTimeout(() => {
      setMessage(null)
    }, 5000) 
      })
    }
    setNewName('')
    setNewNumber('')
  }
  const removePerson = (id) => {
    console.log(id)
    console.log('here')
    const name = persons.find((person) => person.id === id).name
    console.log(name)
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id ))
        })
      setMessage(`Removed ${name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setNewSearch(event.target.value)
  }
  const peopleToShow = persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))
  
  const Notification = ({message}) => { //viesti
    if (message === null) {
      return null
    }
    if (message.includes("already")) { //virheellinen
      return (
        <div className="error">
          {message}
        </div>
      )
    }
    else { //onnistunut
      return (
        <div className="success"> 
          {message}
        </div>
    )}
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {message} />
      <div>{Filter({newSearch, handleSearchChange})}</div>
      <h2>add a new</h2>
      <>{addPerson({newName, newNumber, handleNoteChange, handleNumChange, addNote})}</>
      <h3>Numbers</h3>
      <>{showPeople({peopleToShow, removePerson})}</>
    </div>
  )

}

export default App