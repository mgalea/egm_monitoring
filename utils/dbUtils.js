const mongoose = require('mongoose');
const path = require('path');
const EventEmitter = require('events');
const log = require(path.join(global.__utilsPath, 'logUtils'));

let gracefulShutdown;
const db = mongoose.connection;

const dbEmitter = new EventEmitter();

var tryOnce = 0;

var connectWithRetry = function () {
    try {
        return mongoose
            .connect(process.env.DB_URI, {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                bufferCommands: false,
                serverSelectionTimeoutMS: 1000, // Keep trying to send operations for 5 seconds
                heartbeatFrequencyMS: 500,
                family: 4
            });
    } catch (err) {
        console.log('DB now working');
    }
};

db.on('connected', function () {
    log.info('DB connected to ' + process.env.DB_URI);
    dbEmitter.emit('DBCONNECT');
});
db.on('error', function (err) {
    log.error('DB connection error: ' + err.message);
    setTimeout(connectWithRetry, 5000);
    dbEmitter.emit('DBERROR');
});
db.on('disconnected', function () {
    log.info('DB disconnected');
   dbEmitter.emit('DBDISCONNECT');
});

connectWithRetry();

gracefulShutdown = function (msg, callback) {
    db.close(function () {
        log.info('DB disconnected through ' + msg);
        callback();
    });
};

//DEV function
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

//PRODUCTION function
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});

module.exports = dbEmitter;