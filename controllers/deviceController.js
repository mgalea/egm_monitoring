/**
 * AuthUtilities
 * @module Device Controllers
 * @author Mario Galea
 * @version 1.0
 * @copyright Random Systems International
 */

var Device = require('../models/Device');

var controllers =
{
    //TODO Need to insert data validation checks
    create: function (req, res) {
        const device = new Device();

        device.device_id = req.body.device_id;
        device.location_id = req.body.location_id;
        device.install_date = req.body.install_date;
        device.save(function (err) {
            if (err) return res.status(500).send(err);
            res.status(200).send({save: true});
        });
    },

    list: function (req, res) {
        Device.find({}, function (err, devices) {
            if (err) return res.status(500).send("There was a problem finding the devices.");
            res.status(200).json(devices);
        });
    },
    getDevicebyId: function (req, res) {
        Device.findById(req.params.id, function (err, device) {
            if (err) return res.status(500).send("There was a problem finding the device.");
            if (!device) return res.status(404).send("No such device found.");
            res.status(200).json(device);
        });
    },
    updateDevicebyId: function (req, res) {
        Device.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, device) {
            if (err) return res.status(500).send("There was a problem updating the device.");
            res.status(200).json(device);
        });
    },
    deleteDevicebyId: function (req, res) {
        Device.findByIdAndRemove(req.params.id, function (err, device) {
            if (err) return res.status(500).send("There was a problem deleting the device.");
            res.status(200).send("Device: " + device.id + " was deleted.");
        });
    }

}

module.exports = controllers;