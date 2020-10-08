
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



/*
both runServer and closeServer need to access the same server object,
so we declare `server` here, and then when runServer runs, it assigns a value. */
let server;

//Starts our server and returns a Promise. In our test code, we need a way of asynchronously starting our server, since we'll be dealing w/ promises there.
const runServer = () => {

  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {

    server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      }) //end of .listen() which created and ran a server.
      .on("error", err => {
        reject(err);
      });  //end of .on() which is like a more dynamic way of writing .catch()

  }); //end of "new Promise". We wrapped the server creator (.listen()) in a promise because we need the asynchronisity of a promise for starting a server inside the testing modules.


};//end of runServer



// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
const closeServer = () => {


  return new Promise((resolve, reject) => {
    console.log("CLOSING SERVER");
    server.close(err => {
      if (err) {
        reject(err);
        return; //so we don't call resolve as well
      }

      //otherwise resolve() since it closed fine without errors
      resolve();

    });//end of server.close()

  }); //end of "new Promise" wrapper


}; //end of closeServer





//require.main is assigned to a module when that module is run directly from Node like when the npm start script auto-runs "node server.js".
//This is opposed to it being run from the testing module.

//So it's possible to determine if a file is run directly from node by testing if require.main === module      (module refers to the current module, this module)
if (require.main === module) {

  runServer()
    .catch(err => console.error(err));

};


module.exports = { app, runServer, closeServer };