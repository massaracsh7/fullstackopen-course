const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [number]');
  process.exit(1);
}

const password = process.argv[2];
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
      people.forEach(p => console.log(`${p.name} ${p.number}`));
    } else {
      const person = new Person({ name, number });
      await person.save();
      console.log(`added ${name} number ${number} to phonebook`);
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

main();