var express = require('express');
var bodyParser = require('body-parser');
var controller = require('../controllers/userController.js');

var router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
var User = require('../models/User');

const user = new User();

/** CREATES A NEW USER BY ADMIN */
router.post('/', user.verifyToken('admin'), controller.create);

/** RETURNS ALL THE USERS IN THE DATABASE*/
router.get('/', user.verifyToken('admin'), controller.list);

/** GETS A SINGLE USER FROM THE DATABASE */
router.get('/:id', user.verifyToken('admin'), controller.getUserbyId);

/** DELETES A USER FROM THE DATABASE */
router.delete('/:id', user.verifyToken('admin'), controller.deleteUserbyId);

/** UPDATES A SINGLE USER IN THE DATABASE */
router.put('/:id', user.verifyToken('admin'), controller.updateUserbyId);

module.exports = router; 