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
    
    })
    .put(auth.checkPollOwnership, (req, res) => {

        let newOptions = req.body.poll.options;
            
        newOptions = newOptions.map(option => {
            return { description: option };
        });

        Poll.findById(req.params.pollId)
            .then(poll => {
                
                poll.options = poll.options.concat(newOptions);
                poll.save()
                    .then(() => res.redirect(`/polls/${poll._id}/edit`))
                    .catch(err => res.json(err));
                
            })
            .catch(err => res.json(err));

    })
    .delete(auth.checkPollOwnership, (req, res) => {

        Poll.findByIdAndRemove(req.params.pollId)
            .then(() => res.redirect('back'))
            .catch(err => res.json(err));

    });

router.get('/:pollId/edit', auth.checkPollOwnership, (req, res) => {

    Poll.findById(req.params.pollId)
        .then(poll => res.render('polls/edit', { poll }))
        .catch(err => res.json(err));

});

router.post('/:pollId/vote', auth.isLoggedIn, (req, res) => {
    
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