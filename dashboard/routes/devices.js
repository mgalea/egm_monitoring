var express = require('express');
var bodyParser = require('body-parser');
var controller = require('../../controllers/deviceController.js');

var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


/** CREATES A NEW DEVICE BY ADMIN */
router.post('/register', controller.create);

/** RETURNS ALL THE DEVICES IN THE DATABASE*/
router.get('/list', controller.list);

/** GETS A SINGLE DEVICE FROM THE DATABASE */
router.get('/:id', controller.getDevicebyId);

/** DELETES A DEVICE FROM THE DATABASE */
router.delete('/:id', controller.deleteDevicebyId);

/** UPDATES A SINGLE DEVICE IN THE DATABASE */
router.put('/:id', controller.updateDevicebyId);


module.exports = router; 