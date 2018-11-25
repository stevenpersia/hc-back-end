// IMPORTS
const mongoose = require("mongoose");



// CHALLENGE MODEL

const ChallengeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    challengers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    badges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge"
    }],
    ref: {
        name: String,
        category: String,
        /* Animaux, Environnement, Social, Culture  */
        descrition: String,
        prerequisites: Array,
        moreInfo: String,
        /* if contact !== owner */
        contactName: String,
        contactEmail: String,
        contactPhone: Number,
    },
    location: {
        adressLine1: String,
        adressLine2: String,
        city: String,
        zipCode: Number,
        latitude: Number,
        longitude: Number
    },
    date: {
        beginDate: Date,
        endDate: Date,
    },
    media: {
        images: Array,
        videos: Array
    },
    status: String,
    /* next, now, done, canceled */
});

module.exports = mongoose.model("Challenge", ChallengeSchema, "challenges");