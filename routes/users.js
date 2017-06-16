'use strict';

const express = require('express');
const router = express.Router();

const Poll = require('./../models/poll');
const auth = require('./../middlewares/auth');

router.route('/polls')
    .get(auth.isLoggedIn, (req, res, next) => {

        Poll.find({ author: req.user })
            .then(polls => {
                res.render('user/polls', { polls });
            })
            .catch(err => next(err));

    });

module.exports = router;