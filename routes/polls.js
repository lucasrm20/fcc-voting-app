'use strict';

const express = require('express');
const router = express.Router();

const Poll = require('./../models/poll');

router.get('/new', (req, res) => {
    res.render('polls/new');
});

router.route('/')
    .post((req, res) => {

        const newPoll = req.body.poll;
        newPoll.options = newPoll.options.map(option => {
            return { description: option };
        });

        Poll.create(newPoll)
            .then(poll => res.redirect(`/polls/${poll._id}`))
            .catch(err => res.json(err));

    });

router.route('/:pollId')
    .get((req, res) => {

        Poll.findById(req.params.pollId)
            .then(poll => res.render('polls/show', { poll }))
            .catch(err => res.json(err));
    
    });

module.exports = router;