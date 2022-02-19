/**
 * @module User Authorization Router
 * @description Authorization route endpoints
 */

const Express = require('express');
const router = Express.Router();

const Controller = require('../controllers/authController.js');
const User = require('../models/User');

const user = new User();

router.use(Express.urlencoded({ extended: true }));
router.use(Express.json());

router.post('/register', Controller.register)
router.post('/login', Controller.authenticate);
router.get('/logout', Controller.logout);
router.get('/me', user.verifyToken(['admin', 'basic']), Controller.me);

module.exports = router;