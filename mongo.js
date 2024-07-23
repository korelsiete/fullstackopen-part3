const mongoose = require("mongoose");
const argsLength = process.argv.length;

if (argsLength < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const [password, name, number] = process.argv.slice(2);

const url = `mongodb+srv://korelsiete:${password}@fsopen.y27rp5g.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=fsopen`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("Person", personSchema);

if (argsLength === 3) {
  Person.find({}).then((people) => {
    console.log("phonebook:");
    people.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

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
