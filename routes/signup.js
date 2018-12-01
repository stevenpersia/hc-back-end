var express = require('express');
var router = express.Router();
var User = require('../models/User.js');

// Password
var uid2 = require('uid2');
const SHA256 = require('crypto-js/sha256');
const encBase64 = require('crypto-js/enc-base64');

router.post('/', function(req, res, next) {
	const token = uid2(64);
	const salt = uid2(64);
	const hash = SHA256(req.body.password + salt).toString(encBase64);

	// Rendre username, password, phone obligatoire
	const user = new User({
		account: {
			username: req.body.username,
			email: req.body.email,
			phoneNumber: req.body.phone,
			avatar: req.body.avatar,
			interests: req.body.interests
		},
		security: {
			token: token,
			hash: hash,
			salt: salt,
			pepper: 'Private Joke',
			smsCode: req.body.smsCode
		}
	});
	user.save(function(err) {
		if (err) {
			return next(err.message);
		} else {
			return res.json({
				_id: user._id,
				token: user.token,
				account: user.account
			});
		}
	});
});

module.exports = router;
