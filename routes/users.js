'use strict';

const express = require('express');
const router = express.Router();

const Poll = require('./../models/poll');
const auth = require('./../middlewares/auth');

router.route('/polls')
    .get(auth.isLoggedIn, (req, res) => {

        Poll.find({ author: req.user })
            .then(polls => {
                res.render('user/polls', { polls });
            })
            .catch(err => res.json(err));

    });

module.exports = router;