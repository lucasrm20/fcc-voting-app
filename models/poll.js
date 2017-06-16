'use strict';

const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const pollSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    options: [optionSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

pollSchema.virtual('totalVotes')
    .get(function() {

        return this.options.reduce((total, option) => {
            return total + option.votes.length;
        }, 0);
        
    });

pollSchema.methods.userVoted = function(user) {

    if (!user) return false;

    return this.options.some(option => {
        return option.votes.some(vote => {
            return vote.equals(user._id);
        });
    });

};

module.exports = mongoose.model('Poll', pollSchema);