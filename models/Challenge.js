// IMPORTS
const mongoose = require('mongoose');

// CHALLENGE MODEL

const ChallengeSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	challengers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	],
	badges: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Badge'
		}
	],
	ref: {
		name: String,
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category'
		},
		/* Animaux, Environnement, Social, Culture  */
		description: String,
		tags: Array,
		actions: String,
		prerequisites: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Prerequisite'
			}
		],
		moreInfo: String,
		/* if contact !== owner */
		contactName: String,
		contactEmail: String,
		contactPhone: String
	},
	adress: {
		adressLine1: String,
		adressLine2: String,
		city: String,
		zipCode: Number
	},
	loc: {
		type: [Number], // Longitude et latitude
		index: '2d' // Créer un index geospatial https://docs.mongodb.com/manual/core/2d/
	},
	date: {
		beginDate: Date,
		endDate: Date,
		duration: Number
	},
	media: {
		images: Array,
		videos: Array
	},
	canceled: Boolean
});

module.exports = mongoose.model('Challenge', ChallengeSchema, 'challenges');
