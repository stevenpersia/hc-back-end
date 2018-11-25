// IMPORTS
const mongoose = require("mongoose");

// USER MODEL

const PrerequisiteSchema = new mongoose.Schema({
    name: String,
    description: String,
    icon: Array
});

module.exports = mongoose.model("Prerequisite", PrerequisiteSchema, "prerequisites");