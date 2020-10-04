
const express = require('express');
// we'll use morgan to log the HTTP layer
const morgan = require('morgan');
// we'll use body-parser's json() method to 
// parse JSON data sent in requests to this app
// const bodyParser = require('body-parser');

// we import the ShoppingList model, which we'll
// interact with in our GET endpoint
const { ShoppingList, Recipes } = require('./models');

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






// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

app.post('/shopping-list', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'budget'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = ShoppingList.create(req.body.name, req.body.budget);
  res.status(201).json(item);
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `ShoppingList.update` with updated item.
app.put('/shopping-list/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'budget', 'id'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating shopping list item \`${req.params.id}\``);
  ShoppingList.update({
    id: req.params.id,
    name: req.body.name,
    budget: req.body.budget
  });
  res.status(204).end();
});

// when DELETE request comes in with an id in path,
// try to delete that item from ShoppingList.
app.delete('/shopping-list/:id', (req, res) => {
  ShoppingList.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.ID}\``);
  res.status(204).end();
});



/**====================================================================================================END of SHOPPINGLIST ROUTES=============================== */




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
