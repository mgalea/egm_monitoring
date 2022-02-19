/**
 * HTTP File Upload Controller
 * @module File Controllers
 * @author Mario Galea
 * @version 1.0
 * @copyright Random Systems International
 */

const LogFile = require('../models/LogFile');

var controllers =
{
    FindNode: function (req, res) {
            //req.params.filename 
        const logFile = new LogFile({ filename: req.params.filename });
        logFile.findFilebyName(function (err, result) {
            res.status(200).json(result);
        });
    },

    getMap: function (req, res) {
  
        res.status(200).json(zoo.map);

    }

}

module.exports = controllers;
