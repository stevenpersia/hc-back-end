var express = require("express");
var router = express.Router();
var Challenge = require("../models/Challenge.js");
var isAuthenticated = require("../middlewares/isAuthenticated");
var uploadPictures = require("../middlewares/uploadPictures");
// var ObjectId = require("mongoose").Types.ObjectId;


// Récuperer la liste des défis
// !!!! rajouter filtres pour la recherche

router.get("/", function (req, res) {
    Challenge.find().exec(function (err, Challenges) {
        if (!err) {
            res.json(Challenges);
        } else {
            res.send("something is wrong");
        }
    })
});

// Création d'un nouveau défi

router.post("/create/", isAuthenticated, uploadPictures, function (req, res) {
    const challenge = new Challenge({
        owner: req.user,
        // badges: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Badge"
        // }],
        ref: {
            name: req.body.ref.name,
            category: req.body.ref.categoryId,
            descrition: req.body.ref.descrition,
            // prerequisites doit être un tableau avec les _id des prérequisites
            prerequisites: req.body.ref.prerequisites,
            moreInfo: req.body.ref.moreInfo,
            contactName: req.body.ref.contactName,
            contactEmail: req.body.ref.contactEmail,
            contactPhone: req.body.ref.contactPhone,
        },
        location: {
            adressLine1: req.body.location.adressLine1,
            adressLine2: req.body.location.adressLine2,
            city: req.body.location.city,
            zipCode: req.body.location.zipCode,
            geolocalisation: {
                coords: {
                    latitude: req.body.location.coords.latitude,
                    longitude: req.body.location.coords.longitude,

                }
            }
        },
        date: {
            beginDate: req.body.date.beginDate,
            endDate: req.body.date.endDate,
        },
        // media: {
        //     images: Array,
        //     videos: Array
        // },
        canceled: false
    });


    router.delete("/remove/:id", isAuthenticated, function (req, res, next) {
        Challenge.findOneAndRemove({
                _id: ObjectId(req.params.id),
                owner: req.user
            },
            function (err, obj) {
                if (err) {
                    return next(err.message);
                }
                if (!obj) {
                    res.status(404);
                    return next("Nothing to delete");
                } else {
                    return res.json({
                        message: "Deleted"
                    });
                }
            }
        );
    });


















})



Challenge.find().exec(function (err, Challenges) {
if (!err) {
    res.json(Challenges);
} else {
    res.send("something is wrong");
}
})
});







module.exports = router;