// IMPORTS
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json({
    limit: "10mb"
}));
const cors = require("cors");

// CONNEXION AU SERVEUR
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/human_challenge", {
        useNewUrlParser: true
    },
    function (err) {
        if (err) console.error("Could not connect to mongodb.");
    }

);

// `Cross-Origin Resource Sharing` est un mechanisme permettant d'autoriser les
// requêtes provenant d'un nom de domaine different Ici, nous autorisons l'API
// à repondre aux requêtes AJAX venant d'autres serveurs

app.use("/api", cors());

// Import des Models

var User = require("./models/User");
var Challenge = require("./models/Challenge");
var Badges = require("./models/Badges");

// Première page

app.get("/", function (req, res) {
    res.send("Welcome to Human Challenge API.");
    console.log("hello");

});

// Toutes les méthodes HTTP (GET, POST, etc.) des pages non trouvées afficheront
// une erreur 404
app.all("*", function (req, res) {
    res.status(404).json({
        error: "Not Found"
    });
});

// Initialisation du serveur

app.listen(process.env.PORT || 3000, function () {
    console.log("Serveur initialisé");
});