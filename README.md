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

let persons = [
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

## Step 4

Implements functionality that makes it possible to delete a single phonebook entry using an HTTP DELETE request to the unique URL of that phonebook entry

**index.js:**

```js
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.status(404).end();
  }

  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});
```

## Step 5

Expands the backend so that new entries can be added to the phonebook by making HTTP POST requests to the address http://localhost:3001/api/persons.

Generate a new id for the calendar entry with the Math.random function

**Function:**

```js
function generateId() {
  return Math.floor(Math.random() * 100000000);
}
```

**index.js:**

```js
app.use(express.json());
...
app.post("/api/persons", (req, res) => {
  const body = req.body;
  const newPerson = {
    id: generateId(),
    ...body,
  };
  persons = persons.concat(newPerson);
  res.status(201).json(newPerson);
});
```

## Step 6

Implement error handling to create new entries

**Name or number is missing:**

```js
if (!body.name || !body.number) {
  return res.status(400).json({
    error: "name or number missing",
  });
}
```

**The name already exists in the phonebook:**

```js
const isPersonOnList = persons.find((person) => person.name === body.name);
if (isPersonOnList) {
  return res.status(400).json({ error: "name must be unique" });
}
```

## Step 7

Add morgan middleware to your application for message logging. Set it to log messages to your console based on the tiny setting.

```js
const morgan = require("morgan");
...
app.use(morgan("tiny"));
```

## Step 8

Configure Morgan to also display data sent in HTTP POST requests:

```js
morgan.token("content", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);
```

## Step 9

Make the backend work with the phonebook frontend from the exercises in the previous part.
