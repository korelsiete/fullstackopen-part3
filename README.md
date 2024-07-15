# fullstackopen-part3 | PhoneBook

## Step 1

Deploy a Node application that returns an encrypted list of phonebook entries from the address http://localhost:3001/api/persons.

**package.json:**

```json
{
  "name": "fullstackopen-part3",
  "version": "0.0.1",
  "description": "fullstackopen part3",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon index.js"
  },
  "author": "korels7 <pajita200305@gmail.com>",
  "license": "MIT",
  "dependencies": {
    "express": "^4.19.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.4"
  }
}
```

**index.js:**

```js
const express = require("express");
const app = express();

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Step 2

Deploys a page at the address http://localhost:3001/info

The page needs to show the time the request was received and how many entries are in the phonebook at the time the request is processed.

**index.js:**

```js
app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});
```

## Step 3

Implements functionality to display information for a single phonebook entry.

If no entry is found for the given ID, the server should respond with the appropriate status code.

**index.js:**

```js
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.status(404).end();
  }

  res.json(person);
});
```
