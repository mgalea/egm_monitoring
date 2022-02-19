/**
 *  DO NOT CHANGE THE LOADING SEQUENCE BELOW
 */

const DotEnv = require('dotenv').config({ debug: process.env.DEBUG });  //<!-- MUST ALWAYS BE AT THE VERY START OF THE APPLICATION. LOADS ALL ENVIRONMENTAL VARIABLES
if (DotEnv.error) {
    throw result.error;
}
const DotEnvExpand = require('dotenv-expand');
DotEnvExpand(DotEnv);

const Path = require('path');
const Os = require('os');
const FS = require('fs');
const _ = require('lodash');


/** 
 * @global 
 * @description absolute Path for the root directory for this app
*/
global.__root = Path.join(__dirname, '/'); /**@constant global.__root absolute Path for the root directory for this app */

/** 
 * @global 
 * @description absolute Path for the temp directory for this Os
*/
global.__tmpPath = Os.tmpdir();


/************************** INTERNAL PathS ************************************/
/** 
 * @global 
 * @description absolute Path for the utilities directory
*/
global.__utilsPath = Path.join(__dirname, "utils");

/** 
 * @global 
 * @description absolute Path for the utilities directory
*/
global.__libPath = Path.join(__dirname, "lib");

/** 
 * @global 
 *  @description absolute Path for the  server modules directory
*/
global.__serversPath = Path.join(__dirname, "servers");

/** 
 *  @global 
 *  @description absolute Path for the database models directory
*/
global.__modelsPath = Path.join(__dirname, "models");

/** 
 *  @global 
 *  @description absolute Path for the web public directory for this app
*/
global.__publicPath = Path.join(__dirname, "public");

/** 
 *  @global 
 *  @description absolute Path for the controllers  directory for this app
*/
global.__controllersPath = Path.join(__dirname, "controllers");

const color = require(Path.join(global.__utilsPath, 'color'));
var Debug = (function () {
    var savedConsole = console;
    return function (debugOn, suppressAll) {
        var suppress = suppressAll || false;
        if (debugOn === false) {
            console = {};
            console.log = function () { };
            if (suppress) {
                console.info = function () { };
                console.warn = function () { };
                console.error = function () { };
            } else {
                console.info = savedConsole.info;
                console.warn = savedConsole.warn;
                console.error = savedConsole.error;
            }
        } else {
            console = savedConsole;
        }
    }
});
/************************** EXTERNAL PATHS ************************************/

/** 
 *  @global
 *  @constant global.__logPath the top directory that holds the logs
 *  @description absolute Path for the schema directory for this app
*/
if (process.env.LOG_DIR) {      //if environment variable exist then use it 
    global.__logPath = Path.isAbsolute(process.env.LOG_DIR) ? process.env.LOG_DIR : Path.join(global.__root, process.env.LOG_DIR);
    FS.access(global.__logPath, FS.constants.F_OK | FS.constants.R_OK | FS.constants.W_OK, (err) => {
        if (err && err.code === 'ENOENT') {
            console.error(`${global.__logPath}  does not exist. Trying to create....`);
            FileUtils.createDir(global.__logPath, { isRelativeToscript: false });
        } else {
            if (process.env.DEBUG) console.log(`Log folder ${global.__logPath} exists, and it is readable/writable`);
        }
    }
    );
} else { global.__logPath = process.env.LOG_DIR = __dirname; }


require(Path.join(global.__utilsPath, 'dbUtils'));
const FileUtils = require(Path.join(global.__utilsPath, 'fileUtils'));

if (process.env.WELCOME_MSG) //@todo App breaks here if process.env.WELCOME_MSG is null
{
    //process.stdout.write(color.byNum());

    process.stdout.write(color.byNum((process.env.WELCOME_MSG.toString() + '\n'), 31, 31));
}
FS.readdirSync(global.__serversPath).forEach((file) => {
    require(Path.join(global.__serversPath, file));
});