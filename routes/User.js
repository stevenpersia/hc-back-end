var express = require("express");
var router = express.Router();
var User = require("../models/User.js");
var Challenge = require("../models/Challenge.js");
var isAuthenticated = require("../middlewares/isAuthenticated");
// var uploadPictures = require("../middlewares/uploadPictures");
var ObjectId = require("mongoose").Types.ObjectId;

// L'authentification est obligatoire pour cette route

// PARTICIPER AU CHALLENGE
router.put("/participate/:id", isAuthenticated, function (req, res, next) {
  Challenge.findOne({
      _id: ObjectId(req.params.id)
    })
    .exec()
    .then(function (challenge) {
      if (!challenge) {
        res.status(404);
        return next("Challenge not found");
      }
      // on verifie si utilisateur n'existe pas déjà ds le tableau des challengers pour faire le challenge
      let challengerExists = false;
      for (let i = 0; i < challenge.challengers.length; i++) {
        // attention id sont des objets, donc les convertir en string
        if (challenge.challengers[i].toString() === req.user._id.toString()) {
          challengerExists = true;
        }
      }

      // si l'utilisateur a créé le challenge, il ne peut pas s'inscrire
      if (req.user._id.toString() === challenge.owner._id.toString()) {
        return res.send(
          "vous avez créé le challenge pas besoin de vous inscrire"
        );
      }
      // si l'utilisateur n'est pas déjà inscrit au challenge, on l'inscrit
      if (challengerExists === false) {
        challenge.challengers.push(req.user._id);
        challenge.save(function (err) {
          if (err) {
            return next(err.message);
          } else {
            // associé au modele user (clé manager)
            req.user.challenges.player.push(challenge._id); // ou challenge
            req.user.save();

            return res.json({
              user: req.user,
              challenge: challenge
            });
          }
        });
      }
      if (challengerExists === true) {
        return res.send("déjà inscrit au challenge");
      }
    })
    .catch(function (err) {
      res.status(400);
      return next(err.message);
    });
});

// SUPPRESSION DE SA PARTICIPATION AU CHALLENGE
router.delete("/remove/:id", isAuthenticated, function (req, res, next) {
  Challenge.findOne({
      _id: ObjectId(req.params.id)
    })
    .exec()
    .then(function (challenge) {
      if (!challenge) {
        res.status(404);
        return next("Challenge pas trouvé");
      }

      // si id de l'user est ds le tableau challenge on la supprime
      let place = challenge.challengers.indexOf(req.user._id);
      if (challenge.challengers.indexOf(req.user._id) === -1) {
        res.status(404);
        return next("Joueur pas trouvé");
      }

      challenge.challengers.splice(place, 1);

      // on parcours le tableau player de req user pour supprimer le challenge
      for (let i = 0; i < req.user.challenges.player.length; i++) {
        if (
          req.user.challenges.player[i]._id.toString() ===
          challenge._id.toString()
        ) {
          req.user.challenges.player.splice(i, 1);
        }
      }

      challenge.save(function (err) {
        if (err) {
          return next(err.message);
        } else {
          // associé au model user (clé manager)

          req.user.save();

          return res.json({
            message: "supprimé"
          });
        }
      });
    })
    .catch(function (err) {
      res.status(400);
      return next(err.message);
    });
});

module.exports = router;