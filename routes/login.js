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
