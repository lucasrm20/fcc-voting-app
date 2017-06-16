'use strict';

const express = require('express');
const router = express.Router();

const auth = require('./../middlewares/auth');

const Poll = require('./../models/poll');

router.get('/new', auth.isLoggedIn, (req, res) => {
    res.render('polls/new');
});

router.route('/')
    .get((req, res, next) => {

        Poll.find({})
            .populate('author')
            .exec()
            .then(polls => res.render('polls/all', { polls }))
            .catch(err => next(err));

    })
    .post(auth.isLoggedIn, (req, res, next) => {

        const newPoll = req.body.poll;
        
        newPoll.options = newPoll.options.map(option => {
            return { description: option };
        });

        newPoll.author = req.user;

        Poll.create(newPoll)
            .then(poll => res.redirect(`/polls/${poll._id}`))
            .catch(err => next(err));

    });

router.route('/:pollId')
    .get((req, res, next) => {

        Poll.findById(req.params.pollId)
            .populate('author')
            .exec()
            .then(poll => {
                res.format({
                    'text/html': () => res.render('polls/show', { poll }),
                    'application/json': () => res.json(poll)
                });
            })
            .catch(err => next(err));
    
    })
    .put(auth.checkPollOwnership, (req, res, next) => {

        let newOptions = req.body.poll.options;
            
        newOptions = newOptions.map(option => {
            return { description: option };
        });

        Poll.findById(req.params.pollId)
            .then(poll => {
                
                poll.options = poll.options.concat(newOptions);
                poll.save()
                    .then(() => res.redirect(`/polls/${poll._id}/edit`))
                    .catch(err => next(err));
                
            })
            .catch(err => next(err));

    })
    .delete(auth.checkPollOwnership, (req, res, next) => {

        Poll.findByIdAndRemove(req.params.pollId)
            .then(() => res.redirect('back'))
            .catch(err => next(err));

    });

router.get('/:pollId/edit', auth.checkPollOwnership, (req, res, next) => {

    Poll.findById(req.params.pollId)
        .then(poll => res.render('polls/edit', { poll }))
        .catch(err => next(err));

});

router.post('/:pollId/vote', auth.checkIfUserAlreadyVoted, (req, res, next) => {
    
    Poll.findById(req.params.pollId)
        .then(poll => {

            poll.options
                .id(req.body.vote)
                .votes
                .push(req.user);

            poll.save()
                .then(() => res.redirect(`/polls/${req.params.pollId}`))
                .catch(err => next(err));
        
        })
        .catch(err => next(err));
});

module.exports = router;