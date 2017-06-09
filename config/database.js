'use strict';

const mongoose = require('mongoose');

module.exports = function() {

    const dbHost = 'localhost';
    const dbName = 'fcc-poll';

    const uri = `mongodb://${dbHost}/${dbName}`;

    mongoose.connect(uri);
    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => {
        console.log(`Database connected to: ${uri}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.log(`Database disconnected from: ${uri}`);
    });

    mongoose.connection.on('error', err => {
        console.log(`Database error on connection: ${err}`);
    });

    process.on('SIGINT', () => {

        mongoose.connection.close(() => {
            console.log('Database disconnected due the end of application');
            process.exit(0);
        });

    });

};