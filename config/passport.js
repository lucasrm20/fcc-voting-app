'use strict';

const passport = require('passport');

const LocalStrategy = require('passport-local');
const GitHubStrategy = require('passport-github').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const User = require('./../models/user');

passport.use(new LocalStrategy(User.authenticate()));

passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: `${process.env.HOSTNAME}/auth/github/callback`
    }, (accessToken, refreshToken, profile, done) => {

        User.findOrCreate({ username: profile.username }, (err, user) => {
                
            if (err) {
                console.log(err);
                return done(err);
            }

            return done(null, user);
        });
    }));

passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_ID,
        consumerSecret: process.env.TWITTER_SECRET,
        callbackURL: `${process.env.HOSTNAME}/auth/twitter/callback`
    }, (accessToken, refreshToken, profile, done) => {

        User.findOrCreate({ username: profile.username }, (err, user) => {
                
            if (err) {
                console.log(err);
                return done(err);
            }

            return done(null, user);
        });
    }));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;