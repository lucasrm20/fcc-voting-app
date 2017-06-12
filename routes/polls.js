'use strict';

const express = require('express');
const router = express.Router();

const auth = require('./../middlewares/auth');

const Poll = require('./../models/poll');

router.get('/new', auth.isLoggedIn, (req, res) => {
    res.render('polls/new');
});

router.route('/')
    .get((req, res) => {
        res.render('polls/all');
    })
    .post(auth.isLoggedIn, (req, res) => {

        const newPoll = req.body.poll;
        
        newPoll.options = newPoll.options.map(option => {
            return { description: option };
        });

        newPoll.author = req.user;


        Poll.create(newPoll)
            .then(poll => res.redirect(`/polls/${poll._id}`))
            .catch(err => res.json(err));

    });

router.route('/:pollId')
    .get((req, res) => {

        Poll.findById(req.params.pollId)
            .populate('author')
            .exec()
            .then(poll => res.render('polls/show', { poll }))
            .catch(err => res.json(err));
    
    });

router.post('/:pollId/vote', (req, res) => {
    
    Poll.findById(req.params.pollId)
        .then(poll => {

            poll.options
                .id(req.body.vote)
                .votes
                .push(req.user);

            poll.save()
                .then(() => res.redirect(`/polls/${req.params.pollId}`))
                .catch(err => res.json(err));
        
        })
        .catch(err => res.json(err));
});

module.exports = router;