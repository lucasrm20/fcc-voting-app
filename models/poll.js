'use strict';

const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    }
});

const pollSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    options: [optionSchema]
});

module.exports = mongoose.model('Poll', pollSchema);