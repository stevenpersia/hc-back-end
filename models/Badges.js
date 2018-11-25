// IMPORTS
const mongoose = require("mongoose");

// BADGE MODEL

const BadgeSchema = new mongoose.Schema({
    challenges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge"
    }],
    ref: {
        name: String,
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        /* Animaux, Environnement, Social, Culture  */
        descrition: String,
        moreInfo: String,
    },
    media: {
        icon: String
    },
    minPoints: Number,
    maxPoints: Number
});

module.exports = mongoose.model("Badge", BadgeSchema, "Badges");