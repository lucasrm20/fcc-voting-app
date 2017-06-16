'use strict';

const express = require('express');
const router = express.Router();

const User = require('./../models/user');
const passport = require('./../config/passport');

router.route('/register')
    .get((req, res) => res.render('auth/register'))
    .post((req, res) => {

        User.register({ username: req.body.username }, req.body.password, (err, user) => {

            if (err) {
                return res.redirect('/auth/register');
            }

            passport.authenticate('local')(req, res, () => {
                res.redirect('/polls');
            });

        });

    });

router.route('/login')
    .get((req, res) => res.render('auth/login'))
    .post(passport.authenticate('local', { successRedirect: '/polls', failureRedirect: '/auth/login' }));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { successRedirect: '/polls', failureRedirect: '/auth/login' }));

router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', { successRedirect: '/polls', failureRedirect: '/auth/login' }));

module.exports = router;