const express = require('express');
const router = express.Router();
const dishes = require('../assets/dishes.json');
const {isValidIngredient, isValidDay, getPrayerDates, calculate, removeWhiteSpace} = require("../utils/shared");


router.get('/cooktime', async (req, res) => {

    let {day, ingredient} = req.query;


    if (!isValidIngredient(ingredient)) {
        return res.status(400).send("Please enter a valid ingredient");
    }

    if (!isValidDay(parseInt(day))) {
        return res.status(400).send("Please enter a correct day between 1 and 30");
    }

    ingredient = removeWhiteSpace(ingredient);
    let prayerDates;

    try {
        prayerDates = await getPrayerDates(parseInt(day));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Prayers data');
    }

    const asrTime = prayerDates['Asr'];
    const maghribTime = prayerDates['Maghrib'];

    const cooktimes = [];


    dishes.forEach(dish => {
        let dishIngredients = dish.ingredients.map(ing => ing.toLowerCase());

        if (dishIngredients.includes(ingredient.toLowerCase())) {

            const duration = dish.duration;
            const cooktime = calculate(maghribTime, asrTime, duration); // calculate the cooktimes in minutes

            cooktimes.push({
                name: dish.name,
                ingredients: dish.ingredients,
                cooktime: cooktime.readable
            });

        }

    });

    res.send(cooktimes);

});


module.exports = router;
