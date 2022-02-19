var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var cors = require('cors');
//var passport = require('passport');
var fs = require('fs');
var path = require('path');
var FileStore = require('session-file-store')(session);
var cookieParser = require('cookie-parser');

/** @global
 *  @description API non-secure port for this app endpoints
*/
global.__apiPort = process.env.API_PORT || 80;

/** @global
 *  @description API secure port for this app endpoints
*/
global.__apiPort_SSL = process.env.API_PORT_SSL || 443;

/** @global
 *  @description absolute path for the web public directory for this app
*/
global.__routesPath = path.join(global.__root, "routers");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.disable('x-powered-by');  /* IMPORTANT  - Security Vulnerability disable exposing express engine to client */

/**
 * -------------- EXPRESS MIDDLEWARE ----------------
 */
app.use(cors({ origin: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: new FileStore({ retries: 0 }),
    secret: process.env.SECRET_KEY || '412169M',
    resave: false,
    saveUninitialized: false,
    name: process.env.PROJ_NAME + '.sid' || 'connect.sid',
    cookie: {
        maxAge: process.env.COOKIE_MAX_AGE || 1000 * 60 * 60 * 24,
    }
})
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

//app.use(passport.initialize());
//app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

app.use((req, res, next) => {     //any global variables to be passed to the render engine  go here
    res.locals.session = req.session
    res.locals.brand_title = process.env.BRAND_TITLE;
    res.locals.brand_subtitle = process.env.BRAND_SUBTITLE;
    res.locals.brand_image = process.env.BRAND_LOGO_RELATIVE_PATH;
    log.info({ req: req }, 'api_request');
    next()
})

/** 
The routes are loaded using their filename as the last location of their end-point 
so if testroute.js has a route to /testpage, its endpoint is 'testroute/testpage'

There is an exception to this rule for routes whose filename start with _  (underscore)
in such cases the routes are loaded with their actual endpoint.    
*/

fs.readdirSync(global.__routesPath).forEach((file) => {
    var route = require(path.join(global.__routesPath, file));
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
    res.status(err.status || 500);
    res.render('error');
});

// create the HTTPS server on port 443
var apps_server = https.createServer(credentials, app).listen(global.__apiPort_SSL, function (err) {
    log.info("Node.js Express HTTPS Server Listening on Port " + global.__apiPort_SSL);
});

// create an HTTP server on port 80 and redirect to HTTPS
var app_server = http.createServer(function (req, res) {
    var portValueIndex = req.headers['host'].indexOf(":");
    if (portValueIndex > 0) {
        var host = req.headers['host'].substring(0, req.headers['host'].indexOf(":"));
    } else {
        var host = req.headers['host'];
    }
    res.writeHead(301, { "Location": "https://" + host + ":" + global.__apiPort_SSL + req.url });
    res.end();
}).listen(global.__apiPort, function (err) {
    log.info("Node.js Express HTTP Server Listening on Port " + global.__apiPort);
});

module.exports = apps_server;
module.exports = app_server;
