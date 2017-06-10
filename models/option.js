'use strict';

const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Option', optionSchema);