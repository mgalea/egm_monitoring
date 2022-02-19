const router = require('express').Router();
const passport = require('passport');
const User = require('../../controllers/userController')

/**
 * -------------- DEFAULT PAGE IF NOT LOGGED IN----------------
 */

function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.message = "Please log in first"
        res.redirect('/login');
    }
}

/**
 * -------------- POST ROUTES ----------------
 */

router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/main' }));
router.post('/register', User.create);

/**
* -------------- GET ROUTES ----------------
*/

router.get('/', (req, res, next) => {
    res.redirect('/login');
});

// When you visit http://localhost/login, you will see "Login Page"
router.get('/login', (req, res, next) => {

    if (req.isAuthenticated()) {
        res.render('main', {
            title: res.locals.brand_title + ' - Main Dashboard',
            header: ''
        })

    } else {
        res.render('login', {
            title: res.locals.brand_title + ' - Login',
            widgetHeader: 'Log in with your username'
        });
    }

});

// When you visit http://localhost:3000/register, you will see "Register User Page"
router.get('/register', (req, res, next) => {

    res.render('register', {
        title: res.locals.brand_title + ' - New User Registration', widgetHeader: 'Fill all the details below', user: req.user
    });

});

// When you visit http://localhost:3000/addDevice, you will see "Register Device Page"
router.get('/addDevice', (req, res, next) => {

    res.render('addDevice', {
        title: res.locals.brand_title + ' - New Device Registration', header: 'Register a new Device', widgetHeader: 'Fill all the details below', device: req.device

    });

});

router.get('/users', isLogged, (req, res, next) => {

    res.render('users', {
        header: 'Registered Users', user:req.user
    })

});

router.get('/viewDevice', isLogged, (req, res, next) => {

    res.render('devices', {
        header: 'Registered Devices', user: req.user
    })

});

//Register a new user
router.get('/password', (req, res, next) => {

    res.render('password', {
        title: res.locals.brand_title + ' - Change user password', widgetHeader: 'Fill all the details below'
    });

});

router.get('/main', isLogged, (req, res, next) => {

    res.render('main', {
        header: 'Hello ' + req.user.username + '.You are Authenticated as ' + req.user.role + ' user.', user: req.user
    })

});

router.get('/sortable', isLogged, (req, res, next) => {

    res.render('sortable', {
        header: 'Registered Users', user: req.user
    })

});


// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.session.destroy(() => {
        res.clearCookie(process.env.PROJ_NAME+'.sid' || 'connect.sid');
        res.redirect('/login');
    });

});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.render('login', { widgetHeader: 'Invalid username or password.', widgetSubheader: 'Try Again' });

});

module.exports = router;