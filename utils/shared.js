async function getPrayerDates(ramadanDay) {
    let requestYear = getCurrentHijriYear();


    let data = await fetchDates(requestYear);
    const RamadanStartDate = new Date(data.data[0].date['hijri'].date);

    // check if Ramadan has already started if yes then fetch the data for the next year
    if (hijriDatePassed(RamadanStartDate)) {
        requestYear = requestYear + 1;
        data = fetchDates(requestYear);
    }

    const dayData = data.data[ramadanDay - 1];
    const DayTimings = dayData['timings'];


    const formattedTimings = {};
    Object.entries(DayTimings).forEach(([prayer, timing]) => {
        const prayerTime = timing.split(' ')[0];
        formattedTimings[prayer] = removeWhiteSpace(prayerTime);
    });

    return formattedTimings;

}


async function fetchDates(requestYear) {
    const apiUrl = `http://api.aladhan.com/v1/hijriCalendarByCity/${requestYear}/9?city=Mecca&country=Saudi Arabia&method=2`; // Request year should be in Hijri and 9 is Ramadan's month number in hijri

    try {
        const response = await fetch(apiUrl);
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}


function getCurrentHijriYear() {
    const currentDate = new Date();
    const islamicCalendar = new Intl.DateTimeFormat('en-u-ca-islamic', {year: 'numeric'});

    return parseInt(islamicCalendar.format(currentDate).toString().split(' ')[0]);
}

function hijriDatePassed(hijriDate) {

    const providedDate = hijriDate;
    const currentHijriDate = getCurrentHijriDate();
    return providedDate > currentHijriDate;

}

function getCurrentHijriDate() {
    const currentDate = new Date();
    const islamicCalendar = new Intl.DateTimeFormat('en-u-ca-islamic', {
        day: 'numeric', month: 'numeric', year: 'numeric'
    });

    return new Date(islamicCalendar.format(currentDate).toString().split(' ')[0]);
}


function getTimeDifferenceInMinutes(time1, time2) {

    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);


    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;


    return Math.abs(totalMinutes2 - totalMinutes1);
}


function calculate(maghribTime, asrTime, duration) {

    const readyBefore = 15;  // the amount of minutes which should be ready before maghrib
    const difference = getTimeDifferenceInMinutes(maghribTime, asrTime) - readyBefore;

    const cooktime = difference - duration;
    const absoluteCooktime = Math.abs(cooktime);

    const readable = cooktime >= 0 ? `${absoluteCooktime} minutes after Asr` : `${absoluteCooktime} minutes before Asr`;

    return {
        time: cooktime, readable: readable
    };


}

function isValidDay(day) {
    return !isNaN(day) && day >= 1 && day <= 30;
}

function isValidIngredient(ingredient) {
    if (!ingredient) return false; else return ingredient.length > 0 && !/\d/.test(ingredient);
}

function removeWhiteSpace(inputString) {
    let trimmedString = inputString.trim();
    let words = trimmedString.split(/\s+/);
    return words.join(' ');
}


function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];

}

module.exports = {
    getPrayerDates,
    calculate,
    isValidDay,
    isValidIngredient,
    removeWhiteSpace,
    getRandomElement,
    getTimeDifferenceInMinutes
};

