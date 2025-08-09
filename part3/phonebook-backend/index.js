const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3001;

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((p) => Number(p.id))) : 0;
  return String(maxId + 1);
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: "Person not found" });
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const initialLength = persons.length;
  const newPersons = persons.filter((p) => p.id === !id);
  if (newPersons.length < initialLength) {
    res.status(204).end();
  } else {
    res.status(404).json({ error: "Person not found" });
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    res.status(400).json({ error: "Name and number are required" });
  }

  const nameExists = persons.some(
    (p) => p.name.toLowerCase() === body.name.toLowerCase()
  );

  if (nameExists) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }
  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  res.status(201).json(newPerson);
});

app.get("/info", (req, res) => {
  const time = new Date();
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${time}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
