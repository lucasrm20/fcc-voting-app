'use strict';

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/auth/login');

};

function provideLoggedUserForTemplates(req, res, next) {

    res.locals.loggedUser = req.user;
    next();

};

module.exports = { isLoggedIn, provideLoggedUserForTemplates };