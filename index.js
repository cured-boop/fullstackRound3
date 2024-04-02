const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('req-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time :req-body'))

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

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const randId = Math.floor(Math.random() * 10000) + 1
  return randId
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'missing name' 
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'missing number'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }
  const uniqueName = persons.find(person => person.name === body.name)
  if (uniqueName) {
    return response.status(400).json({
      error: 
      'name must be unique'
    })
  }
  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})