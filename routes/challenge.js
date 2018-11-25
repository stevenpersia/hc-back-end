var express = require("express");
var router = express.Router();
var Challenge = require("../models/Challenge.js");
// var isAuthenticated = require("../middlewares/isAuthenticated");
// var uploadPictures = require("../middlewares/uploadPictures");
// var ObjectId = require("mongoose").Types.ObjectId;


router.get("/", function (req, res) {
    Challenge.find().exec(function (err, Challenges) {
        if (!err) {
            res.json(Challenges);
        } else {
            res.send("something is wrong");
        }
    })
});

module.exports = router;