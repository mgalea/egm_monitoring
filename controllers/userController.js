/**
 * AuthUtilities
 * @module User Controllers
 * @author Mario Galea
 * @version 1.0
 * @copyright Random Systems International
 */

var User = require('../models/User');

var controllers =
{
    //TODO Need to insert data validation checks
    create: function (req, res) {
        const user = new User();

        user.username = req.body.username;
        user.name = req.body.name;
        user.email = req.body.email;
        user.role = req.body.role;          //<!-- self registered users are given a basic access by default
        user.org_name = req.body.org;
        user.org_id = req.body.org_id;
        user.active = true;
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
                    res.status(200).send({ auth: true, token: token });
                });
            }
        });
    },

    list: function (req, res) {
        User.find({}, function (err, users) {
            if (err) return res.status(500).send("There was a problem finding the users.");
            res.status(200).json(users);
        });
    },
    getUserbyId: function (req, res) {
        User.findById(req.params.id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            res.status(200).json(user);
        });
    },
    updateUserbyId: function (req, res) {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).json(user);
        });
    },
    deleteUserbyId: function (req, res) {
        User.findByIdAndRemove(req.params.id, function (err, user) {
            if (err) return res.status(500).send("There was a problem deleting the user.");
            res.status(200).send("User: " + user.name + " was deleted.");
        });
    }

}

module.exports = controllers;