'use strict';

require('dotenv').config();

const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('App running');
});

const listener = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${listener.address().port}`);
});