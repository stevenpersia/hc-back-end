// IMPORTS
const mongoose = require("mongoose");

// BADGE MODEL

const BadgeSchema = new mongoose.Schema({
    challengers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    challenges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge"
    }],
    ref: {
        name: String,
        category: String,
        /* Animaux, Environnement, Social, Culture  */
        descrition: String,
        prerequisites: Array,
        moreInfo: String,
    },
    media: {
        icone: String
    },
});

module.exports = mongoose.model("Badge", BadgeSchema, "Badges");