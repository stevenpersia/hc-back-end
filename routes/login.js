<<<<<<< HEAD
var express = require('express');
var router = express.Router();
var User = require('../models/User.js');

router.post('/', function(req, res, next) {
	User.findOne({ phone: req.body.phone }).exec(function(err, user) {
		if (err) return next(err.message);
		if (user) {
			if (
				SHA256(req.body.password + user.salt).toString(encBase64) === user.hash
			) {
				return res.json({
					_id: user._id,
					token: user.token,
					account: user.account
				});
			} else {
				return res.status(401).json({ error: 'Unauthorized' });
			}
		} else {
			return next('User not found');
		}
	});
});

module.exports = router;
=======
var express = require('express');
var router = express.Router();
var User = require('../models/User.js');

const SHA256 = require('crypto-js/sha256');
const encBase64 = require('crypto-js/enc-base64');

router.post('/', function(req, res, next) {
	User.findOne({ 'account.phoneNumber': req.body.account.phoneNumber }).exec(
		function(err, user) {
			if (err) return next(err.message);
			if (user) {
				if (
					SHA256(req.body.account.password + user.security.salt).toString(
						encBase64
					) === user.security.hash
				) {
					return res.json({
						_id: user._id,
						token: user.token,
						account: user.account
					});
				} else {
					return res.status(401).json({ error: 'Unauthorized' });
				}
			} else {
				return next('User not found');
			}
		}
	);
});

module.exports = router;
>>>>>>> 09b1f97c3f79dbe3cb3946d9256056b5a459f4a0
