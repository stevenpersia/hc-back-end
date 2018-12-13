var express = require('express');
var router = express.Router();
var User = require('../models/User.js');

const SHA256 = require('crypto-js/sha256');
const encBase64 = require('crypto-js/enc-base64');

router.post('/', function(req, res, next) {
	User.findOne({
		'account.phoneNumber': req.body.account.phoneNumber
	}).exec(function(err, user) {
		if (err) return next(err.message);
		if (user) {
			if (
				SHA256(req.body.account.password + user.security.salt).toString(
					encBase64
				) === user.security.hash
			) {
				return res.json({
					_id: user._id,
					security: {
						token: user.security.token
					},
					account: user.account
				});
			} else {
				return res.status(401).json({
					error: 'Unauthorized'
				});
			}
		} else {
			return next('User not found');
		}
	});
});

// Mot de passe oublié sans auth
router.put('/forgot', function(req, res, next) {
	User.findOne({
		'account.phoneNumber': req.body.account.phoneNumber
	}).exec(function(err, user) {
		if (err) {
			res.status(400);
			return next('An error occured');
		} else {
			const hash = SHA256(
				req.body.security.password + user.security.salt
			).toString(encBase64);
			user.security.hash = hash;

			user.save(e => {
				console.log(e);
				return res.json(user);
			});
		}
	});
});

module.exports = router;
