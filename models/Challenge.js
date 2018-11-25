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
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        /* Animaux, Environnement, Social, Culture  */
        descrition: String,
        prerequisites: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Prerequisite"
        }],
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
        geolocalisation: {
            timestamp: Number,
            coords: {
                accuracy: Number,
                altitude: Number,
                altitudeAccuracy: Number,
                heading: Number,
                latitude: Number,
                longitude: Number,
                speed: Number
            }
        }
    },
    date: {
        beginDate: Date,
        endDate: Date,
    },
    media: {
        images: Array,
        videos: Array
    },
    canceled: Boolean
});

module.exports = mongoose.model("Challenge", ChallengeSchema, "challenges");