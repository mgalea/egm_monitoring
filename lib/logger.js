/**
 * logger.js
 * 
 * Wrapper code to provide a standard API for logging in  EARP
 * The current class uses bunyan as its logger but you can build  
 * any logger as long as it has the following methods:
 * 
 *  'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
 */

const bunyan = require('bunyan');
var RotatingFileStream = require('bunyan-rotating-file-stream');
const { createLogger } = bunyan;

/**
 * HTTP Request serializer
 * A serializer function for bunyan to log HTTP Header details
 * @param {*} req -the request object returned express.js
 * @returns NULL
 */
function reqSerializer(req) {
    return {
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        method: req.method,
        url: req.url,
    };
}

module.exports = class extends bunyan {
    logName = process.env.PROJ_NAME;
    path = process.env.PROJ_NAME;

    constructor(logName, path) {
        super({ name: logName });
        return createLogger(
            {
                name: logName,
                src: false,
                serializers: { req: reqSerializer },
                streams: [{
                    stream: process.stdout,
                    level: 'info'
                },
                {
                    path: `${(path || process.env.PROJ_NAME)+ '.log'}`,
                    level: 'info',
                }
                ]
                
            })
    }

}