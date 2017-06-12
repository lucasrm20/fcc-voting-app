'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const passport = require('./config/passport');

const auth = require('./middlewares/auth');

require('./config/database')();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// AUTH
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(auth.provideLoggedUserForTemplates);

// ROUTES
app.get('/', (req, res) => {
    res.render('home');
});

app.use('/polls', require('./routes/polls'));
app.use('/auth', require('./routes/auth'));

const listener = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${listener.address().port}`);
});