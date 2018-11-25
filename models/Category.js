// IMPORTS
const mongoose = require("mongoose");

// USER MODEL

const CategorySchema = new mongoose.Schema({

    name: String,
    description: String,
    icon: Array
});

module.exports = mongoose.model("Category", CategorySchema, "categories");