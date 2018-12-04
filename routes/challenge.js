var express = require("express");
var router = express.Router();
var Challenge = require("../models/Challenge.js");
var isAuthenticated = require("../middlewares/isAuthenticated");
var uploadPictures = require("../middlewares/uploadPictures");
var ObjectId = require("mongoose").Types.ObjectId;

// Récuperer la liste des défis
// !!!! rajouter filtres pour la recherche

function getRadians(meters) {
  var km = meters / 1000;
  return km / 111.2;
}

router.get("/", function(req, res) {
  const filter = {};
  // distance de recherche par default égale à 50 km
  let distance = 50000;
  let lat = 48.8708208;
  let long = 2.3715514;

  if (req.query.longitude && req.query.latitude) {
    lat = req.query.latitude;
    long = req.query.longitude;
  }

  if (req.query.distance) {
    distance = Number(req.query.distance);
  }
  if (req.query.name) {
    filter["ref.name"] = {
      $regex: req.query.name,
      $options: "i"
    };
  }
  if (req.query.description) {
    filter["ref.description"] = {
      $regex: req.query.description,
      $options: "i"
    };
  }
  if (req.query.city) {
    filter["adress.city"] = {
      $regex: req.query.city,
      $options: "i"
    };
  }

  Challenge.find(filter)
    .where("loc")
    .near({
      center: [long, lat],
      maxDistance: getRadians(distance)
    })
    .exec(function(err, Challenges) {
      if (!err) {
        res.json(Challenges);
      } else {
        res.send("something is wrong");
      }
    });
});

// Afficher un défi
router.get("/:id", function(req, res) {
  Challenge.findById(req.params.id).exec(function(err, challenge) {
    if (!err) {
      res.json(challenge);
    } else {
      res.send("something is wrong");
    }
  });
});

// Création d'un nouveau défi

router.post("/create", isAuthenticated, uploadPictures, function(req, res) {
  defiDuration =
    new Date(req.body.date.endDate) - new Date(req.body.date.beginDate);

  localisation = [];
  localisation.push(req.body.loc.longitude);
  localisation.push(req.body.loc.latitude);

  const challenge = new Challenge({
    owner: req.user,
    // badges: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Badge"
    // }],
    ref: {
      name: req.body.ref.name,
      category: req.body.ref.categoryId,
      description: req.body.ref.description,
      // prerequisites doit être un tableau avec les _id des prérequisites
      prerequisites: req.body.ref.prerequisites,
      moreInfo: req.body.ref.moreInfo,
      contactName: req.body.ref.contactName,
      contactEmail: req.body.ref.contactEmail,
      contactPhone: req.body.ref.contactPhone
    },
    adress: {
      adressLine1: req.body.adress.adressLine1,
      adressLine2: req.body.adress.adressLine2,
      city: req.body.adress.city,
      zipCode: req.body.adress.zipCode
    },
    loc: localisation,

    date: {
      beginDate: req.body.date.beginDate,
      endDate: req.body.date.endDate,
      duration: defiDuration
    },
    media: {
      images: req.pictures
    },
    canceled: false
  });
  challenge.save(function(err) {
    if (err) {
      return res.json(err);
    } else {
      req.user.challenges.manager.push(challenge._id);
      req.user.save();

      return res.json(challenge);
    }
  });
});

router.delete("/remove/:id", isAuthenticated, function(req, res, next) {
  Challenge.findOneAndRemove(
    {
      _id: ObjectId(req.params.id),
      owner: req.user
    },
    function(err, obj) {
      if (err) {
        return next(err.message);
      }
      if (!obj) {
        res.status(404);
        return next("Nothing to delete");
      } else {
        for (let i = 0; i < req.user.challenges.manager.length; i++) {
          if (
            JSON.stringify(req.params.id) ===
            JSON.stringify(req.user.challenges.manager[i]._id)
          ) {
            req.user.challenges.manager.splice(i, 1);
          }
        }
        req.user.save();
        return res.json({
          message: "Deleted"
        });
      }
    }
  );
});

router.put("/update/:id", isAuthenticated, function(req, res) {
  Challenge.findOne(
    {
      _id: ObjectId(req.params.id),
      owner: req.user
    },
    function(err, challenge) {
      if (err) {
        res.status(400);
        return next("An error occured");
      } else {
        const keys = [
          "ref",
          "location",
          "date",
          "media",
          "challengers",
          "badges",
          "canceled"
        ];
        for (let i = 0; i < keys.length; i++) {
          req.body[keys[i]] &&
            Object.assign(challenge[keys[i]], req.body[keys[i]]);
        }
        challenge.save();
        return res.json(challenge);
      }
    }
  );
});

module.exports = router;
