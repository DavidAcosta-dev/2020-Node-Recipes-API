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

});

