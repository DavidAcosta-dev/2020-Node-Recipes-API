
const express = require('express');
const morgan = require('morgan');// we'll use morgan to log the HTTP layer
// const { ShoppingList, Recipes } = require('./models'); //We abstracted this to each endpoints's router

const app = express();

//importing each respective router
const recipesRouter = require('./Routers/recipesRouter');
const shoppingListRouter = require('./Routers/shoppingListRouter');

// log the http layer
app.use(morgan('common'));
app.use(express.json());

//pointing to our static resources via 2 different methods
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


//Now we use the routers as middleware by supplying the '/path', then the imported router.
app.use('/shopping-list', shoppingListRouter);
app.use('/recipes', recipesRouter);


app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
