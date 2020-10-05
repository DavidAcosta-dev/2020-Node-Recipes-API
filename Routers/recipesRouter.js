const express = require('express');
const router = express.Router();// importing express.Router() method to use in here

const { Recipes } = require('../models'); //importing model into its respective router.

//creating some recipes automatically at start to persist some temp data to visually work with.
Recipes.create("Nata's Vegan Horchata", ['dates', 'rice', 'milk cloth', 'cinnamon', 'anger']);
Recipes.create("Oatmeal", ['milk', 'water', 'oats', 'brown sugar', 'apples']);
Recipes.create("Narb's Red things", ['fear', 'red', 'things']);

//notice how we've changed all the app to router for each endpoint.
router.get('/', (req, res) => {
    res.status(200).json(Recipes.get());
})

router.post('/', (req, res) => {
    console.log(req.body);
    if (!req.body.name || (req.body.ingredients < 1)) {
        return res.status(400).send("please check your recipe object")
    }
    const { name, ingredients } = req.body;
    Recipes.create(name, ingredients);
    res.status(201).end();
})

router.delete('/:id', (req, res) => {
    console.log(req.params);
    Recipes.delete(req.params.id);
    res.status(203).end();
})

router.put('/:id', (req, res) => {
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
});

//exporting the router
module.exports = router;