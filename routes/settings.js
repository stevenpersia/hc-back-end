var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Challenge = require('../models/Challenge.js');
var isAuthenticated = require('../middlewares/isAuthenticated');
var uploadPictures = require('../middlewares/uploadPictures');
var ObjectId = require('mongoose').Types.ObjectId;

// Password
const SHA256 = require('crypto-js/sha256');
const encBase64 = require('crypto-js/enc-base64');

// Show account details
router.get('/:id', isAuthenticated, function(req, res, next) {
	User.findById(req.params.id)
		.exec()
		.then(function(user) {
			if (!user) {
				res.status(404);
				return next('User not found');
			}

			return res.json({
				user
			});
		})
		.catch(function(err) {
			res.status(400);
			return next(err.message);
		});
});

// Update account
router.put('/update/:id', isAuthenticated, uploadPictures, function(
	req,
	res,
	next
) {
	User.findById(req.params.id, function(err, user) {
		if (err) {
			res.status(400);
			return next('An error occured');
		} else {
			if (req.body.security.password) {
				const hash = SHA256(
					req.body.security.password + user.security.salt
				).toString(encBase64);
				user.security.hash = hash;
				req.body.security && Object.assign(user.security, req.body.security);
			}
			req.body.account && Object.assign(user.account, req.body.account);

			if (req.pictures) {
				user.account.avatar = req.pictures;
			}

			user.save(e => {
				console.log(e);
				return res.json(user);
			});
		}
	});
});

// Delete account
router.delete('/remove/:id', isAuthenticated, function(req, res, next) {
	User.remove(
		{
			_id: ObjectId(req.params.id)
		},
		function(err, user) {
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
						{
							owner: ObjectId(req.params.id)
						},
						{
							'date.endDate': {
								$gte: new Date()
							}
						}
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
		}
	);
});

module.exports = router;
