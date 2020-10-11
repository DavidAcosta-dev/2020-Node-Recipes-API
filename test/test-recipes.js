const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);


describe("Recipes", function () {
    before(function () {
        runServer();
    });
    after(function () {
        closeServer();
    });


    it('should retrieve all recipes on GET', function () {
        return chai.request(app).get('/recipes')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.at.least(1);
                const expectedKeys = ['name', 'ingredients'];
                res.body.forEach(function (recipe) {
                    expect(recipe).to.be.an('object');
                    expect(recipe).to.include.keys(expectedKeys);
                });
            });
    });// end of GET/recipes



    //POST
    it('should post recipe on POST', function () {
        const newRecipe = { name: 'Magical Mooley Doughnuts', ingredients: ['hopes', 'dreams', 'wish crystals', 'dough'] };
        const expectedKeys = ['name', 'ingredients', 'id'];
        return chai.request(app).post('/recipes').send(newRecipe)
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.include.keys(expectedKeys);
                expect(res.body.ingredients).to.be.an('array');
                expect(res.body.ingredients.length).to.be.at.least(1);
                const recipeWithId = Object.assign(newRecipe, { "id": res.body.id }); //or...   newRecipe.id = res.body.id
                expect(res.body).to.deep.equal(recipeWithId);
            })
    });//end of POST/recipes



    //PUT
    it('should update a recipe on PUT', function () {
        const updateData = { name: 'Mooly Wish Donuts', ingredients: ['All Hopes', 'All Dreams', 'Wish Crystals'] };
        //fetch GET recipes first
        return chai.request(app).get('/recipes')
            .then(function (res) {
                updateData.id = res.body[0].id;
                return chai.request(app).put(`/recipes/${updateData.id}`)
                    .send(updateData);
            })
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.deep.equal(updateData);
            });
    });//end of PUT/recipes



    //DELETE
    it('should delete recipe on DELETE', function () {
        return chai.request(app).get('/recipes')
            .then(function (res) {
                return chai.request(app).delete(`/recipes/${res.body.id}`);
            })
            .then(function (res) {
                expect(res).to.have.status(204);
            })
    });//end of DELETE/recipes








});// end of test suite