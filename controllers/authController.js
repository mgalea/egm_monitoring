/**
 * Authentication Utilities
 * @module Authentication Controllers
 * @author Mario Galea
 * @version 1.0
 * @copyright Random Systems International
 */

var User = require('../models/User');
var Path = require('path');
const log = require(Path.join(global.__utilsPath, 'logUtils'));

var controllers =
{
    register: function (req, res) {
        const user = new User();
        user.username = req.body.username;
        user.name = req.body.name;
        user.email = req.body.email;
        user.role = 'basic';       //<!-- self registered users are given a basic access by default
        user.active = true;
        user.org_name = req.body.org;
        user.org_id = req.body.org_id;
        User.countDocuments({
            $or: [{ username: { $regex: new RegExp(req.body.username, "i") } },
            { email: { $regex: new RegExp(req.body.email, "i") } }]
        }, function (err, count) {
            if (count > 0) {
                res.status(200).send({
                    'registered': false,
                    'isExisted': true,
                });
            } else {
                user.setPassword(req.body.password);
                user.save(function (err) {
                    if (err) return res.status(500).send(err);
                    var token = user.signToken();
                    res.status(200).json({ auth: true, token: token });
                });
            }
        });
    },
    authenticate: function (req, res) {
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) return res.status(500).json({ auth: true, token: null, message: err });
            if (!user) return res.status(404).json({ auth: false, token: null, message: 'no such user' });

            if (!user.validPassword(req.body.password)) {
                return res.status(404).json({ auth: false, token: null, message: 'wrong password' });
            }
            var token = user.signToken();
            log.info('[API Event] User ' + req.body.username + ' logged in.')
            // return the information including token as JSON
            res.status(200).json({ auth: true, token: token, role: user.role });
        });

    },

    logout: function (req, res) {
        res.status(200).send({ auth: false, token: null });
    },

    me: function (req, res) {
        res.status(200).send(req.userId);
    },
    //@todo this is hardwired to the FPR-serve. Needs to be a generic function
    authUser: function (username, password, cb) {

        User.findOne({ username: username }, function (err, user) {
            if (err) cb('Lost Db Connection',null);
            
            if (!user) {
                cb('Bad username', null);
            }
            else {
                if (user.validPassword(password)) {

                    cb(null, user);

                } else {
                    cb('Bad password', null);
                }
            }
        })
    }
}

module.exports = controllers;