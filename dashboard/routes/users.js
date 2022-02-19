var express = require('express');
var bodyParser = require('body-parser');
var controller = require('../../controllers/userController.js');

var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../../models/User');

const user = new User();

/** CREATES A NEW USER BY ADMIN */
router.post('/', controller.create);

/** RETURNS ALL THE USERS IN THE DATABASE*/
router.get('/list', controller.list);

/** GETS A SINGLE USER FROM THE DATABASE */
router.get('/:id', controller.getUserbyId);

/** DELETES A USER FROM THE DATABASE */
router.delete('/:id', controller.deleteUserbyId);

/** UPDATES A SINGLE USER IN THE DATABASE */
router.put('/:id', controller.updateUserbyId);


module.exports = router; 