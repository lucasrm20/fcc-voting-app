'use strict';

const Poll = require('./../models/poll');

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/auth/login');

};

function provideLoggedUserForTemplates(req, res, next) {

    res.locals.loggedUser = req.user;
    next();

};

function checkPollOwnership(req, res, next) {

    isLoggedIn(req, res, () => {

        Poll.findById(req.params.pollId, 'author')
            .then(poll => {

                if (poll.author.equals(req.user._id))
                    next();
                else
                    res.redirect('back');

            })
            .catch(err => {
                res.json(err);
            });

    });

};

function checkIfUserAlreadyVoted(req, res, next) {

    isLoggedIn(req, res, () => {

        Poll.findById(req.params.pollId)
            .then(poll => {

                let userVoted = poll.options.some(option => {
                    return option.votes.some(vote => {
                        return vote.equals(req.user._id);
                    });
                });

                if (userVoted) res.redirect('back');
                else next();

            })
            .catch(err => res.json(err));

    }); 

};

module.exports = { isLoggedIn, provideLoggedUserForTemplates, checkPollOwnership, checkIfUserAlreadyVoted };