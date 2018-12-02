var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Challenge = require('../models/Challenge.js');
var isAuthenticated = require('../middlewares/isAuthenticated');
var ObjectId = require('mongoose').Types.ObjectId;

// Show account details
router.get('/:id', isAuthenticated, function(req, res, next) {
	User.findById(req.params.id)
		.exec()
		.then(function(user) {
			if (!user) {
				res.status(404);
				return next('User not found');
			}

			return res.json({ user });
		})
		.catch(function(err) {
			res.status(400);
			return next(err.message);
		});
});

// Update account
router.put('/update', isAuthenticated, function(req, res, next) {});

// Delete account
router.delete('/remove/:id', isAuthenticated, function(req, res, next) {
	User.remove({ _id: ObjectId(req.params.id) }, function(err, user) {
		if (err) {
			return next(err.message);
		}
		if (!user) {
			res.status(404);
			return next('Nothing to delete');
		}
		Challenge.remove(
			{
				$and: [
					{ owner: ObjectId(req.params.id) },
					{ 'date.endDate': { $gte: new Date() } }
				]
			},
			function(err, challengeFound) {
				if (err) {
					return next(err.message);
				}
				if (!challengeFound) {
					res.status(404);
					return next('No challenge to delete');
				}
			}
		);
		return res.json({
			message: 'Account and challenges of account (date not passed) deleted'
		});
	});
});

module.exports = router;
