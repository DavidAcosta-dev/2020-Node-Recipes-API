const chai = require("chai");
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

//allows for "expect" style assertion syntax in our tests, example:    `expect (1+1).to.equal(2);
const expect = chai.expect;

//This lets us make HTTP requests to our server during testing.
chai.use(chaiHttp);



//Let the testing suite begin...
describe("Shopping List", function () {  //can't use arrow functions with mocha and describe is a mocha function as is the before() hook

    before(function () {
        return runServer();
    })

    after(function () {
        return closeServer();
    });

    //Next: write the tests

    // GET/shopping-List
    // before({runServer}) will run, starting the server.
    //chai.request will make a request to app.get('/shopping-list) and return a promise. meaning it will make a get request to our server referenced as app which we required above from server.js
    //Attach a .then() handler to work with the response that was returned so we can start testing the response.
    //test the res.status: expect(res) to have a 200 status
    //test the res.content-type          (this doesn't refer to the body per say, we are testing the entire response still, not just the res.body)
    //test the res.body to be an array
    // *** test the res.body.length to be at least one. (***we will remove this later when we use a real database but since we currently preCreate 3 items on start we wanna check that the volitile memory consits of at least 1 shopping item)
    /*test each individual object in res.body's array contains the right items like "id", "name" etc...
        //making the array "expectedKeys" that we used to check the request in the shoppingListRouter, so this should look familiar BUT the point of testing with http chai to to test the RESPONSE this time. Not the request. 
        //Remember, we want to see if our server's http communication is working to see what it's spitting back, NOT what the user sends, not the request.
        //loop over res.body's database (which contains mutliple shopping items) and expect each Shopping item in the body to be an object and to include all the keys from the "expectedKeys" array we just made.
    */
    //after({closeServer}) will run, closing the server so that the next test will not work with our mutated volitile data.
    it('should list items on GET', function () {
        return chai.request(app).get('/shopping-list')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.at.least(1);

                const expectedKeys = ['id', 'name', 'budget']; //making array
                res.body.forEach(function (item) { //can't use arrow functions in mocha so we have to use the keyword "function" instead of   res.body.forEach(item => {})    but this does the same thing.
                    expect(item).to.be.an('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });//end of GET/



    // POST/shopping-List
    // before({runServer}) will run, starting the server.
    //construct newItem object representing a shoppinglist item.
    //chai.request will make a POST request, sending our "newItem" with it. Make sure to return it so we can work with it in the .then() handler later.
    //Attach a .then() handler to work with the response that was returned so we can start testing the response.
    //test the res.status: expect(res) to have a 201 "posted" status
    //test the res.content-type
    //test the res.body to be an object
    /* test that the res.body's contents contain the right keys like "id", "name" etc...
        //use the array "expectedKeys" that we made.
        //Check response has an id. (If it persisted correctly, the response shopping item object should have a key called "id" that is obviously not null)
        //making a clone of the item we sent (newItem) but adding the id that was returned in the response to it and calling it itemWithId. This is what the res.body SHOULD look like exactly.
        //deeply compare the calculated "itemWithId" to the actual res.body object to see if they are exactly identical, which they should be.
    */
    //after({closeServer}) will run, closing the server so that the next test will not work with our mutated volitile data.
    it('should add an item on POST', function () {
        const newItem = { name: 'coffee', budget: 2 };
        const expectedKeys = ["name", "id", "budget"];
        return chai.request(app).post('/shopping-list').send(newItem) //need to return so that we can work with the returned response in the .then() and execute some "expect" tests on it.
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.include.keys(expectedKeys);
                expect(res.body.id).to.not.equal(null);
                const itemWithId = Object.assign(newItem, { id: res.body.id }); //making the caluculated clone
                expect(res.body).to.deep.equal(itemWithId); //deeply comparing the actual response body to our calculated "itemWithId"
            });//end of .then()
    });//end of POST/shopping-list









    /* !!!!!!!!!FIX NOTE DISCLAIMER: 
        For PUT and DELETE methods, attaching an EXISTING id is required in the url (query.params).
        HOWEVER, since we are using volitile memory, we have to do a get request first so that the server auto-creates some arbitrary items and then we can use those
        items and their randomly assigned "id" to execute a PUT or DELETE request. WE WILL CHANGE THIS WHEN WE USE REAL DATABASES
    */

    // PUT/shopping-list:
    // before({runServer}) will run, starting the server.
    //make an item with different values that you want to update an item with later.
    //first make a get request to obtain some volitile data to work with.
    //then from the res.body array of shopping items, copy the id from the first item in the array and assign it to the "updateData".
    //In that same .then() statement, return a chai.request call to PUT/`shopping-list/${updateData.id}`, passing in the updateData object as well in .send()
    //Attach a .then() statement outside of the last .then(). In this new .then() we will test the returned updated object to see if our changes persisted.
    /*
        test the res status
        test the res content-type
        test the res.body is an object
        test that the res.body is exactly the same as our "updateData"
     
     */

    it('should update on PUT', function () {
        const updateData = { name: 'black beans', budget: 7 };
        return chai.request(app).get('/shopping-list')
            .then(function (res) {
                updateData.id = res.body[0].id;
                return chai.request(app).put(`/shopping-list/${updateData.id}`)
                    .send(updateData);// end of put
            })//end of first then()
            .then(function (res) { //now it's time to test the returned updated object to see if our changes persisted.
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.deep.equal(updateData);
            });//end of final .then()
    });//end of entire PUT/shopping-list test










    //!!!!!!FIX THIS WHEN WE ADD DATABASES:
    // Improper way of making a delete call. We are not even checking if the item is gone by testing a get/ and checking if the item is found within the res.body array
    it('should delete items on DELETE', function () {
        return chai.request(app).get('/shopping-list')
            .then(function (res) {
                return chai.request(app).delete(`/shopping-list/${res.body[0].id}`);
            })
            .then(function (res) {
                expect(res).to.have.status(204);
            });
    });//end of DELETE/shopping-list

});

