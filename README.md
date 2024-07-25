# fullstackopen-part3 | PhoneBook

[**App deployed**](https://phonebook-nwcj.onrender.com)

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

## Step 10

- Deploy the backend to the Internet
- Test the backend deployed with a browser and the VS Code REST client

Created: `client.rest`
Deployed: `https://phonebook-nwcj.onrender.com/`

## Step 11

- Generate a production build of your frontend and add it to the web application using the method introduced in this part.
- Also, make sure the frontend still works locally

**Commands:**

```json
// package.json

"build:ui": "rm -rf dist && cd ../phoneBook && npm run build && cp -r dist ../fullstackopen-part3",
"deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push"
```

Generated: `dist`

**Middlewares:**

```js
app.use(cors());
app.use(express.static("dist"));
```

**Configure frontend:**

```js
// services/persons.js
const baseUrl = "/api/persons";
```

```js
// vite.config.js

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
```

## Step 12

- Create a cloud-based MongoDB database for your phonebook application with MongoDB Atlas.
- Creates a mongo.js file in the project directory, which can be used to add entries to the agenda and to list all existing entries in the agenda.

**Created:** `mongo.js`

**Add new entries to the phonebook:**

```js
// mongo.js
...
if (argsLength === 3) {
  Person.find({}).then((people) => {
    console.log("phonebook:");
    people.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
```

**Get all entries from the phonebook:**

```js
// mongo.js
...
if (argsLength > 3) {
  if (!number) {
    console.log("number argument missing");
    process.exit(1);
  }

  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then(() => {
      console.log(`added ${person.name} number ${person.number} to phonebook`);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log(error.message);
      process.exit(1);
    });
}
```

## Step 13

Changes the search for all phonebook entries so that the data is obtained from the database.

- **Create a new model for the phonebook.**

```js
// models/person.js
...
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
```

- **Config /api/persons endpoint to return the data from the database.**

```js
// index.js
require("dotenv").config();
...
app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});
...
const PORT = process.env.PORT;
```

## Step 14

Change the backend so that the new numbers are saved in the database.

- **Config post request to save the data in the database.**

```js
// index.js
app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  const person = new Person({
    name,
    number,
  });

  person.save().then((personSaved) => {
    res.status(201).json(personSaved);
  });
});
```

## Step 15

Change the backend so that deleting phonebook entries is reflected in the database.

- **Config delete request to delete the data in the database.**

```js
app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then((personDeleted) =>
      !personDeleted
        ? res.status(404).json({ error: "person not found" })
        : res.status(204).end()
    )
    .catch(() => res.status(400).end());
});
```

## Step 16

Moves application error handling to new error handling middleware.

- **Config error handling middleware.**

```js
const errorHandler = (error, req, res, next) => {
  console.error(`${error.name}: ===> ${error.message}`);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
```

- **Use error handling middleware.**

```js
...
app.use(unknownEndpoint);
app.use(errorHandler);
```

## Step 17

The frontend will attempt to update the phone number of the existing entry by making an HTTP PUT request to the entry's unique URL.

- **Config put request to update the data in the database.**

```js
app.put("/api/persons/:id", (req, res, next) => {
  const person = req.body;

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});
```

## Step 18

Also updates the handling of the api/persons/:id and info routes to use the database

- **Config get request by id to return the data from the database.**

```js
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) =>
      person
        ? res.json(person)
        : res.status(404).send({ error: "person not found" })
    )
    .catch((error) => next(error));
});
```

- **Config /info endpoint to return the data from the database.**

```js
app.get("/info", (req, res) => {
  Person.find({}).then((people) => {
    res.send(
      `<p>Phonebook has info for ${
        people.length
      } people</p><p>${new Date()}</p>`
    );
  });
});
```
