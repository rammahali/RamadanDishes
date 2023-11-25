const express = require('express');
const router = express.Router();
const dishes = require('../assets/dishes.json');
const {isValidDay, getPrayerDates, calculate, getRandomElement} = require("../utils/shared");


router.get('/suggest', async (req, res) => {

    const {day} = req.query;


    if (!isValidDay(parseInt(day))) {
        return res.status(400).send("Please enter a correct day between 1 and 30");
    }

    let prayerDates;

    try {
        prayerDates = await getPrayerDates(parseInt(day));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Prayers data');
    }
    const asrTime = prayerDates['Asr'];
    const maghribTime = prayerDates['Maghrib'];

    let suggestions = [];

    dishes.forEach(dish => {


        const duration = dish.duration;
        const cooktime = calculate(maghribTime, asrTime, duration);

        const mealMap = {

            name: dish.name,
            ingredients: dish.ingredients,
            cooktime: cooktime.readable
        }


        if (parseInt(day) <= 10 && duration >= cooktimeRange.heavy) {
            suggestions.push(mealMap);
        } else if (parseInt(day) > 10 && parseInt(day) <= 20 && duration >= cooktimeRange.mid && duration <= cooktimeRange.heavy) {
            suggestions.push(mealMap);
        } else if (parseInt(day) > 20 && day <= 30 && duration <= cooktimeRange.fast) {
            suggestions.push(mealMap);
        }

    });

    const randomSuggestion = getRandomElement(suggestions);
    res.send(randomSuggestion);


});

const cooktimeRange = {
    heavy: 180,
    mid: 120,
    fast: 60
}


module.exports = router;
