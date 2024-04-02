const express = require('express')
const app = express()

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-642-3122"
  },
]
app.get('/info', (request, response) => {
  const infoAmount = persons.length
  const time = new Date().toString()
  console.log(infoAmount)
  console.log(time)
  
  response.send(`
    <div>
      <p>Phonebook has info for ${infoAmount} people</p>
      <p>${time}</p>
    </div>
    `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})