// IMPORTS
var express = require("express");
var router = express.Router();
var Challenge = require("../models/Challenge.js");
var isAuthenticated = require("../middlewares/isAuthenticated");
var uploadPictures = require("../middlewares/uploadPictures");
var ObjectId = require("mongoose").Types.ObjectId;

// FONCTIONS
// fonction pour calculer la distance par rapport à un point en mètres
function getRadians(meters) {
  var km = meters / 1000;
  return km / 111.2;
}
// fonction pour mettre en place les paramètres des filtres
function setFilters(req) {
  const filter = {};
  // filtre par rapport à la durée du défi
  if (req.query.duration) {
    const halfADay = 14400000;
    const OneDay = 86400000;

    // si query 0 on à les défis de moins de 4h
    if (Number(req.query.duration) === 0) {
      filter["date.duration"] = {
        $lte: halfADay
      };
    }
    // si query 1 on à les défis de moins de 24h et plus de 4h
    if (Number(req.query.duration) === 1) {
      filter["date.duration"] = {
        $gte: halfADay,
        $lte: OneDay
      };
    }
    // si query 2 on à les défis de plus de 24h
    if (Number(req.query.duration) === 2) {
      filter["date.duration"] = {
        $gte: OneDay
      };
    }
  }

  // filtre sur les categories
  if (req.query.category) {
    // on initialise la catégorie à environnement
    let result = []
    let cat = ""
    let tab = req.query.category.split(" ");
    for (let i = 0; i < tab.length; i++) {
      if (tab[i] === "environnement")
        cat = "5c0560a6c1215431d47a98e5";
      if (tab[i] === "animaux") {
        cat = "5c0560f1c1215431d47a98e7"
      }
      if (tab[i] === "social") {
        cat = "5c0560230cb7ba31d4f7e63c"
      }
      if (tab[i] === "culture") {
        cat = "5c0560c3c1215431d47a98e6"
      }
      if (i === 0) {
        result.push(cat)
      } else {
        result.push(cat)
      }
    }

    filter["ref.category"] = {
      $in: result
    };
  }

  // si on a un nom dans la query on fait une recherche dessus
  if (req.query.name) {
    filter["ref.name"] = {
      $regex: req.query.name,
      $options: "i"
    };
  }

  // si on a une description dans la query on fait une recherche dessus
  if (req.query.description) {
    filter["ref.description"] = {
      $regex: req.query.description,
      $options: "i"
    };
  }

  // si on a une ville dans la query on fait une recherche dessus
  if (req.query.city) {
    filter["adress.city"] = {
      $regex: req.query.city,
      $options: "i"
    };
  }
  return filter;
}

// ROUTES
// Récuperer la liste des défis
router.get("/", function (req, res) {
  // on met les filtres en place
  const filters = setFilters(req);

  // distance de recherche par default égale à 50 km
  let distance = 50000;
  // centre de la recherche par défault LE REACTEUR
  let lat = 48.8708208;
  let long = 2.3715514;

  // si on a une longitude et latitude dans la query on remplace le centre
  if (req.query.longitude && req.query.latitude) {
    lat = req.query.latitude;
    long = req.query.longitude;
  }

  // si on a une distance dans la query on la remplace
  if (req.query.distance) {
    distance = Number(req.query.distance);
  }

  console.log(filters);

  // on fait une recherche sur par rapport aux filtres et ensuite la distance
  Challenge.find(filters)
    .where("loc")
    .near({
      center: [long, lat],
      maxDistance: getRadians(distance)
    })
    .populate("ref.category").exec(function (err, Challenges) {
      if (!err) {
        res.json(Challenges);
      } else {
        res.send("something is wrong");
      }
    });
});

// Afficher un défi
router.get("/:id", function (req, res) {
  Challenge.findById(req.params.id).exec(function (err, challenge) {
    if (!err) {
      res.json(challenge);
    } else {
      res.send("something is wrong");
    }
  });
});

// Création d'un nouveau défi

router.post("/create", isAuthenticated, uploadPictures, function (req, res) {
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
  challenge.save(function (err) {
    if (err) {
      return res.json(err);
    } else {
      req.user.challenges.manager.push(challenge._id);
      req.user.save();

      return res.json(challenge);
    }
  });
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

router.put("/update/:id", isAuthenticated, function (req, res) {
  Challenge.findOne({
      _id: ObjectId(req.params.id),
      owner: req.user
    },
    function (err, challenge) {
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