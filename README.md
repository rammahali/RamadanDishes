# Ramadan Dishes API Documentation ✨

---

## About

A node.js express app that determine the exact time to start preparing your Iftar!

-----
## Run the app !

- Install Dependencies

`npm install`

- Start it !

`npm start`

## Endpoints

The app contains two endpoints:

### `/cooktime`

Calculate the cook time for a given ingredient on a specific day.

- **Query Parameters:**
    - `ingredient`
    - `day`

#### Example Request

`/cooktime?ingredient=Onion&day=2`

#### Example Response

```json
[
    {
        "name": "Meshwiya Salad",
        "ingredients": [
            "Pepper",
            "Tomatoe",
            "Garlic",
            "Onion"
        ],
        "cooktime": "111 minutes after Asr"
    },
    {
        "name": "Veggie Couscous",
        "ingredients": [
            "Semolina",
            "Potatoe",
            "Carrot",
            "Onion",
            "Tomato paste"
        ],
        "cooktime": "125 minutes before Asr"
    }
]
```
All the list of the ingredients can be found in the `assets/dishes.json` file which contain the name of the dish , ingredients it contains as well as the cooking duration.

#### How the cooking time is being calculated ?

every dish contains a cooking duration in minutes . so we make a call to this API
`http://api.aladhan.com/v1/hijriCalendarByCity/{HijriYear}/9?city=Mecca&country=Saudi Arabia&method=2`

which returns the  prayer dates of Ramadan month for the given Hijri year therefore we use the returned data to calculate the difference between Asr prayer and Maghrib prayer in minutes and subtract the duration of the dish perpetration time to determine if you should start cooking before Asr prayer or after it and when exactly you should start


### `/suggest`

Suggest and calculate the cook time of meal for a given specific day.

- **Query Parameters:**

  - `day`

#### Example Request
`/suggest?day=2`
#### Example Response


```json
{
  "name": "BBQ",
  "ingredients": [
    "Meat",
    "Harissa",
    "Black Pepper",
    "Garlic"
  ],
  "cooktime": "39 minutes before Asr"
}
```