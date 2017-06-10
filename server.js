'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

require('./config/database')();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

app.use('/polls', require('./routes/polls'));

const listener = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${listener.address().port}`);
});