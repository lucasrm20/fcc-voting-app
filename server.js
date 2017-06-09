'use strict';

require('dotenv').config();

const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

const listener = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${listener.address().port}`);
});