/**
 * Base module to initialize an incoming data document 
 * for processing using the LocalStorage Method
 * @module initialize.js Name Tester Processing Module
 * @author Mario Galea
 * @version 1.0
 * @copyright Random Systems International
 */

const Path = require('path');
const fs = require('fs');
const Logger = require('./logger');
const LocalStorage = require('node-localstorage').LocalStorage;


/**
 * Check that the zoo is in order. We need to make sure that all nodes have unique names
 * The nodes use the UUID standard {@link https://en.wikipedia.org/wiki/Universally_unique_identifier}
 * However the UUID is too long in human readable form so we shorten it by using a text=to-binary algorithm
 * for UUID  @requires {uuid} - {@link https://www.npmjs.com/package/uuid}
 * for short @requires {short-uuid} - {@link https://www.npmjs.com/package/short-uuid}
 */

const short = require('short-uuid');
const uuid = require('uuid');

class ValidationError extends Error {
    constructor(message) {
        super(message);
        throw Error(message);
    }

}
var tempUUID;

/**
 * The ObjectStore Module creates a LocalStorage Object. 
 * If the LocalStorage already exists use existing local store
 * @module ObjectStore
 */
module.exports = class ObjectStore {
    constructor(object) {

        if (typeof object != 'object') {
            return new ValidationError("Not a valid argument. Must be an object");
        }

        this.translator = short('123456789abcdefghijklmnopqrstuvwxyzABCDEFGHJIKLMNOPQRSTUVWXYZ'); // Defaults to flickrBase58 coding algorithm

        //if the object store already exists then take the filename as UUID and go straight to th instance
        if (object.exist && object.exist == true) {
            tempUUID = Path.basename(object.filename);
        } else {
            try {
                do {
                    tempUUID = this.translator.new();
                } while (fs.existsSync(Path.join(global.zoo.flowData, tempUUID)));  //make sure that the UUID is really unique
            } catch (err) {
                console.error(err);
                return null;
            }
        }

        this.ls = new LocalStorage(Path.join(global.zoo.flowData, tempUUID));
        this.uuid = tempUUID;

        return this;
    }

    /**
     *
     * @param {string} logName a friendly name for the logger
     * @param {string} logPath the full path to the lof file
     */
    logInit(logName, logPath) {
        return new Logger(logName, (Path.join((logPath || global.__logPath || ''), (process.env.PROJ_NAME || 'main'))));

    }

    isUUID(str) {
        if (typeof str != 'string') return false;
        return uuid.validate(str);
    }

}