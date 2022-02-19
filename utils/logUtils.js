
const bunyan = require('bunyan');
const path = require('path');
var jwt = require('jsonwebtoken');

const fs = require("fs");
//const fs= require(path.join(global.__utilPath, 'fileUtils'));

function reqSerializer(req) {
    return {
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        user: jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY, function (err, decoded) {
            if (err) return 'anonymous';
            return decoded.id;
        }),
        method: req.method,
        url: req.url,
        headers: req.headers
    };
}

module.exports = bunyan.createLogger({
    name: `${process.env.PROJ_NAME || 'app'}`,
    serializers: { req: reqSerializer },
    streams: [{
        stream: process.stdout,
        level: 'info'
    },
    {
        path: `${path.join(global.__logPath, (process.env.PROJ_NAME || 'app') + '.log')}`,
        level: 'info',
    },
    {
        path: `${path.join(global.__logPath, (process.env.PROJ_NAME || 'app') + '.log')}`,
        level: 'error'
    }
    ]
});
