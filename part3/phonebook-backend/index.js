const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const errorHandler = require('./middleware')

const app = express()

morgan.token('post-data', (req) => {
  return req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

app.use(express.json())
app.use(express.static('dist'))

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose
  .connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name is required'],
    unique: true,
  },
  number: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v) && v.length >= 8
      },
      message: (props) => `${props.value} is not a valid phone number! Use format XX-XXXXXXX or XXX-XXXXXXXX`,
    },
  },
})

const Person = mongoose.model('Person', personSchema)

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person)
      else res.status(404).json({ error: 'Person not found' })
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      if (result) res.status(204).end()
      else res.status(404).json({ error: 'Person not found' })
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' })
  }

  Person.findOne({ name })
    .then((existingPerson) => {
      if (existingPerson) {
        existingPerson.number = number
        return existingPerson.save().then((updatedPerson) => res.json(updatedPerson))
      } else {
        const person = new Person({ name, number })
        return person.save().then((savedPerson) => res.status(201).json(savedPerson))
      }
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).json({ error: 'Person not found' })
      }
    })
    .catch((error) => next(error))
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      const time = new Date()
      res.send(`<p>Phonebook has info for ${count} people</p><p>${time}</p>`)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
