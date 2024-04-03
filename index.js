require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
morgan.token('req-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time :req-body'))
app.use(cors())

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name ==='NameError' || error.name === 'NumberError') {
    return response.status(400).json({ error: error.message})
  }
  next(error)
}
app.use(errorHandler)

app.get('/info', async (request, response, next) => {
  const infoAmount = await Person.countDocuments({})
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
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person=> {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(person => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  const randId = Math.floor(Math.random() * 10000) + 1
  return randId
}
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name) {
    const error = new Error('Name is missing')
    error.name = 'NameError'
    return next(error)
  } else if (!body.number) {
    const error = new Error('Number is missing')
    error.name = 'NumberError'
    return next(error)
  }
  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
  response.json(savedPerson)
  }).catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})