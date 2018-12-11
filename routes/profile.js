var express = require("express");
var router = express.Router();
var User = require("../models/User.js");
var isAuthenticated = require("../middlewares/isAuthenticated");
// var uploadPictures = require("../middlewares/uploadPictures");
// var ObjectId = require("mongoose").Types.ObjectId;

// L'authentification est obligatoire pour cette route
router.get("/:id", isAuthenticated, function(req, res, next) {
  User.findById(req.params.id).populate("challenges").populate("challenges.player challenges.manager")
    .exec()
    .then(function(user) {
      if (!user) {
        res.status(404);
        return next("User not found");
      }

      return res.json(user);
    })
    .catch(function(err) {
      res.status(400);
      return next(err.message);
    });
});

module.exports = router;
