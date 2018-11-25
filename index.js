// IMPORTS
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(bodyParser.json({
    limit: "10mb"
}));
const cors = require("cors");

// `Cross-Origin Resource Sharing` est un mechanisme permettant d'autoriser les
// requêtes provenant d'un nom de domaine different Ici, nous autorisons l'API
// à repondre aux requêtes AJAX venant d'autres serveurs

app.use("/api", cors());

// CONNEXION AU SERVEUR
mongoose.connect('' || "mongodb://localhost:27017/human_challenge", {
        useNewUrlParser: true
    },
    function (err) {
        if (err) console.error("Could not connect to mongodb.");
    }

);

// Import des Models

var User = require("./models/User");
var Challenge = require("./models/Challenge");
var Badges = require("./models/Badges");
var Category = require("./models/Category");
var Prerequisite = require("./models/Prerequisite");

// Import des Routes
// Les routes sont séparées dans plusieurs fichiers
// var coreRoutes = require("./routes/core.js");
// var userRoutes = require("./routes/user.js");
var challengeRoutes = require("./routes/challenge.js");

// Les routes relatives aux utilisateurs auront pour prefix d'URL `/user`
// app.use("/api", coreRoutes);
// app.use("/api/user", userRoutes);
app.use("/api/challenge", challengeRoutes);



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