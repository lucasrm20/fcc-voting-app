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
                console.log(err);
                return res.redirect('/auth/register');
            }

            passport.authenticate('local')(req, res, () => {
                res.redirect('/polls');
            });

        });

    });

router.route('/login')
    .get((req, res) => res.render('auth/login'))
    .post(passport.authenticate('local', { successRedirect: '/polls', failureRedirect: '/auth/login' }), (req, res) => {});

module.exports = router;