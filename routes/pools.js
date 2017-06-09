'use strict';

const express = require('express');
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('pools/new');
});

router.route('/')
    .post((req, res) => {
        res.json(req.body);
    });

module.exports = router;