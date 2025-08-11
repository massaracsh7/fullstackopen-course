require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

if (!url) {
  console.error('Please provide MONGODB_URI in .env file')
  process.exit(1)
}

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const name = process.argv[2]
const number = process.argv[3]

async function main() {
  try {
    await mongoose.connect(url)

    if (!name && !number) {
      const people = await Person.find({})
      console.log('phonebook:')
      people.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
    } else if (name && number) {
      const person = new Person({ name, number })
      await person.save()
      console.log(`added ${name} number ${number} to phonebook`)
    } else {
      console.log('Please provide both name and number to add a new entry.')
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
  } finally {
    await mongoose.connection.close()
  }
}

main()