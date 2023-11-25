const express = require('express');
const app = express();

const cooktimeRoute = require('./routes/cooktime');
const suggestionRoute = require('./routes/suggest');

app.use('/', cooktimeRoute);
app.use('/', suggestionRoute);


if (require.main === module) {
    const port = 3000;

    app.listen(port, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log(`The server is running on port ${port}`);
        }
    });
} else {

    module.exports = app;
}
