
const express = require('express');
// we'll use morgan to log the HTTP layer
const morgan = require('morgan');
// we'll use body-parser's json() method to 
// parse JSON data sent in requests to this app
// const bodyParser = require('body-parser');

// we import the ShoppingList model, which we'll
// interact with in our GET endpoint
const { ShoppingList, Recipes } = require('./models');

// const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));
app.use(express.json());

// we're going to add some items to ShoppingList
// so there's some data to look at. Note that 
// normally you wouldn't do this. Usually your
// server will simply expose the state of the
// underlying database.
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);

Recipes.create("Nata's Vegan Horchata", ['dates', 'rice', 'milk cloth', 'cinnamon', 'anger']);
Recipes.create("Oatmeal", ['milk', 'water', 'oats', 'brown sugar', 'apples']);
Recipes.create("Narb's Red things", ['fear', 'red', 'things']);

// when the root of this route is called with GET, return
// all current ShoppingList items by calling `ShoppingList.get()`
app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

app.get('/recipes', (req, res) => {
  res.status(200).json(Recipes.get());
})

app.post('/recipes', (req, res) => {
  console.log(req.body);
  if (!req.body.name || (req.body.ingredients < 1)) {
    return res.status(400).send("please check your recipe object")
  }
  const { name, ingredients } = req.body;
  Recipes.create(name, ingredients);
  res.status(201).end();
})

app.delete('/recipes/:id', (req, res) => {
  console.log(req.params);
  Recipes.delete(req.params.id);
  res.status(203).end();
})

app.put('/recipes/:id', (req, res) => {
  const requiredFields = ["name", "ingredients", "id"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing "${field}" in request body..`;
      console.error(message);
      return res.status(400).send(message);
    }
  };//end of body fields check
  if (req.params.id !== req.body.id) {
    return res.status(400).send(`Request path id "${req.params.id}" does not match the body id "${req.body.id}"`);
  };//end of body.id === params.id match check
  Recipes.update(req.body);
  res.status(204).end();
})

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
