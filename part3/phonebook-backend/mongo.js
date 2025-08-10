const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [number]');
  process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fatum7:${password}@ac-d0ds6la.rrz5ycg.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

async function main() {
  try {
    await mongoose.connect(url);

    if (!name && !number) {
      const people = await Person.find({});
      console.log('phonebook:');
      people.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
    } else if (name && number) {
      const person = new Person({ name, number });
      await person.save();
      console.log(`added ${name} number ${number} to phonebook`);
    } else {
      console.log('Please provide both name and number to add a new entry.');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

main();
