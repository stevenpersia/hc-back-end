// IMPORTS
const mongoose = require("mongoose");

// USER MODEL

const UserSchema = new mongoose.Schema({
    account: {
        username: String,
        email: String,
        biography: String,
        phoneNumber: Number
    },
    oarganizer: {
        type: String /* Association, Particulier, Institution... */
    },
    security: {
        token: String,
        hash: String,
        salt: String,
        pepper: String
    },
    challenges: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Challenge"
        },
        status: String
    }],
    location: {
        adressLine1: String,
        adressLine2: String,
        city: String,
        zipCode: Number,
        latitude: Number,
        longitude: Number
    },
    badges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge"
    }],
    rpgCharacter: {
        class: String,
        level: Number,
        experience: Number
    }


});

module.exports = mongoose.model("User", UserSchema, "users");