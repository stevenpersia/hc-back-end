var express = require("express");
var router = express.Router();
var Challenge = require("../models/Challenge.js");
// var isAuthenticated = require("../middlewares/isAuthenticated");
// var uploadPictures = require("../middlewares/uploadPictures");
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

router.post("/create/", function (req, res) {
    const challenge = new Challenge({
        owner: req.body.ownerId,
        // badges: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Badge"
        // }],
        ref: {
            name: req.body.name,
            category: req.body.categoryId,
            descrition: req.body.descrition,
            // prerequisites: [{
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: "Prerequisite"
            // }],
            moreInfo: req.body.moreInfo,
            contactName: req.body.contactName,
            contactEmail: req.body.contactEmail,
            contactPhone: req.body.contactPhone,
        },
        location: {
            adressLine1: req.body.adressLine1,
            adressLine2: req.body.adressLine2,
            city: req.body.city,
            zipCode: req.body.zipCode,
            geolocalisation: {
                coords: {
                    latitude: req.body.latitude,
                    longitude: req.body.longitude,

                }
            }
        },
        date: {
            beginDate: req.body.date.beginDate,
            endDate: req.body.date.endDate,
        },
        media: {
            images: Array,
            videos: Array
        },
        canceled: false
    });

    cloudinary.uploader.upload("sample.jpg", {
        "crop": "limit",
        "tags": "samples",
        "width": 3000,
        "height": 2000
    }, function (result) {
        console.log(result)
    });

    cloudinary.image("sample", {
        "crop": "fill",
        "gravity": "faces",
        "width": 300,
        "height": 200,
        "format": "jpg"
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