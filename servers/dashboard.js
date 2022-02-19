var http = require('http');
var https = require('https');
var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var FileStore = require('session-file-store')(session);

var fs = require('fs');
var path = require('path');

var cookieParser = require('cookie-parser');

const log = require('../utils/logUtils.js')
const passport = require('passport');
require("../controllers/passportController")(passport)

/** @global
 *  @description API non-secure port for this app endpoints
*/
global.__dashboardPort = process.env.DASHBOARD_PORT || 8080;

/** @global
 *  @description API secure port for this app endpoints
*/
global.__dashboardPort_SSL = process.env.DASHBOARD_PORT_SSL || 8443;

/** @global
 *  @description absolute path for the web public directory for this app
*/
global.__dashboardPath = path.join(global.__root, "dashboard");

var app = express();
app.disable('x-powered-by');  /* IMPORTANT  - Security Vulnerability disable exposing express engine to client */

// Dashboard view engine setup
app.set('views', path.join(global.__dashboardPath, 'views'));
app.set('view engine', 'pug');

/**
 * -------------- EXPRESS MIDDLEWARE ----------------
 */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    store: new FileStore({ retries: 0 }),
    secret: process.env.SECRET_KEY || 'I aint afraid of no ghost',
    resave: false,
    saveUninitialized: false,
    name: (process.env.PROJ_NAME + '.sid') || 'connect.sid',
    cookie: {
        secure: true,
        expires:false,
        maxAge: 1000 * 60 * 60 * 1,
    }
})
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

app.use((req, res, next) => {     //any global variables to be passed to the render engine  go here
    res.locals.session = req.session
    res.locals.brand_title = process.env.BRAND_TITLE;
    res.locals.brand_subtitle = process.env.BRAND_SUBTITLE;
    res.locals.brand_image = process.env.BRAND_LOGO_RELATIVE_PATH;
    log.info({ req: req }, 'dashboard_request');
    next()
})

/* 
The routes are loaded using their filename as the last location of their end-point 
so if testroute.js has a route to /testpage, its endpoint is 'testroute/testpage'

There is an exception to this rule for routes whose filename start with _  (underscore)
in such cases the routes are loaded with their actual endpoint.    
*/

fs.readdirSync(path.join(global.__dashboardPath, 'routes')).forEach((file) => {
    var route = require(path.join(global.__dashboardPath, 'routes',file));
    app.use('/' + ((path.basename(file).charAt(0) == '_') ? '' : path.basename(file, '.js')), route);
});

/**
 * Catch 404 errors and forward to error handler
 * This statement must always follow the routes 
 */

app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    if (res.headersSent) { res.status(err.status || 500).end('Missing file') }
    else { 
    res.status(err.status || 500);
    res.render('error');
    }
});

// create the HTTPS server 
var credentials = {
    key: fs.readFileSync(process.env.KEY_FILE),
    cert: fs.readFileSync(path.resolve(process.env.CERT_FILE)),
    passphrase: process.env.CERT_PASSPHRASE
};

var dashboard_ssl_server = https.createServer(credentials, app).listen(global.__dashboardPort_SSL, function (err) {
    log.info("Dashboard HTTPS Server Listening on Port " + global.__dashboardPort_SSL);
});

// create an HTTP server on a port and redirect to HTTPS
var dashboard_server = http.createServer(function (req, res) {

    if (req.headers.host) {
        var host = (req.headers.host.indexOf(":") > 0) ? req.headers.host.substring(0, req.headers.host.indexOf(":")) : req.headers.host;

        res.writeHead(301, { "Location": "https://" + host + ":" + global.__dashboardPort_SSL + req.url });
        res.end();
    }

}).listen(global.__dashboardPort, function (err) {
    log.info("Dashboard HTTP Server Listening on Port " + global.__dashboardPort);
});

module.exports = dashboard_ssl_server;
module.exports = dashboard_server;
