/**
 * API HTTP Server for use with other modules
 * @module api.js
 * @author Mario Galea
 * @version 1.0
 * @copyright Random Systems International
 */

const Http = require('http');
const Https = require('https');
const FS = require("fs");
const Path = require("path");

const Express = require('express');
var cors = require('cors');

const log = require(Path.join(global.__utilsPath, 'logUtils'));  //<!-- @todo chnage to logger class

/** @global
 *  @description API non-secure port for this app endpoints
*/
global.__apiPort = parseInt(process.env.API_PORT) || 80;

/** @global
 *  @description API secure port for this app endpoints
*/
global.__apiPort_SSL = parseInt(process.env.API_PORT_SSL) || 443;

/** @global
 *  @description absolute Path for the web public directory for this app
*/
global.__api_routesPath = Path.join(global.__root, "api-routes");

var app = Express();

/** @express */
app.disable('x-powered-by');  

app.use(function (req, res, next) {
    log.info({ req: req }, 'api_request');
    next();
});
app.use(cors({ origin: true }));

const credentials = {
    key: FS.readFileSync(Path.resolve(process.env.KEY_FILE)),
    cert: FS.readFileSync(Path.resolve(process.env.CERT_FILE)),
    passphrase: process.env.CERT_PASSPHRASE
};

/** 
The routes are loaded using their filename as the last location of their end-point 
so if testroute.js has a route to /testpage, its endpoint is 'testroute/testpage'

There is an exception to this rule for routes whose filename start with _  
in such cases the routes are loaded with their actual endpoint.   
    
*/

FS.readdirSync(global.__api_routesPath).forEach((file) => {
    var route = require(Path.join(global.__api_routesPath, file));
    app.use(((file.charAt(0) === '_') ? '' : '/api/' + Path.basename(file, '.js')), route);

});

// create the HTTPS server on port 443
var apps_server = Https.createServer(credentials, app).listen(global.__apiPort_SSL, function (err) {
    log.info("API HTTPS Server Listening on Port " + global.__apiPort_SSL);
});

// create an HTTP server on port 80 and redirect to HTTPS
var app_server = Http.createServer(function (req, res) {

    if (req.headers.host) {
        var host = (req.headers.host.indexOf(":") > 0) ? req.headers.host.substring(0, req.headers.host.indexOf(":")) : req.headers.host;

        res.writeHead(301, { "Location": "https://" + host + ":" + global.__apiPort_SSL + req.url });
        res.end();
    }

}).listen(global.__apiPort, function (err) {
    if (err) {
        log.info("[ERROR] Could not start HTTP server on Port " + global.__apiPort_SSL);
    }
    log.info("API HTTP Server Listening on Port " + global.__apiPort);
});


module.exports = apps_server;